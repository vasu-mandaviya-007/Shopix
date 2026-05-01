import { ImSpinner3 } from "react-icons/im";
import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../context/CartContext.jsx';
import { Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FaApplePay, FaArrowLeft, FaCcAmex, FaCcMastercard, FaCcVisa, FaGooglePay, FaHeadset, FaMinus, FaPaypal, FaPlus, FaShieldAlt, FaShoppingBag, FaShoppingCart, FaTag, FaTrash, FaTruck, FaUndo } from 'react-icons/fa';
import { FaAngleRight, FaImage, FaXmark } from 'react-icons/fa6';
import { RiDiscountPercentLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { formatPriceINR } from "../utils/formatPriceINR.js"
import ConfirmDialog from '../components/UI/ConfirmDialog.jsx';
import axios from 'axios';
import { getAccess } from '../auth.js';
import { ArrowBigRightDash } from 'lucide-react';
import { PiSpinner } from 'react-icons/pi';
import API_BASE_URL from '../config/config.js';
import { AuthContext } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';

const CartPage2 = () => {

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


    const [open, setOpen] = useState(false)

    const navigate = useNavigate();


    const handleCheckout = () => {

        if (!user) {

            navigate("/login", {
                state: { from: "/checkout/address" }
            })

        } else {

            navigate("/checkout/address")

        }

    }


    document.querySelectorAll(".qty-input").forEach(input => {

        input.addEventListener("input", function () {
            const maxStock = parseInt(this.max);
            let value = parseInt(this.value);

            // If user types negative or zero → set 1
            if (value < 1 || isNaN(value)) {
                this.value = 1;
            }

            // If user types more than stock → set stock
            if (value > maxStock) {
                this.value = maxStock;
            }
        });

        // When user finishes typing, call Django URL
        input.addEventListener("change", function () {
            const url = this.dataset.url;
            const qty = this.value;

            window.location.href = url + "?qty=" + qty;
        });
    });


    return (

        <div className="container mx-auto px-4 py-6 lg:py-8">

            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-5 lg:mb-8">
                <Link to="/" className="hover:text-primary-600">Home</Link>
                <FaAngleRight className='text-xs' /> 
                <span className="text-gray-400">Shopping Cart</span>
            </nav>

            {/* Cart Header */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Shopping Cart
                </h1>
                <div className="flex items-center space-x-2 text-gray-600">
                    <i className="fas fa-shopping-cart"></i>
                    <span>
                        {/* {{ cart_count }} item{{ cart_count|pluralize}} */}
                        {cart?.cart_items?.length}
                    </span>
                </div>
            </div>

            {

                loading
                    ?
                    <Loading size={30} className='my-5' />
                    :
                    cart?.cart_items?.length > 0
                        ?
                        (

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Cart Items */}
                                <div className="lg:col-span-2 space-y-6">

                                    <div className="bg-white shadow-box rounded-lg overflow-hidden">

                                        <div className="lg:p-6 p-4 border-b border-gray-200">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                Cart Items
                                            </h2>
                                        </div>

                                        <div className="divide-y divide-gray-200">
                                            {
                                                [...cart?.cart_items].reverse().map((item, key) => (

                                                    <div key={key} className="p-4 md:p-6 flex flex-col md:items-start" id="cart-item-{{ item.id }}">

                                                        <div className='flex '>

                                                            {/* Product Image */}
                                                            <div className="md:w-auto flex justify-center items-center md:justify-start">
                                                                {/* <a href="{{ item.product.get_absolute_url }}" className="block"> */}
                                                                <div className='relative w-20 h-20 md:w-30 md:h-30  overflow-hidden'>

                                                                    {
                                                                        item?.product?.image
                                                                            ?
                                                                            <img src={item?.product?.image} alt="{{ item.name }}" className="max-w-full! max-h-full! absolute m-auto top-0 right-0 left-0 bottom-0" />
                                                                            :
                                                                            <div className="w-29 h-29 md:w-20 md:h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                                <FaImage className='text-gray-400' />
                                                                            </div>
                                                                    }
                                                                </div>
                                                                {/* </a> */}
                                                            </div>

                                                            {/* Product Details */}
                                                            <div className="flex flex-col items-start justify-baseline px-6 pb-3">

                                                                <h3 className="text-base font-semibold text-gray-800 mb-1">
                                                                    <Link to={`/product/${item?.product?.product_slug}?variant=${item?.product?.uid}`} className="hover:text-primary-600 text-xs md:text-base line-clamp-1">
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
                                                                </h3>

                                                                <p className="md:text-sm text-mobile-2 font-semibold text-gray-500 mb-1 md:mb-2">
                                                                    Stock : {item?.product?.stock_qty}
                                                                </p>

                                                                <div className='mt-1 md:mt-2 flex items-center text-fluid-sm md:text-xs text-gray-500 font-medium'>
                                                                    {
                                                                        item?.product?.attribute_values.slice(0, 3).map((attribute, index) => (
                                                                            <span key={index} className='capitalize'>
                                                                                {attribute?.attribute_name} : {attribute?.value}
                                                                                {index !== item?.product?.attribute_values.slice(0, 3).length - 1 && <span> |&nbsp; </span>}
                                                                            </span>
                                                                        ))
                                                                    }
                                                                </div>


                                                                {/* Price and Actions */}
                                                                <div className="text-center md:text-right flex items-end gap-3 mt-1 md:mt-2">
                                                                    {
                                                                        item?.product?.mrp > 0 &&
                                                                        <div className="md:text-sm text-mobile-2 font-semibold text-gray-400 line-through">
                                                                            {formatPriceINR(item?.product?.mrp * item?.quantity)}
                                                                        </div>
                                                                    }
                                                                    <div className="md:text-lg text-sm font-bold text-black/80">
                                                                        {formatPriceINR(item?.sub_total)}
                                                                    </div>
                                                                    {
                                                                        item?.product?.discount_percent > 0 &&
                                                                        <div className="md:text-sm text-mobile-2 text-nowrap font-bold text-green-600">
                                                                            {item?.product?.discount_percent}% Off
                                                                        </div>
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div className='flex items-center pt-2.5'>

                                                            <div className='flex items-center'>

                                                                <button onClick={() => decreaseQuantity(item.product?.uid)} className='border border-gray-300 cursor-pointer rounded-full p-2 text-black/70'>
                                                                    <FaMinus className='md:text-mobile-1 text-7px' />
                                                                </button>

                                                                <p className='lg:w-12 w-8  border border-gray-300 lg:text-sm text-xs rounded-xs py-1 outline-none text-center mx-2'>{item.quantity}</p>

                                                                <button onClick={() => increaseQuantity(item.product?.uid)} className='border border-gray-300 cursor-pointer rounded-full p-2 text-black/70'>
                                                                    <FaPlus className='md:text-mobile-1 text-7px' />
                                                                </button>

                                                            </div>

                                                            <div className="flex items-center gap-2 ml-4">

                                                                <Button
                                                                    onClick={() => removeFromCart(item.product?.uid)}
                                                                    variant='contained'
                                                                    size="small"
                                                                    color='error'
                                                                    disabled={isAnyActionRunning}
                                                                    loading={loadingAction === `remove_${item.product?.uid}`}
                                                                    loadingIndicator={<ImSpinner3 size={17} className="animate-spin" />}
                                                                    loadingPosition='start'
                                                                    startIcon={<FaTrash size={13} />}
                                                                    className='bg-red-400! text-white! disabled:bg-gray-200! disabled:text-gray-400! rounded-full! capitalize! max-sm:text-mobile-3!'
                                                                >
                                                                    Remove
                                                                </Button>


                                                                {/* <button
                                                                className="bg-blue-100 hover:bg-blue-200 cursor-pointer duration-200 px-3 rounded-full py-1.5 text-[13px] font-medium flex items-center justify-center ">
                                                                <i className="fas fa-trash mr-1"></i>Save for Later
                                                            </button> */}

                                                            </div>

                                                        </div>

                                                    </div>

                                                ))
                                            }

                                        </div>

                                        {/* Cart Actions */}
                                        <div className="px-1 py-2 sm:px-6 sm:py-4 border-t border-gray-200 bg-white">

                                            <div className="flex flex-row gap-4 justify-between items-center">

                                                <Button onClick={() => navigate("/")} variant='contained' startIcon={<FaArrowLeft className='text-base!' />} className='capitalize! max-sm:text-mobile-3!' >
                                                    Continue Shopping
                                                </Button>

                                                <Button
                                                    onClick={clearCart}
                                                    variant='contained'
                                                    color='error'
                                                    disabled={isAnyActionRunning}
                                                    loading={loadingAction === "clear_cart"}
                                                    loadingIndicator={<ImSpinner3 size={17} className="animate-spin" />}
                                                    loadingPosition='start'
                                                    startIcon={<FaTrash className='text-base!' />}
                                                    className=' capitalize! max-sm:text-mobile-3!'
                                                >
                                                    Clear Cart
                                                </Button>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                {/* Order Summary */}
                                <div className="sticky top-24 h-fit lg:col-span-1">

                                    {/* Coupon Code */}
                                    <div className="bg-white rounded-lg shadow-box mb-4 p-4 lg:p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            Discount Code
                                        </h3>

                                        <form action="" onSubmit={applyCoupon}>

                                            <div className="flex flex-col gap-4" >

                                                <TextField
                                                    label="Enter Coupon Code"
                                                    fullWidth
                                                    className=''
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                />
                                                <Button
                                                    type='submit'
                                                    variant='contained'
                                                    startIcon={<RiDiscountPercentLine className='' />}
                                                    disabled={isAnyActionRunning || cart?.coupon}
                                                    loading={loadingAction === "apply_coupon"}
                                                    loadingPosition='start'
                                                    loadingIndicator={<ImSpinner3 size={20} className="animate-spin" />}
                                                    className='py-2!'
                                                    fullWidth
                                                >
                                                    Apply
                                                </Button>

                                                {/* <button type="submit" className="btn btn-outline">
                                            <i className="fas fa-tag mr-2"></i>Apply
                                            </button> */}
                                            </div>

                                        </form>

                                        {cart?.coupon?.coupon_code && (

                                            <div className="mt-3">
                                                <span className="font-medium mb-1"> Applied Coupon : </span>
                                                <div className="shadow-sm shadow-green-200 border border-green-200 font-medium tracking-wider text-sm! mt-2 px-3 py-2.5 flex justify-between items-center gap-2 bg-green-50 text-green-600 ">
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <FaTag />
                                                        <span>{cart?.coupon?.coupon_code}</span>
                                                    </div>
                                                    <FaXmark onClick={() => setOpen(true)} className='text-red-500 cursor-pointer' />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <ConfirmDialog
                                        open={open}
                                        title="Remove Coupon"
                                        message="Are you sure you want to remove this coupon?"
                                        confirmText="Remove"
                                        onConfirm={removeCoupon}
                                        onCancel={() => setOpen(false)}
                                    />

                                    <div className="bg-white rounded-lg shadow-box">
                                        <div className="p-5 lg:p-6 border-b border-gray-200">
                                            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">
                                                Order Summary
                                            </h2> 
                                        </div>

                                        <div className="p-5 lg:p-6 text-sm lg:text-base space-y-4">
                                            {/* Subtotal */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Subtotal ({cart?.cart_items?.length} items)</span>
                                                <span className="font-semibold"> {formatPriceINR(cart.mrp_total)}</span>
                                                {/* <span className="font-semibold">₹{cart.cart_items}</span> */}
                                            </div>

                                            {/* Shipping */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Shipping</span>
                                                <span className="font-semibold text-green-600"> {cart?.shipping_cost > 0 ? `+ ₹${cart?.shipping_cost}` : "FREE"}</span>
                                            </div>

                                            {/* Tax */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Discount on MRP</span>
                                                <span className="font-semibold"> - {formatPriceINR(cart?.discount_on_mrp)} </span>
                                            </div>

                                            {
                                                cart?.coupon?.discount_percentage > 0 && (

                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Coupon Discount ({cart?.coupon?.discount_percentage}%)</span>
                                                        <span className="font-semibold"> - {formatPriceINR(cart?.discount_amount)} </span>
                                                    </div>
                                                )
                                            }

                                            <hr className="border-gray-200" />

                                            {/* Total */}
                                            <div className="flex justify-between items-center text-lg">
                                                <span className="font-semibold text-gray-800">Total</span>
                                                <span className="font-bold text-xl text-primary-600"> {formatPriceINR(cart?.total_price)}</span>
                                            </div>

                                            {/* Savings */}
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center text-green-800">
                                                    <i className="fas fa-piggy-bank mr-2"></i>
                                                    <span className="text-sm">You saved $15.00 with free
                                                        shipping!</span>
                                                </div>
                                            </div>

                                            {/* Checkout Button */}
                                            <Button onClick={handleCheckout} variant='contained' className='py-3!' endIcon={<ArrowBigRightDash />} fullWidth >Proceed to Checkout</Button>

                                            {/* Payment Methods */}
                                            <div className="text-center mt-6">
                                                <p className="text-sm text-gray-600 mb-3">
                                                    We accept:
                                                </p>
                                                <div className="flex justify-center space-x-3">
                                                    <FaCcVisa className='text-2xl text-blue-600' />
                                                    <FaCcMastercard className='text-2xl text-red-600' />
                                                    <FaCcAmex className='text-2xl text-green-600' />
                                                    <FaPaypal className='text-2xl text-blue-500' />
                                                    <FaGooglePay className='text-2xl text-green-500' />
                                                </div>
                                            </div>

                                            {/* Trust Badges */}
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                                <div className="text-center">
                                                    <FaShieldAlt className="fas fa-shield-alt inline-flex text-2xl text-green-600 mb-2" />
                                                    <p className="text-xs text-gray-600">
                                                        Secure Payment
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <FaTruck className="fas fa-truck inline-flex text-2xl text-blue-600 mb-2" />
                                                    <p className="text-xs text-gray-600">
                                                        Free Shipping
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <FaUndo className="fas fa-undo inline-flex text-2xl text-purple-600 mb-2" />
                                                    <p className="text-xs text-gray-600">
                                                        Easy Returns
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <FaHeadset className="fas fa-headset inline-flex text-2xl text-orange-600 mb-2" />
                                                    <p className="text-xs text-gray-600">
                                                        24/7 Support
                                                    </p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>

                                    {/* Recently Viewed */}
                                    {/* <div className="bg-white rounded-lg shadow-md mt-6 p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        You might also like
                                    </h3>
                                    <div className="space-y-4">
                                        {
                                            Array.from({ length: 5 }, (_, i) => (

                                                <div key={i} className="flex items-center space-x-3 group">
                                                    <div
                                                        className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                                                        <i className="fas fa-image text-gray-400"></i>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-800 group-hover:text-primary-600">
                                                            Related Product {i}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">$29.99</p>
                                                    </div>
                                                    <button className="btn btn-outline text-xs">
                                                        Add
                                                    </button>
                                                </div>
                                            ))

                                        }

                                    </div>
                                </div> */}

                                </div>

                            </div>

                        )
                        :
                        <div className="text-center bg-white shadow-[0_0_20px_5px_rgba(0,0,0,.04)] border-gray-200 py-10">
                            <div className="max-w-2xl p-10 mx-auto flex items-center flex-col justify-center">
                                <FaShoppingCart className="fas fa-shopping-cart text-8xl text-gray-400 mb-8" />
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Your cart is empty
                                </h2>
                                <p className="text-gray-500 mb-8 text-base font-semibold">
                                    Looks like you haven't added any items to your cart yet.
                                    <br />
                                    Start shopping to fill it up!
                                </p>

                                {/* Quick Actions */}
                                <div className="space-y-4">
                                    <Link to={"/"} className="btn btn-primary text-lg px-8 py-4">
                                        <Button onClick={() => navigate("/")} variant='contained' startIcon={<FaShoppingBag className='text-base!' />} >
                                            Start Shopping
                                        </Button>
                                    </Link>
                                    {/* <div className="flex justify-center space-x-4">
                                    <a href="{% url 'products:categories' %}"
                                        className="text-primary-600 hover:text-primary-700 font-medium">
                                        <i className="fas fa-th-large mr-1"></i>Browse
                                        Categories
                                    </a>
                                    <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                                        <i className="fas fa-heart mr-1"></i>View Wishlist
                                    </a>
                                </div> */}
                                </div>

                            </div>
                        </div>

            }
        </div >

    )
}

export default CartPage2

