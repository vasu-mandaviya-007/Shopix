import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { getAccess } from "../auth";
import API_BASE_URL from '../config/config.js';

export const CartContext = createContext();


export const CartProvider = ({ children }) => {

    const { user, authLoading } = useContext(AuthContext)

    const [loadingAction, setLoadingAction] = useState(null);

    const [loading, setLoading] = useState(true)
    const [couponCode, setCouponCode] = useState("")
    const [cart, setCart] = useState([]);
    const [userToken, setUserToken] = useState(localStorage.getItem("userToken") || null);

    const getHeaders = () => {
        const token = getAccess();
        const cartId = localStorage.getItem('cart_id');

        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        else if (cartId) headers['X-Cart-ID'] = cartId; // Attach Guest Ticket

        return headers;
    };

    const fetchCart = async () => {

        setLoading(true)

        try {

            const res = await axios.get(`${API_BASE_URL}/api/cart/`, { headers: getHeaders() });

            setCart(res.data.cart);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (!authLoading) {

            fetchCart();

        }

    }, [user, authLoading])

    const mergeCart = async (authToken) => {
        const guestId = localStorage.getItem("cart_id");
        if (guestId) {
            try {
                const res = await axios.post(`${API_BASE_URL}/api/cart/merge-cart/`,
                    { cart_id: guestId },
                    { headers: { Authorization: `Bearer ${authToken}` } }
                )

                localStorage.removeItem("cart_id");
                setCart(res.data.cart);

            } catch (e) {
                console.error(e)
                fetchCart();
            }
        } else {
            fetchCart();
        }
    }

    // Add to cart Logic 
    const addToCart = async (selectedVariant) => {

        setLoadingAction(`add_${selectedVariant.uid}`)

        try {

            const res = await axios.post(`${API_BASE_URL}/api/cart/add-to-cart/`,
                { variant_id: selectedVariant.uid, },
                { headers: getHeaders() }
            )

            const token = getAccess()

            if (!token && res.data.cart.uid) {
                localStorage.setItem('cart_id', res.data.cart.uid)
                // fetchCart()
            }

            setCart(res.data.cart)
            toast.success("Added to Cart")

        } catch (err) {
            toast.error("Error In Add to Cart")
        } finally {
            setLoadingAction(null)
        }

    }

    // Remove from cart Logic 
    const removeFromCart = async (id) => {

        setLoadingAction(`remove_${id}`)

        try {


            const response = await axios.post(`${API_BASE_URL}/api/cart/remove-from-cart/`,
                {
                    variant_id: id
                },
                {
                    headers: getHeaders()
                }
            )

            console.log(response.data)
            setCart(response.data.cart)

        } catch (e) {

            toast.error("Failed To Remove")

        } finally {
            setLoadingAction(null)
        }

    }

    const increaseQuantity = async (id) => {
        // const item = cartItems.filter(item => item.variant_id == id)[0]


        const existing_item = cart?.cart_items?.filter(item => item?.product?.uid === id)[0];

        if (existing_item.quantity < 5) {


            if (user) {

                try {
                    const access = getAccess()

                    const response = await axios.post(`${API_BASE_URL}/api/cart/update-quantity/`,
                        {
                            variant_id: id,
                            action: "increase"
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${access}`
                            }
                        }
                    )

                    setCart(response.data.cart)

                } catch (e) {
                    toast.error(e.response.data.error || "Failed to Update")
                }


            } else {


                setCart(prevItems =>
                    prevItems.map(item =>
                        item.variant_id === id ? { ...item, quantity: item?.quantity + 1 } : item
                    )
                )

                const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
                const updatedCart = localCart.map(item =>
                    item.variant_id === id ? { ...item, quantity: item?.quantity + 1 } : item
                );
                localStorage.setItem('guestCart', JSON.stringify(updatedCart));

            }

        } else {

            toast.error("Only 5 unit(s) allowed in each order")

        }
    }

    const decreaseQuantity = async (id) => {

        const existing_item = cart?.cart_items?.filter(item => item.variant_id === id)[0];
        // console.log(existing_item.quantity);

        if (user) {

            try {
                const access = getAccess()

                const response = await axios.post(`${API_BASE_URL}/api/cart/update-quantity/`,
                    {
                        variant_id: id,
                        action: "decrease"
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${access}`
                        }
                    }
                )


                setCart(response.data.cart)
            } catch (e) {
                toast.error(e.response.data.error || "Failed to Update")
            }


        } else {


            if (existing_item.quantity > 1) {

                setCart(prevItems =>
                    prevItems.map(item =>
                        item.variant_id === id ? { ...item, quantity: item?.quantity - 1 } : item
                    )
                )

                const localCart = JSON.parse(localStorage.getItem('guestCart')) || [];
                const updatedCart = localCart.map(item =>
                    item.variant_id === id ? { ...item, quantity: item?.quantity - 1 } : item
                );
                localStorage.setItem('guestCart', JSON.stringify(updatedCart));
            } else {
                console.log("Quantity Cant be 0");
            }

        }

    }

    const clearCart = async () => {

        setLoadingAction("clear_cart");

        try {

            const res = await axios.get(`${API_BASE_URL}/api/cart/clear-cart/`, { headers: getHeaders() })

            const token = getAccess()

            if (!token && res.data.cart.uid) {
                localStorage.setItem('cart_id', res.data.cart.uid)
            }

            setCart(res.data.cart)

        } catch (e) {
            console.log(e)
            toast.error("Failed to Clear Cart")
        } finally {
            setLoadingAction(null);
        }

    }

    const applyCoupon = async (e) => {

        e.preventDefault()

        try {

            setLoadingAction("apply_coupon");

            const token = getAccess()

            const response = await axios.post(`${API_BASE_URL}/api/cart/apply-coupon/`, {
                cart_id: cart?.uid,
                coupon_code: couponCode
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                setCart(response.data.cart)
                setCouponCode("")
                toast.success("Coupon Applied.")
            } else {
                toast.error(response?.data?.error || "Failed to Apply Coupon")
            }

        } catch (e) {
            console.log(e);
            if (e.status === 401) {
                navigate("/login")
                toast.error("Please Login to Apply Coupon.")
            } else {
                toast.error("Failed to Apply Coupon")
            }
        } finally {
            setTimeout(() => {
                setLoadingAction(null);
            }, 500);
        }

    }

    const removeCoupon = async () => {


        try {

            setLoadingAction("remove_coupon");

            const token = getAccess()

            const response = await axios.post(`${API_BASE_URL}/api/cart/remove-coupon/`, {
                cart_id: cart?.uid
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setCart(response.data.cart)
            toast.success("Coupon Removed.")
        }
        catch (e) {
            toast.error("Failed to Remove")
        }
        finally {
            setOpen(false)
            setLoadingAction(null);
        }

    };

    const value = {
        cart, setCart,
        userToken, setUserToken,
        addToCart, removeFromCart,
        increaseQuantity, decreaseQuantity,
        clearCart,
        mergeCart,
        fetchCart,
        loading, setLoading,
        couponCode, setCouponCode,
        loadingAction, setLoadingAction,
        applyCoupon, removeCoupon
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )

}