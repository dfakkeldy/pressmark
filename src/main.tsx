import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/source-serif-4'
import '@fontsource-variable/space-grotesk'
import '@fontsource/atkinson-hyperlegible/latin-400.css'
import '@fontsource/atkinson-hyperlegible/latin-400-italic.css'
import '@fontsource/atkinson-hyperlegible/latin-700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import '@fontsource/lato/latin-400.css'
import '@fontsource/lato/latin-400-italic.css'
import '@fontsource/lato/latin-700.css'
import '@fontsource/libre-baskerville/400.css'
import '@fontsource/libre-baskerville/700.css'
import '@fontsource/lexend/latin-400.css'
import '@fontsource/lexend/latin-600.css'
import '@fontsource/lexend/latin-700.css'
import '@fontsource/merriweather/latin-400.css'
import '@fontsource/merriweather/latin-400-italic.css'
import '@fontsource/merriweather/latin-700.css'
import '@fontsource/opendyslexic/latin-400.css'
import '@fontsource/opendyslexic/latin-400-italic.css'
import '@fontsource/opendyslexic/latin-700.css'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker } from './lib/serviceWorker'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

registerServiceWorker()
