const express = require('express');
const PptxGenJS = require('pptxgenjs');
const { supabaseAdmin } = require('../supabase');

const router = express.Router();

// ── Color palette — matches the AI in a Box brand ────────
const C = {
  ink:    '07090D',
  onyx:   '0D1117',
  carbon: '161B22',
  lead:   '21262D',
  zinc:   '6E7681',
  silver: '8B949E',
  paper:  'F0F6FC',
  amber:  'E6933A',
  cyan:   '58A6FF',
  jade:   '3FB950',
  rose:   'F85149',
  violet: 'BC8CFF',
  gold:   'E3B341',
};

const TYPE_COLOR = {
  instant:  C.amber,
  custom:   C.violet,
  function: C.cyan,
};

// ── Parse Claude's text into sections ────────────────────
function parseSections(text) {
  const raw = text.split(/\n(?=[1-9]\.|#{1,3}\s)/).filter(s => s.trim());
  return raw.map(sec => {
    const lines = sec.trim().split('\n');
    const heading = lines[0].replace(/^[#\d.\s]+/, '').trim();
    const body = lines.slice(1).join('\n').trim() || sec.trim();
    // Extract bullet points
    const bullets = body.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .map(l => l.replace(/^[-–•·*]\s+/, '').trim())
      .filter(l => l.length > 3);
    return { heading, body, bullets };
  });
}

// ── Helper: truncate text ─────────────────────────────────
function trunc(str, n) {
  if (!str) return '';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

// ── Slide builders ────────────────────────────────────────

function addCoverSlide(pres, { company, industry, type, date, accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  // Full-bleed left accent strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: accentColor }, line: { color: accentColor }
  });

  // Top-right badge
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.2, y: 0.3, w: 2.5, h: 0.45,
    fill: { color: C.lead }, line: { color: C.lead }, rectRadius: 0.06
  });
  slide.addText('AI IN A BOX · CONFIDENTIAL', {
    x: 7.2, y: 0.3, w: 2.5, h: 0.45,
    fontSize: 7.5, color: C.zinc, align: 'center', valign: 'middle',
    fontFace: 'Calibri', charSpacing: 2, margin: 0
  });

  // Brand wordmark top-left
  slide.addText([
    { text: 'AI', options: { color: C.paper, bold: true } },
    { text: 'in', options: { color: accentColor, italic: true } },
    { text: 'Box', options: { color: C.silver } }
  ], { x: 0.5, y: 0.3, w: 3, h: 0.5, fontSize: 20, fontFace: 'Georgia', margin: 0 });

  // Strategy type label
  const typeLabel = type === 'instant' ? 'INSTANT AI STRATEGY'
    : type === 'custom' ? 'CUSTOM AI STRATEGY'
    : 'FUNCTION AI STRATEGY';
  slide.addText(typeLabel, {
    x: 0.5, y: 1.5, w: 9, h: 0.35,
    fontSize: 9, color: accentColor, charSpacing: 4,
    fontFace: 'Calibri', margin: 0
  });

  // Company name — big
  slide.addText(trunc(company, 40), {
    x: 0.5, y: 1.9, w: 9, h: 1.5,
    fontSize: 44, color: C.paper, bold: true,
    fontFace: 'Georgia', margin: 0,
    shrinkText: true
  });

  // Subtitle
  slide.addText('AI Transformation Strategy', {
    x: 0.5, y: 3.45, w: 9, h: 0.5,
    fontSize: 20, color: C.silver, italic: true,
    fontFace: 'Georgia', margin: 0
  });

  // Metadata row — 4 pills
  const meta = [
    { label: 'Industry', value: trunc(industry, 22) },
    { label: 'Generated', value: date },
    { label: 'Model', value: 'Claude Opus' },
    { label: 'Powered by', value: 'AI in a Box' },
  ];
  meta.forEach((m, i) => {
    const bx = 0.5 + i * 2.3;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 4.25, w: 2.1, h: 0.85,
      fill: { color: C.carbon }, line: { color: C.lead }
    });
    slide.addText(m.label.toUpperCase(), {
      x: bx, y: 4.3, w: 2.1, h: 0.25,
      fontSize: 7, color: C.zinc, align: 'center', charSpacing: 2,
      fontFace: 'Calibri', margin: 0
    });
    slide.addText(m.value, {
      x: bx, y: 4.55, w: 2.1, h: 0.4,
      fontSize: 10, color: C.paper, align: 'center', bold: true,
      fontFace: 'Calibri', margin: 0, shrinkText: true
    });
  });

  // Bottom line
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 5.3, w: 9, h: 0,
    line: { color: C.lead, width: 0.5 }
  });
  slide.addText('hello@aiinbox.com  ·  aiinbox.com  ·  © 2026 AI in a Box', {
    x: 0.5, y: 5.35, w: 9, h: 0.22,
    fontSize: 8, color: C.zinc, align: 'center', fontFace: 'Calibri', margin: 0
  });
}

function addAgendaSlide(pres, { sections, accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.onyx };

  // Left strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: accentColor }, line: { color: accentColor }
  });

  slide.addText('AGENDA', {
    x: 0.5, y: 0.3, w: 9, h: 0.3,
    fontSize: 9, color: accentColor, charSpacing: 4, fontFace: 'Calibri', margin: 0
  });
  slide.addText('What we cover in this strategy', {
    x: 0.5, y: 0.62, w: 9, h: 0.55,
    fontSize: 28, color: C.paper, fontFace: 'Georgia', italic: true, margin: 0
  });

  // 2-column agenda grid
  const cols = [sections.slice(0, Math.ceil(sections.length / 2)), sections.slice(Math.ceil(sections.length / 2))];
  cols.forEach((col, ci) => {
    col.forEach((sec, ri) => {
      const bx = 0.5 + ci * 4.8;
      const by = 1.45 + ri * 0.78;
      slide.addShape(pres.shapes.RECTANGLE, {
        x: bx, y: by, w: 4.5, h: 0.65,
        fill: { color: C.carbon }, line: { color: C.lead }
      });
      // Number circle
      slide.addShape(pres.shapes.OVAL, {
        x: bx + 0.1, y: by + 0.1, w: 0.42, h: 0.42,
        fill: { color: accentColor }, line: { color: accentColor }
      });
      const globalIdx = ci === 0 ? ri + 1 : Math.ceil(sections.length / 2) + ri + 1;
      slide.addText(String(globalIdx), {
        x: bx + 0.1, y: by + 0.1, w: 0.42, h: 0.42,
        fontSize: 10, color: C.ink, bold: true, align: 'center', valign: 'middle',
        fontFace: 'Calibri', margin: 0
      });
      slide.addText(trunc(sec.heading, 45), {
        x: bx + 0.65, y: by + 0.08, w: 3.7, h: 0.5,
        fontSize: 11, color: C.paper, fontFace: 'Calibri', valign: 'middle',
        margin: 0, shrinkText: true
      });
    });
  });
}

function addSectionSlide(pres, { index, heading, bullets, accentColor, totalSections }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  // Left strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: accentColor }, line: { color: accentColor }
  });

  // Section number — large background
  slide.addText(String(index).padStart(2, '0'), {
    x: 7.8, y: 0.15, w: 2, h: 1.4,
    fontSize: 80, color: C.lead, bold: true, align: 'right',
    fontFace: 'Georgia', margin: 0
  });

  // Heading
  slide.addText(trunc(heading, 60), {
    x: 0.5, y: 0.3, w: 7, h: 1.0,
    fontSize: 28, color: C.paper, bold: true, fontFace: 'Georgia',
    margin: 0, shrinkText: true
  });

  // Accent underline
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.35, w: 1.4, h: 0.05,
    fill: { color: accentColor }, line: { color: accentColor }
  });

  // Content area — smart layout based on bullet count
  const usableBullets = bullets.slice(0, 8);
  const halfLen = Math.ceil(usableBullets.length / 2);
  const left = usableBullets.slice(0, halfLen);
  const right = usableBullets.slice(halfLen);

  const renderBulletCol = (items, bx, by, bw) => {
    if (items.length === 0) return;
    const bulletItems = items.map((b, i) => {
      return [
        {
          text: trunc(b, 90),
          options: {
            bullet: false, breakLine: i < items.length - 1,
            color: C.silver, fontSize: 12, fontFace: 'Calibri'
          }
        }
      ];
    }).flat();

    // Bullet dots as shapes
    items.forEach((_, i) => {
      slide.addShape(pres.shapes.OVAL, {
        x: bx, y: by + i * 0.55 + 0.06,
        w: 0.1, h: 0.1,
        fill: { color: accentColor }, line: { color: accentColor }
      });
    });

    items.forEach((b, i) => {
      slide.addText(trunc(b, 95), {
        x: bx + 0.18, y: by + i * 0.55,
        w: bw - 0.18, h: 0.48,
        fontSize: 11.5, color: C.silver, fontFace: 'Calibri',
        valign: 'middle', margin: 0, shrinkText: true
      });
    });
  };

  if (right.length === 0) {
    // Single column
    renderBulletCol(left, 0.5, 1.55, 9.0);
  } else {
    // Two columns
    renderBulletCol(left, 0.5, 1.55, 4.5);
    // Divider
    slide.addShape(pres.shapes.LINE, {
      x: 5.1, y: 1.55, w: 0, h: 3.6,
      line: { color: C.lead, width: 0.5 }
    });
    renderBulletCol(right, 5.3, 1.55, 4.2);
  }

  // Footer
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 5.25, w: 9, h: 0,
    line: { color: C.lead, width: 0.5 }
  });
  slide.addText(`AI in a Box  ·  ${heading.toUpperCase().slice(0, 40)}  ·  ${index} / ${totalSections}`, {
    x: 0.5, y: 5.3, w: 9, h: 0.22,
    fontSize: 7.5, color: C.zinc, align: 'center', fontFace: 'Calibri', margin: 0
  });
}

function addStatSlide(pres, { company, industry, accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.onyx };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: accentColor }, line: { color: accentColor }
  });

  slide.addText('WHY AI. WHY NOW.', {
    x: 0.5, y: 0.3, w: 9, h: 0.3,
    fontSize: 9, color: accentColor, charSpacing: 4, fontFace: 'Calibri', margin: 0
  });
  slide.addText('The AI opportunity in numbers', {
    x: 0.5, y: 0.62, w: 9, h: 0.55,
    fontSize: 28, color: C.paper, fontFace: 'Georgia', italic: true, margin: 0
  });

  const stats = [
    { n: '$72.8B', l: 'AI consulting market by 2030', c: C.amber },
    { n: '31.6%', l: 'Annual growth rate (CAGR)', c: C.cyan },
    { n: '86%', l: 'Buyers now seek AI-enabled firms', c: C.jade },
    { n: '95%', l: 'AI pilots fail without proper strategy', c: C.rose },
  ];

  stats.forEach((s, i) => {
    const bx = 0.5 + (i % 2) * 4.8;
    const by = 1.45 + Math.floor(i / 2) * 1.75;

    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: by, w: 4.5, h: 1.55,
      fill: { color: C.carbon }, line: { color: C.lead }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: by, w: 0.08, h: 1.55,
      fill: { color: s.c }, line: { color: s.c }
    });
    slide.addText(s.n, {
      x: bx + 0.2, y: by + 0.12, w: 4.1, h: 0.75,
      fontSize: 38, color: s.c, bold: true, fontFace: 'Georgia',
      margin: 0
    });
    slide.addText(s.l, {
      x: bx + 0.2, y: by + 0.9, w: 4.1, h: 0.5,
      fontSize: 11, color: C.silver, fontFace: 'Calibri', margin: 0
    });
  });
}

function addRoadmapSlide(pres, { accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: accentColor }, line: { color: accentColor }
  });

  slide.addText('18-MONTH ROADMAP', {
    x: 0.5, y: 0.3, w: 9, h: 0.3,
    fontSize: 9, color: accentColor, charSpacing: 4, fontFace: 'Calibri', margin: 0
  });
  slide.addText('Your AI transformation journey', {
    x: 0.5, y: 0.62, w: 9, h: 0.55,
    fontSize: 28, color: C.paper, fontFace: 'Georgia', italic: true, margin: 0
  });

  const phases = [
    { title: 'PHASE 1', sub: 'Quick Wins', range: '0 – 6 months', color: C.jade,
      items: ['AI tool audit & baseline assessment', 'Pilot 1–2 high-impact use cases', 'Data quality foundation', 'Team AI literacy programme'] },
    { title: 'PHASE 2', sub: 'Core Build', range: '6 – 12 months', color: C.amber,
      items: ['Scale successful pilots to production', 'Build internal AI competency centre', 'Integrate AI into core processes', 'Measure and report ROI to board'] },
    { title: 'PHASE 3', sub: 'Scale & Lead', range: '12 – 18 months', color: C.cyan,
      items: ['Enterprise-wide AI deployment', 'AI-native product/service development', 'Competitive AI advantage established', 'Continuous improvement engine live'] },
  ];

  // Timeline arrow
  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 2.0, w: 9.1, h: 0,
    line: { color: C.lead, width: 1.5 }
  });

  phases.forEach((p, i) => {
    const bx = 0.5 + i * 3.15;

    // Phase node on timeline
    slide.addShape(pres.shapes.OVAL, {
      x: bx + 1.3, y: 1.78, w: 0.44, h: 0.44,
      fill: { color: p.color }, line: { color: p.color }
    });

    // Phase card
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 2.3, w: 2.9, h: 2.9,
      fill: { color: C.carbon }, line: { color: C.lead }
    });
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 2.3, w: 2.9, h: 0.06,
      fill: { color: p.color }, line: { color: p.color }
    });

    slide.addText(p.title, {
      x: bx + 0.12, y: 2.38, w: 2.6, h: 0.3,
      fontSize: 8, color: p.color, charSpacing: 3, fontFace: 'Calibri', margin: 0
    });
    slide.addText(p.sub, {
      x: bx + 0.12, y: 2.65, w: 2.6, h: 0.4,
      fontSize: 16, color: C.paper, bold: true, fontFace: 'Georgia', margin: 0
    });
    slide.addText(p.range, {
      x: bx + 0.12, y: 3.0, w: 2.6, h: 0.28,
      fontSize: 9, color: p.color, fontFace: 'Calibri', margin: 0
    });

    p.items.forEach((item, j) => {
      slide.addShape(pres.shapes.OVAL, {
        x: bx + 0.12, y: 3.38 + j * 0.37 + 0.08,
        w: 0.08, h: 0.08,
        fill: { color: p.color }, line: { color: p.color }
      });
      slide.addText(trunc(item, 38), {
        x: bx + 0.28, y: 3.38 + j * 0.37,
        w: 2.5, h: 0.32,
        fontSize: 9.5, color: C.silver, fontFace: 'Calibri',
        valign: 'middle', margin: 0
      });
    });
  });

  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 5.25, w: 9, h: 0,
    line: { color: C.lead, width: 0.5 }
  });
  slide.addText('AI in a Box  ·  18-Month Transformation Roadmap', {
    x: 0.5, y: 5.3, w: 9, h: 0.22,
    fontSize: 7.5, color: C.zinc, align: 'center', fontFace: 'Calibri', margin: 0
  });
}

function addClosingSlide(pres, { company, accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 5.625,
    fill: { color: accentColor }, line: { color: accentColor }
  });

  // Large decorative quote mark
  slide.addText('"', {
    x: 0.3, y: 0.5, w: 3, h: 2.5,
    fontSize: 180, color: C.lead, fontFace: 'Georgia', margin: 0
  });

  slide.addText('The window to lead is now.', {
    x: 0.5, y: 1.4, w: 9, h: 1.2,
    fontSize: 36, color: C.paper, fontFace: 'Georgia', italic: true,
    margin: 0
  });
  slide.addText(`The AI transformation strategy for ${company} was prepared exclusively by AI in a Box, powered by Claude Opus with live web research.`, {
    x: 0.5, y: 2.8, w: 8, h: 0.9,
    fontSize: 13, color: C.silver, fontFace: 'Calibri',
    margin: 0, shrinkText: true
  });

  // CTA box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.85, w: 9, h: 1.1,
    fill: { color: C.carbon }, line: { color: accentColor }
  });
  slide.addText('Ready to take the next step?', {
    x: 0.6, y: 3.95, w: 8.8, h: 0.35,
    fontSize: 16, color: accentColor, bold: true, fontFace: 'Georgia', margin: 0
  });
  slide.addText('hello@aiinbox.com  ·  aiinbox.com  ·  Book your expert consultation today', {
    x: 0.6, y: 4.3, w: 8.8, h: 0.5,
    fontSize: 12, color: C.silver, fontFace: 'Calibri', margin: 0
  });

  slide.addShape(pres.shapes.LINE, {
    x: 0.5, y: 5.25, w: 9, h: 0,
    line: { color: C.lead, width: 0.5 }
  });
  slide.addText('© 2026 AI in a Box  ·  Confidential  ·  Not for redistribution', {
    x: 0.5, y: 5.3, w: 9, h: 0.22,
    fontSize: 7.5, color: C.zinc, align: 'center', fontFace: 'Calibri', margin: 0
  });
}

// ── Main PPTX builder ─────────────────────────────────────
async function buildPPTX({ company, industry, type, strategyText }) {
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'AI in a Box';
  pres.title = `AI Strategy — ${company}`;
  pres.subject = `${type.charAt(0).toUpperCase() + type.slice(1)} AI Strategy`;

  const accentColor = TYPE_COLOR[type] || C.amber;
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const sections = parseSections(strategyText);

  // Slide 1 — Cover
  addCoverSlide(pres, { company, industry, type, date, accentColor });

  // Slide 2 — Market stats
  addStatSlide(pres, { company, industry, accentColor });

  // Slide 3 — Agenda
  addAgendaSlide(pres, { sections, accentColor });

  // Slides 4..N — One per section
  sections.forEach((sec, i) => {
    addSectionSlide(pres, {
      index: i + 1,
      heading: sec.heading,
      bullets: sec.bullets,
      accentColor,
      totalSections: sections.length
    });
  });

  // Roadmap slide
  addRoadmapSlide(pres, { accentColor });

  // Closing slide
  addClosingSlide(pres, { company, accentColor });

  return pres;
}

// ── POST /api/pptx/generate ───────────────────────────────
router.post('/generate', async (req, res) => {
  const { company_name, industry, type, strategy_text, strategy_id } = req.body;

  if (!company_name || !strategy_text) {
    return res.status(400).json({ error: 'company_name and strategy_text are required' });
  }

  try {
    const pres = await buildPPTX({
      company: company_name,
      industry: industry || 'Enterprise',
      type: type || 'instant',
      strategyText: strategy_text
    });

    // Get base64 buffer
    const buffer = await pres.write({ outputType: 'nodebuffer' });
    const base64 = buffer.toString('base64');

    // Track PDF download in Supabase
    if (strategy_id) {
      supabaseAdmin.from('pdf_downloads').insert({
        strategy_id,
        downloaded_at: new Date().toISOString()
      }).then(() => {}).catch(console.error);
    }

    const filename = `AI-Strategy-${company_name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pptx`;

    res.json({
      success: true,
      filename,
      base64,
      slides: Math.ceil(strategy_text.split(/\n(?=[1-9]\.|#{1,3}\s)/).length) + 5
    });
  } catch (err) {
    console.error('PPTX generation error:', err);
    res.status(500).json({ error: err.message || 'PPTX generation failed' });
  }
});

module.exports = router;
