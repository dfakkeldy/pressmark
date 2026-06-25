import { escapeCssString } from './escape'
import { fontById } from './fonts'
import type { DocumentSettings, TemplateId } from './types'

interface TemplateTokens {
  background: string
  paper: string
  ink: string
  muted: string
  accent: string
  rule: string
  body: string
  display: string
  mono: string
  bodySize: string
  lineHeight: string
  headingWeight: string
  codeBackground: string
}

const TOKENS: Record<TemplateId, TemplateTokens> = {
  editorial: {
    background: '#e8ece8',
    paper: '#fffdfa',
    ink: '#1f2523',
    muted: '#69736c',
    accent: '#a35638',
    rule: '#d9d2c6',
    body: '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif',
    display: '"Newsreader Variable", Newsreader, Georgia, serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    bodySize: '10.6pt',
    lineHeight: '1.56',
    headingWeight: '650',
    codeBackground: '#f3f1eb',
  },
  technical: {
    background: '#e7eef0',
    paper: '#fcfefe',
    ink: '#172229',
    muted: '#5f7179',
    accent: '#256d85',
    rule: '#c9d9de',
    body: '"Inter Variable", Inter, system-ui, sans-serif',
    display: '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    bodySize: '9.8pt',
    lineHeight: '1.5',
    headingWeight: '690',
    codeBackground: '#eef5f7',
  },
  modern: {
    background: '#eceee9',
    paper: '#ffffff',
    ink: '#181916',
    muted: '#696c63',
    accent: '#d94f45',
    rule: '#d8ddd2',
    body: '"Inter Variable", Inter, system-ui, sans-serif',
    display: '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    bodySize: '10.2pt',
    lineHeight: '1.58',
    headingWeight: '720',
    codeBackground: '#f2f4ef',
  },
  academic: {
    background: '#e9ebed',
    paper: '#fffefd',
    ink: '#191b1f',
    muted: '#5e626b',
    accent: '#394f68',
    rule: '#cfd4dc',
    body: '"Libre Baskerville", Georgia, serif',
    display: '"Libre Baskerville", Georgia, serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    bodySize: '10pt',
    lineHeight: '1.62',
    headingWeight: '700',
    codeBackground: '#f4f5f7',
  },
}

function pageSizeValue(pageSize: DocumentSettings['pageSize']) {
  return pageSize === 'a4' ? 'A4 portrait' : 'Letter portrait'
}

function pageNumberContent(settings: DocumentSettings) {
  if (!settings.includePageNumbers) return 'none'
  if (settings.pageNumberStyle === 'page') return '"Page " counter(page)'
  return '"Page " counter(page) " of " counter(pages)'
}

function academicCounters(templateId: TemplateId) {
  if (templateId !== 'academic') return ''
  return `
    .pm-body { counter-reset: h1; }
    .pm-body h1 { counter-reset: h2; }
    .pm-body h2 { counter-reset: h3; }
    .pm-body h1::before {
      counter-increment: h1;
      content: counter(h1) ". ";
      color: var(--pm-accent);
    }
    .pm-body h2::before {
      counter-increment: h2;
      content: counter(h1) "." counter(h2) " ";
      color: var(--pm-accent);
    }
    .pm-body h3::before {
      counter-increment: h3;
      content: counter(h1) "." counter(h2) "." counter(h3) " ";
      color: var(--pm-muted);
    }
  `
}

export function buildTemplateCss(settings: DocumentSettings, documentTitle: string) {
  const tokens = TOKENS[settings.templateId]
  const selectedFont = fontById(settings.bodyFontId)
  const bodyFont = selectedFont.cssStack ?? tokens.body
  const bodySize = selectedFont.bodySize ?? tokens.bodySize
  const lineHeight = selectedFont.lineHeight ?? tokens.lineHeight
  const title = escapeCssString(documentTitle)
  const pageNumbers = pageNumberContent(settings)
  const chapterBreaks = settings.startChaptersOnNewPage
    ? `
      .pm-body .pm-chapter-title {
        break-before: page;
      }
      .pm-body .pm-chapter-title:first-child {
        break-before: auto;
      }
    `
    : ''

  return `
    :root {
      --pm-background: ${tokens.background};
      --pm-paper: ${tokens.paper};
      --pm-ink: ${tokens.ink};
      --pm-muted: ${tokens.muted};
      --pm-accent: ${tokens.accent};
      --pm-rule: ${tokens.rule};
      --pm-code-bg: ${tokens.codeBackground};
      --pm-body-font: ${bodyFont};
      --pm-display-font: ${tokens.display};
      --pm-mono-font: ${tokens.mono};
    }

    @page {
      size: ${pageSizeValue(settings.pageSize)};
      margin: ${settings.marginMm}mm;
      @top-left {
        content: "${title}";
        color: var(--pm-muted);
        font-family: var(--pm-mono-font);
        font-size: 7.5pt;
        letter-spacing: .04em;
        text-transform: uppercase;
        vertical-align: bottom;
        padding-bottom: 5mm;
      }
      @top-right {
        content: string(pmChapter, start);
        color: var(--pm-muted);
        font-family: var(--pm-mono-font);
        font-size: 7.5pt;
        letter-spacing: .04em;
        text-transform: uppercase;
        vertical-align: bottom;
        padding-bottom: 5mm;
      }
      @bottom-center {
        content: ${pageNumbers};
        color: var(--pm-muted);
        font-family: var(--pm-mono-font);
        font-size: 8pt;
        padding-top: 4mm;
        vertical-align: top;
      }
    }

    @page cover {
      margin: 0;
      @top-left { content: none; }
      @top-right { content: none; }
      @bottom-center { content: none; }
    }

    @page toc {
      @top-right { content: "Contents"; }
    }

    .pm-document {
      color: var(--pm-ink);
      background: var(--pm-paper);
      font-family: var(--pm-body-font);
      font-size: ${bodySize};
      line-height: ${lineHeight};
      font-kerning: normal;
      text-rendering: optimizeLegibility;
    }

    .pm-cover {
      page: cover;
      min-height: 100%;
      padding: 30mm;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      background:
        linear-gradient(120deg, color-mix(in srgb, var(--pm-accent) 10%, transparent), transparent 36%),
        var(--pm-paper);
      break-after: page;
    }

    .pm-cover-rule {
      width: 32mm;
      height: 2.4mm;
      background: var(--pm-accent);
      margin-bottom: 18mm;
    }

    .pm-cover-kicker,
    .pm-cover-meta,
    .pm-toc-kicker {
      color: var(--pm-muted);
      font-family: var(--pm-mono-font);
      font-size: 8pt;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .pm-cover h1 {
      max-width: 130mm;
      margin: 0;
      color: var(--pm-ink);
      font-family: var(--pm-display-font);
      font-size: 38pt;
      font-weight: ${tokens.headingWeight};
      letter-spacing: 0;
      line-height: .98;
    }

    .pm-cover-subtitle {
      max-width: 108mm;
      margin: 8mm 0 0;
      color: var(--pm-muted);
      font-size: 14pt;
      line-height: 1.35;
    }

    .pm-cover-meta {
      margin-top: 22mm;
    }

    .pm-toc {
      page: toc;
      break-after: page;
    }

    .pm-toc h2 {
      margin: 0 0 11mm;
      font-family: var(--pm-display-font);
      font-size: 24pt;
      line-height: 1;
    }

    .pm-toc-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .pm-toc-item {
      margin: 0 0 3.4mm;
      break-inside: avoid;
    }

    .pm-toc-level-2 { margin-left: 6mm; }
    .pm-toc-level-3 { margin-left: 12mm; font-size: 90%; color: var(--pm-muted); }

    .pm-toc a {
      display: grid;
      grid-template-columns: minmax(28mm, auto) 1fr auto;
      gap: 3mm;
      color: inherit;
      text-decoration: none;
    }

    .pm-toc a::before {
      content: "";
      grid-column: 2;
      border-bottom: 1px dotted var(--pm-rule);
      transform: translateY(-1.6mm);
    }

    .pm-toc a::after {
      content: target-counter(attr(href url), page);
      grid-column: 3;
      color: var(--pm-accent);
      font-family: var(--pm-mono-font);
      font-size: 8pt;
    }

    .pm-toc-label {
      grid-column: 1;
    }

    .pm-body {
      max-width: 72ch;
    }

    .pm-body h1 {
      string-set: pmChapter content(text);
      margin: 0 0 7mm;
      font-family: var(--pm-display-font);
      font-size: 25pt;
      font-weight: ${tokens.headingWeight};
      line-height: 1.08;
      letter-spacing: 0;
    }

    .pm-body h2 {
      margin: 10mm 0 4mm;
      color: var(--pm-ink);
      font-family: var(--pm-display-font);
      font-size: 15.5pt;
      font-weight: ${tokens.headingWeight};
      line-height: 1.18;
    }

    .pm-body h3 {
      margin: 7mm 0 2.5mm;
      color: var(--pm-muted);
      font-family: var(--pm-mono-font);
      font-size: 9pt;
      font-weight: 600;
      letter-spacing: .06em;
      text-transform: uppercase;
    }

    .pm-body h1,
    .pm-body h2,
    .pm-body h3 {
      break-after: avoid;
    }

    .pm-body h1 + *,
    .pm-body h2 + *,
    .pm-body h3 + * {
      break-before: avoid;
    }

    .pm-body p,
    .pm-body ul,
    .pm-body ol {
      margin: 0 0 4.2mm;
      orphans: 3;
      widows: 3;
    }

    .pm-body ul,
    .pm-body ol {
      padding-left: 6mm;
    }

    .pm-body li {
      margin-bottom: 1.6mm;
    }

    .task-list-item {
      list-style: none;
      margin-left: -5mm;
    }

    .task-list-item-checkbox {
      width: 3.2mm;
      height: 3.2mm;
      margin-right: 2mm;
      padding: 0;
      border: 1px solid var(--pm-rule);
      vertical-align: -.4mm;
      transform: translateY(.4mm);
      accent-color: var(--pm-accent);
    }

    .task-list-item-label {
      display: inline;
      margin: 0;
      color: inherit;
      font-family: inherit;
      font-size: inherit;
      font-weight: inherit;
      letter-spacing: 0;
      text-transform: none;
    }

    .pm-body blockquote {
      margin: 7mm 0;
      padding: 4mm 0 4mm 6mm;
      border-left: 1.3mm solid var(--pm-accent);
      color: var(--pm-muted);
      break-inside: avoid;
    }

    .pm-body table {
      width: 100%;
      margin: 7mm 0;
      border-collapse: collapse;
      font-size: 9pt;
      break-inside: avoid;
    }

    .pm-body th,
    .pm-body td {
      padding: 2.2mm 2mm;
      border-bottom: 1px solid var(--pm-rule);
      text-align: left;
      vertical-align: top;
    }

    .pm-body th {
      color: var(--pm-accent);
      font-family: var(--pm-mono-font);
      font-size: 7.6pt;
      letter-spacing: .06em;
      text-transform: uppercase;
    }

    .pm-body pre {
      margin: 7mm 0;
      padding: 4mm;
      border: 1px solid var(--pm-rule);
      border-radius: 2mm;
      background: var(--pm-code-bg) !important;
      white-space: pre-wrap;
      break-inside: avoid;
    }

    .pm-body code,
    .pm-body pre code {
      font-family: var(--pm-mono-font);
      font-size: 8.2pt;
    }

    .pm-body :not(pre) > code {
      padding: .4mm 1.1mm;
      border-radius: .8mm;
      background: var(--pm-code-bg);
      color: var(--pm-accent);
    }

    .pm-body img,
    .pm-body svg {
      max-width: 100%;
      height: auto;
    }

    .pm-body figure,
    .pm-body img,
    .katex-display {
      break-inside: avoid;
    }

    .footnotes {
      margin-top: 12mm;
      padding-top: 5mm;
      border-top: 1px solid var(--pm-rule);
      color: var(--pm-muted);
      font-size: 8.6pt;
    }

    ${chapterBreaks}
    ${academicCounters(settings.templateId)}
  `
}
