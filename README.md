# Pressmark

Pressmark is a 100% client-side Markdown to paged PDF tool. It parses Markdown in the browser, assembles a cover page, generated table of contents, running headers, page numbers, and template CSS, then asks Paged.js to render the live paginated preview.

Your files never leave your browser. There is no backend, no login, no analytics, and no CDN dependency at runtime.

Live site: https://dfakkeldy.github.io/pressmark/

## Features

- GitHub-Flavored Markdown-style tables, task lists, strikethrough, and autolinks.
- Footnotes through `markdown-it-footnote`.
- Inline and block math rendered with KaTeX.
- Syntax-highlighted code blocks with Shiki.
- Drag/drop `.md` files and local images. Dropped image files are read with `FileReader` as data URLs.
- Paged.js preview with real CSS paged-media furniture:
  - `counter(page)` and `counter(pages)` page numbers.
  - Running headers through `string-set` and `string()`.
  - TOC page references through `target-counter()`.
  - Named cover page with no header, footer, or page number.
  - Break control for headings, tables, code, figures, and paragraphs.
- Four self-hosted templates: Editorial Report, Technical Docs, Modern Minimal, and Academic Manuscript.
- Selectable body fonts including OpenDyslexic, Lexend, Helvetica, Atkinson Hyperlegible, Inter, Lato, Merriweather, and Source Serif 4.
- Production service worker for offline use after first load.

## Run

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

## Build

```bash
npm run build
npm run preview
```

The static bundle is written to `dist/` and can be served from any static host.

## Export

Pressmark does not print raw, unpaginated HTML. The preview pane is the Paged.js output. When the preview is ready, `Export PDF` opens the browser print dialog for that already-paginated document.

For best PDF output in Chrome:

- Destination: Save as PDF.
- Margins: None.
- Headers and footers: Off.
- Background graphics: On.

## Verify

```bash
npm test
npm run lint
npm run build
```

The included `sample.md` is the long fixture for pagination checks. It should produce a multi-page PDF with a clean cover, clickable TOC, visible page numbers, running headers, highlighted code, rendered math, tables, task lists, an image, and footnotes.

## Architecture

- `src/lib/markdown.ts` parses and sanitizes Markdown.
- `src/lib/document.ts` adds heading IDs, cover markup, TOC markup, and standalone HTML.
- `src/lib/templates.ts` generates the paged-media CSS for the active template and settings.
- `src/components/PagedPreview.tsx` runs `new Previewer().preview(...)` and reports readiness/page count.
- `public/sw.js` caches same-origin static assets for offline use after first load.
