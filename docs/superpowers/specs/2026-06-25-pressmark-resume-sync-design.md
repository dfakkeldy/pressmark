# Pressmark ATS Resume and Source Sync Design

## Context

Pressmark is a client-side Markdown to paged PDF app. It already supports multiple paged-media templates, selectable body fonts, local Markdown/image drops, sanitized Markdown rendering, Paged.js preview, PDF export through browser print, and GitHub Pages deployment.

This change adds a practical resume workflow while improving the editing surface for longer documents.

## Goals

- Add an ATS-friendly resume template that produces a clean, single-column PDF suitable for applicant tracking systems and human review.
- Keep Markdown image support available without making images part of the default ATS resume structure.
- Let the editor pane become narrower or wider so users can better align the source side with the paged preview side.
- Add source-to-preview and preview-to-source block highlighting so users can quickly understand where a Markdown block landed in the paginated output.

## Non-Goals

- Do not add a full WYSIWYG editor.
- Do not attempt exact character-level text sync between Markdown source and paginated PDF text.
- Do not add multi-column or highly decorative resume layouts to the ATS template.
- Do not upload, persist, or externally process user documents or images.

## Resume Template

Add a fifth template named `ATS Resume`.

Default behavior when selected:

- `includeCover`: false
- `includeToc`: false
- `includePageNumbers`: true
- `startChaptersOnNewPage`: false
- `bodyFontId`: `helvetica`
- `pageSize`: existing user setting, defaulting to US Letter through current defaults
- margins remain user-adjustable

Visual direction:

- Single-column text flow.
- Compact name/contact header from the first `h1` plus following contact paragraph.
- Simple uppercase section labels for `h2`.
- Tight but readable bullets for experience and project entries.
- Minimal rules and no decorative icons.
- Black or near-black ink, muted gray secondary text, very subtle accent only for rules or section markers.
- Resume content should stay legible if copied as plain text from the PDF.

Sample structure:

```md
# Jane Doe
Product Designer / Halifax, NS / jane@example.com / linkedin.com/in/janedoe

## Summary
Product designer focused on document tools, design systems, and accessible workflows.

## Experience
### Senior Product Designer, Acme Studio
2022-Present
- Led the redesign of a complex reporting workflow.
- Improved review turnaround by 34% through clearer document states.

## Projects
### Pressmark
- Built a browser-only Markdown to paged PDF workflow.

## Education
Bachelor of Design, NSCAD University

## Skills
Design systems / Accessibility / Research / React / Prototyping
```

## Image Handling

Existing image behavior stays in place:

- Markdown image syntax works for relative, HTTP(S), and data image URLs.
- Dropped image files are read with `FileReader` and converted to in-browser data URLs.
- Dropping a Markdown file with matching image files rewrites references such as `photo.jpg`, `./photo.jpg`, `images/photo.jpg`, and `assets/photo.jpg`.

The ATS Resume sample should not include images by default. If a user includes an image, the template should render it conservatively: bounded width, no floating layout, and no dependency on the image for meaning.

## Adjustable Workspace

Replace the fixed editor/preview workspace columns with a resizable split layout on desktop.

Behavior:

- A draggable divider sits between the source panel and preview stack.
- The source pane width is clamped to a useful range, for example 280-720 px.
- The preview pane takes the remaining width.
- A compact "fit source" control snaps the editor to a narrow Markdown measure that pairs well with the PDF preview.
- The width is stored in React state for the current session.
- On narrow screens, the current stacked layout remains.

The source pane should not claim exact visual line parity with the PDF. Markdown syntax, monospace source text, proportional document fonts, and Paged.js pagination make exact parity fragile. The goal is visual comfort and better side-by-side scanning.

## Block Highlighting

Implement block-level source mapping.

Source mapping model:

- Derive source line ranges from Markdown-it block token maps where available.
- Assign stable source block IDs to headings, paragraphs, lists, list items where practical, blockquotes, code blocks, tables, and images.
- Add `data-source-block`, `data-source-start`, and `data-source-end` attributes to rendered block elements before Paged.js pagination.
- Preserve those attributes through the Paged.js rendered output.

Source to preview:

- Track the active source line from textarea cursor or selection.
- Find the source block whose line range contains that line.
- Highlight the matching rendered block in the paginated preview.
- Scroll the matching block into view when the active line changes through explicit navigation or click, but avoid aggressive scrolling on every keystroke.

Preview to source:

- Clicking a highlighted-capable block in the paginated preview activates its source block.
- The textarea scrolls to the matching source line range.
- The matching source range is selected when practical using textarea selection APIs.

Highlight style:

- Use a subtle outline or background wash that does not affect pagination.
- Keep highlight styles out of print output.
- The active state should be visible in both panes and removable by clicking elsewhere or moving the cursor.

## Architecture

Add a small source-map layer rather than embedding sync behavior directly inside the app component.

Suggested modules:

- `src/lib/sourceMap.ts`: source block types, Markdown line helpers, and active-line lookup.
- `src/lib/markdown.ts`: attach source metadata during Markdown rendering where Markdown-it token maps are available.
- `src/lib/document.ts`: preserve source metadata while building the paged document wrapper.
- `src/components/PagedPreview.tsx`: expose block click events and apply active block class inside the paged host.
- `src/App.tsx`: own active block state, editor width state, and event wiring between textarea and preview.

## Testing

Automated tests:

- ATS template produces CSS with no cover dependency and resume-specific selectors.
- Selecting the ATS Resume template applies resume defaults.
- Markdown image sanitization continues to preserve relative image URLs and data image URLs.
- Source map lookup returns the correct block for representative line ranges.
- Rendered HTML contains source metadata for headings, paragraphs, code blocks, and images.

Browser verification:

- The resume template paginates a sample resume.
- The editor divider resizes the panes and preserves the preview.
- The fit source control narrows the editor predictably.
- Cursoring in the source highlights the matching paged block.
- Clicking a paged block selects or scrolls the matching source lines.
- PDF export hides interactive highlights.

## Deployment

After implementation:

- Run tests, lint, and production build.
- Verify locally in browser with desktop and mobile viewports.
- Deploy through the existing GitHub Pages workflow.
- Verify the live site with service workers enabled so returning users receive the updated app shell.
