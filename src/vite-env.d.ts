/// <reference types="vite/client" />

declare module '@fontsource-variable/*'
declare module '@fontsource/*/*.css'

declare module 'markdown-it-task-lists' {
  import type MarkdownIt from 'markdown-it'

  interface TaskListOptions {
    enabled?: boolean
    label?: boolean
    labelAfter?: boolean
  }

  const taskLists: (md: MarkdownIt, options?: TaskListOptions) => void
  export default taskLists
}

declare module 'pagedjs' {
  export class Previewer {
    preview(
      content?: string | Node,
      stylesheets?: Array<string | Record<string, string>>,
      renderTo?: Element,
    ): Promise<{ total: number; pages: unknown[]; performance: number }>
  }
}
