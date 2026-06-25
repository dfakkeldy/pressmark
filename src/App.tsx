import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Check,
  Clipboard,
  Download,
  FileText,
  ImagePlus,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import sampleMarkdown from '../sample.md?raw'
import './App.css'
import { PagedPreview } from './components/PagedPreview'
import { DEFAULT_SETTINGS, TEMPLATES } from './lib/defaults'
import { buildPagedDocument } from './lib/document'
import { filesToMarkdown } from './lib/files'
import { BODY_FONTS, fontById } from './lib/fonts'
import { renderMarkdown } from './lib/markdown'
import type { BodyFontId, DocumentSettings, PagedDocument, PageNumberStyle, PageSize, TemplateId } from './lib/types'

type PreviewStatus = 'idle' | 'rendering' | 'ready' | 'error'

function updateSetting<K extends keyof DocumentSettings>(
  settings: DocumentSettings,
  key: K,
  value: DocumentSettings[K],
) {
  return { ...settings, [key]: value }
}

function templateById(templateId: TemplateId) {
  return TEMPLATES.find((template) => template.id === templateId) ?? TEMPLATES[0]
}

function App() {
  const [markdown, setMarkdown] = useState(sampleMarkdown)
  const [settings, setSettings] = useState<DocumentSettings>(DEFAULT_SETTINGS)
  const [document, setDocument] = useState<PagedDocument | null>(null)
  const [renderError, setRenderError] = useState('')
  const [previewStatus, setPreviewStatus] = useState<PreviewStatus>('idle')
  const [previewError, setPreviewError] = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  useEffect(() => {
    let cancelled = false
    const handle = window.setTimeout(async () => {
      try {
        const html = await renderMarkdown(markdown)
        if (!cancelled) {
          setDocument(buildPagedDocument(html, settings))
          setRenderError('')
        }
      } catch (error) {
        if (!cancelled) {
          setRenderError(error instanceof Error ? error.message : 'The Markdown could not be rendered.')
          setDocument(null)
        }
      }
    }, 180)

    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [markdown, settings])

  const selectedTemplate = useMemo(() => templateById(settings.templateId), [settings.templateId])
  const selectedFont = useMemo(() => fontById(settings.bodyFontId), [settings.bodyFontId])

  const setSetting = useCallback(
    <K extends keyof DocumentSettings>(key: K, value: DocumentSettings[K]) => {
      setSettings((current) => updateSetting(current, key, value))
    },
    [],
  )

  const handlePreviewStatus = useCallback((status: PreviewStatus, pages = 0, error = '') => {
    setPreviewStatus(status)
    setPageCount(pages)
    setPreviewError(error)
  }, [])

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const nextMarkdown = await filesToMarkdown(files)
    if (nextMarkdown) {
      setMarkdown((current) => (nextMarkdown.startsWith('![') ? `${current}\n\n${nextMarkdown}` : nextMarkdown))
    }
  }, [])

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)
      await handleFiles(event.dataTransfer.files)
    },
    [handleFiles],
  )

  const exportPdf = useCallback(() => {
    if (previewStatus === 'ready') {
      window.print()
    }
  }, [previewStatus])

  const copyHtml = useCallback(async () => {
    if (!document) return
    await navigator.clipboard.writeText(document.standaloneHtml)
    setCopyState('copied')
    window.setTimeout(() => setCopyState('idle'), 1600)
  }, [document])

  return (
    <main
      className={`app-shell ${isDragging ? 'is-dragging' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true">
            P
          </div>
          <div>
            <p className="eyebrow">Pressmark</p>
            <h1>Markdown to paged PDF</h1>
          </div>
        </div>
        <div className="privacy-note">
          <ShieldCheck aria-hidden="true" />
          <span>Your files never leave your browser.</span>
        </div>
      </header>

      <section className="control-strip" aria-label="Document settings">
        <div className="field-group title-fields">
          <label>
            <span>Title</span>
            <input value={settings.title} onChange={(event) => setSetting('title', event.target.value)} />
          </label>
          <label>
            <span>Subtitle</span>
            <input value={settings.subtitle} onChange={(event) => setSetting('subtitle', event.target.value)} />
          </label>
          <label>
            <span>Author</span>
            <input value={settings.author} onChange={(event) => setSetting('author', event.target.value)} />
          </label>
          <label>
            <span>Date</span>
            <input value={settings.date} onChange={(event) => setSetting('date', event.target.value)} />
          </label>
        </div>

        <div className="setting-grid">
          <label>
            <span>Page</span>
            <select value={settings.pageSize} onChange={(event) => setSetting('pageSize', event.target.value as PageSize)}>
              <option value="letter">US Letter</option>
              <option value="a4">A4</option>
            </select>
          </label>
          <label className="font-field">
            <span>Body font</span>
            <select
              value={settings.bodyFontId}
              onChange={(event) => setSetting('bodyFontId', event.target.value as BodyFontId)}
            >
              {BODY_FONTS.map((font) => (
                <option key={font.id} value={font.id}>{font.name}</option>
              ))}
            </select>
            <small
              className="font-preview"
              style={{ '--font-preview-family': selectedFont.previewStack } as React.CSSProperties}
            >
              Aa Markdown to PDF
            </small>
          </label>
          <label>
            <span>Margins</span>
            <input
              type="range"
              min="12"
              max="28"
              value={settings.marginMm}
              onChange={(event) => setSetting('marginMm', Number(event.target.value))}
            />
            <small>{settings.marginMm} mm</small>
          </label>
          <label>
            <span>Numbering</span>
            <select
              value={settings.pageNumberStyle}
              onChange={(event) => setSetting('pageNumberStyle', event.target.value as PageNumberStyle)}
            >
              <option value="page-of-total">Page X of Y</option>
              <option value="page">Page X</option>
            </select>
          </label>
        </div>

        <div className="toggle-grid">
          <label><input type="checkbox" checked={settings.includeCover} onChange={(event) => setSetting('includeCover', event.target.checked)} /> Cover</label>
          <label><input type="checkbox" checked={settings.includeToc} onChange={(event) => setSetting('includeToc', event.target.checked)} /> TOC</label>
          <label><input type="checkbox" checked={settings.includePageNumbers} onChange={(event) => setSetting('includePageNumbers', event.target.checked)} /> Page numbers</label>
          <label><input type="checkbox" checked={settings.startChaptersOnNewPage} onChange={(event) => setSetting('startChaptersOnNewPage', event.target.checked)} /> Chapter breaks</label>
        </div>
      </section>

      <section className="template-picker" aria-label="Template picker">
        {TEMPLATES.map((template) => (
          <button
            className={template.id === settings.templateId ? 'template-card is-selected' : 'template-card'}
            key={template.id}
            onClick={() => setSetting('templateId', template.id)}
            style={{ '--template-accent': template.accent } as React.CSSProperties}
            type="button"
          >
            <span className="template-swatch" aria-hidden="true" />
            <strong>{template.name}</strong>
            <span>{template.description}</span>
          </button>
        ))}
      </section>

      <section className="workspace">
        <section className="editor-panel" aria-label="Markdown input">
          <div className="panel-toolbar">
            <div>
              <p className="eyebrow">Markdown source</p>
              <h2>Input desk</h2>
            </div>
            <div className="toolbar-actions">
              <label className="icon-button" title="Import Markdown or images">
                <ImagePlus aria-hidden="true" />
                <input
                  multiple
                  type="file"
                  accept=".md,text/markdown,image/*"
                  onChange={(event) => event.target.files && handleFiles(event.target.files)}
                />
              </label>
              <button className="icon-button" onClick={() => setMarkdown(sampleMarkdown)} title="Reload sample" type="button">
                <RotateCcw aria-hidden="true" />
              </button>
            </div>
          </div>
          <textarea
            spellCheck="false"
            value={markdown}
            onChange={(event) => setMarkdown(event.target.value)}
            aria-label="Markdown"
          />
          {renderError ? <p className="inline-error">{renderError}</p> : null}
        </section>

        <div className="preview-stack">
          <div className="export-bar">
            <div>
              <p className="eyebrow">{selectedTemplate.name}</p>
              <strong>{pageCount ? `${pageCount} pages` : 'Waiting for pagination'}</strong>
            </div>
            <div className="export-actions">
              <button className="secondary-button" disabled={!document} onClick={copyHtml} type="button">
                {copyState === 'copied' ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                {copyState === 'copied' ? 'Copied' : 'Copy HTML'}
              </button>
              <button className="primary-button" disabled={previewStatus !== 'ready'} onClick={exportPdf} type="button">
                {previewStatus === 'rendering' ? <Loader2 className="spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
                Export PDF
              </button>
            </div>
          </div>
          {document ? (
            <PagedPreview
              css={document.css}
              error={previewError}
              html={document.bodyHtml}
              onStatusChange={handlePreviewStatus}
              status={previewStatus}
            />
          ) : (
            <div className="empty-preview">
              <BookOpen aria-hidden="true" />
              <p>Preview appears after the Markdown renders.</p>
            </div>
          )}
        </div>
      </section>

      {isDragging ? (
        <div className="drop-overlay">
          <FileText aria-hidden="true" />
          <span>Drop Markdown or local images</span>
        </div>
      ) : null}
    </main>
  )
}

export default App
