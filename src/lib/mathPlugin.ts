import katex from 'katex'
import type MarkdownIt from 'markdown-it'
import type StateBlock from 'markdown-it/lib/rules_block/state_block.mjs'
import type StateInline from 'markdown-it/lib/rules_inline/state_inline.mjs'

function renderMath(source: string, displayMode: boolean) {
  return katex.renderToString(source, {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
    output: 'html',
  })
}

function mathInline(state: StateInline, silent: boolean) {
  if (state.src.charCodeAt(state.pos) !== 0x24 || state.src.charCodeAt(state.pos + 1) === 0x24) {
    return false
  }

  let end = state.pos + 1
  while ((end = state.src.indexOf('$', end)) !== -1) {
    if (state.src.charCodeAt(end - 1) !== 0x5c) {
      break
    }
    end += 1
  }

  if (end === -1) return false
  const content = state.src.slice(state.pos + 1, end)
  if (!content.trim()) return false

  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.content = content
    token.markup = '$'
  }
  state.pos = end + 1
  return true
}

function mathBlock(state: StateBlock, startLine: number, endLine: number, silent: boolean) {
  const start = state.bMarks[startLine] + state.tShift[startLine]
  const max = state.eMarks[startLine]
  const firstLine = state.src.slice(start, max).trim()

  if (!firstLine.startsWith('$$')) return false
  if (silent) return true

  const body: string[] = []
  let nextLine = startLine
  const firstContent = firstLine.slice(2)

  if (firstContent.endsWith('$$') && firstContent.length > 2) {
    body.push(firstContent.slice(0, -2))
  } else {
    if (firstContent.trim()) body.push(firstContent)
    for (nextLine = startLine + 1; nextLine < endLine; nextLine += 1) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine]
      const lineEnd = state.eMarks[nextLine]
      const line = state.src.slice(lineStart, lineEnd)
      if (line.trim().endsWith('$$')) {
        body.push(line.replace(/\$\$\s*$/, ''))
        break
      }
      body.push(line)
    }
  }

  const token = state.push('math_block', 'math', 0)
  token.block = true
  token.content = body.join('\n').trim()
  token.map = [startLine, nextLine + 1]
  token.markup = '$$'
  state.line = nextLine + 1
  return true
}

export function markdownItKatex(md: MarkdownIt) {
  md.inline.ruler.after('escape', 'math_inline', mathInline)
  md.block.ruler.after('blockquote', 'math_block', mathBlock, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  md.renderer.rules.math_inline = (tokens, idx) => renderMath(tokens[idx].content, false)
  md.renderer.rules.math_block = (tokens, idx) => renderMath(tokens[idx].content, true)
}
