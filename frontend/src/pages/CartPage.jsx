

import { ImSpinner3 } from "react-icons/im";
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowDown, FaArrowLeft, FaCcAmex, FaCcMastercard, FaCcVisa, FaGooglePay, FaHeadset, FaMinus, FaPaypal, FaPlus, FaShieldAlt, FaShoppingBag, FaShoppingCart, FaTag, FaTrash, FaTruck, FaUndo } from 'react-icons/fa';
import { FaAngleRight, FaImage, FaXmark } from 'react-icons/fa6';
import { RiDiscountPercentLine } from "react-icons/ri";
import { formatPriceINR } from "../utils/formatPriceINR.js";
import ConfirmDialog from '../components/UI/ConfirmDialog.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
import { ArrowBigRightDash } from 'lucide-react';

const CartPage = () => {

    const {
        cart, setCart,
        loadingAction, setLoadingAction,
        loading, setLoading,
        applyCoupon, removeCoupon,
        increaseQuantity, decreaseQuantity,
        removeFromCart, clearCart,
        couponCode, setCouponCode
    } = useContext(CartContext);

    const isAnyActionRunning = loadingAction !== null;
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate("/login", {
                state: { from: "/checkout/address" }
            });
        } else {
            navigate("/checkout/address");
        }
    };

    // Safely wrapped inside useEffect to prevent memory leaks in React
    useEffect(() => {
        const inputs = document.querySelectorAll(".qty-input");
        const handleInput = function () {
            const maxStock = parseInt(this.max);
            let value = parseInt(this.value);
            if (value < 1 || isNaN(value)) this.value = 1;
            if (value > maxStock) this.value = maxStock;
        };
        const handleChange = function () {
            const url = this.dataset.url;
            const qty = this.value;
            window.location.href = url + "?qty=" + qty;
        };

        inputs.forEach(input => {
            input.addEventListener("input", handleInput);
            input.addEventListener("change", handleChange);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener("input", handleInput);
                input.removeEventListener("change", handleChange);
            });
        };
    }, []);

    return (
        <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10 max-w-7xl">

            {/* Breadcrumb */}
            <nav className="hidden md:flex items-center space-x-2 text-xs md:text-sm text-gray-600 mb-5 md:mb-8">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <FaAngleRight className='text-mobile-1 md:text-xs' />
                <span className="text-gray-400 font-medium">Shopping Cart</span>
            </nav>

            {/* Cart Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">
                    Shopping Cart
                </h1>
                <div className="flex items-center space-x-2 text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full text-mobile-2 md:text-sm font-semibold">
                    <FaShoppingCart />
                    <span>
                        {cart?.cart_items?.length || 0} {cart?.cart_items?.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>
            </div>

            {
                loading ? (
                    <div className="flex justify-center py-20">
                        <Loading size={40} />
                    </div>
                ) : cart?.cart_items?.length > 0 ? (

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-6 xl:gap-8 items-start">

                        {/* Cart Items Section */}
                        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 shadow-sm border border-gray-100 rounded-lg bg-white overflow-hidden">

                            <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                                    Cart Items
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {[...cart?.cart_items].reverse().map((item, key) => (

                                    // 🌟 Responsive Item Row: Flex-col on mobile, Flex-row on md screens
                                    <div key={key} className="p-4 md:p-6 flex flex-col  justify-between gap-4 md:gap-6 hover:bg-gray-50/50 transition-colors" id={`cart-item-${item?.id || key}`}>

                                        {/* Left Side: Image + Details */}
                                        <div className='flex gap-4 md:gap-5 w-full sm:w-auto flex-1'>

                                            {/* Product Image */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 shrink-0 bg-white border border-gray-200 rounded-lg flex justify-center items-center overflow-hidden relative p-1.5">
                                                {item?.product?.image ? (
                                                    // <img src={item?.product?.image} alt={item?.product?.product_name || "Product"} className="max-w-full max-h-full object-contain" />
                                                    <img src={item?.product?.image} alt="{{ item.name }}" className="max-w-full! max-h-full! absolute m-auto top-0 right-0 left-0 bottom-0" />
                                                ) : (
                                                    <FaImage className='text-gray-300 text-3xl' />
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex flex-col items-start justify-center flex-1">
                                                <Link to={`/product/${item?.product?.product_slug}?variant=${item?.product?.uid}`} className="text-sm md:text-base font-semibold text-gray-800 hover:text-blue-600 line-clamp-1 leading-snug">
                                                    {item.product?.product_name}
                                                    {" "}
                                                    (
                                                    {
                                                        item.product?.attribute_values?.map(attribute => (
                                                            attribute.value
                                                        )).join(" / ")
                                                    }
                                                    )
                                                </Link>

                                                <p className="text-mobile-2 md:text-xs font-semibold text-gray-400 mt-1 md:mt-1.5 uppercase tracking-wider">
                                                    Stock: <span className={item?.product?.stock_qty > 5 ? "text-green-600" : "text-orange-500"}>{item?.product?.stock_qty}</span>
                                                </p>

                                                {/* Attributes */}
                                                <div className='mt-1 md:mt-1.5 flex flex-wrap line-clamp-1 md:flex-wrap items-center gap-1.5 text-mobile-2 md:text-xs text-gray-500 font-medium'>
                                                    {item?.product?.attribute_values?.slice(0, 3)?.map((attribute, index) => (
                                                        <span key={index} className='bg-gray-100 px-2 py-0.5 rounded-sm text-nowrap capitalize border border-gray-200'>
                                                            {attribute?.attribute_name}: {attribute?.value}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* <div className='mt-1 md:mt-2 line-clamp-1  text-fluid-sm md:text-xs text-gray-500 font-medium'>
                                                    {

                                                        item.product?.attribute_values?.slice(0, 3)?.map(attribute => (
                                                            attribute.value
                                                        )).join(" / ")

                                                    }
                                                </div> */}


                                                {/* Price for Mobile (Hidden on Desktop) */}
                                                <div className="flex items-end gap-2 mt-2.5">
                                                    <span className="text-base font-bold text-gray-900">{formatPriceINR(item?.sub_total)}</span>
                                                    {item?.product?.mrp > 0 && <span className="text-xs text-gray-400 line-through mb-0.5">{formatPriceINR(item?.product?.mrp * item?.quantity)}</span>}
                                                    {
                                                        item?.product?.discount_percent > 0 &&
                                                        <div className="md:text-sm flex items-center gap-1 text-[13px] text-nowrap font-semibold text-green-600">
                                                            <FaArrowDown />
                                                            {item?.product?.discount_percent}% Off
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Quantity + Price + Actions */}
                                        {/* <div className='flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-2 sm:mt-0 gap-3 md:gap-4'> */}



                                        {/* Quantity & Remove Buttons */}
                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">

                                            {/* Custom Qty Control */}
                                            {/* <div className='flex items-center border border-gray-300 rounded-full bg-white shadow-sm'>
                                                    <button onClick={() => decreaseQuantity(item.product?.uid)} disabled={isAnyActionRunning} className='p-2 md:p-2.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-l-full transition-colors disabled:opacity-50'>
                                                        <FaMinus className='text-mobile-1 md:text-xs' />
                                                    </button>
                                                    <span className='w-8 md:w-10 text-center text-xs md:text-sm font-semibold text-gray-800'>{item.quantity}</span>
                                                    <button onClick={() => increaseQuantity(item.product?.uid)} disabled={isAnyActionRunning} className='p-2 md:p-2.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-r-full transition-colors disabled:opacity-50'>
                                                        <FaPlus className='text-mobile-1 md:text-xs' />
                                                    </button>
                                                </div> */}

                                            <div className='flex items-center'>

                                                <button onClick={() => decreaseQuantity(item.product?.uid)} className='border border-gray-300 cursor-pointer rounded-full p-2 text-black/70'>
                                                    <FaMinus className='md:text-mobile-1 text-7px' />
                                                </button>

                                                <p className='lg:w-12 w-8  border border-gray-300 lg:text-sm text-xs rounded-xs py-1 outline-none text-center mx-2'>{item.quantity}</p>

                                                <button onClick={() => increaseQuantity(item.product?.uid)} className='border border-gray-300 cursor-pointer rounded-full p-2 text-black/70'>
                                                    <FaPlus className='md:text-mobile-1 text-7px' />
                                                </button>

                                            </div>

                                            <Button
                                                onClick={() => removeFromCart(item.product?.uid)}
                                                variant='outlined'
                                                color='error'
                                                size="small"
                                                disabled={isAnyActionRunning}
                                                loading={loadingAction === `remove_${item.product?.uid}`}
                                                loadingIndicator={<ImSpinner3 size={15} className="animate-spin" />}
                                                className='min-w-0 px-2! py-1.5! md:px-3! md:py-1.5! rounded-md! capitalize! hover:bg-red-50!'
                                            >
                                                <FaTrash className='md:mr-1.5 text-xs' /> <span className="hidden md:block text-xs font-bold">Remove</span>
                                            </Button>

                                        </div>
                                    </div>
                                    // </div>
                                ))}
                            </div>

                            {/* Cart Footer Actions */}
                            <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center">
                                <Button onClick={() => navigate("/")} variant='text' startIcon={<FaArrowLeft className='text-sm!' />} className='capitalize! text-gray-600! font-semibold! w-full sm:w-auto hover:bg-white!'>
                                    Continue Shopping
                                </Button>

                                <Button
                                    onClick={clearCart}
                                    variant='outlined'
                                    color='error'
                                    disabled={isAnyActionRunning}
                                    loading={loadingAction === "clear_cart"}
                                    loadingIndicator={<ImSpinner3 size={17} className="animate-spin" />}
                                    startIcon={<FaTrash className='text-sm!' />}
                                    className='capitalize! w-full sm:w-auto bg-white!'
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="sticky top-24 lg:col-span-1 flex flex-col gap-6">

                            {/* Coupon Code Block */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 md:p-6">
                                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaTag className="text-blue-500" /> Apply Discount
                                </h3>

                                <form onSubmit={applyCoupon}>
                                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                                        <TextField
                                            label="Coupon Code"
                                            size="small"
                                            fullWidth
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={cart?.coupon}
                                        />
                                        <Button
                                            type='submit'
                                            variant='contained'
                                            startIcon={<RiDiscountPercentLine />}
                                            disabled={isAnyActionRunning || cart?.coupon || !couponCode}
                                            loading={loadingAction === "apply_coupon"}
                                            loadingIndicator={<ImSpinner3 size={18} className="animate-spin" />}
                                            className='shadow-none! sm:shrink-0 lg:w-full xl:w-auto'
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </form>

                                {cart?.coupon?.coupon_code && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-lg">
                                            <div className='flex items-center gap-2 font-bold text-sm'>
                                                <RiDiscountPercentLine size={18} />
                                                <span className="uppercase tracking-wide">{cart?.coupon?.coupon_code}</span>
                                            </div>
                                            <button onClick={() => setOpen(true)} className="p-1 hover:bg-green-100 rounded-full transition-colors text-red-500">
                                                <FaXmark size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <ConfirmDialog
                                open={open}
                                title="Remove Coupon"
                                message="Are you sure you want to remove this applied coupon?"
                                confirmText="Remove"
                                onConfirm={removeCoupon}
                                onCancel={() => setOpen(false)}
                            />

                            {/* Summary Block */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Order Summary
                                    </h2>
                                </div>

                                <div className="p-5 md:p-6 text-sm font-medium text-gray-600 space-y-3.5">

                                    <div className="flex justify-between items-center">
                                        <span>Subtotal ({cart?.cart_items?.length} items)</span>
                                        <span className="text-gray-900 font-bold">{formatPriceINR(cart.mrp_total)}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span>Shipping</span>
                                        <span className="text-gray-900 font-bold">
                                            {cart?.shipping_cost > 0 ? `+ ${formatPriceINR(cart?.shipping_cost)}` : <span className="text-green-600">FREE</span>}
                                        </span>
                                    </div>

                                    {cart?.discount_on_mrp > 0 && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span>Discount on MRP</span>
                                            <span className="font-bold">- {formatPriceINR(cart?.discount_on_mrp)}</span>
                                        </div>
                                    )}

                                    {cart?.coupon?.discount_percentage > 0 && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span>Coupon ({cart?.coupon?.discount_percentage}% OFF)</span>
                                            <span className="font-bold">- {formatPriceINR(cart?.discount_amount)}</span>
                                        </div>
                                    )}

                                    <hr className="border-gray-100 my-4" />

                                    <div className="flex justify-between items-center text-lg md:text-xl">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-extrabold text-blue-600">{formatPriceINR(cart?.total_price)}</span>
                                    </div>

                                    {/* Checkout Button */}
                                    <div className="pt-4">
                                        <Button onClick={handleCheckout} variant='contained' size="large" className='py-3.5! rounded-lg! shadow-md! font-bold! text-[15px]!' endIcon={<ArrowBigRightDash />} fullWidth>
                                            Proceed to Checkout
                                        </Button>
                                    </div>

                                    {/* Trust & Payment Info */}
                                    <div className="pt-6">
                                        <p className="text-xs text-center text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                                            Guaranteed Safe Checkout
                                        </p>
                                        <div className="flex justify-center items-center gap-3 text-2xl">
                                            <FaCcVisa className='text-[#1a1f71]' />
                                            <FaCcMastercard className='text-[#eb001b]' />
                                            <FaCcAmex className='text-[#2e77bc]' />
                                            <FaPaypal className='text-[#00457c]' />
                                            <FaGooglePay className='text-gray-600 text-3xl' />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6 mt-2 border-t border-gray-100">
                                        <div className="flex flex-col items-center text-center gap-1.5">
                                            <FaShieldAlt className="text-xl text-emerald-500" />
                                            <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">Secure Payment</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-1.5">
                                            <FaTruck className="text-xl text-blue-500" />
                                            <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">Free Shipping</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-1.5">
                                            <FaUndo className="text-xl text-purple-500" />
                                            <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">Easy Returns</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-1.5">
                                            <FaHeadset className="text-xl text-orange-500" />
                                            <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">24/7 Support</span>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="flex items-center justify-center py-10 md:py-15 px-4">
                        <div className="max-w-md md:max-w-lg  lg:max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaShoppingCart className="text-5xl text-gray-300" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                                Your cart is empty
                            </h2>
                            <p className="text-sm md:text-base text-gray-500 mb-8 font-medium">
                                Looks like you haven't added anything to your cart yet. Browse our categories and discover our best deals!
                            </p>
                            <Button onClick={() => navigate("/")} variant='contained' className='rounded-full! px-6! py-2.5!' startIcon={<FaShoppingBag />}>
                                Start Shopping
                            </Button>
                        </div>
                    </div>

                )}
        </div>
    );
};

export default CartPage;