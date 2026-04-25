import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { CartContext } from './cart-context'
import { getProductCoverImage } from '../utils/productImages'
const STORAGE_KEY = 'elantraa_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items])

  const value = useMemo(() => {
    const mrpTotal = items.reduce((sum, item) => sum + item.mrp * item.quantity, 0)
    const total = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0)

    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      mrpTotal,
      total,
      discount: mrpTotal - total,
      addToCart(product, size = 'Free Size', quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id && item.size === size)
          if (existing) {
            return current.map((item) =>
              item.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          }
          return [
            ...current,
            {
              id: product.id,
              name: product.name,
              image: getProductCoverImage(product),
              mrp: product.mrp,
              salePrice: product.salePrice,
              size,
              quantity,
            },
          ]
        })
        toast.success(`${product.name} added to cart`)
      },
      removeFromCart(id, size) {
        setItems((current) => current.filter((item) => !(item.id === id && item.size === size)))
        toast.success('Removed from cart')
      },
      updateQuantity(id, size, quantity) {
        if (quantity <= 0) return
        setItems((current) =>
          current.map((item) => (item.id === id && item.size === size ? { ...item, quantity } : item)),
        )
      },
      clearCart() {
        setItems([])
      },
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
