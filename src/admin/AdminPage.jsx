import { useEffect, useMemo, useState } from 'react'
import { FiUploadCloud, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import Seo from '../components/Seo'
import { useCategoriesData, useHomeContentData, useOrdersData, useProducts } from '../hooks/useStoreData'
import {
  deleteProduct,
  saveCategory,
  saveHomeContent,
  saveProduct,
  updateOrderStatus,
  uploadCategoryImage,
  uploadHeroImage,
  uploadProductImages,
} from '../firebase/services'
import { formatPrice, slugify } from '../utils/format'
import { formatFileSize, prepareCompressedImages } from '../utils/imageUpload'
import {
  buildProductImageCollection,
  getProductCoverImage,
  getProductGalleryImages,
} from '../utils/productImages'

const emptyProduct = {
  id: '',
  name: '',
  category: '',
  mrp: 0,
  salePrice: 0,
  coverImage: '',
  images: [],
  sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
  fabric: '',
  color: '',
  description: '',
  stock: 0,
  isFeatured: false,
}

function AdminPage() {
  const { products, setProducts } = useProducts()
  const { categories, setCategories } = useCategoriesData()
  const { homeContent, setHomeContent } = useHomeContentData()
  const { orders, setOrders } = useOrdersData()
  const [tab, setTab] = useState('dashboard')
  const [productForm, setProductForm] = useState(emptyProduct)
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', image: '', description: '' })
  const [heroForm, setHeroForm] = useState({
    eyebrow: '',
    title: '',
    description: '',
    ctaLabel: '',
    ctaLink: '',
    image: '',
    imageAlt: '',
  })
  const [files, setFiles] = useState([])
  const [coverFile, setCoverFile] = useState(null)
  const [categoryImageFile, setCategoryImageFile] = useState(null)
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isCoverCompressing, setIsCoverCompressing] = useState(false)
  const [isCategoryImageCompressing, setIsCategoryImageCompressing] = useState(false)
  const [isHeroImageCompressing, setIsHeroImageCompressing] = useState(false)

  useEffect(() => {
    if (!homeContent?.hero) return
    const hero = homeContent.hero
    setHeroForm({
      eyebrow: hero.eyebrow || '',
      title: hero.title || '',
      description: hero.description || '',
      ctaLabel: hero.ctaLabel || '',
      ctaLink: hero.ctaLink || '',
      image: hero.image || '',
      imageAlt: hero.imageAlt || '',
    })
  }, [homeContent])

  useEffect(() => {
    if (!categories.length) return
    setProductForm((current) => {
      const hasValidCategory = categories.some((category) => category.slug === current.category)
      if (hasValidCategory) return current
      return { ...current, category: categories[0].slug }
    })
  }, [categories])

  const metrics = useMemo(
    () => ({
      revenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      totalOrders: orders.length,
      totalProducts: products.length,
    }),
    [orders, products],
  )

  async function handleProductSubmit(event) {
    event.preventDefault()
    const id = productForm.id || slugify(productForm.name)
    const uploadedCoverImage = coverFile
      ? await uploadProductImages(
          id,
          [coverFile.file],
        )
      : []
    const uploadedImages = files.length
      ? await uploadProductImages(
          id,
          files.map((item) => item.file),
        )
      : []
    const coverImage = uploadedCoverImage[0] || getProductCoverImage(productForm)
    const galleryImages = uploadedImages.length
      ? [...getProductGalleryImages(productForm), ...uploadedImages]
      : getProductGalleryImages(productForm)
    const allImages = buildProductImageCollection(coverImage, galleryImages)

    const payload = {
      ...productForm,
      id,
      mrp: Number(productForm.mrp),
      salePrice: Number(productForm.salePrice),
      stock: Number(productForm.stock),
      coverImage: coverImage || allImages[0] || '',
      images: allImages,
      createdAt: productForm.createdAt || new Date().toISOString(),
    }

    const saved = await saveProduct(payload)
    setProducts((current) => {
      const exists = current.some((item) => item.id === saved.id)
      return exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]
    })
    setProductForm({ ...emptyProduct, category: categories[0]?.slug || '' })
    setFiles([])
    setCoverFile(null)
    toast.success('Product saved')
  }

  async function handleCoverImageChange(event) {
    const selectedFiles = event.target.files
    if (!selectedFiles?.length) {
      setCoverFile(null)
      return
    }

    setIsCoverCompressing(true)

    try {
      const [prepared] = await prepareCompressedImages([selectedFiles[0]])
      setCoverFile(prepared)
      toast.success('Cover image ready for upload')
    } catch (error) {
      toast.error(error.message || 'Unable to prepare cover image')
    } finally {
      setIsCoverCompressing(false)
      event.target.value = ''
    }
  }

  async function handleFilesChange(event) {
    const selectedFiles = event.target.files
    if (!selectedFiles?.length) {
      setFiles([])
      return
    }

    setIsCompressing(true)

    try {
      const prepared = await prepareCompressedImages(selectedFiles)
      setFiles(prepared)
      toast.success(`${prepared.length} image${prepared.length > 1 ? 's' : ''} ready for upload`)
    } catch (error) {
      toast.error(error.message || 'Unable to prepare images')
    } finally {
      setIsCompressing(false)
      event.target.value = ''
    }
  }

  function removePreparedFile(fileId) {
    setFiles((current) => current.filter((item) => item.id !== fileId))
  }

  function removeCoverFile() {
    setCoverFile(null)
  }

  function removeExistingCoverImage() {
    setCoverFile(null)
    setProductForm((current) => {
      const galleryImages = getProductGalleryImages(current)
      return {
        ...current,
        coverImage: '',
        images: [...galleryImages],
      }
    })
  }

  function removeExistingGalleryImage(imageToRemove) {
    setProductForm((current) => {
      const coverImage = getProductCoverImage(current)
      const galleryImages = getProductGalleryImages(current).filter((image) => image !== imageToRemove)
      return {
        ...current,
        images: buildProductImageCollection(coverImage, galleryImages),
      }
    })
  }

  function startEditingProduct(product) {
    const coverImage = getProductCoverImage(product)
    const galleryImages = getProductGalleryImages(product)

    setProductForm({
      ...emptyProduct,
      ...product,
      category: product.category || categories[0]?.slug || '',
      coverImage,
      images: buildProductImageCollection(coverImage, galleryImages),
    })
    setCoverFile(null)
    setFiles([])
  }

  async function handleCategoryImageChange(event) {
    const selectedFiles = event.target.files
    if (!selectedFiles?.length) {
      setCategoryImageFile(null)
      return
    }

    setIsCategoryImageCompressing(true)

    try {
      const [prepared] = await prepareCompressedImages([selectedFiles[0]])
      setCategoryImageFile(prepared)
      toast.success('Category image ready for upload')
    } catch (error) {
      toast.error(error.message || 'Unable to prepare category image')
    } finally {
      setIsCategoryImageCompressing(false)
      event.target.value = ''
    }
  }

  function removeCategoryImage() {
    setCategoryImageFile(null)
  }

  async function handleHeroImageChange(event) {
    const selectedFiles = event.target.files
    if (!selectedFiles?.length) {
      setHeroImageFile(null)
      return
    }

    setIsHeroImageCompressing(true)

    try {
      const [prepared] = await prepareCompressedImages([selectedFiles[0]])
      setHeroImageFile(prepared)
      toast.success('Hero image ready for upload')
    } catch (error) {
      toast.error(error.message || 'Unable to prepare hero image')
    } finally {
      setIsHeroImageCompressing(false)
      event.target.value = ''
    }
  }

  function removeHeroImage() {
    setHeroImageFile(null)
  }

  async function handleDeleteProduct(productId) {
    await deleteProduct(productId)
    setProducts((current) => current.filter((item) => item.id !== productId))
    toast.success('Product deleted')
  }

  async function handleCategorySubmit(event) {
    event.preventDefault()
    const slug = categoryForm.slug || slugify(categoryForm.name)
    const uploadedCategoryImage = categoryImageFile ? await uploadCategoryImage(slug, categoryImageFile.file) : ''
    const payload = {
      ...categoryForm,
      slug,
      image: uploadedCategoryImage || categoryImageFile?.preview || categoryForm.image,
    }
    const saved = await saveCategory(payload)
    setCategories((current) => {
      const exists = current.some((item) => item.slug === saved.slug)
      return exists ? current.map((item) => (item.slug === saved.slug ? saved : item)) : [saved, ...current]
    })
    setCategoryForm({ name: '', slug: '', image: '', description: '' })
    setCategoryImageFile(null)
    toast.success('Category saved')
  }

  async function handleStatus(orderId, status) {
    await updateOrderStatus(orderId, status)
    setOrders((current) => current.map((item) => (item.id === orderId ? { ...item, status } : item)))
    toast.success('Order status updated')
  }

  async function handleHeroSubmit(event) {
    event.preventDefault()
    const uploadedHeroImage = heroImageFile ? await uploadHeroImage(heroImageFile.file) : ''
    const payload = {
      hero: {
        ...heroForm,
        image: uploadedHeroImage || heroImageFile?.preview || heroForm.image,
      },
    }
    const saved = await saveHomeContent(payload)
    setHomeContent(saved)
    setHeroImageFile(null)
    toast.success('Hero section saved')
  }

  return (
    <>
      <Seo title="Admin" />
      <section className="container-shell page-section">
        <div className="mb-8 flex flex-wrap gap-3">
          {['dashboard', 'products', 'orders', 'categories', 'hero'].map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] ${
                tab === item ? 'bg-brand text-white' : 'bg-white text-[#C9A227]'
              }`}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="glass-card p-6">
              <p className="text-sm text-[#C9A227]">Total Orders</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#A8841F]">{metrics.totalOrders}</h2>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-[#C9A227]">Revenue</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#A8841F]">{formatPrice(metrics.revenue)}</h2>
            </div>
            <div className="glass-card p-6">
              <p className="text-sm text-[#C9A227]">Products</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#A8841F]">{metrics.totalProducts}</h2>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <form onSubmit={handleProductSubmit} className="glass-card space-y-4 p-6">
              <h2 className="heading-display text-3xl text-[#A8841F]">Product CRUD</h2>
              <input
                type="text"
                placeholder="Product name"
                value={productForm.name}
                onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <select
                value={productForm.category}
                onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  placeholder="MRP"
                  value={productForm.mrp}
                  onChange={(event) => setProductForm((current) => ({ ...current, mrp: event.target.value }))}
                  className="rounded-[18px] border border-[#E0B84A] px-4 py-3"
                />
                <input
                  type="number"
                  placeholder="Sale price"
                  value={productForm.salePrice}
                  onChange={(event) => setProductForm((current) => ({ ...current, salePrice: event.target.value }))}
                  className="rounded-[18px] border border-[#E0B84A] px-4 py-3"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Fabric"
                  value={productForm.fabric}
                  onChange={(event) => setProductForm((current) => ({ ...current, fabric: event.target.value }))}
                  className="rounded-[18px] border border-[#E0B84A] px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="Color"
                  value={productForm.color}
                  onChange={(event) => setProductForm((current) => ({ ...current, color: event.target.value }))}
                  className="rounded-[18px] border border-[#E0B84A] px-4 py-3"
                />
              </div>
              <textarea
                placeholder="Description"
                value={productForm.description}
                onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="number"
                placeholder="Stock"
                value={productForm.stock}
                onChange={(event) => setProductForm((current) => ({ ...current, stock: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="text"
                placeholder="Cover image URL (optional)"
                value={productForm.coverImage}
                onChange={(event) => setProductForm((current) => ({ ...current, coverImage: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <div className="rounded-[22px] border border-dashed border-[#E0B84A] bg-white p-4">
                <div className="flex items-center gap-3 text-sm text-[#C9A227]">
                  <FiUploadCloud className="text-lg text-brand" />
                  <p>Upload one cover image. This image will be used first across the website.</p>
                </div>
                {isCoverCompressing && (
                  <p className="mt-3 text-sm font-medium text-brand">Compressing cover image...</p>
                )}
                {(coverFile || getProductCoverImage(productForm)) && (
                  <div className="mt-4 rounded-[18px] border border-[#E0B84A] bg-white p-3">
                    <div className="relative overflow-hidden rounded-[14px]">
                      <img
                        src={coverFile?.preview || getProductCoverImage(productForm)}
                        alt={coverFile?.name || productForm.name || 'Cover image'}
                        className="h-40 w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm"
                        onClick={coverFile ? removeCoverFile : removeExistingCoverImage}
                        aria-label="Remove cover image"
                      >
                        <FiX />
                      </button>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="truncate font-medium text-[#A8841F]">
                        {coverFile?.originalName || 'Current cover image'}
                      </p>
                      {coverFile && (
                        <p className="mt-1 text-[#C9A227]">
                          {formatFileSize(coverFile.originalSize)} to {formatFileSize(coverFile.compressedSize)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFilesChange}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <div className="rounded-[22px] border border-dashed border-[#E0B84A] bg-white p-4">
                <div className="flex items-center gap-3 text-sm text-[#C9A227]">
                  <FiUploadCloud className="text-lg text-brand" />
                  <p>Upload additional gallery images. Selected files are compressed before Firebase upload.</p>
                </div>
                {isCompressing && (
                  <p className="mt-3 text-sm font-medium text-brand">Compressing selected images...</p>
                )}
                {!files.length && getProductGalleryImages(productForm).length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {getProductGalleryImages(productForm).map((image, index) => (
                      <div key={`${image}-${index}`} className="rounded-[18px] border border-[#E0B84A] bg-white p-3">
                        <div className="relative overflow-hidden rounded-[14px]">
                          <img src={image} alt={`Gallery ${index + 1}`} className="h-32 w-full object-cover" />
                          <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm"
                            onClick={() => removeExistingGalleryImage(image)}
                            aria-label={`Remove gallery image ${index + 1}`}
                          >
                            <FiX />
                          </button>
                        </div>
                        <div className="mt-3 text-sm">
                          <p className="font-medium text-[#A8841F]">Current gallery image {index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {files.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {files.map((item) => (
                      <div key={item.id} className="rounded-[18px] border border-[#E0B84A] bg-white p-3">
                        <div className="relative overflow-hidden rounded-[14px]">
                          <img src={item.preview} alt={item.name} className="h-32 w-full object-cover" />
                          <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm"
                            onClick={() => removePreparedFile(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <FiX />
                          </button>
                        </div>
                        <div className="mt-3 text-sm">
                          <p className="truncate font-medium text-[#A8841F]">{item.originalName}</p>
                          <p className="mt-1 text-[#C9A227]">
                            {formatFileSize(item.originalSize)} to {formatFileSize(item.compressedSize)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label className="flex items-center gap-3 text-sm text-[#C9A227]">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(event) => setProductForm((current) => ({ ...current, isFeatured: event.target.checked }))}
                  className="accent-brand"
                />
                Featured product
              </label>
              <button type="submit" className="btn-primary w-full">
                SAVE PRODUCT
              </button>
            </form>

            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <img
                    src={getProductCoverImage(product)}
                    alt={product.name}
                    className="h-24 w-20 rounded-[18px] object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#A8841F]">{product.name}</p>
                    <p className="text-sm text-[#C9A227]">
                      {product.category} - {formatPrice(product.salePrice)}
                    </p>
                    <p className="mt-1 text-xs text-[#B08E39]">
                      Cover + {Math.max(buildProductImageCollection(getProductCoverImage(product), getProductGalleryImages(product)).length - 1, 0)} gallery image(s)
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" className="btn-secondary" onClick={() => startEditingProduct(product)}>
                      Edit
                    </button>
                    <button type="button" className="btn-primary" onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="glass-card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#A8841F]">{order.id}</p>
                    <p className="text-sm text-[#C9A227]">
                      {formatPrice(order.total)} - {order.items?.length || 0} items
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(event) => handleStatus(order.id, event.target.value)}
                    className="rounded-full border border-[#E0B84A] px-5 py-3 text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'categories' && (
          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <form onSubmit={handleCategorySubmit} className="glass-card space-y-4 p-6">
              <h2 className="heading-display text-3xl text-[#A8841F]">Categories</h2>
              <input
                type="text"
                placeholder="Category name"
                value={categoryForm.name}
                onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="text"
                placeholder="Slug"
                value={categoryForm.slug}
                onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="text"
                placeholder="Image URL or upload below"
                value={categoryForm.image}
                onChange={(event) => setCategoryForm((current) => ({ ...current, image: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleCategoryImageChange}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <div className="rounded-[22px] border border-dashed border-[#E0B84A] bg-white p-4">
                <div className="flex items-center gap-3 text-sm text-[#C9A227]">
                  <FiUploadCloud className="text-lg text-brand" />
                  <p>Upload a category image. Uploaded file will be used instead of the URL field.</p>
                </div>
                {isCategoryImageCompressing && (
                  <p className="mt-3 text-sm font-medium text-brand">Compressing category image...</p>
                )}
                {categoryImageFile && (
                  <div className="mt-4 rounded-[18px] border border-[#E0B84A] bg-white p-3">
                    <div className="relative overflow-hidden rounded-[14px]">
                      <img src={categoryImageFile.preview} alt={categoryImageFile.name} className="h-40 w-full object-cover" />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm"
                        onClick={removeCategoryImage}
                        aria-label={`Remove ${categoryImageFile.name}`}
                      >
                        <FiX />
                      </button>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="truncate font-medium text-[#A8841F]">{categoryImageFile.originalName}</p>
                      <p className="mt-1 text-[#C9A227]">
                        {formatFileSize(categoryImageFile.originalSize)} to {formatFileSize(categoryImageFile.compressedSize)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <textarea
                placeholder="Description"
                value={categoryForm.description}
                onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <button type="submit" className="btn-primary w-full">
                SAVE CATEGORY
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => (
                <div key={category.slug} className="glass-card overflow-hidden">
                  <img src={category.image} alt={category.name} className="h-44 w-full object-cover" />
                  <div className="p-5">
                    <p className="heading-display text-3xl text-[#A8841F]">{category.name}</p>
                    <p className="mt-2 text-sm text-[#C9A227]">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'hero' && (
          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <form onSubmit={handleHeroSubmit} className="glass-card space-y-4 p-6">
              <h2 className="heading-display text-3xl text-[#A8841F]">Hero Section</h2>
              <input
                type="text"
                placeholder="Eyebrow text"
                value={heroForm.eyebrow}
                onChange={(event) => setHeroForm((current) => ({ ...current, eyebrow: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="text"
                placeholder="Hero title"
                value={heroForm.title}
                onChange={(event) => setHeroForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <textarea
                placeholder="Hero description"
                value={heroForm.description}
                onChange={(event) => setHeroForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Button label"
                  value={heroForm.ctaLabel}
                  onChange={(event) => setHeroForm((current) => ({ ...current, ctaLabel: event.target.value }))}
                  className="rounded-[18px] border border-[#E0B84A] px-4 py-3"
                />
                <input
                  type="text"
                  placeholder="Button link"
                  value={heroForm.ctaLink}
                  onChange={(event) => setHeroForm((current) => ({ ...current, ctaLink: event.target.value }))}
                  className="rounded-[18px] border border-[#E0B84A] px-4 py-3"
                />
              </div>
              <input
                type="text"
                placeholder="Hero image URL or upload below"
                value={heroForm.image}
                onChange={(event) => setHeroForm((current) => ({ ...current, image: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="text"
                placeholder="Hero image alt text"
                value={heroForm.imageAlt}
                onChange={(event) => setHeroForm((current) => ({ ...current, imageAlt: event.target.value }))}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageChange}
                className="w-full rounded-[18px] border border-[#E0B84A] px-4 py-3"
              />
              <div className="rounded-[22px] border border-dashed border-[#E0B84A] bg-white p-4">
                <div className="flex items-center gap-3 text-sm text-[#C9A227]">
                  <FiUploadCloud className="text-lg text-brand" />
                  <p>Upload a hero image. Uploaded file will be used instead of the URL field.</p>
                </div>
                {isHeroImageCompressing && (
                  <p className="mt-3 text-sm font-medium text-brand">Compressing hero image...</p>
                )}
                {heroImageFile && (
                  <div className="mt-4 rounded-[18px] border border-[#E0B84A] bg-white p-3">
                    <div className="relative overflow-hidden rounded-[14px]">
                      <img src={heroImageFile.preview} alt={heroImageFile.name} className="h-40 w-full object-cover" />
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-white p-2 shadow-sm"
                        onClick={removeHeroImage}
                        aria-label={`Remove ${heroImageFile.name}`}
                      >
                        <FiX />
                      </button>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="truncate font-medium text-[#A8841F]">{heroImageFile.originalName}</p>
                      <p className="mt-1 text-[#C9A227]">
                        {formatFileSize(heroImageFile.originalSize)} to {formatFileSize(heroImageFile.compressedSize)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <button type="submit" className="btn-primary w-full">
                SAVE HERO
              </button>
            </form>

            <div className="glass-card overflow-hidden">
              <div className="grid bg-white lg:grid-cols-[1.05fr_0.95fr]">
                <div className="flex flex-col justify-center p-8 sm:p-12">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand">{heroForm.eyebrow}</p>
                  <h3 className="heading-display max-w-xl text-4xl leading-none text-[#A8841F] sm:text-5xl">
                    {heroForm.title}
                  </h3>
                  <p className="mt-6 max-w-lg text-sm leading-7 text-[#C9A227] sm:text-base">{heroForm.description}</p>
                  <div className="mt-8">
                    <span className="btn-primary inline-flex gap-2">{heroForm.ctaLabel || 'Button'}</span>
                  </div>
                </div>
                <div className="relative min-h-[320px] bg-white">
                  <img
                    src={heroImageFile?.preview || heroForm.image}
                    alt={heroForm.imageAlt || heroForm.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminPage

