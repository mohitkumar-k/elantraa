export function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export function getDiscountPercent(mrp, salePrice) {
  if (!mrp || !salePrice || salePrice >= mrp) return 0
  return Math.round(((mrp - salePrice) / mrp) * 100)
}

export function getDeliveryEstimate(days = 7) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function slugify(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
