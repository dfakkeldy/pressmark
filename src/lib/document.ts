import { buildTemplateCss } from './templates'
import { escapeHtml } from './escape'
import type { DocumentSettings, HeadingItem, PagedDocument } from './types'

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  )
}

function uniqueSlug(base: string, seen: Map<string, number>) {
  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

function metadataLine(values: string[]) {
  return values.filter(Boolean).map(escapeHtml).join(' / ')
}

function buildToc(headings: HeadingItem[]) {
  if (!headings.length) {
    return '<p class="pm-empty-note">No headings found yet.</p>'
  }

  const items = headings
    .map(
      (heading) => `
        <li class="pm-toc-item pm-toc-level-${heading.level}">
          <a href="#${heading.id}">
            <span class="pm-toc-label">${escapeHtml(heading.text)}</span>
          </a>
        </li>`,
    )
    .join('')

  return `<ol class="pm-toc-list">${items}</ol>`
}

function buildCover(settings: DocumentSettings, title: string) {
  const subtitle = settings.subtitle.trim()
  const meta = metadataLine([settings.author.trim(), settings.date.trim()])

  return `
    <section class="pm-cover" aria-label="Cover">
      <div class="pm-cover-rule"></div>
      <p class="pm-cover-kicker">Pressmark private preview</p>
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="pm-cover-subtitle">${escapeHtml(subtitle)}</p>` : ''}
      ${meta ? `<p class="pm-cover-meta">${meta}</p>` : ''}
    </section>
  `
}

export function buildPagedDocument(markdownHtml: string, settings: DocumentSettings): PagedDocument {
  const parsed = new DOMParser().parseFromString(`<article>${markdownHtml}</article>`, 'text/html')
  const article = parsed.querySelector('article')
  if (!article) {
    throw new Error('Unable to prepare document preview.')
  }

  const seen = new Map<string, number>()
  const headings: HeadingItem[] = []

  article.querySelectorAll('h1, h2, h3').forEach((heading) => {
    const level = Number(heading.tagName.slice(1)) as 1 | 2 | 3
    const text = heading.textContent?.trim() || `Section ${headings.length + 1}`
    const existingId = heading.getAttribute('id')
    const id = existingId || uniqueSlug(slugify(text), seen)

    heading.id = id
    heading.classList.add('pm-heading', `pm-heading-${level}`)
    if (level === 1) heading.classList.add('pm-chapter-title')

    headings.push({ id, level, text })
  })

  const inferredTitle = headings.find((heading) => heading.level === 1)?.text
  const title = settings.title.trim() || inferredTitle || 'Untitled document'
  const css = buildTemplateCss(settings, title)
  const cover = settings.includeCover ? buildCover(settings, title) : ''
  const toc = settings.includeToc
    ? `
      <nav class="pm-toc" aria-label="Table of contents">
        <p class="pm-toc-kicker">Contents</p>
        <h2>Table of contents</h2>
        ${buildToc(headings)}
      </nav>
    `
    : ''

  const bodyHtml = `
    <section class="pm-document pm-template-${settings.templateId}">
      ${cover}
      ${toc}
      <main class="pm-body">
        ${article.innerHTML}
      </main>
    </section>
  `

  const standaloneHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>${css}</style>
  </head>
  <body>${bodyHtml}</body>
</html>`

  return { bodyHtml, css, standaloneHtml, headings, title }
}
