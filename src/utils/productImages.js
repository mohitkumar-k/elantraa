export function getProductCoverImage(product) {
  if (!product) return ''
  return product.coverImage || product.images?.[0] || ''
}

export function buildProductImageCollection(coverImage, galleryImages = []) {
  const seen = new Set()
  const ordered = []

  ;[coverImage, ...galleryImages].forEach((image) => {
    if (!image || seen.has(image)) return
    seen.add(image)
    ordered.push(image)
  })

  return ordered
}

export function getProductGalleryImages(product) {
  if (!product) return []

  const coverImage = getProductCoverImage(product)
  const images = Array.isArray(product.images) ? product.images : []
  const seen = new Set(coverImage ? [coverImage] : [])
  const gallery = []

  images.forEach((image) => {
    if (!image || seen.has(image)) return
    seen.add(image)
    gallery.push(image)
  })

  return gallery
}

export function getProductImageSet(product) {
  return buildProductImageCollection(getProductCoverImage(product), Array.isArray(product?.images) ? product.images : [])
}
