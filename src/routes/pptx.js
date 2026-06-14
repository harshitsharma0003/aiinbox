const express = require('express');
const PptxGenJS = require('pptxgenjs');
const { supabaseAdmin } = require('../supabase');

const router = express.Router();

// ── BRAND PALETTE ─────────────────────────────────────────
// "Midnight Executive" with warm gold accent — for premium enterprise feel
const C = {
  ink:      '07090D',  // near-black background
  onyx:     '0D1117',  // dark panel
  carbon:   '161B22',  // card surface
  lead:     '21262D',  // subtle border
  zinc:     '6E7681',  // muted text
  silver:   '8B949E',  // body text
  paper:    'F0F6FC',  // primary text on dark
  white:    'FFFFFF',
  // accents
  amber:    'E6933A',
  cyan:     '58A6FF',
  jade:     '3FB950',
  rose:     'F85149',
  violet:   'BC8CFF',
  gold:     'C9963A',
};

const TYPE_COLOR = {
  instant:  C.amber,
  custom:   C.violet,
  function: C.cyan,
};

const FONT_HEAD = 'Cambria';      // safe serif with personality
const FONT_BODY = 'Calibri';      // safe modern sans
const FONT_MONO = 'Consolas';     // for small labels

// ── Strip markdown so PPTX output is clean professional text ──
function stripMd(s) {
  if (!s) return '';
  return String(s)
    // Bold **text** or __text__ → text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    // Italic *text* or _text_ → text
    .replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1$2')
    .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, '$1$2')
    // Inline code
    .replace(/`([^`]+)`/g, '$1')
    // Headings #
    .replace(/^#{1,6}\s+/gm, '')
    // Links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

// ── Convert markdown tables into clean inline "Key: Value · ..." strings ──
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

// ── Parse Claude's text into sections ────────────────────
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
    return { heading, body, bullets };
  });
}

const trunc = (s, n) => !s ? '' : s.length > n ? s.slice(0, n - 1) + '…' : s;

// ── Reusable: footer slip (clean, no decorative bar) ─────
function addFooter(slide, { left = '', right = '', page = '' }) {
  // No line — just text in muted color, plenty of margin
  slide.addText(left, {
    x: 0.5, y: 5.32, w: 4.5, h: 0.2,
    fontSize: 8, color: C.zinc, fontFace: FONT_BODY,
    charSpacing: 2, margin: 0
  });
  if (page) {
    slide.addText(page, {
      x: 4.5, y: 5.32, w: 1, h: 0.2,
      fontSize: 8, color: C.zinc, fontFace: FONT_BODY,
      align: 'center', margin: 0
    });
  }
  slide.addText(right, {
    x: 5.0, y: 5.32, w: 4.5, h: 0.2,
    fontSize: 8, color: C.zinc, fontFace: FONT_BODY,
    align: 'right', charSpacing: 2, margin: 0
  });
}

// ── Reusable: brand mark (top-left, no stripe) ───────────
function addBrand(slide, color) {
  slide.addText([
    { text: 'AI',  options: { color: C.paper, bold: true, fontFace: FONT_HEAD } },
    { text: 'in',  options: { color, italic: true, fontFace: FONT_HEAD } },
    { text: 'Box', options: { color: C.silver, fontFace: FONT_HEAD } },
  ], {
    x: 0.5, y: 0.3, w: 3, h: 0.4,
    fontSize: 16, margin: 0
  });
}

// ═══════════════════════════════════════════════════════════
//  COVER SLIDE — dark, dominant typography, no stripes
// ═══════════════════════════════════════════════════════════
function addCoverSlide(pres, { company, industry, type, date, accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  // Top-right subtle confidentiality tag (no border bar)
  slide.addText('CONFIDENTIAL', {
    x: 7.5, y: 0.35, w: 2, h: 0.25,
    fontSize: 8, color: accentColor, charSpacing: 4,
    fontFace: FONT_BODY, align: 'right', margin: 0
  });

  // Brand mark
  addBrand(slide, accentColor);

  // Decorative motif: small accent dot in upper area (replacing stripes)
  slide.addShape(pres.shapes.OVAL, {
    x: 0.5, y: 1.4, w: 0.18, h: 0.18,
    fill: { color: accentColor }, line: { type: 'none' }
  });

  // Strategy type label
  const typeLabel = type === 'instant' ? 'INSTANT AI STRATEGY'
    : type === 'custom' ? 'CUSTOM AI STRATEGY'
    : 'FUNCTION AI STRATEGY';
  slide.addText(typeLabel, {
    x: 0.84, y: 1.37, w: 6, h: 0.25,
    fontSize: 9, color: accentColor, charSpacing: 4,
    fontFace: FONT_BODY, margin: 0
  });

  // Company name — dominant, takes the full deck visual weight
  slide.addText(trunc(company, 40), {
    x: 0.5, y: 1.8, w: 9, h: 1.5,
    fontSize: 48, color: C.paper, bold: true,
    fontFace: FONT_HEAD, margin: 0, shrinkText: true
  });

  // Italic subtitle
  slide.addText('AI Transformation Strategy', {
    x: 0.5, y: 3.35, w: 9, h: 0.55,
    fontSize: 22, color: C.silver, italic: true,
    fontFace: FONT_HEAD, margin: 0
  });

  // Metadata in clean rows — NOT pill boxes
  const meta = [
    ['INDUSTRY',   trunc(industry, 30)],
    ['PREPARED',   date],
    ['MODEL',      'Claude Opus 4'],
    ['CLASS',      type === 'instant' ? 'Public Data' : 'Proprietary'],
  ];
  meta.forEach((m, i) => {
    const by = 4.3 + Math.floor(i / 2) * 0.42;
    const bx = 0.5 + (i % 2) * 4.5;
    slide.addText(m[0], {
      x: bx, y: by, w: 1.2, h: 0.22,
      fontSize: 7.5, color: C.zinc, charSpacing: 3,
      fontFace: FONT_BODY, margin: 0
    });
    slide.addText(m[1], {
      x: bx + 1.3, y: by, w: 3, h: 0.22,
      fontSize: 11, color: C.paper, bold: true,
      fontFace: FONT_BODY, margin: 0, shrinkText: true
    });
  });

  // Footer (no line)
  addFooter(slide, { left: 'hello@aiinbox.com', right: 'aiinbox.com' });
}

// ═══════════════════════════════════════════════════════════
//  STATS SLIDE — large stat callouts, varied 2x2 grid
// ═══════════════════════════════════════════════════════════
function addStatSlide(pres, { accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.onyx };

  addBrand(slide, accentColor);

  slide.addText('WHY AI. WHY NOW.', {
    x: 0.5, y: 1.4, w: 9, h: 0.25,
    fontSize: 9, color: accentColor, charSpacing: 4,
    fontFace: FONT_BODY, margin: 0
  });
  slide.addText('The opportunity, by the numbers.', {
    x: 0.5, y: 1.75, w: 9, h: 0.6,
    fontSize: 26, color: C.paper, italic: true,
    fontFace: FONT_HEAD, margin: 0
  });

  // 2x2 stat grid — NO stripes, just subtle card surfaces
  const stats = [
    { n: '$72.8B', l: 'AI consulting market\nby 2030',                color: C.amber  },
    { n: '31.6%',  l: 'Annual market growth\n(CAGR through 2030)',     color: C.cyan   },
    { n: '86%',    l: 'Of buyers now seek\nAI-enabled firms',          color: C.jade   },
    { n: '95%',    l: 'Of AI pilots fail\nwithout proper strategy',    color: C.violet },
  ];
  stats.forEach((s, i) => {
    const bx = 0.6 + (i % 2) * 4.5;
    const by = 2.65 + Math.floor(i / 2) * 1.35;
    // Subtle card — no stripe, just background tint with border
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: by, w: 4.2, h: 1.15,
      fill: { color: C.carbon }, line: { color: C.lead, width: 0.5 }
    });
    // Number (huge)
    slide.addText(s.n, {
      x: bx + 0.2, y: by + 0.12, w: 1.9, h: 0.85,
      fontSize: 38, bold: true, color: s.color,
      fontFace: FONT_HEAD, valign: 'middle', margin: 0
    });
    // Label
    slide.addText(s.l, {
      x: bx + 2.2, y: by + 0.15, w: 1.9, h: 0.85,
      fontSize: 10, color: C.silver, fontFace: FONT_BODY,
      valign: 'middle', margin: 0
    });
  });

  // Source attribution
  slide.addText('Sources: Gartner · McKinsey Global Survey · IBM Institute for Business Value · 2025-26.', {
    x: 0.5, y: 5.05, w: 9, h: 0.25,
    fontSize: 8, color: C.zinc, italic: true,
    fontFace: FONT_BODY, margin: 0
  });

  addFooter(slide, { left: 'AI in a Box · Confidential', right: 'Market Context' });
}

// ═══════════════════════════════════════════════════════════
//  AGENDA SLIDE — typographic grid, no boxes
// ═══════════════════════════════════════════════════════════
function addAgendaSlide(pres, { sections, accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  addBrand(slide, accentColor);

  slide.addText('CONTENTS', {
    x: 0.5, y: 1.4, w: 9, h: 0.25,
    fontSize: 9, color: accentColor, charSpacing: 4,
    fontFace: FONT_BODY, margin: 0
  });
  slide.addText('What we cover.', {
    x: 0.5, y: 1.75, w: 9, h: 0.6,
    fontSize: 26, color: C.paper, italic: true,
    fontFace: FONT_HEAD, margin: 0
  });

  // Single-column typographic agenda — no boxes, just hierarchy
  const items = sections.slice(0, 8);
  items.forEach((sec, i) => {
    const by = 2.85 + i * 0.32;
    // Number — light gray, smaller
    slide.addText(String(i + 1).padStart(2, '0'), {
      x: 0.5, y: by, w: 0.5, h: 0.28,
      fontSize: 11, color: C.zinc, fontFace: FONT_BODY,
      margin: 0
    });
    // Section title
    slide.addText(trunc(sec.heading, 75), {
      x: 1.0, y: by, w: 7.5, h: 0.28,
      fontSize: 13, color: C.paper, fontFace: FONT_HEAD,
      margin: 0, valign: 'middle'
    });
    // Right-aligned page indicator
    slide.addText('p. ' + (i + 4), {
      x: 8.6, y: by, w: 0.9, h: 0.28,
      fontSize: 9, color: C.zinc, fontFace: FONT_BODY,
      align: 'right', margin: 0, valign: 'middle'
    });
    // Subtle separator dots (low opacity feel via color)
    if (i < items.length - 1) {
      slide.addShape(pres.shapes.LINE, {
        x: 0.5, y: by + 0.3, w: 9, h: 0,
        line: { color: C.lead, width: 0.5, dashType: 'dash' }
      });
    }
  });

  addFooter(slide, { left: 'AI in a Box · Confidential', right: 'Contents' });
}

// ═══════════════════════════════════════════════════════════
//  SECTION SLIDE — varied layout: 1-col, 2-col, or featured-quote
// ═══════════════════════════════════════════════════════════
function addSectionSlide(pres, { index, heading, bullets, accentColor, totalSections, variant }) {
  const slide = pres.addSlide();
  slide.background = { color: index % 2 === 0 ? C.ink : C.onyx };

  addBrand(slide, accentColor);

  // Section number — large, low-contrast, decorative (not a stripe)
  slide.addText(String(index).padStart(2, '0'), {
    x: 8.0, y: 0.25, w: 1.5, h: 1.0,
    fontSize: 64, color: C.lead, bold: true,
    fontFace: FONT_HEAD, align: 'right', margin: 0
  });

  // Eyebrow label
  slide.addText('SECTION ' + index + ' / ' + totalSections, {
    x: 0.5, y: 1.4, w: 6, h: 0.25,
    fontSize: 9, color: accentColor, charSpacing: 4,
    fontFace: FONT_BODY, margin: 0
  });

  // Heading — large serif
  slide.addText(trunc(heading, 80), {
    x: 0.5, y: 1.7, w: 8.8, h: 1.0,
    fontSize: 30, color: C.paper, bold: true,
    fontFace: FONT_HEAD, margin: 0, shrinkText: true
  });

  // Content area
  const usable = bullets.slice(0, 8);

  if (variant === 'callout' && usable.length >= 1) {
    // Featured callout layout — first bullet is a hero quote, rest below
    const hero = usable[0];
    const rest = usable.slice(1);

    // Hero quote — large italic serif
    slide.addText('"' + trunc(hero, 200) + '"', {
      x: 0.5, y: 2.85, w: 9, h: 1.1,
      fontSize: 18, color: accentColor, italic: true,
      fontFace: FONT_HEAD, margin: 0, shrinkText: true
    });

    // Rest as 2-column compact list
    const half = Math.ceil(rest.length / 2);
    const left = rest.slice(0, half);
    const right = rest.slice(half);

    [left, right].forEach((col, ci) => {
      const bx = 0.5 + ci * 4.5;
      col.forEach((b, i) => {
        const by = 4.1 + i * 0.32;
        slide.addShape(pres.shapes.OVAL, {
          x: bx, y: by + 0.06, w: 0.08, h: 0.08,
          fill: { color: accentColor }, line: { type: 'none' }
        });
        slide.addText(trunc(b, 75), {
          x: bx + 0.2, y: by, w: 4, h: 0.28,
          fontSize: 10, color: C.silver,
          fontFace: FONT_BODY, valign: 'middle', margin: 0
        });
      });
    });
  } else if (variant === 'twocol' || usable.length >= 5) {
    // 2-column bulleted layout
    const half = Math.ceil(usable.length / 2);
    const left = usable.slice(0, half);
    const right = usable.slice(half);

    [left, right].forEach((col, ci) => {
      const bx = 0.5 + ci * 4.5;
      col.forEach((b, i) => {
        const by = 2.9 + i * 0.46;
        slide.addShape(pres.shapes.OVAL, {
          x: bx, y: by + 0.07, w: 0.1, h: 0.1,
          fill: { color: accentColor }, line: { type: 'none' }
        });
        slide.addText(trunc(b, 95), {
          x: bx + 0.22, y: by, w: 4.2, h: 0.42,
          fontSize: 11, color: C.silver,
          fontFace: FONT_BODY, valign: 'top', margin: 0
        });
      });
    });
  } else {
    // Single-column for short lists — bigger text
    usable.forEach((b, i) => {
      const by = 2.9 + i * 0.5;
      slide.addShape(pres.shapes.OVAL, {
        x: 0.5, y: by + 0.08, w: 0.12, h: 0.12,
        fill: { color: accentColor }, line: { type: 'none' }
      });
      slide.addText(trunc(b, 180), {
        x: 0.8, y: by, w: 8.6, h: 0.46,
        fontSize: 13, color: C.paper,
        fontFace: FONT_BODY, valign: 'top', margin: 0
      });
    });
  }

  addFooter(slide, {
    left: 'AI in a Box · Confidential',
    right: trunc(heading, 40),
    page: index + ' / ' + totalSections
  });
}

// ═══════════════════════════════════════════════════════════
//  ROADMAP SLIDE — horizontal timeline (clean, no stripes)
// ═══════════════════════════════════════════════════════════
function addRoadmapSlide(pres, { accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.onyx };

  addBrand(slide, accentColor);

  slide.addText('ROADMAP', {
    x: 0.5, y: 1.4, w: 9, h: 0.25,
    fontSize: 9, color: accentColor, charSpacing: 4,
    fontFace: FONT_BODY, margin: 0
  });
  slide.addText('Eighteen months to AI fluency.', {
    x: 0.5, y: 1.75, w: 9, h: 0.6,
    fontSize: 26, color: C.paper, italic: true,
    fontFace: FONT_HEAD, margin: 0
  });

  const phases = [
    { phase: 'PHASE 01', dur: 'Months 1-3',  title: 'Foundation',   color: C.amber,  items: ['Data audit', 'Quick wins', 'Team setup'] },
    { phase: 'PHASE 02', dur: 'Months 4-9',  title: 'Acceleration', color: C.cyan,   items: ['Production AI', 'Process redesign', 'Skill build'] },
    { phase: 'PHASE 03', dur: 'Months 10-18',title: 'Scale',        color: C.jade,   items: ['Enterprise rollout', 'AI-native ops', 'Continuous gains'] },
  ];

  // Timeline backbone — a single dashed line connecting all 3
  slide.addShape(pres.shapes.LINE, {
    x: 1.2, y: 3.05, w: 7.6, h: 0,
    line: { color: C.lead, width: 1 }
  });

  phases.forEach((p, i) => {
    const bx = 0.6 + i * 3.13;
    // Node
    slide.addShape(pres.shapes.OVAL, {
      x: bx + 1.35, y: 2.93, w: 0.24, h: 0.24,
      fill: { color: p.color }, line: { color: p.color }
    });
    // Phase label
    slide.addText(p.phase, {
      x: bx, y: 2.55, w: 2.9, h: 0.25,
      fontSize: 8, color: p.color, charSpacing: 3,
      fontFace: FONT_BODY, align: 'center', margin: 0
    });
    // Duration
    slide.addText(p.dur, {
      x: bx, y: 3.32, w: 2.9, h: 0.22,
      fontSize: 9, color: C.zinc,
      fontFace: FONT_BODY, align: 'center', margin: 0
    });
    // Title
    slide.addText(p.title, {
      x: bx, y: 3.6, w: 2.9, h: 0.4,
      fontSize: 17, color: C.paper, bold: true,
      fontFace: FONT_HEAD, align: 'center', margin: 0
    });
    // Items
    p.items.forEach((item, j) => {
      slide.addText('— ' + item, {
        x: bx, y: 4.1 + j * 0.27, w: 2.9, h: 0.25,
        fontSize: 10, color: C.silver,
        fontFace: FONT_BODY, align: 'center', margin: 0
      });
    });
  });

  addFooter(slide, { left: 'AI in a Box · Confidential', right: 'Roadmap' });
}

// ═══════════════════════════════════════════════════════════
//  INVESTMENT SLIDE — comparison-style
// ═══════════════════════════════════════════════════════════
function addInvestmentSlide(pres, { accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  addBrand(slide, accentColor);

  slide.addText('INVESTMENT FRAMEWORK', {
    x: 0.5, y: 1.4, w: 9, h: 0.25,
    fontSize: 9, color: accentColor, charSpacing: 4,
    fontFace: FONT_BODY, margin: 0
  });
  slide.addText('Where the budget goes.', {
    x: 0.5, y: 1.75, w: 9, h: 0.6,
    fontSize: 26, color: C.paper, italic: true,
    fontFace: FONT_HEAD, margin: 0
  });

  // 3-column horizontal bar — illustrative budget split
  const splits = [
    { label: 'Foundation',   pct: '20%', detail: 'Data, infra, governance',           color: C.amber  },
    { label: 'Acceleration', pct: '50%', detail: 'Use cases in production',           color: C.cyan   },
    { label: 'Scale',        pct: '30%', detail: 'Enterprise rollout & ops',          color: C.jade   },
  ];

  // Horizontal stacked bar visual
  let xOffset = 0.5;
  const totalW = 9.0;
  splits.forEach((s, i) => {
    const w = (parseInt(s.pct) / 100) * totalW;
    // Bar
    slide.addShape(pres.shapes.RECTANGLE, {
      x: xOffset, y: 2.9, w, h: 0.5,
      fill: { color: s.color }, line: { type: 'none' }
    });
    // Percent inside bar
    slide.addText(s.pct, {
      x: xOffset, y: 2.9, w, h: 0.5,
      fontSize: 14, color: C.ink, bold: true,
      fontFace: FONT_HEAD, align: 'center', valign: 'middle', margin: 0
    });
    xOffset += w;
  });

  // Labels below bar
  xOffset = 0.5;
  splits.forEach((s, i) => {
    const w = (parseInt(s.pct) / 100) * totalW;
    slide.addText(s.label, {
      x: xOffset, y: 3.5, w, h: 0.3,
      fontSize: 12, color: s.color, bold: true,
      fontFace: FONT_HEAD, align: 'center', margin: 0
    });
    slide.addText(s.detail, {
      x: xOffset, y: 3.8, w, h: 0.3,
      fontSize: 9, color: C.silver,
      fontFace: FONT_BODY, align: 'center', margin: 0
    });
    xOffset += w;
  });

  // Indicative ranges callout
  const ranges = [
    ['CONSERVATIVE', '₹3–8 Cr',  'Sub-100Cr revenue · pilot-stage'],
    ['BALANCED',     '₹8–25 Cr', 'Mid-market · 3-5 use cases live'],
    ['AMBITIOUS',    '₹25 Cr+',  'Enterprise · platform-level AI'],
  ];
  ranges.forEach((r, i) => {
    const bx = 0.5 + i * 3.1;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 4.35, w: 2.9, h: 0.78,
      fill: { color: C.carbon }, line: { color: C.lead, width: 0.5 }
    });
    slide.addText(r[0], {
      x: bx + 0.15, y: 4.4, w: 2.6, h: 0.2,
      fontSize: 7.5, color: accentColor, charSpacing: 3,
      fontFace: FONT_BODY, margin: 0
    });
    slide.addText(r[1], {
      x: bx + 0.15, y: 4.6, w: 2.6, h: 0.3,
      fontSize: 14, color: C.paper, bold: true,
      fontFace: FONT_HEAD, margin: 0
    });
    slide.addText(r[2], {
      x: bx + 0.15, y: 4.88, w: 2.6, h: 0.22,
      fontSize: 8.5, color: C.silver, italic: true,
      fontFace: FONT_BODY, margin: 0
    });
  });

  addFooter(slide, { left: 'AI in a Box · Confidential', right: 'Investment' });
}

// ═══════════════════════════════════════════════════════════
//  CLOSING SLIDE — typographic, premium
// ═══════════════════════════════════════════════════════════
function addClosingSlide(pres, { company, accentColor }) {
  const slide = pres.addSlide();
  slide.background = { color: C.ink };

  addBrand(slide, accentColor);

  // Decorative quote glyph — large, low-contrast
  slide.addText('"', {
    x: 0.3, y: 0.8, w: 2.5, h: 2,
    fontSize: 140, color: C.lead, fontFace: FONT_HEAD, margin: 0
  });

  // Quote
  slide.addText('The window to lead is now.', {
    x: 0.5, y: 1.85, w: 9, h: 1.0,
    fontSize: 38, color: C.paper, italic: true,
    fontFace: FONT_HEAD, margin: 0
  });

  // Attribution
  slide.addText('Strategy prepared exclusively for ' + trunc(company, 40) + ' by AI in a Box,', {
    x: 0.5, y: 3.0, w: 9, h: 0.35,
    fontSize: 13, color: C.silver,
    fontFace: FONT_BODY, margin: 0
  });
  slide.addText('powered by Claude Opus 4 with live web research.', {
    x: 0.5, y: 3.32, w: 9, h: 0.35,
    fontSize: 13, color: C.silver,
    fontFace: FONT_BODY, margin: 0
  });

  // CTA — subtle card, no stripe
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.95, w: 9, h: 1.15,
    fill: { color: C.carbon }, line: { color: C.lead, width: 0.5 }
  });

  slide.addText('Ready for the next step?', {
    x: 0.7, y: 4.05, w: 8.6, h: 0.35,
    fontSize: 15, color: accentColor, bold: true,
    fontFace: FONT_HEAD, margin: 0
  });
  slide.addText('Book a 30-minute discovery call.  ·  hello@aiinbox.com  ·  aiinbox.com', {
    x: 0.7, y: 4.4, w: 8.6, h: 0.3,
    fontSize: 11, color: C.silver,
    fontFace: FONT_BODY, margin: 0
  });
  slide.addText('AI Design Sprint · Custom Strategy · C-Suite Packages', {
    x: 0.7, y: 4.7, w: 8.6, h: 0.3,
    fontSize: 9, color: C.zinc, italic: true,
    fontFace: FONT_BODY, margin: 0
  });

  addFooter(slide, {
    left: '© ' + new Date().getFullYear() + ' AI in a Box',
    right: 'Confidential · Not for redistribution'
  });
}

// ═══════════════════════════════════════════════════════════
//  MAIN BUILDER
// ═══════════════════════════════════════════════════════════
async function buildPPTX({ company, industry, type, strategyText }) {
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'AI in a Box';
  pres.title = 'AI Strategy — ' + company;
  pres.subject = (type.charAt(0).toUpperCase() + type.slice(1)) + ' AI Strategy';
  pres.company = 'AI in a Box';

  const accentColor = TYPE_COLOR[type] || C.amber;
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const sections = parseSections(strategyText);

  // 1. Cover
  addCoverSlide(pres, { company, industry, type, date, accentColor });

  // 2. Market stats
  addStatSlide(pres, { accentColor });

  // 3. Agenda
  addAgendaSlide(pres, { sections, accentColor });

  // 4..N. Sections — vary layout to avoid AI tell
  sections.forEach((sec, i) => {
    let variant = 'twocol';
    if (i === 0 && sec.bullets.length >= 1) variant = 'callout';
    else if (sec.bullets.length <= 4) variant = 'single';
    else variant = 'twocol';
    addSectionSlide(pres, {
      index: i + 1,
      heading: sec.heading,
      bullets: sec.bullets,
      accentColor,
      totalSections: sections.length,
      variant,
    });
  });

  // Roadmap
  addRoadmapSlide(pres, { accentColor });

  // Investment
  addInvestmentSlide(pres, { accentColor });

  // Closing
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

    const buffer = await pres.write({ outputType: 'nodebuffer' });
    const base64 = buffer.toString('base64');

    // Track PPTX download in Supabase
    if (strategy_id && supabaseAdmin) {
      supabaseAdmin.from('pdf_downloads').insert({
        strategy_id,
        downloaded_at: new Date().toISOString()
      }).then(() => {}).catch(() => {});
    }

    const filename = 'AI-Strategy-' + company_name.replace(/[^a-zA-Z0-9]/g, '-') + '-' + Date.now() + '.pptx';

    res.json({
      success: true,
      filename,
      base64,
      slides: parseSections(strategy_text).length + 6
    });
  } catch (err) {
    console.error('PPTX generation error:', err);
    res.status(500).json({ error: err.message || 'PPTX generation failed' });
  }
});

module.exports = router;
