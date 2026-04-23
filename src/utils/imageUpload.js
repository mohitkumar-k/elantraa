function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`))
    reader.readAsDataURL(file)
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Failed to load selected image'))
    image.src = dataUrl
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to compress image'))
        return
      }
      resolve(blob)
    }, type, quality)
  })
}

export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export async function compressImageFile(
  file,
  { maxWidth = 1600, maxHeight = 2000, quality = 0.82 } = {},
) {
  if (!file.type.startsWith('image/')) {
    throw new Error(`${file.name} is not an image file`)
  }

  const dataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(dataUrl)
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1)
  const width = Math.max(1, Math.round(image.width * ratio))
  const height = Math.max(1, Math.round(image.height * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, width, height)

  const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const extension = outputType === 'image/png' ? 'png' : 'jpg'
  const blob = await canvasToBlob(canvas, outputType, quality)
  const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
    type: outputType,
    lastModified: Date.now(),
  })

  return {
    file: compressedFile,
    preview: canvas.toDataURL(outputType, quality),
    originalSize: file.size,
    compressedSize: compressedFile.size,
  }
}

export async function prepareCompressedImages(fileList, options) {
  return Promise.all(
    [...fileList].map(async (file) => {
      const compressed = await compressImageFile(file, options)
      return {
        id: `${file.name}-${file.lastModified}`,
        name: compressed.file.name,
        originalName: file.name,
        preview: compressed.preview,
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        file: compressed.file,
      }
    }),
  )
}
