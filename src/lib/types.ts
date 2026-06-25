export type TemplateId = 'editorial' | 'technical' | 'modern' | 'academic'

export type PageSize = 'letter' | 'a4'

export type PageNumberStyle = 'page' | 'page-of-total'

export type BodyFontId =
  | 'template'
  | 'opendyslexic'
  | 'lexend'
  | 'helvetica'
  | 'atkinson'
  | 'inter'
  | 'lato'
  | 'merriweather'
  | 'source-serif'

export interface DocumentSettings {
  templateId: TemplateId
  bodyFontId: BodyFontId
  pageSize: PageSize
  marginMm: number
  includeCover: boolean
  includeToc: boolean
  includePageNumbers: boolean
  pageNumberStyle: PageNumberStyle
  startChaptersOnNewPage: boolean
  title: string
  subtitle: string
  author: string
  date: string
}

export interface HeadingItem {
  id: string
  level: 1 | 2 | 3
  text: string
}

export interface PagedDocument {
  bodyHtml: string
  css: string
  standaloneHtml: string
  headings: HeadingItem[]
  title: string
}

export interface TemplateDefinition {
  id: TemplateId
  name: string
  description: string
  accent: string
}

export interface BodyFontDefinition {
  id: BodyFontId
  name: string
  cssStack?: string
  previewStack: string
  bodySize?: string
  lineHeight?: string
}
