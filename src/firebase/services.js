import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, isFirebaseConfigured, storage } from './config'
import { demoCategories, demoHomeContent, demoProducts } from '../data/demoData'

const memory = {
  products: [...demoProducts],
  categories: [...demoCategories],
  homeContent: { ...demoHomeContent },
  orders: [],
}

function getLocal(key, fallback) {
  if (typeof window === 'undefined') return fallback
  const raw = window.localStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

function setLocal(key, value) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

export async function getProducts() {
  if (!isFirebaseConfigured || !db) {
    const local = getLocal('elantraa_products', memory.products)
    return local
  }

  const snapshot = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function getProductById(productId) {
  if (!isFirebaseConfigured || !db) {
    const products = await getProducts()
    return products.find((item) => item.id === productId) || null
  }

  const snapshot = await getDoc(doc(db, 'products', productId))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export async function getCategories() {
  if (!isFirebaseConfigured || !db) {
    return getLocal('elantraa_categories', memory.categories)
  }

  const snapshot = await getDocs(collection(db, 'categories'))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function getHomeContent() {
  if (!isFirebaseConfigured || !db) {
    return getLocal('elantraa_home_content', memory.homeContent)
  }

  const snapshot = await getDoc(doc(db, 'siteContent', 'home'))
  return snapshot.exists() ? { ...demoHomeContent, ...snapshot.data() } : demoHomeContent
}

export async function saveOrder(order) {
  if (!isFirebaseConfigured || !db) {
    const orders = getLocal('elantraa_orders', [])
    const next = [
      { id: `order_${Date.now()}`, createdAt: new Date().toISOString(), ...order },
      ...orders,
    ]
    setLocal('elantraa_orders', next)
    return next[0]
  }

  const created = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
  })

  return { id: created.id, ...order }
}

export async function getOrders(userId) {
  if (!isFirebaseConfigured || !db) {
    return getLocal('elantraa_orders', []).filter((item) => !userId || item.userId === userId)
  }

  const snapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')))
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .filter((item) => !userId || item.userId === userId)
}

export async function upsertUserProfile(userId, data) {
  if (!isFirebaseConfigured || !db || !userId) return
  await setDoc(doc(db, 'users', userId), data, { merge: true })
}

export async function getUserProfile(userId) {
  if (!isFirebaseConfigured || !db || !userId) return null
  const snapshot = await getDoc(doc(db, 'users', userId))
  return snapshot.exists() ? snapshot.data() : null
}

export async function uploadProductImages(productId, files) {
  if (!isFirebaseConfigured || !storage || !files?.length) return []
  const uploads = await Promise.all(
    [...files].map(async (file) => {
      const imageRef = ref(storage, `products/${productId}/${Date.now()}-${file.name}`)
      await uploadBytes(imageRef, file)
      return getDownloadURL(imageRef)
    }),
  )
  return uploads
}

export async function uploadCategoryImage(categorySlug, file) {
  if (!isFirebaseConfigured || !storage || !file) return ''
  const imageRef = ref(storage, `categories/${categorySlug}/${Date.now()}-${file.name}`)
  try {
    await uploadBytes(imageRef, file)
    return getDownloadURL(imageRef)
  } catch (error) {
    if (error?.code === 'storage/unauthorized') {
      throw new Error('Category image upload is blocked by Firebase Storage rules. Deploy the updated storage rules and try again.')
    }
    throw error
  }
}

export async function uploadHeroImage(file) {
  if (!isFirebaseConfigured || !storage || !file) return ''
  const imageRef = ref(storage, `site-content/home/hero/${Date.now()}-${file.name}`)
  try {
    await uploadBytes(imageRef, file)
    return getDownloadURL(imageRef)
  } catch (error) {
    if (error?.code === 'storage/unauthorized') {
      throw new Error('Hero image upload is blocked by Firebase Storage rules. Deploy the updated storage rules and try again.')
    }
    throw error
  }
}

export async function saveProduct(product) {
  if (!isFirebaseConfigured || !db) {
    const products = getLocal('elantraa_products', memory.products)
    const exists = products.findIndex((item) => item.id === product.id)
    const next =
      exists >= 0
        ? products.map((item) => (item.id === product.id ? product : item))
        : [{ ...product, id: product.id || `product_${Date.now()}` }, ...products]
    setLocal('elantraa_products', next)
    return next[0]
  }

  const refDoc = product.id ? doc(db, 'products', product.id) : doc(collection(db, 'products'))
  await setDoc(refDoc, { ...product, createdAt: product.createdAt || serverTimestamp() }, { merge: true })
  return { ...product, id: refDoc.id }
}

export async function deleteProduct(productId) {
  if (!isFirebaseConfigured || !db) {
    const products = getLocal('elantraa_products', memory.products).filter((item) => item.id !== productId)
    setLocal('elantraa_products', products)
    return
  }
  await deleteDoc(doc(db, 'products', productId))
}

export async function saveCategory(category) {
  if (!isFirebaseConfigured || !db) {
    const categories = getLocal('elantraa_categories', memory.categories)
    const exists = categories.findIndex((item) => item.slug === category.slug)
    const next =
      exists >= 0
        ? categories.map((item) => (item.slug === category.slug ? category : item))
        : [category, ...categories]
    setLocal('elantraa_categories', next)
    return category
  }

  const refDoc = category.id ? doc(db, 'categories', category.id) : doc(collection(db, 'categories'))
  await setDoc(refDoc, category, { merge: true })
  return { ...category, id: refDoc.id }
}

export async function saveHomeContent(homeContent) {
  if (!isFirebaseConfigured || !db) {
    setLocal('elantraa_home_content', homeContent)
    return homeContent
  }

  await setDoc(doc(db, 'siteContent', 'home'), homeContent, { merge: true })
  return homeContent
}

export async function updateOrderStatus(orderId, status) {
  if (!isFirebaseConfigured || !db) {
    const orders = getLocal('elantraa_orders', []).map((item) =>
      item.id === orderId ? { ...item, status } : item,
    )
    setLocal('elantraa_orders', orders)
    return
  }
  await updateDoc(doc(db, 'orders', orderId), { status })
}
