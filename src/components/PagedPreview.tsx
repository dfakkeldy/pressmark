import { useEffect, useRef } from 'react'
import { FileWarning } from 'lucide-react'

type PreviewStatus = 'idle' | 'rendering' | 'ready' | 'error'

interface PagedPreviewProps {
  html: string
  css: string
  status: PreviewStatus
  error: string
  onStatusChange: (status: PreviewStatus, pages?: number, error?: string) => void
}

function clearPagedStyles() {
  document.querySelectorAll('style[data-pagedjs-inserted-styles]').forEach((style) => style.remove())
}

export function PagedPreview({ html, css, status, error, onStatusChange }: PagedPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function renderPreview() {
      if (!previewRef.current || !html.trim()) {
        onStatusChange('idle', 0)
        return
      }

      onStatusChange('rendering')
      previewRef.current.innerHTML = ''
      clearPagedStyles()

      try {
        const { Previewer } = await import('pagedjs')
        const previewer = new Previewer()
        const flow = await previewer.preview(
          html,
          [{ [`${window.location.href.split('#')[0]}pressmark-template.css`]: css }],
          previewRef.current,
        )
        if (!cancelled) {
          onStatusChange('ready', flow.total)
        }
      } catch (previewError) {
        if (!cancelled) {
          const message =
            previewError instanceof Error ? previewError.message : 'Paged.js could not render this document.'
          onStatusChange('error', 0, message)
        }
      }
    }

    const handle = window.setTimeout(renderPreview, 80)
    return () => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [css, html, onStatusChange])

  return (
    <section className="preview-panel" aria-label="Paginated preview">
      <div className="preview-toolbar">
        <div>
          <p className="eyebrow">Paged.js preview</p>
          <h2>Print sheet</h2>
        </div>
        <span className={`status-pill status-${status}`}>
          {status === 'ready' ? 'Ready' : status === 'rendering' ? 'Paginating' : status === 'error' ? 'Needs attention' : 'Idle'}
        </span>
      </div>

      {status === 'error' ? (
        <div className="preview-error" role="alert">
          <FileWarning aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="paged-host" ref={previewRef} />
    </section>
  )
}
