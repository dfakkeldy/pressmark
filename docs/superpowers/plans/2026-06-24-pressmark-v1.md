# Pressmark V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, client-side Markdown-to-PDF app that proves Paged.js pagination first, then adds page furniture, templates, polish, and offline support.

**Architecture:** Vite + React owns the tool UI and settings. Markdown is parsed and sanitized into semantic HTML, assembled with cover/TOC/body sections, and rendered by Paged.js using generated CSS strings with real `@page` rules. Browser print exports the already-paginated Paged.js preview.

**Tech Stack:** Vite, React, TypeScript, Paged.js, markdown-it, Shiki, KaTeX, DOMPurify, local Fontsource fonts, Vitest.

## Global Constraints

- 100% client-side.
- No file uploads, no backend, no CDN dependencies at runtime.
- Use real CSS Paged Media through Paged.js, not unpaginated `window.print()`.
- Surface the privacy promise in the UI: "Your files never leave your browser."
- Build to static files with `npm run build`.

---

### Task 1: Pagination Pipeline

**Files:**
- Create: `src/lib/markdown.ts`
- Create: `src/lib/document.ts`
- Create: `src/lib/templates.ts`
- Create: `src/components/PagedPreview.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `renderMarkdown(markdown: string): Promise<string>`
- Produces: `buildPagedDocument(markdownHtml: string, settings: DocumentSettings): PagedDocument`
- Produces: `buildTemplateCss(settings: DocumentSettings, documentTitle: string): string`

- [x] Parse Markdown into sanitized HTML.
- [x] Build cover, TOC, and body sections with stable heading IDs.
- [x] Generate CSS containing `@page`, margin boxes, counters, and running heads.
- [x] Render the result through Paged.js Previewer.
- [x] Enable export only after pagination finishes.

### Task 2: Page Furniture

**Files:**
- Modify: `src/lib/templates.ts`
- Modify: `src/lib/document.ts`
- Modify: `sample.md`

**Interfaces:**
- Consumes: `DocumentSettings`
- Produces: CSS for cover page, TOC cross references, page numbers, running headers, and break control.

- [x] Add `counter(page)` and `counter(pages)` page number modes.
- [x] Add running headers via `string-set` and `string()`.
- [x] Add TOC links using `target-counter(attr(href url), page)`.
- [x] Keep cover free of headers, footers, and page numbers with a named page.
- [x] Add break control for headings, code, tables, figures, and paragraphs.

### Task 3: Templates and Controls

**Files:**
- Modify: `src/lib/templates.ts`
- Modify: `src/lib/defaults.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Interfaces:**
- Consumes: `TemplateId`
- Produces: Four template CSS token sets.

- [x] Add Editorial Report, Technical Docs, Modern Minimal, and Academic Manuscript templates.
- [x] Add template picker, page size, margin, metadata, and toggle controls.
- [x] Keep fonts self-hosted through package imports.

### Task 4: Polish and Static Delivery

**Files:**
- Modify: `src/App.css`
- Create: `public/sw.js`
- Create: `public/sample-figure.svg`
- Modify: `README.md`

**Interfaces:**
- Produces: offline-capable static app and user-facing documentation.

- [x] Add drag/drop for Markdown and local images.
- [x] Add Copy HTML.
- [x] Register service worker in production.
- [x] Validate with the long fixture.
- [x] Run final build, tests, and browser smoke checks.
