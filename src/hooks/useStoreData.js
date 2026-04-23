import { useEffect, useState } from 'react'
import { getCategories, getHomeContent, getOrders, getProductById, getProducts } from '../firebase/services'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, setProducts }
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductById(productId)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [productId])

  return { product, loading }
}

export function useCategoriesData() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  return { categories, loading, setCategories }
}

export function useHomeContentData() {
  const [homeContent, setHomeContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHomeContent()
      .then(setHomeContent)
      .finally(() => setLoading(false))
  }, [])

  return { homeContent, loading, setHomeContent }
}

export function useOrdersData(userId) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders(userId)
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [userId])

  return { orders, loading, setOrders }
}
