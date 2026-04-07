

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../config/config';
import { getAccess } from '../auth';
import { Button } from '@mui/material';
import { formatPriceINR } from '../utils/formatPriceINR';

const CheckoutSuccess = () => {


    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrder = async () => {

        try {


            window.scrollTo({ top: 0, behavior: 'smooth' });
            const session_id = params.get("session_id");

            if (!session_id) {
                setError("Invalid Request. No session ID found.");
                setLoading(false);
                return;
            }

            const token = getAccess();

            const res = await axios.post(`${API_BASE_URL}/api/orders/${session_id}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setOrderData(res.data.order);

        } catch (err) {

            console.error(err);
            setError("We couldn't fetch your order details right now, but your payment might be successful. Please check 'My Orders'.");

        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }


    }

    useEffect(() => {

        fetchOrder();

    }, [params]);

    if (loading) {

        return (

            <div className='flex flex-col items-center justify-center min-h-[90vh] text-center'>

                <div className="spinner w-12.5 h-12.5 border-5 border-[#f3f3f3] border-t-[#4CAF50] rounded-[50%] animate-spin"></div>

                <h2 className='mt-5 text-[#333]'>Verifying Payment...</h2>
                <p className='text-[#666]' >Please do not close or refresh this window.</p>

            </div>
        );
    }

    // 🌟 STATE 2: THE ERROR SCREEN (Just in case)
    if (error) {

        return (

            <div className='min-h-[80vh] flex flex-col items-center justify-start pt-20 gap-5 text-center mt-12.5' >

                <div className="relative w-20 h-20 mx-auto mt-5 mb-10">

                    {/* Error Ripples (Tailwind Colors + Custom Animation) */}
                    <div className="error-ripple error-ripple1 bg-red-500/30 "></div>
                    <div className="error-ripple error-ripple2 bg-red-500/30 "></div>

                    {/* SVG Cross Icon */}
                    <svg className="crossmark relative z-10 block w-full h-full rounded-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style={{ strokeWidth: '4', stroke: '#fff', strokeMiterlimit: '10', boxShadow: 'inset 0px 0px 0px #ef4444', animation: 'fillError .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both' }}>

                        {/* Outer Circle */}
                        <circle className="crossmark__circle" cx="26" cy="26" r="25" fill="none" style={{ strokeDasharray: '166', strokeDashoffset: '166', strokeWidth: '2', strokeMiterlimit: '10', stroke: '#ef4444', animation: 'strokeError 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards' }} />

                        {/* The 'X' Path */}
                        <path className="crossmark__check" fill="none" d="M16 16 36 36 M36 16 16 36" style={{ transformOrigin: '50% 50%', strokeDasharray: '60', strokeDashoffset: '60', animation: 'strokeError 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards' }} />
                    </svg>

                    {/* CSS Keyframes for Error Animations */}
                    <style>
                        {`
                            @keyframes strokeError { 
                                100% { stroke-dashoffset: 0; } 
                            }
                            @keyframes scale { 
                                0%, 100% { transform: none; } 
                                50% { transform: scale3d(1.1, 1.1, 1); } 
                            }
                            @keyframes fillError { 
                                100% { box-shadow: inset 0px 0px 0px 40px #ef4444; } 
                            }
                            @keyframes rippleAnim {
                                0% { transform: scale(0.8); opacity: 0.8; }
                                100% { transform: scale(2.5); opacity: 0; }
                            }

                            /* Ripple Classes with Tailwind's border width & absolute positioning built-in via standard CSS here for clean integration */
                            .error-ripple {
                                position: absolute;
                                inset: 0;
                                border-radius: 50%;
                                // border-width: 2px;
                                opacity: 0;
                                animation: rippleAnim 2s infinite linear;
                                box-sizing: border-box;
                                z-index: 0;
                            }
                            .error-ripple1 { animation-delay: 0s; }
                            .error-ripple2 { animation-delay: 1s; }
                        `}
                    </style>
                </div>

                <h2 className='text-red-500 text-2xl' >Oops! Something went wrong.</h2>
                <p>{error}</p>
                <Button variant="contained" onClick={() => navigate('/profile/orders')}>
                    Go to My Orders
                </Button>
            </div>
        );
    }

    const totalMRP = orderData?.items?.reduce((total, item) => {
        const sellPrice = Number(item.price) || 0;
        const origPrice = Number(item.original_price);

        // Agar original price 0, null, ya invalid hai, toh selling price ko hi MRP maan lo
        const effectiveMRP = origPrice > 0 ? origPrice : sellPrice;

        return total + (effectiveMRP * item.quantity);
    }, 0) || 0;

    const totalSellingPrice = orderData?.items?.reduce((total, item) => {
        const sellPrice = Number(item.price) || 0;
        return total + (sellPrice * item.quantity);
    }, 0) || 0;

    const mrpDiscount = totalMRP - totalSellingPrice;
    return (

        <div className="min-h-screen bg-white p-4 sm:p-6 md:p-12 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto">

                {/* Header Section */}
                <div className="mb-6 md:mb-8 flex  items-center flex-col">

                    <div className="success-animation-container" style={{ position: 'relative', width: '80px', height: '80px', margin: '20px auto 40px auto' }}>

                        <div className="ripple ripple1"></div>
                        <div className="ripple ripple2"></div>
                        {/* <div className="ripple ripple3"></div> */}

                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', strokeWidth: '4', stroke: '#fff', strokeMiterlimit: '10', boxShadow: 'inset 0px 0px 0px #4CAF50', animation: 'fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both', position: 'relative', zIndex: 1 }}>
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" style={{ strokeDasharray: '166', strokeDashoffset: '166', strokeWidth: '2', strokeMiterlimit: '10', stroke: '#33d638', fill: 'none', animation: 'stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards' }} />
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" style={{ transformOrigin: '50% 50%', strokeDasharray: '48', strokeDashoffset: '48', animation: 'stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards' }} />
                        </svg>

                    </div>

                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 leading-tight">
                        Order Successful!
                    </h1>
                    <h2 className="text-base sm:text-lg font-bold mb-1">
                        Hello, {orderData?.full_name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        Your Order has been Confirmed and will be shipping within next two days.
                    </p>
                </div>

                {/* Summary Card (Responsive Flexbox) */}
                <div className="bg-[#f8f9fb] rounded-xl flex flex-col gap-4 p-4 sm:p-6 mb-8 md:mb-10">

                    <div className="w-full flex gap-10 sm:w-auto">

                        <div className="">
                            <p className="text-mobile-1 sm:text-xs text-gray-500 mb-1">Estimate Delivery</p>
                            <p className="text-sm font-semibold">{orderData?.created_at}</p>
                        </div>

                        <div className="">
                            <p className="text-mobile-1 sm:text-xs text-gray-500 mb-1">Payment Method</p>
                            <p className="text-sm font-semibold">{orderData?.payment_method}</p>
                        </div>

                        <div className="">
                            <p className="text-mobile-1 sm:text-xs text-gray-500 mb-1">Order ID</p>
                            <p className="text-sm font-semibold text-[#5a4df3]">{orderData?.uid}</p>
                        </div>

                    </div>

                    <button onClick={() => navigate(`/order_details/${orderData?.uid}`)} className="w-full cursor-pointer sm:w-auto bg-[#5a4df3] hover:bg-[#483cce] text-white text-xs font-medium px-5 py-2.5 rounded-md transition-colors text-center">
                        Track your order
                    </button>

                </div>

                {/* Order Details Section */}
                <div className="mb-8">

                    <h3 className="text-lg sm:text-xl font-bold mb-6">Order Details</h3>

                    {/* Product List */}
                    <div className="space-y-4">

                        {orderData?.items?.map((item, index) => (

                            <div key={index} className="flex flex-row items-center p-3 sm:p-4 border border-gray-100 rounded-xl bg-white shadow-sm gap-3 sm:gap-4">

                                <img
                                    src={item?.product_image}
                                    alt={item?.product_name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 truncate whitespace-normal line-clamp-2 pr-2">
                                        {item?.product_name}
                                        &nbsp;
                                        {/* (
                                        {item.attribute_values.map((attr, id) => (

                                            ))}
                                        ) */}

                                        ( {
                                            item.attribute_values && item.attribute_values.map(item => (
                                                item.value
                                            )).join(" / ")
                                        } )

                                    </h4>
                                    <p className="text-mobile-1 sm:text-xs text-gray-600 mb-0.5">QTY : {item?.quantity}</p>

                                </div>

                                <div className="text-sm font-semibold text-gray-900 shrink-0">
                                    ₹{item?.price}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                <div className="mt-10 w-full">

                    <h3 className="text-lg font-bold text-gray-900 mb-3">Order Summary</h3>

                    <div className="bg-white border border-gray-200 shadow rounded-lg p-4 space-y-4 text-base">

                        <div className="flex justify-between font-semibold text-gray-600">
                            <span>Subtotal (MRP)</span>
                            <span className="font-medium">{formatPriceINR(totalMRP)}</span>
                        </div>

                        {mrpDiscount > 0 && (
                            <div className="flex justify-between font-medium text-gray-600">
                                <span>Product Discount</span>
                                <span className="text-green-600 font-medium">-{formatPriceINR(mrpDiscount)}</span>
                            </div>
                        )}

                        {orderData.coupon_used && (
                            <div className="flex font-medium justify-between text-gray-600">
                                <span>Coupon ({orderData?.coupon_used})</span>
                                <span className="text-green-600 font-medium">-{formatPriceINR(orderData?.discount_amount)}</span>
                            </div>
                        )}

                        <div className="h-px bg-gray-200 my-4"></div>

                        <div className="flex justify-between text-gray-900 font-bold text-base">
                            <span>Total Paid</span>
                            <span>{formatPriceINR(orderData?.total_amount)}</span>
                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="text-center mt-10">
                    <h3 className="text-sm sm:text-base font-bold mb-2">Thank you for Shopping!</h3>

                    <Button variant="contained" size='large' color="primary" className='rounded-full!' onClick={() => navigate("/")} >
                        Back to Shopping
                    </Button>
                </div>

            </div>
        </div>

    );
};

export default CheckoutSuccess;