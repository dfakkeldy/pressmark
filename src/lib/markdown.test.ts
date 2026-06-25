// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  it('renders GFM-like tasks, footnotes, math, and highlighted code', async () => {
    const html = await renderMarkdown(`- [x] Checked

Inline math $E = mc^2$ and a note.[^a]

\`\`\`ts
const page = 'ready'
\`\`\`

[^a]: Footnote copy.
`)

    expect(html).toContain('task-list-item')
    expect(html).toContain('katex')
    expect(html).toContain('footnote')
    expect(html).toContain('class="shiki')
    expect(html).toContain('const')
  })

  it('keeps bare relative image sources for static deployments', async () => {
    const html = await renderMarkdown('![Pipeline](sample-figure.svg)')

    expect(html).toContain('src="sample-figure.svg"')
  })
})
