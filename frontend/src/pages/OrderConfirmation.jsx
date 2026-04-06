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


import React, { useEffect } from 'react';
import {
    CheckCircle2,
    MapPin,
    CreditCard,
    Mail,
    Package,
    HelpCircle,
    Gift,
    ChevronRight
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const OrderConfirmation = () => {
    // Upgraded Mock Data with missing elements
    const orderDetails = {
        customerName: "Kevin Patel",
        customerEmail: "kevin.p@example.com",
        orderId: "#1358499",
        orderDate: "Jan 18, 2026",
        estimateDelivery: "Mon, 20 Jan - Tue, 21 Jan",
        shippingAddress: "4517 Washington Ave. Manchester, Kentucky 39495",
        paymentMethod: "Visa ending in 4242",
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

    useEffect(() => {

        console.log(params);

    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-12 font-sans text-gray-800">
            <div className="max-w-5xl mx-auto">

                {/* HEADER SECTION - Reassurance & Email Notice */}
                <div className="mb-8 md:mb-10 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full shrink-0">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">
                            Your Order is Confirmed!
                        </h1>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            Thanks for shopping, {orderDetails.customerName}!
                        </h2>
                        <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start gap-1.5">
                            <Mail className="w-4 h-4" />
                            We've sent your order receipt to <span className="font-medium text-gray-700">{orderDetails.customerEmail}</span>
                        </p>
                    </div>
                </div>

                {/* MAIN LAYOUT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN - Order Details & Pricing */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Items Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                                    <p className="text-sm text-gray-500 mt-1">Order {orderDetails.orderId} • Placed on {orderDetails.orderDate}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {orderDetails.items.map((item) => (
                                    <div key={item.id} className="flex flex-row items-center p-3 sm:p-4 border border-gray-50 hover:bg-gray-50 transition-colors rounded-xl gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-100 shrink-0 shadow-sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-1 truncate whitespace-normal line-clamp-2">
                                                {item.name}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-gray-500">Qty: {item.qty} • ${item.basicPrice.toFixed(2)} each</p>
                                        </div>
                                        <div className="text-sm sm:text-base font-bold text-gray-900 shrink-0">
                                            ${item.totalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Breakdown Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">${orderDetails.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-gray-900">${orderDetails.shippingCharge.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax</span>
                                    <span className="font-medium text-gray-900">${orderDetails.taxFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span className="font-medium">-${orderDetails.discount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-bold text-[#5a4df3] border-t border-gray-100 mt-4 pt-4">
                                <span>Total Paid</span>
                                <span>${orderDetails.total.toFixed(2)}</span>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN - Summary, Shipping, Actions */}
                    <div className="space-y-6">

                        {/* Delivery & Shipping Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-5">Delivery Info</h3>

                            <div className="space-y-5">
                                <div className="flex gap-3 items-start">
                                    <Package className="w-5 h-5 text-[#5a4df3] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Expected Delivery</p>
                                        <p className="text-sm font-semibold text-gray-900">{orderDetails.estimateDelivery}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <MapPin className="w-5 h-5 text-[#5a4df3] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Shipping Address</p>
                                        <p className="text-sm font-semibold text-gray-900 leading-relaxed">{orderDetails.shippingAddress}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 items-start">
                                    <CreditCard className="w-5 h-5 text-[#5a4df3] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Payment Method</p>
                                        <p className="text-sm font-semibold text-gray-900">{orderDetails.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                <button className="w-full bg-[#5a4df3] hover:bg-[#483cce] text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-indigo-200">
                                    Track Your Order
                                </button>
                                <button className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-bold py-3.5 rounded-xl transition-colors">
                                    Cancel or Edit Order
                                </button>
                            </div>
                        </div>

                        {/* Nice-to-Have: Promo / Account Creation Banner */}
                        <div className="bg-linear-to-br from-[#5a4df3] to-[#7f74f7] rounded-2xl p-6 text-white shadow-md">
                            <div className="flex items-center gap-3 mb-3">
                                <Gift className="w-6 h-6 text-yellow-300" />
                                <h3 className="font-bold text-lg">Love our products?</h3>
                            </div>
                            <p className="text-sm text-indigo-100 mb-4 leading-relaxed">
                                Refer a friend and you both get $20 off your next purchase. Share the love!
                            </p>
                            <button className="w-full bg-white text-[#5a4df3] text-sm font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                Get Invite Link <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Customer Support Info */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                            <div className="bg-orange-50 p-2.5 rounded-full shrink-0">
                                <HelpCircle className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-900 mb-1">Need Help?</h4>
                                <p className="text-xs text-gray-500 mb-2">If you have any questions, we are here to help you 24/7.</p>
                                <a href="#" className="text-xs font-bold text-[#5a4df3] hover:underline">Contact Support</a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#5a4df3] transition-colors">
                        ← Continue Shopping
                    </a>
                </div>

            </div>
        </div>
    );
};

export default OrderConfirmation;

