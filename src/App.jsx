import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import AdminPage from './admin/AdminPage'
import AdminRoute from './components/AdminRoute'
import PrivateRoute from './components/PrivateRoute'
import AuthPage from './pages/AuthPage'
import CartPage from './pages/CartPage'
import CategoryPage from './pages/CategoryPage'
import CheckoutPage from './pages/CheckoutPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import OrdersPage from './pages/OrdersPage'
import ProductPage from './pages/ProductPage'
import ProfilePage from './pages/ProfilePage'
import WishlistPage from './pages/WishlistPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '18px',
            background: '#fffaf7',
            color: '#2d1420',
            border: '1px solid rgba(194, 24, 91, 0.14)',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
