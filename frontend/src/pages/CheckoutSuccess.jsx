// import React, { useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { CheckCircle, Package, ArrowRight, ShoppingBag, Receipt } from 'lucide-react';

// const CheckoutSuccess = () => {
//     const navigate = useNavigate();
//     const [searchParams] = useSearchParams();
//     const sessionId = searchParams.get('session_id');

//     useEffect(() => {
//         // Clear local cart state
//         localStorage.removeItem('guest_cart_uid');
//     }, []);

//     // Animation variants
//     const containerVariants = {
//         hidden: { opacity: 0 },
//         visible: {
//             opacity: 1,
//             transition: {
//                 staggerChildren: 0.1,
//                 delayChildren: 0.3
//             }
//         }
//     };

//     const itemVariants = {
//         hidden: { y: 20, opacity: 0 },
//         visible: {
//             y: 0,
//             opacity: 1,
//             transition: { type: "spring", stiffness: 300, damping: 24 }
//         }
//     };

//     return (
//         <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
//             {/* Background animated gradients */}
//             <motion.div
//                 className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl"
//                 animate={{
//                     x: [0, 50, 0],
//                     y: [0, 30, 0],
//                     scale: [1, 1.1, 1]
//                 }}
//                 transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
//             />
//             <motion.div
//                 className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-3xl"
//                 animate={{
//                     x: [0, -40, 0],
//                     y: [0, 50, 0],
//                     scale: [1, 1.2, 1]
//                 }}
//                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//             />
//             <motion.div
//                 className="absolute bottom-[-10%] left-[20%] w-[25rem] h-[25rem] bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl"
//                 animate={{
//                     x: [0, 30, 0],
//                     y: [0, -30, 0],
//                     scale: [1, 1.1, 1]
//                 }}
//                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
//             />

//             <motion.div
//                 className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white/60 p-8 md:p-12 w-full max-w-2xl relative z-10"
//                 initial="hidden"
//                 animate="visible"
//                 variants={containerVariants}
//             >
//                 {/* Success Icon Animation */}
//                 <motion.div
//                     className="flex justify-center mb-8"
//                     variants={itemVariants}
//                 >
//                     <div className="relative">
//                         <motion.div
//                             className="absolute inset-0 bg-emerald-200 rounded-full blur-xl"
//                             initial={{ scale: 0.8, opacity: 0 }}
//                             animate={{ scale: 1.3, opacity: 0.6 }}
//                             transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
//                         />
//                         <div className="relative bg-gradient-to-tr from-emerald-500 to-green-400 w-24 h-24 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white">
//                             <motion.div
//                                 initial={{ scale: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
//                             >
//                                 <CheckCircle size={48} strokeWidth={2.5} />
//                             </motion.div>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Header Typography */}
//                 <motion.div className="text-center mb-10" variants={itemVariants}>
//                     <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
//                         Payment Successful!
//                     </h1>
//                     <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
//                         Thank you for your purchase. We've received your order and are getting it ready to ship.
//                     </p>
//                 </motion.div>

//                 {/* Order Details Grid */}
//                 <motion.div
//                     className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
//                     variants={containerVariants}
//                 >
//                     <motion.div className="bg-white/50 border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow" variants={itemVariants}>
//                         <div className="bg-indigo-50 text-indigo-600 p-3.5 rounded-xl shadow-inner">
//                             <Package size={24} strokeWidth={2} />
//                         </div>
//                         <div>
//                             <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Status</p>
//                             <p className="font-bold text-slate-900 flex items-center gap-2">
//                                 <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
//                                 Processing
//                             </p>
//                         </div>
//                     </motion.div>

//                     {sessionId ? (
//                         <motion.div className="bg-white/50 border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow" variants={itemVariants}>
//                             <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-xl shadow-inner">
//                                 <Receipt size={24} strokeWidth={2} />
//                             </div>
//                             <div className="overflow-hidden">
//                                 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Transaction ID</p>
//                                 <p className="font-mono text-sm font-bold text-slate-900 truncate" title={sessionId}>
//                                     {sessionId.substring(0, 16)}...
//                                 </p>
//                             </div>
//                         </motion.div>
//                     ) : (
//                         <motion.div className="bg-white/50 border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow" variants={itemVariants}>
//                             <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-xl shadow-inner">
//                                 <Receipt size={24} strokeWidth={2} />
//                             </div>
//                             <div className="overflow-hidden">
//                                 <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Order Summary</p>
//                                 <p className="text-sm font-bold text-slate-900">
//                                     Check email for receipt
//                                 </p>
//                             </div>
//                         </motion.div>
//                     )}
//                 </motion.div>

//                 {/* Action Buttons */}
//                 <motion.div
//                     className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//                     variants={itemVariants}
//                 >
//                     <motion.button
//                         whileHover={{ scale: 1.02, y: -2 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => navigate("/profile")}
//                         className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-800 font-bold rounded-2xl hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all flex items-center justify-center gap-2"
//                     >
//                         <ShoppingBag size={20} strokeWidth={2.5} />
//                         View Order
//                     </motion.button>

//                     <motion.button
//                         whileHover={{ scale: 1.02, y: -2 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => navigate("/")}
//                         className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all flex items-center justify-center gap-2"
//                     >
//                         Continue Shopping
//                         <ArrowRight size={20} strokeWidth={2.5} />
//                     </motion.button>
//                 </motion.div>

//                 {/* Footer text */}
//                 <motion.p className="text-center text-sm text-slate-400 mt-8 font-medium" variants={itemVariants}>
//                     A confirmation email has been sent to your registered address.
//                 </motion.p>
//             </motion.div>
//         </div>
//     );
// };

// export default CheckoutSuccess;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../config/config';
import { getAccess } from '../auth';

const CheckoutSuccess = () => {

    // Mock data for the order
    const orderDetails = {
        customerName: "Kevin Patel",
        orderId: "#1358499",
        estimateDelivery: "Monday, 20 Jan - Tuesday, 21 Jan",
        paymentMethod: "Credit Card",
        subtotal: 180.00,
        shippingCharge: 15.00,
        taxFee: 5.00,
        discount: 10.00,
        total: 190.00,
        items: [
            {
                id: 1,
                name: "Sweet Fragrance Woman COCO Perfume",
                qty: 1,
                basicPrice: 52.00,
                totalPrice: 52.00,
                image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=150&h=150"
            },
            {
                id: 2,
                name: "Strong Fragrance Man Gabrielle Perfume",
                qty: 2,
                basicPrice: 64.00,
                totalPrice: 128.00,
                image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=150&h=150"
            }
        ]
    };

    const [params] = useSearchParams();
    const [orderData, setOrderData] = useState({})

    useEffect(() => {

        const session_id = params.get("session_id");

        const token = getAccess();

        axios.post(`${API_BASE_URL}/api/orders/${session_id}/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => setOrderData(res.data.order)).catch(err => console.log(err));

    }, []);

    useEffect(()=> {

        if (orderData){
            console.log(orderData)
        }

    },[orderData])

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 md:p-12 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto">

                {/* Header Section */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 leading-tight">
                        Your Order is Confirmed! 🥳
                    </h1>
                    <h2 className="text-base sm:text-lg font-bold mb-1">
                        Hello, {orderData.full_name}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        Your Order has been Confirmed and will be shipping within next two days.
                    </p>
                </div>

                {/* Summary Card (Responsive Flexbox) */}
                {/* <div className="bg-[#f8f9fb] rounded-xl p-4 sm:p-6 flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 md:mb-10">
                    <div className="w-full sm:w-auto">
                        <div className="mb-4">
                            <p className="text-mobile-1 sm:text-xs text-gray-400 mb-1">Estimate Delivery</p>
                            <p className="text-sm font-semibold">{orderDetails.estimateDelivery}</p>
                        </div>
                        <div className="mb-5">
                            <p className="text-mobile-1 sm:text-xs text-gray-400 mb-1">Payment Method</p>
                            <p className="text-sm font-semibold">{orderDetails.paymentMethod}</p>
                        </div>
                        <button className="w-full sm:w-auto bg-[#5a4df3] hover:bg-[#483cce] text-white text-xs font-medium px-5 py-2.5 rounded-md transition-colors text-center">
                            Track your order
                        </button>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm shrink-0 self-center sm:self-auto">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Order1358499"
                            alt="Order QR Code"
                            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                        />
                    </div>
                </div> */}

                {/* Order Details Section */}
                <div className="mb-8">
                    <h3 className="text-lg sm:text-xl font-bold mb-1">Order Details</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-6">
                        Order ID: <span className="text-[#5a4df3]">{orderDetails.orderId}</span>
                    </p>

                    {/* Product List */}
                    <div className="space-y-4">
                        {orderData?.items?.map((item) => (
                            <div key={item.uid} className="flex flex-row items-center p-3 sm:p-4 border border-gray-100 rounded-xl bg-white shadow-sm gap-3 sm:gap-4">
                                {/* Product Image */}
                                <img
                                    src={item?.product_image}
                                    alt={item?.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                                />

                                {/* Product Info - min-w-0 prevents flexbox overflow on small screens */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 truncate whitespace-normal line-clamp-2">
                                        {item?.name}
                                    </h4>
                                    <p className="text-mobile-1 sm:text-xs text-gray-500 mb-0.5">QTY : {item?.quantity}</p>
                                    <p className="text-mobile-1 sm:text-xs text-gray-500">
                                        Basic Price : ₹{item?.price}
                                    </p>
                                </div>

                                {/* Product Total */}
                                <div className="text-sm font-bold text-gray-900 shrink-0">
                                    ₹{item?.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="border border-gray-100 rounded-xl p-4 sm:p-6 mb-8 md:mb-10 shadow-sm">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-bold text-gray-900">₹{orderData?.subtotal}</span>
                        </div>
                        {/* <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Shipping Charge</span>
                            <span className="font-bold text-gray-900">${orderDetails.shippingCharge.toFixed(2)}</span>
                        </div> */}
                        {/* <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Tax Fee</span>
                            <span className="font-bold text-gray-900">${orderDetails.taxFee.toFixed(2)}</span>
                        </div> */}
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-500">Discount ({orderData?.coupon_used}) </span>
                            <span className="font-bold text-gray-900">₹{orderData?.discount_amount}</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm sm:text-base font-bold text-[#5a4df3] border-t border-gray-100 mt-4 sm:mt-5 pt-4 sm:pt-5">
                        <span>Total</span>
                        <span>₹{orderData.total_amount}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center sm:text-left">
                    <h3 className="text-sm sm:text-base font-bold mb-2">Thank you for Shopping!</h3>
                    <a href="/" className="text-xs sm:text-sm font-medium text-[#5a4df3] hover:underline">
                        Back to Shopping
                    </a>
                </div>

            </div>
        </div>
    );
};

export default CheckoutSuccess;