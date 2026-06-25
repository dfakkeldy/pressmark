function isMarkdown(file: File) {
  return file.name.toLowerCase().endsWith('.md') || file.type === 'text/markdown'
}

function isImage(file: File) {
  return file.type.startsWith('image/')
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(String(reader.result)))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(file)
  })
}

function replaceImageReferences(markdown: string, images: Map<string, string>) {
  let next = markdown
  images.forEach((dataUrl, name) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const referencePattern = new RegExp(`\\((?:\\.\\/|images\\/|assets\\/)?${escapedName}\\)`, 'gi')
    next = next.replace(referencePattern, `(${dataUrl})`)
  })
  return next
}

export async function filesToMarkdown(files: FileList | File[]) {
  const list = Array.from(files)
  const markdownFile = list.find(isMarkdown)
  const imageFiles = list.filter(isImage)
  const imageEntries = await Promise.all(imageFiles.map(async (file) => [file.name, await readAsDataUrl(file)] as const))
  const images = new Map(imageEntries)

  if (markdownFile) {
    const text = await markdownFile.text()
    const replaced = replaceImageReferences(text, images)
    const appended = imageEntries
      .filter(([name]) => !text.includes(name))
      .map(([name, dataUrl]) => `\n\n![${name}](${dataUrl})`)
      .join('')
    return replaced + appended
  }

  if (imageEntries.length) {
    return imageEntries.map(([name, dataUrl]) => `![${name}](${dataUrl})`).join('\n\n')
  }

  return ''
}
