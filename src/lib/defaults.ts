import type { DocumentSettings, TemplateDefinition } from './types'

export const DEFAULT_SETTINGS: DocumentSettings = {
  templateId: 'editorial',
  bodyFontId: 'template',
  pageSize: 'letter',
  marginMm: 18,
  includeCover: true,
  includeToc: true,
  includePageNumbers: true,
  pageNumberStyle: 'page-of-total',
  startChaptersOnNewPage: true,
  title: 'The Quiet Machinery of Great Documents',
  subtitle: 'A paged-media sample for Markdown, math, code, tables, and notes',
  author: 'Pressmark',
  date: new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'editorial',
    name: 'Editorial Report',
    description: 'Serif-led, consultancy polish, balanced measure.',
    accent: '#a35638',
  },
  {
    id: 'technical',
    name: 'Technical Docs',
    description: 'Dense, crisp code, monospace navigation cues.',
    accent: '#256d85',
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Confident sans, generous air, sharp section rhythm.',
    accent: '#d94f45',
  },
  {
    id: 'academic',
    name: 'Academic Manuscript',
    description: 'Classic paper texture with numbered sections.',
    accent: '#394f68',
  },
]
