// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import { formatPriceINR } from '../utils/formatPriceINR';
// import { Link } from 'react-router-dom';

// // Helper function to get dynamic colors based on order status
// const getStatusStyles = (status) => {
//     switch (status?.toLowerCase()) {
//         case 'delivered':
//         case 'paid':
//             return 'bg-green-50 text-green-700 border-green-200';
//         case 'cancelled':
//             return 'bg-red-50 text-red-700 border-red-200';
//         case 'shipped':
//         case 'out for delivery':
//             return 'bg-blue-50 text-blue-700 border-blue-200';
//         case 'returned':
//             return 'bg-purple-50 text-purple-700 border-purple-200';
//         default: // Pending, Processing, etc.
//             return 'bg-orange-50 text-orange-700 border-orange-200';
//     }
// };

// const OrderCard = ({ order }) => {
//     const [isExpanded, setIsExpanded] = useState(false);

//     return (
//         <div className="border border-gray-200 rounded-lg mb-6 bg-white  overflow-hidden shadow-sm shadow-gray-100 hover:shadow-gray-200 hover:shadow-sm transition-shadow">

//             {/* --- HEADER SECTION (Always Visible) --- */}
//             <div
//                 className="p-4 md:p-5 flex flex-wrap lg:flex-nowrap justify-between items-center cursor-pointer  hover:bg-gray-50 transition-colors"
//                 onClick={() => setIsExpanded(!isExpanded)}
//             >

//                 {/* Left: Order Info & Status */}
//                 <div className="flex flex-col gap-3 w-full lg:w-auto mb-4 lg:mb-0">

//                     <div className="flex flex-wrap items-center gap-3 md:gap-4">
//                         <span className="font-semibold text-gray-900">Order ID: {order.uid}</span>
//                         <span className="hidden md:inline text-gray-300">|</span>
//                         <span className="text-gray-500 text-sm font-medium">{order.date || order.created_at?.split('T')[0]}</span>
//                     </div>

//                     <div className="flex items-center gap-4">
//                         {/* Dynamic Status Pill */}
//                         <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(order.status)} uppercase tracking-wide`}>
//                             {order.status}
//                         </span>

//                         <Link
//                             to={`/order_details/${order.uid}`}
//                             className="text-green-600 text-sm font-semibold hover:text-green-700 hover:underline flex items-center gap-1"
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             Track order
//                         </Link>
//                     </div>
                    
//                 </div>

//                 {/* Center: Thumbnails (Visible only on larger screens when collapsed) */}
//                 {!isExpanded && (
//                     <div className="hidden lg:flex items-center gap-3">
//                         {order.items?.slice(0, 3).map((item, index) => (
//                             <div key={index} className="w-12 h-12 bg-white rounded-md border border-gray-200 overflow-hidden relative p-1 shadow-sm">
//                                 <img
//                                     src={item.product_image?.replace("/upload/", "/upload/w_200/")}
//                                     alt="Product thumbnail"
//                                     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90%]! max-h-[90%]! object-contain"
//                                 />
//                             </div>
//                         ))}
//                         {order.items?.length > 3 && (
//                             <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
//                                 +{order.items.length - 3}
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* Right: Total Price & Toggle Icon */}
//                 <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end mt-2 lg:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-200">
//                     <div className="text-left lg:text-right">
//                         <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Total</div>
//                         <div className="font-semibold text-lg md:text-xl text-gray-900">{formatPriceINR(order.total_amount)}</div>
//                     </div>
//                     <button className="text-gray-400 hover:text-gray-800 cursor-pointer bg-white border border-gray-200 rounded-full p-1 shadow-sm focus:outline-none transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
//                         <ChevronDown size={20} />
//                     </button>
//                 </div>
//             </div>

//             {/* --- EXPANDED DETAILS SECTION --- */}
//             <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
//                 <div className="p-4 md:p-5 border-t border-gray-100 bg-white">
//                     <div className="space-y-4">
//                         {order.items?.map((item, index) => (
//                             <div key={index} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row gap-5 hover:border-gray-200 transition-colors">

//                                 {/* Product Image & Details */}
//                                 <div className="flex flex-1 gap-4 items-start">
//                                     {/* Product Image */}
//                                     <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden relative p-2">
                                        
//                                         <img
//                                             src={item.product_image?.replace("/upload/", "/upload/w_200/")}
//                                             className="absolute top-1/2 left-1/2 -translate-1/2 max-w-full! max-h-full!"
//                                         />

//                                     </div>

//                                     {/* Product Info */}
//                                     <div className="flex flex-col gap-2">
//                                         <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2">
//                                             {item.product_name}
//                                         </h3>

//                                         {/* Item Attributes (Size, Color, etc) */}
//                                         <div className="flex flex-col gap-1">
//                                             {item.attribute_values?.map((attr, i) => (
//                                                 <div key={i} className="flex items-center gap-2 text-xs md:text-sm">
//                                                     <span className="text-gray-400 uppercase tracking-wider font-semibold text-mobile-1 md:text-mobile-2 mt-0.5">
//                                                         {attr.attribute_name}:
//                                                     </span>
//                                                     <span className="font-medium text-xs text-gray-700">
//                                                         {attr.value}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Price Calculation (Right side) */}
//                                 <div className="flex md:flex-col items-center justify-between md:items-end md:justify-center md:w-48 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 mt-2 md:mt-0">
//                                     <div className="text-gray-500 text-sm font-medium">
//                                         {formatPriceINR(item.price)} <span className="text-gray-400 text-xs mx-1">×</span> {item.quantity}
//                                     </div>
//                                     <div className="font-bold text-lg text-gray-900 mt-1">
//                                         {formatPriceINR(item.total_price || (item.price * item.quantity))}
//                                     </div>
//                                 </div>

//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderCard;


import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatPriceINR } from '../utils/formatPriceINR';
import { Link } from 'react-router-dom';

const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
        case 'delivered':
        case 'paid':
            return 'bg-green-50 text-green-700 border-green-200';
        case 'cancelled':
            return 'bg-red-50 text-red-700 border-red-200';
        case 'shipped':
        case 'out for delivery':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'returned':
            return 'bg-purple-50 text-purple-700 border-purple-200';
        default: 
            return 'bg-orange-50 text-orange-700 border-orange-200';
    }
};

const OrderCard = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg mb-4 md:mb-6 bg-white overflow-hidden shadow-sm shadow-gray-100 hover:shadow-gray-200 hover:shadow-sm transition-shadow">

            {/* --- HEADER SECTION --- */}
            <div
                className="p-3.5 md:p-4 lg:p-5 flex flex-wrap lg:flex-nowrap justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >

                {/* Left: Order Info & Status */}
                <div className="flex flex-col gap-2.5 md:gap-3 w-full lg:w-auto mb-3 lg:mb-0">

                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                        
                        {/* <span className="font-semibold text-sm md:text-base text-gray-900">Order ID: <span className='hover:underline underline-offset-2 text-blue-500'>{order.uid}</span></span> */}
                        <span className="font-semibold text-sm md:text-base text-gray-900">Order ID : &nbsp;
                            <Link
                                to={`/order_details/${order.uid}`} className='hover:underline hover:underline-offset-2 text-blue-500'
                            >{ order.uid}</Link> 
                        </span>
                        {/* </Link> */}
                        <span className="hidden md:inline text-gray-300">|</span>
                        <span className="text-gray-500 text-xs md:text-sm font-medium">{order.date || order.created_at?.split('T')[0]}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                        <span className={`px-2.5 py-1 md:px-3 md:py-1 rounded-full text-mobile-1 md:text-xs font-bold border ${getStatusStyles(order.status)} uppercase tracking-wide`}>
                            {order.status}
                        </span>

                        <Link
                            to={`/order_details/${order.uid}`}
                            className="text-green-600 text-xs md:text-sm font-semibold hover:text-green-700 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Track order
                        </Link>
                    </div>
                    
                </div>

                {/* Center: Thumbnails (Desktop Only) */}
                {!isExpanded && (
                    <div className="hidden lg:flex items-center gap-3">
                        {order.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="w-12 h-12 bg-white rounded-md border border-gray-200 overflow-hidden relative p-1 shadow-sm">
                                <img
                                    src={item.product_image?.replace("/upload/", "/upload/w_200/")}
                                    alt="Product thumbnail"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90%]! max-h-[90%]! object-contain"
                                />
                            </div>
                        ))}
                        {order.items?.length > 3 && (
                            <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                +{order.items.length - 3}
                            </div>
                        )}
                    </div>
                )}

                {/* Right: Total Price & Toggle Icon */}
                <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto justify-between lg:justify-end mt-1 md:mt-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                    <div className="text-left lg:text-right">
                        <div className="text-gray-400 text-mobile-1 md:text-xs font-bold uppercase tracking-wider mb-0.5">Total</div>
                        <div className="font-semibold text-base md:text-lg lg:text-xl text-gray-900">{formatPriceINR(order.total_amount)}</div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-800 cursor-pointer bg-white border border-gray-200 rounded-full p-1 shadow-sm focus:outline-none transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown size={20} />
                    </button>
                </div>
            </div>

            {/* --- EXPANDED DETAILS SECTION --- */}
            {/* Height max-h-[2000px] fix ki hai taaki zyada items hone par cut na ho */}
            <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="p-3 md:p-4 lg:p-5 border-t border-gray-100 bg-white">
                    <div className="space-y-3 md:space-y-4">
                        {order.items?.map((item, index) => (
                            <div key={index} className="border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col md:flex-row gap-4 md:gap-5 hover:border-gray-200 transition-colors">

                                {/* Product Image & Details */}
                                <div className="flex flex-1 gap-3 md:gap-4 items-start">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden relative p-1 md:p-2">
                                        
                                        <img
                                            src={item.product_image?.replace("/upload/", "/upload/w_200/")}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full! max-h-full!"
                                            alt={item.product_name}
                                        />

                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-col gap-1.5 md:gap-2">
                                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2">
                                            {item.product_name}
                                        </h3>

                                        <div className="flex flex-col gap-0.5 md:gap-1">
                                            {item.attribute_values?.map((attr, i) => (
                                                <div key={i} className="flex items-center gap-1.5 md:gap-2 text-mobile-1 md:text-sm">
                                                    <span className="text-gray-400 uppercase tracking-wider font-semibold mt-0.5">
                                                        {attr.attribute_name}:
                                                    </span>
                                                    <span className="font-medium text-gray-700">
                                                        {attr.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Price Calculation */}
                                <div className="flex md:flex-col items-center justify-between md:items-end md:justify-center md:w-48 border-t md:border-t-0 border-gray-100 pt-2 md:pt-0 mt-2 md:mt-0">
                                    <div className="text-gray-500 text-xs md:text-sm font-medium">
                                        {formatPriceINR(item.price)} <span className="text-gray-400 text-mobile-1 md:text-xs mx-1">×</span> {item.quantity}
                                    </div>
                                    <div className="font-bold text-sm md:text-lg text-gray-900 mt-0.5 md:mt-1">
                                        {formatPriceINR(item.total_price || (item.price * item.quantity))}
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;