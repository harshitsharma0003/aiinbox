const express = require('express');
const PDFDocument = require('pdfkit');
const { supabaseAdmin } = require('../supabase');

const router = express.Router();

// ── BRAND PALETTE ─────────────────────────────────────────
const C = {
  ink:    '#07090D',
  onyx:   '#0D1117',
  carbon: '#161B22',
  lead:   '#21262D',
  zinc:   '#6E7681',
  silver: '#8B949E',
  paper:  '#F0F6FC',
  white:  '#FFFFFF',
  amber:  '#E6933A',
  cyan:   '#58A6FF',
  jade:   '#3FB950',
  violet: '#BC8CFF',
};
const TYPE_COLOR = {
  instant:  C.amber,
  custom:   C.violet,
  function: C.cyan,
};

// ── Markdown stripping (mirrors pptx.js) ─────────────────
function stripMd(s) {
  if (!s) return '';
  return String(s)
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, '$1$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

function tablesToBullets(text) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\s*\|[\s\-:|]+\|\s*$/.test(lines[i + 1])) {
      const header = line.split('|').map(c => c.trim()).filter(Boolean);
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
        if (cells.length > 0) {
          const parts = [];
          cells.forEach((c, idx) => {
            const h = header[idx] || '';
            if (h && cells[idx]) parts.push(h + ': ' + c);
            else if (cells[idx]) parts.push(c);
          });
          out.push(parts.join(' · '));
        }
        i++;
      }
    } else {
      out.push(line);
      i++;
    }
  }
  return out.join('\n');
}

function parseSections(text) {
  const cleaned = stripMd(tablesToBullets(text));
  const raw = cleaned.split(/\n(?=[1-9]\.|#{1,3}\s)/).filter(s => s.trim());
  return raw.map(sec => {
    const lines = sec.trim().split('\n');
    const heading = stripMd(lines[0]).replace(/^[#\d.\s]+/, '').trim();
    const body = lines.slice(1).join('\n').trim() || sec.trim();
    const bullets = body.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(l => l.replace(/^[-–•·*]\s+/, '').trim())
      .map(l => stripMd(l))
      .filter(l => l.length > 3);
    return { heading, body: stripMd(body), bullets };
  });
}

// ── PDF Builder ─────────────────────────────────────────
function buildPDF({ company, industry, type, strategyText }) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: 'AI Strategy — ' + company,
      Author: 'AI in a Box',
      Subject: (type.charAt(0).toUpperCase() + type.slice(1)) + ' AI Strategy',
      Creator: 'AI in a Box',
    }
  });

  const accent = TYPE_COLOR[type] || C.amber;
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const sections = parseSections(strategyText);

  // Page dims (A4 = 595.28 × 841.89 pts)
  const PW = doc.page.width;
  const PH = doc.page.height;
  const M = 50;  // outer margin

  // ─── COVER PAGE ─────────────────────────────────────
  doc.rect(0, 0, PW, PH).fill(C.ink);

  // Subtle grid (decorative, faint)
  doc.save();
  doc.strokeColor(C.lead).lineWidth(0.4).opacity(0.5);
  for (let x = 0; x < PW; x += 40) doc.moveTo(x, 0).lineTo(x, PH).stroke();
  for (let y = 0; y < PH; y += 40) doc.moveTo(0, y).lineTo(PW, y).stroke();
  doc.restore();

  // Brand
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(14).text('AI', M, M + 20, { continued: true });
  doc.fillColor(accent).font('Helvetica-Oblique').text('in', { continued: true });
  doc.fillColor(C.silver).font('Helvetica').text('Box');

  // CONFIDENTIAL tag (top-right)
  doc.fillColor(accent).fontSize(8).font('Helvetica').text('CONFIDENTIAL', PW - M - 100, M + 22, { width: 100, align: 'right', characterSpacing: 2 });

  // Small accent dot
  doc.circle(M + 5, 200, 5).fill(accent);

  // Eyebrow label
  const typeLabel = type === 'instant' ? 'INSTANT AI STRATEGY'
    : type === 'custom' ? 'CUSTOM AI STRATEGY'
    : 'FUNCTION AI STRATEGY';
  doc.fillColor(accent).font('Helvetica').fontSize(10).text(typeLabel, M + 20, 195, { characterSpacing: 3 });

  // Company name — dominant
  doc.fillColor(C.paper).font('Times-Bold').fontSize(44).text(company, M, 240, { width: PW - 2 * M });

  // Subtitle
  doc.fillColor(C.silver).font('Times-Italic').fontSize(20).text('AI Transformation Strategy', M, 320, { width: PW - 2 * M });

  // Metadata — clean rows, no boxes
  const meta = [
    ['INDUSTRY', industry || 'Enterprise'],
    ['PREPARED', date],
    ['MODEL', 'Claude Opus 4'],
    ['CLASS', type === 'instant' ? 'Public Data' : 'Proprietary'],
  ];
  let metaY = 440;
  meta.forEach(([k, v], idx) => {
    const x = M + (idx % 2) * (PW - 2 * M) / 2;
    const y = metaY + Math.floor(idx / 2) * 32;
    doc.fillColor(C.zinc).font('Helvetica').fontSize(7).text(k, x, y, { characterSpacing: 2.5 });
    doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(11).text(v, x + 80, y - 2);
  });

  // Footer line + text (subtle, no decorative bar)
  doc.fillColor(C.zinc).font('Helvetica').fontSize(8).text('hello@aiinbox.com', M, PH - M - 14, { characterSpacing: 1.5 });
  doc.text('aiinbox.com', PW / 2, PH - M - 14, { width: PW / 2 - M, align: 'right', characterSpacing: 1.5 });

  // ─── STATS PAGE ─────────────────────────────────────
  doc.addPage();
  doc.rect(0, 0, PW, PH).fill(C.onyx);

  // Brand again
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(14).text('AI', M, M + 20, { continued: true });
  doc.fillColor(accent).font('Helvetica-Oblique').text('in', { continued: true });
  doc.fillColor(C.silver).font('Helvetica').text('Box');

  doc.fillColor(accent).font('Helvetica').fontSize(10).text('WHY AI. WHY NOW.', M, 130, { characterSpacing: 3 });
  doc.fillColor(C.paper).font('Times-Italic').fontSize(28).text('The opportunity, by the numbers.', M, 160);

  const stats = [
    { n: '$72.8B', l: 'AI consulting market\nby 2030', color: C.amber },
    { n: '31.6%',  l: 'Annual growth rate\nCAGR through 2030', color: C.cyan },
    { n: '86%',    l: 'Of buyers now seek\nAI-enabled firms', color: C.jade },
    { n: '95%',    l: 'Of AI pilots fail\nwithout proper strategy', color: C.violet },
  ];
  stats.forEach((s, i) => {
    const bx = M + (i % 2) * (PW - 2 * M) / 2;
    const by = 250 + Math.floor(i / 2) * 130;
    const bw = (PW - 2 * M) / 2 - 12;

    // Card with subtle border (no stripe)
    doc.roundedRect(bx, by, bw, 110, 6).fillAndStroke(C.carbon, C.lead).lineWidth(0.5);

    // Big number
    doc.fillColor(s.color).font('Times-Bold').fontSize(38).text(s.n, bx + 18, by + 22, { width: bw / 2 });

    // Label
    doc.fillColor(C.silver).font('Helvetica').fontSize(10).text(s.l, bx + bw / 2 + 8, by + 32, { width: bw / 2 - 24, lineGap: 4 });
  });

  doc.fillColor(C.zinc).font('Helvetica-Oblique').fontSize(8).text(
    'Sources: Gartner · McKinsey Global Survey · IBM Institute for Business Value · 2025-26.',
    M, PH - M - 30
  );

  // ─── CONTENTS PAGE ──────────────────────────────────
  doc.addPage();
  doc.rect(0, 0, PW, PH).fill(C.ink);
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(14).text('AI', M, M + 20, { continued: true });
  doc.fillColor(accent).font('Helvetica-Oblique').text('in', { continued: true });
  doc.fillColor(C.silver).font('Helvetica').text('Box');

  doc.fillColor(accent).font('Helvetica').fontSize(10).text('CONTENTS', M, 130, { characterSpacing: 3 });
  doc.fillColor(C.paper).font('Times-Italic').fontSize(28).text('What we cover.', M, 160);

  sections.slice(0, 10).forEach((sec, i) => {
    const y = 230 + i * 30;
    doc.fillColor(C.zinc).font('Helvetica').fontSize(10).text(String(i + 1).padStart(2, '0'), M, y);
    doc.fillColor(C.paper).font('Times-Roman').fontSize(13).text(sec.heading.toUpperCase().slice(0, 80), M + 35, y - 1);
    doc.fillColor(C.zinc).font('Helvetica').fontSize(9).text('p. ' + (i + 4), PW - M - 60, y, { width: 60, align: 'right' });
    // Dashed separator
    if (i < Math.min(sections.length, 10) - 1) {
      doc.strokeColor(C.lead).lineWidth(0.4).dash(2, { space: 3 })
        .moveTo(M, y + 18).lineTo(PW - M, y + 18).stroke().undash();
    }
  });

  // ─── SECTION PAGES ──────────────────────────────────
  sections.forEach((sec, i) => {
    doc.addPage();
    const bg = i % 2 === 0 ? C.ink : C.onyx;
    doc.rect(0, 0, PW, PH).fill(bg);

    // Brand
    doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(14).text('AI', M, M + 20, { continued: true });
    doc.fillColor(accent).font('Helvetica-Oblique').text('in', { continued: true });
    doc.fillColor(C.silver).font('Helvetica').text('Box');

    // Large section number (decorative, top-right)
    doc.fillColor(C.lead).font('Times-Bold').fontSize(72).text(String(i + 1).padStart(2, '0'), PW - M - 100, M + 8, { width: 100, align: 'right' });

    // Eyebrow
    doc.fillColor(accent).font('Helvetica').fontSize(9).text(
      'SECTION ' + (i + 1) + ' / ' + sections.length,
      M, 140, { characterSpacing: 3 }
    );

    // Heading
    doc.fillColor(C.paper).font('Times-Bold').fontSize(26).text(sec.heading.toUpperCase().slice(0, 100), M, 170, { width: PW - 2 * M, lineGap: 2 });

    // Body — bullets if present, else prose
    let yPos = 270;
    const maxY = PH - M - 60;
    if (sec.bullets.length >= 2) {
      sec.bullets.slice(0, 12).forEach(b => {
        if (yPos > maxY) return;
        const txt = b.replace(/\s+/g, ' ').trim();
        // Bullet dot
        doc.fillColor(accent).circle(M + 5, yPos + 7, 3).fill();
        // Text
        const txtHeight = doc.fillColor(C.silver).font('Helvetica').fontSize(11).heightOfString(txt, { width: PW - 2 * M - 20, lineGap: 3 });
        doc.text(txt, M + 18, yPos, { width: PW - 2 * M - 20, lineGap: 3 });
        yPos += Math.max(txtHeight + 12, 24);
      });
    } else {
      // Prose body
      doc.fillColor(C.silver).font('Helvetica').fontSize(12).text(sec.body.slice(0, 1800), M, yPos, { width: PW - 2 * M, lineGap: 4, align: 'left' });
    }

    // Footer
    doc.fillColor(C.zinc).font('Helvetica').fontSize(8).text('AI in a Box · Confidential', M, PH - M - 14);
    doc.text((i + 1) + ' / ' + sections.length, PW / 2 - 40, PH - M - 14, { width: 80, align: 'center' });
    doc.text(sec.heading.slice(0, 40), M, PH - M - 14, { width: PW - 2 * M, align: 'right' });
  });

  // ─── ROADMAP PAGE ───────────────────────────────────
  doc.addPage();
  doc.rect(0, 0, PW, PH).fill(C.onyx);
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(14).text('AI', M, M + 20, { continued: true });
  doc.fillColor(accent).font('Helvetica-Oblique').text('in', { continued: true });
  doc.fillColor(C.silver).font('Helvetica').text('Box');

  doc.fillColor(accent).font('Helvetica').fontSize(10).text('ROADMAP', M, 130, { characterSpacing: 3 });
  doc.fillColor(C.paper).font('Times-Italic').fontSize(28).text('Eighteen months to AI fluency.', M, 160);

  const phases = [
    { ph: 'PHASE 01', dur: 'Months 1-3',   title: 'Foundation',   color: C.amber,  items: ['Data audit', 'Quick wins', 'Team setup'] },
    { ph: 'PHASE 02', dur: 'Months 4-9',   title: 'Acceleration', color: C.cyan,   items: ['Production AI', 'Process redesign', 'Skill build'] },
    { ph: 'PHASE 03', dur: 'Months 10-18', title: 'Scale',        color: C.jade,   items: ['Enterprise rollout', 'AI-native ops', 'Continuous gains'] },
  ];

  // Timeline line
  doc.strokeColor(C.lead).lineWidth(1)
    .moveTo(M + 80, 320).lineTo(PW - M - 80, 320).stroke();

  const phaseSpacing = (PW - 2 * M - 160) / 2;
  phases.forEach((p, i) => {
    const cx = M + 80 + i * phaseSpacing;

    // Node
    doc.circle(cx, 320, 8).fill(p.color);

    // Phase label
    doc.fillColor(p.color).font('Helvetica').fontSize(8).text(p.ph, cx - 60, 285, { width: 120, align: 'center', characterSpacing: 3 });
    // Duration
    doc.fillColor(C.zinc).font('Helvetica').fontSize(9).text(p.dur, cx - 60, 345, { width: 120, align: 'center' });
    // Title
    doc.fillColor(C.paper).font('Times-Bold').fontSize(18).text(p.title, cx - 60, 370, { width: 120, align: 'center' });
    // Items
    p.items.forEach((item, j) => {
      doc.fillColor(C.silver).font('Helvetica').fontSize(10).text('— ' + item, cx - 80, 410 + j * 20, { width: 160, align: 'center' });
    });
  });

  doc.fillColor(C.zinc).font('Helvetica').fontSize(8).text('AI in a Box · Confidential', M, PH - M - 14);

  // ─── CLOSING PAGE ───────────────────────────────────
  doc.addPage();
  doc.rect(0, 0, PW, PH).fill(C.ink);
  doc.fillColor(C.paper).font('Helvetica-Bold').fontSize(14).text('AI', M, M + 20, { continued: true });
  doc.fillColor(accent).font('Helvetica-Oblique').text('in', { continued: true });
  doc.fillColor(C.silver).font('Helvetica').text('Box');

  // Decorative quote glyph
  doc.fillColor(C.lead).font('Times-Bold').fontSize(120).text('"', M - 10, 130, { width: 100 });

  // Quote
  doc.fillColor(C.paper).font('Times-Italic').fontSize(40).text('The window to lead is now.', M, 250, { width: PW - 2 * M });

  // Attribution
  doc.fillColor(C.silver).font('Helvetica').fontSize(13).text(
    'Strategy prepared exclusively for ' + company + ' by AI in a Box,',
    M, 360, { width: PW - 2 * M }
  );
  doc.text('powered by Claude Opus 4 with live web research.', M, 380, { width: PW - 2 * M });

  // CTA card
  doc.roundedRect(M, 460, PW - 2 * M, 100, 8).fillAndStroke(C.carbon, C.lead).lineWidth(0.5);
  doc.fillColor(accent).font('Times-Bold').fontSize(16).text('Ready for the next step?', M + 24, 480, { width: PW - 2 * M - 48 });
  doc.fillColor(C.silver).font('Helvetica').fontSize(11).text(
    'Book a 30-minute discovery call.  ·  hello@aiinbox.com  ·  aiinbox.com',
    M + 24, 510, { width: PW - 2 * M - 48 }
  );
  doc.fillColor(C.zinc).font('Helvetica-Oblique').fontSize(9).text(
    'AI Design Sprint · Custom Strategy · C-Suite Packages',
    M + 24, 532, { width: PW - 2 * M - 48 }
  );

  doc.fillColor(C.zinc).font('Helvetica').fontSize(8).text('© ' + new Date().getFullYear() + ' AI in a Box', M, PH - M - 14);
  doc.text('Confidential · Not for redistribution', M, PH - M - 14, { width: PW - 2 * M, align: 'right' });

  doc.end();
  return doc;
}

// ── POST /api/pdf/generate ────────────────────────────
router.post('/generate', async (req, res) => {
  const { company_name, industry, type, strategy_text, strategy_id } = req.body;

  if (!company_name || !strategy_text) {
    return res.status(400).json({ error: 'company_name and strategy_text are required' });
  }

  try {
    const doc = buildPDF({
      company: company_name,
      industry: industry || 'Enterprise',
      type: type || 'instant',
      strategyText: strategy_text
    });

    // Collect into buffer then send as base64
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', async () => {
      const buf = Buffer.concat(chunks);
      const base64 = buf.toString('base64');

      if (strategy_id && supabaseAdmin) {
        supabaseAdmin.from('pdf_downloads').insert({
          strategy_id,
          downloaded_at: new Date().toISOString()
        }).then(() => {}).catch(() => {});
      }

      const filename = 'AI-Strategy-' + company_name.replace(/[^a-zA-Z0-9]/g, '-') + '-' + Date.now() + '.pdf';

      res.json({
        success: true,
        filename,
        base64,
      });
    });
    doc.on('error', err => {
      console.error('PDF generation error:', err);
      res.status(500).json({ error: err.message || 'PDF generation failed' });
    });
  } catch (err) {
    console.error('PDF route error:', err);
    res.status(500).json({ error: err.message || 'PDF generation failed' });
  }
});

module.exports = router;
