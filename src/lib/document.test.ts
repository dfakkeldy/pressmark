// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from './defaults'
import { buildPagedDocument } from './document'

describe('buildPagedDocument', () => {
  it('adds stable heading IDs and a paged-media table of contents', () => {
    const document = buildPagedDocument(
      '<h1>Alpha Report</h1><p>Intro</p><h2>Findings</h2><p>Body</p>',
      DEFAULT_SETTINGS,
    )

    expect(document.headings).toEqual([
      { id: 'alpha-report', level: 1, text: 'Alpha Report' },
      { id: 'findings', level: 2, text: 'Findings' },
    ])
    expect(document.bodyHtml).toContain('href="#alpha-report"')
    expect(document.bodyHtml).toContain('class="pm-cover"')
    expect(document.css).toContain('target-counter(attr(href url), page)')
    expect(document.css).toContain('counter(page) " of " counter(pages)')
    expect(document.css).toContain('@page cover')
    expect(document.css).toContain('string(pmChapter, start)')
  })

  it('honors furniture toggles', () => {
    const document = buildPagedDocument('<h1>No Cover</h1><p>Body</p>', {
      ...DEFAULT_SETTINGS,
      includeCover: false,
      includeToc: false,
      includePageNumbers: false,
      startChaptersOnNewPage: false,
    })

    expect(document.bodyHtml).not.toContain('pm-cover')
    expect(document.bodyHtml).not.toContain('pm-toc')
    expect(document.css).toContain('@bottom-center')
    expect(document.css).toContain('content: none')
    expect(document.css).not.toContain('break-before: page;')
  })

  it('uses the selected body font in generated paged CSS', () => {
    const document = buildPagedDocument('<h1>Readable</h1><p>Body</p>', {
      ...DEFAULT_SETTINGS,
      bodyFontId: 'opendyslexic',
    })

    expect(document.css).toContain('--pm-body-font: "OpenDyslexic", "Atkinson Hyperlegible", Arial, sans-serif;')
    expect(document.css).toContain('line-height: 1.68;')
  })
})
