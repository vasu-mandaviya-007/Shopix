
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getAccess } from '../auth';
import API_BASE_URL from '../config/config';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, IconButton, Skeleton } from '@mui/material';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BsCartPlus, BsHeart } from 'react-icons/bs';
import { formatPriceINR } from '../utils/formatPriceINR';
import Skel from '../components/skeleton/Skel';

const WishlistPage = () => {
    const { user } = useContext(AuthContext);
    const { addToCart, cartLoading } = useContext(CartContext);

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    const fetchWishlist = async () => {
        try {
            const token = getAccess();
            const res = await axios.get(`${API_BASE_URL}/api/cart/wishlist/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setWishlist(res.data.wishlist);
            }
        } catch (err) {
            console.error("Error fetching wishlist", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchWishlist();
        else setLoading(false);
    }, [user]);

    const handleRemove = async (variantId) => {
        setRemovingId(variantId);
        try {
            const token = getAccess();
            const res = await axios.post(`${API_BASE_URL}/api/cart/wishlist/`,
                { variant_id: variantId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setWishlist(prev => prev.filter(item => item.variant.uid !== variantId));
                toast.success("Removed from wishlist");
            }
        } catch (err) {
            toast.error("Failed to remove item");
        } finally {
            setRemovingId(null);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50/30">
                <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center max-w-md w-full mx-4 border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BsHeart className="text-3xl text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">Save your favorite tech gear and access them across all your devices.</p>
                    <Link to="/login">
                        <Button variant="contained" fullWidth className="bg-black! font-bold! rounded-xl! py-3.5! shadow-none! hover:bg-gray-800! capitalize! text-base!">
                            Login or Signup
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50/30 min-h-[80vh] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Your Wishlist</h1>
                        {!loading && wishlist.length > 0 && (
                            <p className="text-gray-500 font-medium mt-2 flex items-center gap-2">
                                <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md text-xs font-bold">{wishlist.length}</span>
                                items saved for later
                            </p>
                        )}
                    </div>
                    {!loading && wishlist.length > 0 && (
                        <Link to="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            + Discover more products
                        </Link>
                    )}
                </div>

                {/* Skeletons */}
                {loading ? (

                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="flex flex-col md:flex-row bg-white p-2 sm:p-4 border border-gray-100 rounded-lg shadow-sm">

                                {/* Image area — full width square on mobile, fixed size on md+ */}
                                <Skel className="w-full aspect-square md:aspect-auto md:w-32 md:h-32! lg:w-35 lg:h-35! rounded-lg! shrink-0" />

                                {/* Text area */}
                                <div className="flex flex-col justify-around flex-1 pt-3 md:pt-1 px-1 md:pl-4 lg:pl-6 gap-2 min-w-0">

                                    {/* Title */}
                                    <Skel className="w-[85%] h-4 sm:h-5!" />

                                    {/* Attributes pill */}
                                    <Skel className="w-1/2 h-5 sm:h-6!" />

                                    {/* Price + button row */}
                                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3">

                                        {/* Price block */}
                                        <div className="flex flex-col gap-1.5">
                                            <Skel className="w-20 sm:w-24 h-5 sm:h-6!" />
                                            <div className="flex items-center gap-1.5">
                                                <Skel className="w-14 h-3.5 sm:h-4!" />
                                                <Skel className="w-10 sm:w-12 h-3.5 sm:h-4!" />
                                            </div>
                                        </div>

                                        {/* Move to Cart button */}
                                        <Skel className="w-24 sm:w-28 h-7 sm:h-8! shrink-0" />

                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                ) : wishlist.length === 0 ? (

                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] text-center px-4">
                        <div className="w-32 h-32 bg-linear-to-tr from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                            <BsHeart className="text-5xl text-gray-300" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Nothing saved yet</h2>
                        <p className="text-gray-500 mb-10 max-w-md text-sm md:text-base leading-relaxed">
                            Found something you like? Tap on the heart icon next to the item to add it to your wishlist.
                        </p>
                        <Link to="/products">
                            <Button variant="contained" className="bg-black! font-bold! rounded-xl! px-10! py-3.5! shadow-none! hover:bg-gray-800! hover:-translate-y-0.5 transition-all! capitalize! text-base!">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>

                ) : (

                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">

                        {wishlist.map((item) => {

                            const variant = item.product;
                            const currentPrice = Number(variant.price) || 0;
                            const originalPrice = Number(variant.mrp) || 0;
                            const isDiscounted = originalPrice > currentPrice && currentPrice > 0;
                            const discountPercent = variant.discount_percent || 0;

                            return (

                                <div key={item.id} className="group flex flex-col md:flex-row bg-white p-2 sm:p-4 border border-gray-100 hover:border-gray-200 rounded-lg shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 relative">

                                    <div className="absolute top-2 right-2 md:top-5 md:right-5 z-10">
                                        <IconButton
                                            onClick={(e) => { e.preventDefault(); handleRemove(variant.uid); }}
                                            disabled={removingId === variant.uid}
                                            size="small"
                                            className="bg-gray-50/80! backdrop-blur-md! text-gray-400! hover:bg-red-50! hover:text-red-500! transition-all! disabled:opacity-50"
                                            sx={{ p: { xs: 0.5, md: 1 } }}
                                        >
                                            <RiDeleteBin6Line className="text-[16px] md:text-[18px]" />
                                        </IconButton>
                                    </div>

                                    {/* Product Image Area - 🌟 CHANGED: Mobile pe 'w-full aspect-square', Laptop pe fixed width */}
                                    <Link to={`/product/${variant.product_slug}?variant=${variant.uid}`} className="relative w-full aspect-square md:aspect-auto md:w-32 md:h-32 lg:w-35 lg:h-35 bg-[#f8f9fa] rounded-lg md:rounded-xl overflow-hidden shrink-0 block">
                                        <img
                                            src={variant.image?.startsWith('http') ? variant.image : `${API_BASE_URL}${variant.image}`}
                                            alt={variant.product_name}
                                            className={`absolute top-0 left-0 w-full h-full object-contain p-3 md:p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-110 ${removingId === variant.uid ? 'opacity-30 grayscale blur-sm' : ''}`}
                                        />
                                    </Link>

                                    {/* <div className="flex flex-col flex-1 pl-4 md:pl-6 py-1 md:py-2 justify-between min-w-0"> */}
                                    {/* Product Details Area - 🌟 CHANGED: Padding top added for mobile, left padding for Laptop */}
                                    <div className="flex flex-col justify-around  md:gap-1 flex-1 pt-3 md:pt-1 px-1 md:px-0 md:pl-4 lg:pl-6 py-1 md:py-0  min-w-0">

                                        {/* Title and Attributes - 🌟 CHANGED: Mobile pe pr-0 kyuki delete button image pe overlap karega text pe nahi */}
                                        <div className="pr-0  md:pr-14">
                                            <Link to={`/product/${variant.product_slug}?variant=${variant.uid}`} className="group-hover:text-blue-600 transition-colors ">
                                                <h3 className="font-semibold text-gray-900 text-mobile-2 sm:text-sm md:text-base leading-snug line-clamp-1 md:line-clamp-1 mb-1 md:mb-1.5 lg:mb-2">
                                                    {/* {variant.product_name} */}
                                                    {variant.variant_name}
                                                </h3>
                                            </Link>

                                            {/* Variant Pill Badge */}
                                            {variant.attributes && (
                                                <span className="inline-block  bg-gray-100 text-gray-600 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-9px sm:text-mobile-1 md:text-xs font-medium uppercase tracking-wider truncate max-w-full">
                                                    {variant.attributes}
                                                </span>
                                            )}
                                        </div>

                                        {/* Price Section */}
                                        <div className="mt-1  md:mt-0 flex flex-col sm:flex-row sm:items-end justify-between gap-3 md:gap-4">
                                            <div className="flex flex-col items-start flex-wrap gap-1.5 md:gap-2 mt-0 md:mt-auto">
                                                <span className="font-black text-xs sm:text-base md:text-lg lg:text-xl text-gray-900 tracking-tight">
                                                    {formatPriceINR(currentPrice)}
                                                </span>
                                                {isDiscounted && (
                                                    <div className="flex items-center gap-1 md:gap-1.5">
                                                        <span className="text-mobile-1 md:text-xs lg:text-sm text-gray-400 line-through font-medium">
                                                            {formatPriceINR(originalPrice)}
                                                        </span>
                                                        <span className="text-9px sm:text-mobile-1 md:text-xs font-bold text-green-700 bg-green-100 px-1 py-0.5 md:px-1.5 md:py-0.5 rounded-md">
                                                            {discountPercent}% OFF
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* <button
                                                onClick={() => addToCart(variant)}
                                                disabled={cartLoading}
                                                className="w-full md:w-auto  bg-gray-900 text-white cursor-pointer font-bold rounded-sm px-2 py-1.5 md:px-3 md:py-2 lg:px-5 lg:py-2.5 text-mobile-1 sm:text-xs md:text-sm hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-1.5 md:gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0"
                                            >
                                                
                                                Move to Cart
                                            </button> */}
                                            <Button variant='dark' size='small' startIcon={<BsCartPlus className="max-sm:text-sm!" />} disabled={cartLoading} onClick={() => addToCart(variant)}>
                                                Move to Cart
                                            </Button>

                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                )}

            </div>

        </div>

    );

};

export default WishlistPage;