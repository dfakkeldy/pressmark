import type { BodyFontDefinition, BodyFontId } from './types'

export const BODY_FONTS: BodyFontDefinition[] = [
  {
    id: 'template',
    name: 'Template default',
    previewStack: 'var(--serif)',
  },
  {
    id: 'opendyslexic',
    name: 'OpenDyslexic',
    cssStack: '"OpenDyslexic", "Atkinson Hyperlegible", Arial, sans-serif',
    previewStack: '"OpenDyslexic", "Atkinson Hyperlegible", Arial, sans-serif',
    bodySize: '10.2pt',
    lineHeight: '1.68',
  },
  {
    id: 'lexend',
    name: 'Lexend',
    cssStack: '"Lexend", "Atkinson Hyperlegible", Arial, sans-serif',
    previewStack: '"Lexend", "Atkinson Hyperlegible", Arial, sans-serif',
    bodySize: '10.2pt',
    lineHeight: '1.58',
  },
  {
    id: 'helvetica',
    name: 'Helvetica',
    cssStack: 'Helvetica, Arial, system-ui, sans-serif',
    previewStack: 'Helvetica, Arial, system-ui, sans-serif',
    bodySize: '10pt',
    lineHeight: '1.54',
  },
  {
    id: 'atkinson',
    name: 'Atkinson Hyperlegible',
    cssStack: '"Atkinson Hyperlegible", Arial, sans-serif',
    previewStack: '"Atkinson Hyperlegible", Arial, sans-serif',
    bodySize: '10.1pt',
    lineHeight: '1.58',
  },
  {
    id: 'inter',
    name: 'Inter',
    cssStack: '"Inter Variable", Inter, system-ui, sans-serif',
    previewStack: '"Inter Variable", Inter, system-ui, sans-serif',
    bodySize: '10pt',
    lineHeight: '1.54',
  },
  {
    id: 'lato',
    name: 'Lato',
    cssStack: '"Lato", Arial, sans-serif',
    previewStack: '"Lato", Arial, sans-serif',
    bodySize: '10pt',
    lineHeight: '1.56',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    cssStack: '"Merriweather", Georgia, serif',
    previewStack: '"Merriweather", Georgia, serif',
    bodySize: '9.7pt',
    lineHeight: '1.64',
  },
  {
    id: 'source-serif',
    name: 'Source Serif 4',
    cssStack: '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif',
    previewStack: '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif',
    bodySize: '10.4pt',
    lineHeight: '1.58',
  },
]

export function fontById(fontId: BodyFontId) {
  return BODY_FONTS.find((font) => font.id === fontId) ?? BODY_FONTS[0]
}
