import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getUserProfile, upsertUserProfile } from '../firebase/services'
import { useAuth } from '../hooks/useAuth'
import { getProductCoverImage } from '../utils/productImages'
import { WishlistContext } from './wishlist-context'

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    async function loadWishlist() {
      if (!user) {
        setWishlist([])
        return
      }
      const profile = await getUserProfile(user.uid)
      setWishlist(profile?.wishlist || [])
    }

    loadWishlist()
  }, [user])

  const value = useMemo(
    () => ({
      wishlist,
      hasInWishlist(productId) {
        return wishlist.some((item) => item.id === productId)
      },
      async toggleWishlist(product) {
        if (!user) {
          toast.error('Please login to save wishlist')
          return
        }

        const exists = wishlist.some((item) => item.id === product.id)
        const next = exists
          ? wishlist.filter((item) => item.id !== product.id)
          : [
              ...wishlist,
              {
                id: product.id,
                name: product.name,
                salePrice: product.salePrice,
                mrp: product.mrp,
                image: getProductCoverImage(product),
              },
            ]

        setWishlist(next)
        await upsertUserProfile(user.uid, { wishlist: next })
        toast.success(exists ? 'Removed from wishlist' : 'Added to wishlist')
      },
    }),
    [user, wishlist],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
