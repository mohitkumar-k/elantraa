import { useContext } from 'react'
import { WishlistContext } from '../context/wishlist-context'

export function useWishlist() {
  return useContext(WishlistContext)
}
