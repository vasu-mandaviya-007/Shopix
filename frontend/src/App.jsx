import { useContext } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

// Context APIs
import { CartProvider } from './context/CartContext'
import { AuthContext } from './context/AuthContext'

// Pages and Componensts
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'

// Protected Routes
import PublicRoute from './routes/PublicRoute'
import ProductListSkeleton from './components/skeleton/ProductListSkeleton'
import AddVariant from './Admin/AddVariant'
import AddProduct from './Admin/AddProduct'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Footer from './components/Footer'
import ShopPage from './pages/ShopPage'
import OrderConfirmation from './pages/OrderConfirmation'
import Profile from './pages/Profile'
import ProfileDashbord from './pages/ProfileDashbord'
import MyOrders from './pages/MyOrders'
import PrivateRoute from './routes/PrivateRoute'
import MyAddresses from './pages/MyAddresses'
import OrderDetails from './pages/OrderDetails'
import ScrollManager from './pages/ScrollManager'
import WishlistPage from './pages/WishlistPage'

function App() {

    return (
        
        <BrowserRouter>

            <ScrollManager />

            <CartProvider>

                <Navbar />

                <Routes>

                    <Route path="/" element={<Home />} />

                    <Route path='/login' element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />


                    <Route path='/profile' element={
                        <PrivateRoute>
                            <ProfileDashbord />
                        </PrivateRoute>
                    }>
                        <Route index element={<Profile />} />
                        <Route path='orders' element={<MyOrders />} />
                        <Route path='address' element={<MyAddresses />} />
                    </Route>

                    <Route path='order_details/:order_id' element={
                        <PrivateRoute>
                            <OrderDetails />
                        </PrivateRoute>
                    } />

                    <Route path='/product/:slug' element={<ProductDetails />} />

                    <Route path='/category-skeleton' element={<ProductListSkeleton />} />

                    <Route path='/products/:slug' element={<ShopPage />} />

                    <Route path='/products/' element={<ShopPage />} />

                    {/* <Route path='/cart2' element={<CartPage />} /> */}

                    <Route path='/cart' element={<CartPage />} />

                    <Route path="/wishlist" element={<WishlistPage />} />

                    <Route path='/checkout/address' element={<Checkout />} />

                    <Route path='/checkout/success' element={<CheckoutSuccess />} />

                    <Route path='/checkout/success2' element={<OrderConfirmation />} />

                    <Route path='/add-variant' element={<AddVariant />} />

                    <Route path='/add-product' element={<AddProduct />} />

                </Routes>

                <Footer />

            </CartProvider>


        </BrowserRouter>
    )

}

export default App
