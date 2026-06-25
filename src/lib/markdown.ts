import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'
import footnote from 'markdown-it-footnote'
import taskLists from 'markdown-it-task-lists'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import bash from '@shikijs/langs/bash'
import css from '@shikijs/langs/css'
import html from '@shikijs/langs/html'
import javascript from '@shikijs/langs/javascript'
import json from '@shikijs/langs/json'
import markdownLang from '@shikijs/langs/markdown'
import python from '@shikijs/langs/python'
import swift from '@shikijs/langs/swift'
import tsx from '@shikijs/langs/tsx'
import typescript from '@shikijs/langs/typescript'
import yaml from '@shikijs/langs/yaml'
import githubLight from '@shikijs/themes/github-light'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import { escapeHtml } from './escape'
import { markdownItKatex } from './mathPlugin'

type SupportedLanguage =
  | 'bash'
  | 'css'
  | 'html'
  | 'javascript'
  | 'json'
  | 'markdown'
  | 'python'
  | 'tsx'
  | 'typescript'
  | 'swift'
  | 'yaml'

const LANGUAGES: SupportedLanguage[] = [
  'bash',
  'css',
  'html',
  'javascript',
  'json',
  'markdown',
  'python',
  'tsx',
  'typescript',
  'swift',
  'yaml',
]

const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  cjs: 'javascript',
  js: 'javascript',
  jsx: 'javascript',
  md: 'markdown',
  py: 'python',
  sh: 'bash',
  shell: 'bash',
  ts: 'typescript',
  yml: 'yaml',
}

let highlighterPromise: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [githubLight],
    langs: [bash, css, html, javascript, json, markdownLang, python, swift, tsx, typescript, yaml],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighterPromise
}

function normalizeLanguage(input: string): SupportedLanguage | undefined {
  const language = input.trim().split(/\s+/)[0].toLowerCase()
  if (!language) return undefined
  if (LANGUAGE_ALIASES[language]) return LANGUAGE_ALIASES[language]
  if ((LANGUAGES as string[]).includes(language)) return language as SupportedLanguage
  return undefined
}

function createMarkdownIt(highlighter: HighlighterCore) {
  const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: false,
    highlight(code: string, languageHint: string): string {
      const language = normalizeLanguage(languageHint)
      if (!language) {
        return `<pre class="shiki pressmark-plain-code"><code>${escapeHtml(code)}</code></pre>`
      }

      return highlighter.codeToHtml(code, {
        lang: language,
        theme: 'github-light',
      })
    },
  })

  md.use(footnote)
  md.use(taskLists, { enabled: true, label: false })
  md.use(markdownItKatex)

  const defaultLinkOpen: RenderRule =
    md.renderer.rules.link_open ??
    ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const href = tokens[idx].attrGet('href') ?? ''
    if (!href.startsWith('#')) {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noreferrer')
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  return md
}

export async function renderMarkdown(markdown: string) {
  const highlighter = await getHighlighter()
  const html = createMarkdownIt(highlighter).render(markdown)

  return DOMPurify.sanitize(html, {
    ALLOW_DATA_ATTR: true,
    ADD_ATTR: ['target', 'rel', 'checked', 'style', 'aria-hidden'],
    ADD_TAGS: ['math'],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|data:image\/(?:png|gif|jpeg|jpg|webp|svg\+xml);|#|\/|\.\/|\.\.\/)/i,
  })
}
