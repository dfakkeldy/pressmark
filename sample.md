# The Quiet Machinery of Great Documents

Documents feel trustworthy when the page knows where it is. Running heads, live page
numbers, tables of contents, code, figures, notes, and calm spacing all contribute to a
reader's confidence before they notice any one of those details.

This sample is intentionally long. It exercises headings, tables, footnotes, task lists,
math, images, blockquotes, and code so Pressmark can prove that the hard part is not a
decorative export button. The hard part is paged-media typesetting in the browser.

![A local SVG figure showing the Pressmark pagination pipeline](/sample-figure.svg)

## What Pressmark proves

- Markdown can remain the authoring format while the output behaves like a designed PDF.
- Page furniture belongs in CSS paged-media rules, not in screenshots or fixed overlays.
- A privacy-first converter can work fully client-side without uploads.
- Templates should feel opinionated enough to save the user from tuning every knob.

> A good PDF export does not ask readers to forgive the medium. It gives them a clean page,
> useful landmarks, and typography that keeps its promises.

## Fixture checklist

- [x] GitHub-Flavored Markdown tables and task lists
- [x] Footnotes and internal links
- [x] Inline math such as $E = mc^2$
- [x] Display math
- [x] Syntax-highlighted code
- [x] Local images that never upload

The table below should avoid awkward page breaks, keep headers legible, and maintain a
readable measure.

| Feature | Why it matters | Paged-media signal |
| --- | --- | --- |
| Cover page | Sets context before page furniture begins | Named `cover` page |
| Table of contents | Confirms page destinations | `target-counter()` |
| Running head | Keeps orientation in long documents | `string-set` |
| Page numbers | Makes references stable | `counter(page)` |
| Chapter breaks | Gives long reports rhythm | `break-before: page` |

## The pagination contract

The pipeline is deliberately small:

```ts
const html = await renderMarkdown(markdown)
const document = buildPagedDocument(html, settings)
await previewer.preview(document.bodyHtml, [document.css], previewRoot)
```

The app is allowed to be beautiful, but it is not allowed to hide a weak pagination path.
The preview pane shows the actual Paged.js output. The export button waits until pagination
has completed, then asks the browser to save the already-paginated document as a PDF.

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$

## Local-first handling

When a Markdown file is dropped with images, Pressmark rewrites matching image references
to data URLs. That means a document can include local diagrams or screenshots while keeping
the privacy promise intact.[^privacy]

[^privacy]: The sample figure is served from the static app bundle. User-dropped images are read with `FileReader` and remain in memory as data URLs.

# A Report Chapter With Enough Weight

Long-form reports need more than clean paragraphs. They need predictable section starts,
headings that do not strand themselves, code blocks that do not tear apart, and tables that
survive the edge of the page. This chapter repeats realistic prose to force several page
breaks across the preview.

## The reader's map

The table of contents is generated from headings. Its page numbers are not guessed from
JavaScript; they are created by CSS cross-references after layout. If a template changes
margins or type size, the page references move with the content.

Paragraphs in this section are intentionally plain. The sample wants to expose layout
behavior, not entertain with copy. A Markdown-to-PDF tool should be resilient when the
author writes dense material, not only when a demo document is short and convenient.

Repeated body copy creates a useful pressure test. The following paragraphs should flow
over pages with running headers intact, page numbers in order, and no isolated heading at
the bottom of a sheet.

Pressmark treats CSS as the place where page behavior lives. Margins, counters, running
heads, break control, and template type scales all belong to the stylesheet. The React app
assembles the document and settings, but the page model remains declarative.

## Tables and lists

| Template | Body face | Best for | Accent |
| --- | --- | --- | --- |
| Editorial Report | Source Serif 4 | Client reports | Clay |
| Technical Docs | Inter and IBM Plex Mono | READMEs and specs | Blue green |
| Modern Minimal | Inter and Space Grotesk | Proposals | Coral |
| Academic Manuscript | Libre Baskerville | Essays and papers | Steel |

1. Parse Markdown to semantic HTML.
2. Add stable heading IDs.
3. Generate cover and table of contents sections.
4. Inject template CSS with `@page` rules.
5. Let Paged.js paginate the live preview.
6. Export only after pagination finishes.

## Notes on rhythm

Good vertical rhythm is mostly restraint. Body text needs a comfortable line height, code
needs enough padding to be scannable, and headings need more space before than after. Those
choices differ by template, but the contract stays the same.

Pressmark uses a small set of settings instead of an infinite style panel. Page size,
margins, cover, contents, page numbering, and chapter breaks are meaningful controls. A
template picker should do the rest.

# Technical Appendix

This section includes code and a denser heading structure. The technical template should
make this part feel natural without making the editorial template fall apart.

## A small renderer shape

```tsx
export function PagedPreview({ html, css }: Props) {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previewer = new Previewer()
    previewer.preview(html, [{ 'template.css': css }], previewRef.current)
  }, [html, css])

  return <div ref={previewRef} />
}
```

### Why this matters

Pagination is asynchronous. The export button should not be active while the page count,
table of contents, and generated margin boxes are still settling.

### Practical validation

Use this sample after every template change. If the TOC references drift, if the cover gets
a page number, or if a code block splits badly, the template is not done.

## More prose for page pressure

The rest of this appendix repeats realistic technical prose. A proper fixture has enough
length to make pagination bugs visible. Short samples are friendly to demos and hostile to
quality.

The preview should remain responsive while the source changes. A small debounce protects
the layout engine from needless churn, while still making the tool feel alive during
editing. The user should never need to think about the internal pipeline.

Security still matters in a local app. Markdown is sanitized before it enters the preview.
Math is rendered through KaTeX directly, avoiding a known vulnerable wrapper package. Links
open in a separate tab unless they point to headings inside the document.

# Manuscript Notes

Academic and manuscript output has a different temperature. It can be quieter, more
conservative, and more dependent on hierarchy than color. Numbered sections help readers
cross-reference arguments without turning the page into a dashboard.

## Argument

The PDF is often the final artifact that leaves the author's machine. That makes privacy
part of the interface, not only part of the README. Pressmark keeps the statement visible:
files never leave the browser.

## Evidence

The sample contains enough structural variety to catch common problems. Footnotes should
remain legible, math should render cleanly, and code should keep its spacing. Tables should
not collide with page furniture.

## Closing

A beautiful Markdown-to-PDF converter earns its keep by caring about the page. The page is
where the reader meets the work.
