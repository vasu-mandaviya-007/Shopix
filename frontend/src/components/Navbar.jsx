import { FiShoppingCart } from "react-icons/fi";


// import { BsFillBoxSeamFill, BsArrowRight } from "react-icons/bs";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { Button, IconButton } from "@mui/material";
// import { ShoppingCartIcon } from "lucide-react";
// import React, { useContext, useState } from "react";
// import { IoSearchSharp } from "react-icons/io5";
// import { TbLogout } from "react-icons/tb";
// import { Link, useNavigate } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// import { logout } from "../auth";
// import { FaAddressBook, FaHome, FaUserCircle } from "react-icons/fa";
// import { FaShop } from "react-icons/fa6";
// // 🌟 NAYA IMPORT: Mobile menu icons ke liye
// import { FiMenu, FiX } from "react-icons/fi";

// import logo from "../assets/shopix_logo.png";
// import default_avatar from "../assets/default-avatar.png";

// const Navbar = () => {
//     const [search, setSearch] = useState("");
//     const { cart } = useContext(CartContext);
//     const { user, fetchUser } = useContext(AuthContext);

//     const [showProfile, setshowProfile] = useState(false);
//     const [loading, setLoading] = useState(false);

//     // 🌟 NAYA STATE: Mobile menu ko toggle karne ke liye
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     const navigate = useNavigate();

//     const handleSearchChange = (e) => {
//         setSearch(e.target.value);
//     };

//     const handleLogout = () => {
//         setLoading(true);
//         setTimeout(() => {
//             logout();
//             fetchUser();
//             setLoading(false);
//             setshowProfile(false); // Logout hone par profile dropdown band kar do
//         }, 2000);
//     };

//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (search.trim()) {
//             navigate(`/products?q=${search}`);
//             setIsMobileMenuOpen(false); // Search karne ke baad mobile menu band kar do
//         }
//     };

//     return (
//         <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">

//             <div className="container mx-auto px-4 lg:px-10">
//                 <div className="flex justify-between items-center py-3 lg:py-4">

//                     {/* Logo Section */}
//                     <div className="flex items-center">
//                         <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-600">
//                             <img src={logo} className="h-8 md:h-10" alt="Shopix Logo" />
//                         </Link>
//                     </div>

//                     {/* Desktop Search Bar (Hidden on Mobile) */}
//                     <div className="hidden md:flex flex-1 max-w-lg mx-8">
//                         <form onSubmit={handleSearch} className="w-full">
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     name="q"
//                                     placeholder="Search products..."
//                                     className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
//                                     value={search}
//                                     onChange={handleSearchChange}
//                                 />
//                                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                                     <IoSearchSharp className="text-gray-500 text-lg" />
//                                 </div>
//                                 <button type="submit" className="absolute inset-y-0 right-1 pr-3 flex items-center">
//                                     <BsArrowRight className="text-gray-700 hover:text-blue-600 transition-colors text-xl" />
//                                 </button>
//                             </div>
//                         </form>
//                     </div>

//                     {/* Desktop Navigation Links */}
//                     <div className="hidden lg:flex items-center space-x-8 font-medium text-gray-700">
//                         <Link to={"/"} className="hover:text-blue-600 transition-colors inline-flex items-center gap-2">
//                             <FaHome size={18} /> Home
//                         </Link>
//                         <Link to={"/products/"} className="hover:text-blue-600 transition-colors inline-flex items-center gap-2">
//                             <FaShop size={18} /> Shop
//                         </Link>
//                     </div>

//                     {/* Right Side Actions (Profile, Cart, Mobile Toggle) */}
//                     <div className="flex items-center space-x-2 md:space-x-4 ml-auto lg:ml-8">

//                         {/* Auth / Profile Logic */}
//                         {user ? (

//                             // <div className='flex items-center gap-3 relative'>

//                             //     <p className='font-semibold'>Hi, {user.first_name}</p>

//                             //     <div style={{ display: showProfile ? "flex" : "none" }} onClick={() => setshowProfile(false)} className='fixed w-full h-full z-2 left-0 top-0'></div>

//                             //     <button onClick={() => setshowProfile(!showProfile)} className='relative group cursor-pointer overflow-hidden z-5 rounded-full'>
//                             //         <img src={user?.profile_pic || default_avatar} className='h-8 w-8' alt="" />
//                             //         <span className='absolute border -skew-x-30 -translate-x-10 group-hover:translate-x-10 duration-600 w-4 h-12 z-10 bg-gray-200/40 -top-2 left-2'></span>
//                             //     </button>

//                             //     {/* 🔥 FIX: w-94 ki jagah w-64 sm:w-80 lg:w-94 lagaya hai taaki mobile me screen ke bahar na bhage */}
//                             //     <div className={` ${showProfile ? "opacity-100 translate-y-0 z-10 pointer-events-auto" : "opacity-0 translate-y-5 -z-10 pointer-events-none"} duration-300 absolute bg-white text-black w-64 sm:w-80 lg:w-94 overflow-hidden rounded-xl right-0 top-[120%] border border-gray-300 shadow-2xl `}>

//                             //         <div className='flex items-center gap-4 py-3 px-3 md:py-3.5 md:px-4 border-b border-b-gray-200'>
//                             //             <img src={user.profile_pic || default_avatar} className='w-8 h-8 md:h-10 md:w-10 rounded-full shrink-0' alt="" />
//                             //             {/* 🔥 FIX: overflow-hidden aur truncate lagaya hai taaki lamba email box break na kare */}
//                             //             <div className="overflow-hidden">
//                             //                 <p className='text-sm font-medium truncate'>{user.first_name + " " + user.last_name}</p>
//                             //                 <p className='text-xs truncate'>{user.email}</p>
//                             //             </div>
//                             //         </div>

//                             //         <div className='flex flex-col items-center text-[13px] text-neutral-600'>

//                             //             <button
//                             //                 onClick={() => {
//                             //                     navigate("/profile")
//                             //                     setshowProfile(false);
//                             //                 }}
//                             //                 className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-4 sm:gap-6 px-5 sm:px-7 py-3 sm:py-4 border-b border-gray-200"
//                             //             >
//                             //                 <FaUserCircle className='text-gray-700 text-base shrink-0' />
//                             //                 Profile
//                             //             </button>

//                             //             <button
//                             //                 onClick={() => {
//                             //                     navigate("/profile/orders")
//                             //                     setshowProfile(false);
//                             //                 }}
//                             //                 className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-4 sm:gap-6 px-5 sm:px-7 py-3 sm:py-4 border-b border-gray-200" >
//                             //                 <BsFillBoxSeamFill className="text-gray-700 text-base shrink-0" />
//                             //                 My Order
//                             //             </button>

//                             //             <button
//                             //                 onClick={() => {
//                             //                     navigate("/profile/address")
//                             //                     setshowProfile(false);
//                             //                 }}
//                             //                 className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-4 sm:gap-6 px-5 sm:px-7 py-3 sm:py-4 border-b border-gray-200"
//                             //             >
//                             //                 <FaAddressBook className='text-gray-700 text-base shrink-0' />
//                             //                 My Addresses
//                             //             </button>

//                             //             <button
//                             //                 onClick={handleLogout}
//                             //                 disabled={loading}
//                             //                 className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-4 sm:gap-6 px-5 sm:px-7 py-3 sm:py-4 border-b border-gray-200" >
//                             //                 {
//                             //                     loading
//                             //                         ?
//                             //                         <AiOutlineLoading3Quarters className='animate-spin duration-100 shrink-0' />
//                             //                         :
//                             //                         <TbLogout className='text-gray-700 text-base shrink-0' />
//                             //                 }
//                             //                 Logout
//                             //             </button>

//                             //         </div>

//                             //     </div>

//                             // </div>

//                             <div className='flex items-center gap-2 sm:gap-3 relative'>

//                                 {/* Mobile par naam hide kiya hai space bachane ke liye, PC par dikhega */}
//                                 <p className='font-semibold text-sm sm:text-base hidden sm:block'>Hi, {user.first_name}</p>

//                                 <div style={{ display: showProfile ? "flex" : "none" }} onClick={() => setshowProfile(false)} className='fixed w-full h-full z-2 left-0 top-0'></div>

//                                 <button onClick={() => setshowProfile(!showProfile)} className='relative group cursor-pointer overflow-hidden z-5 rounded-full'>
//                                     {/* Mobile par profile pic thodi choti (h-8), desktop par badi (h-10) */}
//                                     <img src={user?.profile_pic || default_avatar} className='h-8 w-8 sm:h-10 sm:w-10 object-cover' alt="" />
//                                     <span className='absolute border -skew-x-30 -translate-x-10 group-hover:translate-x-10 duration-600 w-4 h-12 z-10 bg-gray-200/40 -top-2 left-2'></span>
//                                 </button>

//                                 {/* 🌟 TRUE RESPONSIVE CONTAINER: Width, placement, sab scaled */}
//                                 <div className={` ${showProfile ? "opacity-100 translate-y-0 z-50 pointer-events-auto" : "opacity-0 translate-y-5 -z-10 pointer-events-none"} duration-300 absolute bg-white text-black w-64 sm:w-80 lg:w-94 overflow-hidden rounded-xl -right-2 sm:right-0 top-[130%] sm:top-[120%] border border-gray-300 shadow-2xl `}>

//                                     {/* HEADER: Mobile par padding (py-3 px-4), gap (gap-3), image aur font size chote */}
//                                     <div className='flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-5 border-b border-b-gray-200'>
//                                         <img src={user.profile_pic || default_avatar} className='h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0' alt="" />
//                                         <div className="overflow-hidden">
//                                             <p className='text-xs sm:text-sm font-medium truncate'>{user.first_name + " " + user.last_name}</p>
//                                             <p className='text-mobile-1 sm:text-xs truncate text-gray-500'>{user.email}</p>
//                                         </div>
//                                     </div>

//                                     <div className='flex flex-col items-center text-mobile-2 sm:text-[13px] text-neutral-600'>

//                                         {/* BUTTONS: Mobile par padding (py-2.5 px-4), gap (gap-3), aur icons chhote */}
//                                         <button
//                                             onClick={() => {
//                                                 navigate("/profile")
//                                                 setshowProfile(false);
//                                             }}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3  sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200"
//                                         >
//                                             <FaUserCircle className='text-xs sm:text-base text-gray-700 shrink-0' />
//                                             Profile
//                                         </button>

//                                         <button
//                                             onClick={() => {
//                                                 navigate("/profile/orders")
//                                                 setshowProfile(false);
//                                             }}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3 sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200" >
//                                             <BsFillBoxSeamFill className="text-xs sm:text-base text-gray-700 shrink-0" />
//                                             My Order
//                                         </button>

//                                         <button
//                                             onClick={() => {
//                                                 navigate("/profile/address")
//                                                 setshowProfile(false);
//                                             }}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3 sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200"
//                                         >
//                                             <FaAddressBook className='text-xs sm:text-base text-gray-700 shrink-0' />
//                                             My Addresses
//                                         </button>

//                                         <button
//                                             onClick={handleLogout}
//                                             disabled={loading}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3 sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200" >
//                                             {
//                                                 loading
//                                                     ?
//                                                     <AiOutlineLoading3Quarters className='animate-spin duration-100 shrink-0 text-xs sm:text-base' />
//                                                     :
//                                                     <TbLogout className='text-xs sm:text-base text-gray-700 shrink-0' />
//                                             }
//                                             Logout
//                                         </button>

//                                     </div>

//                                 </div>

//                             </div>

//                         ) : (
//                             <div className='flex gap-1 md:gap-2'>
//                                 <Button onClick={() => navigate("/login")} variant="contained" size="small" className="rounded-full! shadow-none! capitalize! bg-gray-900! hover:bg-gray-800!" >
//                                     Login
//                                 </Button>
//                                 <Button onClick={() => navigate("/register")} variant="outlined" size="small" className="rounded-full! capitalize! hidden sm:flex border-gray-300! text-gray-700! hover:bg-gray-50!" >
//                                     Register
//                                 </Button>
//                             </div>
//                         )}

//                         {/* Cart Icon */}
//                         <IconButton onClick={() => navigate("/cart")} className="relative bg-gray-50! hover:bg-gray-100!">
//                             <ShoppingCartIcon size={22} className="text-gray-800" />
//                             <span className="absolute -top-1 -right-1 text-mobile-1 font-bold flex items-center justify-center rounded-full w-5 h-5 bg-red-500 text-white border-2 border-white">
//                                 {cart?.cart_items?.length || 0}
//                             </span>
//                         </IconButton>

//                         {/* 🌟 FIX: Mobile Menu Toggle Button */}
//                         <button
//                             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                             className="lg:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg bg-gray-50"
//                         >
//                             {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//                         </button>
//                     </div>
//                 </div>

//                 {/* 🌟 FIX: Mobile Menu Dropdown (Fully Functional) */}
//                 <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-100 opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
//                     <div className="pt-4 pb-2 border-t border-gray-100">

//                         {/* Mobile Search */}
//                         <div className="mb-4 px-2">
//                             <form onSubmit={handleSearch}>
//                                 <div className="relative">
//                                     <input
//                                         type="text"
//                                         placeholder="Search products..."
//                                         value={search}
//                                         onChange={handleSearchChange}
//                                         className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
//                                     />
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <IoSearchSharp className="text-gray-400 text-lg" />
//                                     </div>
//                                     <button type="submit" className="absolute inset-y-0 right-0 pr-4 flex items-center">
//                                         <BsArrowRight className="text-gray-600" />
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>

//                         {/* Mobile Navigation Links */}
//                         <div className="space-y-1 px-2 font-medium text-gray-700">
//                             <Link
//                                 to="/"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                                 className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
//                             >
//                                 <FaHome size={18} className="text-gray-400" /> Home
//                             </Link>
//                             <Link
//                                 to="/products"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                                 className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors"
//                             >
//                                 <FaShop size={18} className="text-gray-400" /> Categories / Shop
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;



// import { BsFillBoxSeamFill, BsArrowRight } from "react-icons/bs";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { Button, IconButton } from "@mui/material";
// import { ShoppingCartIcon } from "lucide-react";
// import React, { useContext, useState } from "react";
// import { IoSearchSharp } from "react-icons/io5";
// import { TbLogout } from "react-icons/tb";
// import { Link, useNavigate } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// import { logout } from "../auth";
// import { FaAddressBook, FaHome, FaShoppingCart, FaUserCircle } from "react-icons/fa";
// import { FaShop } from "react-icons/fa6";
// import { FiMenu, FiX } from "react-icons/fi";

// import logo from "../assets/shopix_logo.png";
// import default_avatar from "../assets/default-avatar.png";

// const Navbar = () => {
//     const [search, setSearch] = useState("");
//     const { cart } = useContext(CartContext);
//     const { user, fetchUser } = useContext(AuthContext);

//     const [showProfile, setshowProfile] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     const navigate = useNavigate();

//     const handleSearchChange = (e) => setSearch(e.target.value);

//     const handleLogout = () => {
//         setLoading(true);
//         setTimeout(() => {
//             logout();
//             fetchUser();
//             setLoading(false);
//             setshowProfile(false);
//         }, 2000);
//     };

//     const handleSearch = (e) => {
//         e.preventDefault();
//         if (search.trim()) {
//             navigate(`/products?q=${search}`);
//             setIsMobileMenuOpen(false);
//         }
//     };

//     return (
//         <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">

//             <div className="container mx-auto px-3 sm:px-4 lg:px-10">

//                 {/* ── Main Row ── */}
//                 <div className="flex justify-between items-center gap-2 sm:gap-4 py-3 lg:py-4">

//                     {/* Logo */}
//                     <Link to="/" className="flex items-center shrink-0">
//                         <img src={logo} className="h-7 sm:h-8 md:h-10" alt="Shopix Logo" />
//                     </Link>

//                     {/* Desktop Search Bar — hidden on mobile, visible md+ */}
//                     <div className="hidden md:flex flex-1 max-w-xs lg:max-w-lg mx-2 lg:mx-8">
//                         <form onSubmit={handleSearch} className="w-full">
//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     name="q"
//                                     placeholder="Search products..."
//                                     className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
//                                     value={search}
//                                     onChange={handleSearchChange}
//                                 />
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <IoSearchSharp className="text-gray-400 text-base" />
//                                 </div>
//                                 <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                     <BsArrowRight className="text-gray-600 hover:text-blue-600 transition-colors text-lg" />
//                                 </button>
//                             </div>
//                         </form>
//                     </div>

//                     {/* Desktop Nav Links — lg+ only */}
//                     <div className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700 shrink-0">
//                         <Link to="/" className="hover:text-blue-600 transition-colors inline-flex items-center gap-2 text-sm">
//                             <FaHome size={16} /> Home
//                         </Link>
//                         <Link to="/products/" className="hover:text-blue-600 transition-colors inline-flex items-center gap-2 text-sm">
//                             <FaShop size={16} /> Shop
//                         </Link>
//                     </div>

//                     {/* Spacer — pushes right actions to end on mobile */}
//                     <div className="flex-1 md:hidden" />

//                     {/* ── Right Actions ── */}
//                     <div className="flex items-center gap-1 sm:gap-2 shrink-0">

//                         {/* Auth / Profile */}
//                         {user ? (

//                             // <div className="flex items-center gap-1 sm:gap-2 relative">

//                             //     {/* Name — hidden on small screens */}
//                             //     <p className="font-semibold text-sm hidden sm:block truncate max-w-[80px] lg:max-w-none">
//                             //         Hi, {user.first_name}
//                             //     </p>

//                             //     {/* Backdrop to close dropdown */}
//                             //     <div
//                             //         style={{ display: showProfile ? "flex" : "none" }}
//                             //         onClick={() => setshowProfile(false)}
//                             //         className="fixed inset-0 z-20"
//                             //     />

//                             //     {/* Avatar Button */}
//                             //     <button
//                             //         onClick={() => setshowProfile(!showProfile)}
//                             //         className="relative group cursor-pointer overflow-hidden z-30 rounded-full shrink-0"
//                             //     >
//                             //         <img
//                             //             src={user?.profile_pic || default_avatar}
//                             //             className="h-8 w-8 sm:h-9 sm:w-9 object-cover rounded-full"
//                             //             alt="Profile"
//                             //         />
//                             //         <span className="absolute border -skew-x-30 -translate-x-10 group-hover:translate-x-10 duration-500 w-4 h-12 z-10 bg-gray-200/40 -top-2 left-2" />
//                             //     </button>

//                             //     {/* Profile Dropdown */}
//                             //     <div className={`
//                             //         ${showProfile
//                             //             ? "opacity-100 translate-y-0 z-50 pointer-events-auto"
//                             //             : "opacity-0 translate-y-3 -z-10 pointer-events-none"
//                             //         }
//                             //         duration-200 absolute bg-white text-black
//                             //         w-60 sm:w-72 lg:w-80
//                             //         overflow-hidden rounded-xl
//                             //         right-0 top-[calc(100%+10px)]
//                             //         border border-gray-200 shadow-2xl
//                             //     `}>

//                             //         {/* Dropdown Header */}
//                             //         <div className="flex items-center gap-3 py-3 px-4 border-b border-gray-100 bg-gray-50">
//                             //             <img
//                             //                 src={user.profile_pic || default_avatar}
//                             //                 className="h-9 w-9 rounded-full shrink-0 object-cover"
//                             //                 alt=""
//                             //             />
//                             //             <div className="overflow-hidden">
//                             //                 <p className="text-sm font-semibold truncate text-gray-800">
//                             //                     {user.first_name} {user.last_name}
//                             //                 </p>
//                             //                 <p className="text-xs truncate text-gray-500">{user.email}</p>
//                             //             </div>
//                             //         </div>

//                             //         {/* Dropdown Items */}
//                             //         {[
//                             //             { icon: <FaUserCircle />, label: "Profile", path: "/profile" },
//                             //             { icon: <BsFillBoxSeamFill />, label: "My Orders", path: "/profile/orders" },
//                             //             { icon: <FaAddressBook />, label: "My Addresses", path: "/profile/address" },
//                             //         ].map(({ icon, label, path }) => (
//                             //             <button
//                             //                 key={path}
//                             //                 onClick={() => { navigate(path); setshowProfile(false); }}
//                             //                 className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
//                             //             >
//                             //                 <span className="text-gray-400 text-base shrink-0">{icon}</span>
//                             //                 {label}
//                             //             </button>
//                             //         ))}

//                             //         <button
//                             //             onClick={handleLogout}
//                             //             disabled={loading}
//                             //             className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
//                             //         >
//                             //             {loading
//                             //                 ? <AiOutlineLoading3Quarters className="animate-spin text-base shrink-0" />
//                             //                 : <TbLogout className="text-base shrink-0" />
//                             //             }
//                             //             Logout
//                             //         </button>

//                             //     </div>
//                             // </div>

//                             <div className='flex items-center gap-2 sm:gap-3 relative'>

//                                 {/* Mobile par naam hide kiya hai space bachane ke liye, PC par dikhega */}
//                                 <p className='font-semibold text-sm sm:text-base hidden sm:block'>Hi, {user.first_name}</p>

//                                 <div style={{ display: showProfile ? "flex" : "none" }} onClick={() => setshowProfile(false)} className='fixed w-full h-full z-2 left-0 top-0'></div>

//                                 <button onClick={() => setshowProfile(!showProfile)} className='relative group cursor-pointer overflow-hidden z-5 rounded-full'>
//                                     {/* Mobile par profile pic thodi choti (h-8), desktop par badi (h-10) */}
//                                     <img src={user?.profile_pic || default_avatar} className='h-7 w-7 sm:h-8 sm:w-8 object-cover' alt="" />
//                                     <span className='absolute border -skew-x-30 -translate-x-10 group-hover:translate-x-10 duration-600 w-4 h-12 z-10 bg-gray-200/40 -top-2 left-2'></span>
//                                 </button>

//                                 {/* 🌟 TRUE RESPONSIVE CONTAINER: Width, placement, sab scaled */}
//                                 <div className={` ${showProfile ? "opacity-100 translate-y-0 z-50 pointer-events-auto" : "opacity-0 translate-y-5 -z-10 pointer-events-none"} duration-300 absolute bg-white text-black w-64 sm:w-80 lg:w-94 overflow-hidden rounded-xl -right-2 sm:right-0 top-[130%] sm:top-[120%] border border-gray-300 shadow-2xl `}>

//                                     {/* HEADER: Mobile par padding (py-3 px-4), gap (gap-3), image aur font size chote */}
//                                     <div className='flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-5 border-b border-b-gray-200'>
//                                         <img src={user.profile_pic || default_avatar} className='h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0' alt="" />
//                                         <div className="overflow-hidden">
//                                             <p className='text-xs sm:text-sm font-medium truncate'>{user.first_name + " " + user.last_name}</p>
//                                             <p className='text-mobile-1 sm:text-xs truncate text-gray-500'>{user.email}</p>
//                                         </div>
//                                     </div>

//                                     <div className='flex flex-col items-center text-mobile-2 sm:text-[13px] text-neutral-600'>

//                                         {/* BUTTONS: Mobile par padding (py-2.5 px-4), gap (gap-3), aur icons chhote */}
//                                         <button
//                                             onClick={() => {
//                                                 navigate("/profile")
//                                                 setshowProfile(false);
//                                             }}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3  sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200"
//                                         >
//                                             <FaUserCircle className='text-xs sm:text-base text-gray-700 shrink-0' />
//                                             Profile
//                                         </button>

//                                         <button
//                                             onClick={() => {
//                                                 navigate("/profile/orders")
//                                                 setshowProfile(false);
//                                             }}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3 sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200" >
//                                             <BsFillBoxSeamFill className="text-xs sm:text-base text-gray-700 shrink-0" />
//                                             My Order
//                                         </button>

//                                         <button
//                                             onClick={() => {
//                                                 navigate("/profile/address")
//                                                 setshowProfile(false);
//                                             }}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3 sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200"
//                                         >
//                                             <FaAddressBook className='text-xs sm:text-base text-gray-700 shrink-0' />
//                                             My Addresses
//                                         </button>

//                                         <button
//                                             onClick={handleLogout}
//                                             disabled={loading}
//                                             className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-3 sm:gap-6 px-4 sm:px-7 py-2.5 sm:py-4 border-b border-gray-200" >
//                                             {
//                                                 loading
//                                                     ?
//                                                     <AiOutlineLoading3Quarters className='animate-spin duration-100 shrink-0 text-xs sm:text-base' />
//                                                     :
//                                                     <TbLogout className='text-xs sm:text-base text-gray-700 shrink-0' />
//                                             }
//                                             Logout
//                                         </button>

//                                     </div>

//                                 </div>

//                             </div>

//                         ) : (
//                             <div className="flex gap-1 sm:gap-2">
//                                 <Button
//                                     onClick={() => navigate("/login")}
//                                     variant="contained"
//                                     size="small"
//                                     className="rounded-full! shadow-none! capitalize! bg-gray-900! hover:bg-gray-800! text-xs! sm:text-sm!"
//                                 >
//                                     Login
//                                 </Button>
//                                 <Button
//                                     onClick={() => navigate("/register")}
//                                     variant="outlined"
//                                     size="small"
//                                     className="rounded-full! capitalize! hidden sm:flex! border-gray-300! text-gray-700! hover:bg-gray-50! text-xs! sm:text-sm!"
//                                 >
//                                     Register
//                                 </Button>
//                             </div>
//                         )}

//                         {/* Cart */}

//                         <IconButton onClick={() => navigate("/cart")} className="relative bg-gray-50! hover:bg-gray-100!">

//                             <FiShoppingCart className="text-gray-800 text-lg sm:text-xl" />

//                             <span className="absolute -top-1 -right-1 text-mobile-1 font-bold flex items-center justify-center rounded-full w-5 h-5 bg-red-500 text-white border-2 border-white">
//                                 {cart?.cart_items?.length || 0}
//                             </span>

//                         </IconButton>

//                         {/* Mobile Menu Toggle */}
//                         <button
//                             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                             className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
//                             aria-label="Toggle menu"
//                         >
//                             {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
//                         </button>

//                     </div>

//                 </div>

//                 {/* ── Mobile Dropdown Menu ── */}
//                 <div className={`
//                     lg:hidden overflow-hidden transition-all duration-300 ease-in-out
//                     ${isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"}
//                 `}>
//                     <div className="border-t border-gray-100 pt-3 space-y-1">

//                         {/* Mobile Search */}
//                         <div className="md:hidden px-1 pb-2">
//                             <form onSubmit={handleSearch}>
//                                 <div className="relative">
//                                     <input
//                                         type="text"
//                                         placeholder="Search products..."
//                                         value={search}
//                                         onChange={handleSearchChange}
//                                         className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
//                                     />
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <IoSearchSharp className="text-gray-400 text-base" />
//                                     </div>
//                                     <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                         <BsArrowRight className="text-gray-500 text-lg" />
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>

//                         {/* Mobile Nav Links */}
//                         <Link
//                             to="/"
//                             onClick={() => setIsMobileMenuOpen(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//                         >
//                             <FaHome size={16} className="text-gray-400 shrink-0" /> Home
//                         </Link>
//                         <Link
//                             to="/products"
//                             onClick={() => setIsMobileMenuOpen(false)}
//                             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
//                         >
//                             <FaShop size={16} className="text-gray-400 shrink-0" /> Shop
//                         </Link>

//                     </div>
//                 </div>

//             </div>
//         </nav>
//     );
// };

// export default Navbar;




import { BsFillBoxSeamFill, BsArrowRight } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, IconButton } from "@mui/material";
import { ShoppingCartIcon, HeartIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../auth";
import { FaAddressBook, FaHome, FaUserCircle } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { FiMenu, FiX } from "react-icons/fi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BsHeart } from 'react-icons/bs';

import logo from "../assets/shopix_logo.png";
import default_avatar from "../assets/default-avatar.png";

// NavLink active class helper
const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 text-sm font-medium transition-colors ${isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-600"
    }`;

// Mobile NavLink class helper
const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
        ? "bg-blue-50 text-blue-600 font-semibold"
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

const Navbar = () => {
    const [search, setSearch] = useState("");
    const { cart } = useContext(CartContext);
    const { user, fetchUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            logout();
            fetchUser();
            setLoading(false);
            closeMobileMenu();
        }, 2000);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/products?q=${search}`);
            closeMobileMenu();
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (isMobileMenuOpen) {
                closeMobileMenu();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isMobileMenuOpen]);

    return (

        <>

            {/* Backdrop overlay when menu is open */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}


            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="container mx-auto px-3 sm:px-4 lg:px-10">

                    {/* ── Main Row ── */}
                    {/* <div className="flex justify-between items-center gap-2 sm:gap-3 py-3 lg:py-4"> */}
                    <div className="flex justify-between items-center gap-2 sm:gap-3 py-3 lg:py-4 relative bg-white z-50">

                        {/* Logo */}
                        <Link to="/" className="flex items-center shrink-0">
                            <img src={logo} className="h-7 sm:h-8 md:h-10" alt="Shopix Logo" />
                        </Link>

                        {/* Desktop Search Bar — md and above */}
                        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-lg mx-2 lg:mx-8">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="Search products..."
                                        className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <IoSearchSharp className="text-gray-400 text-base" />
                                    </div>
                                    <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <BsArrowRight className="text-gray-600 hover:text-blue-600 transition-colors text-lg" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Desktop Nav Links — lg+ */}
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0">
                            <NavLink to="/" end className={navLinkClass}>
                                <FaHome size={16} /> Home
                            </NavLink>
                            <NavLink to="/products/" className={navLinkClass}>
                                <FaShop size={16} /> Shop
                            </NavLink>
                            {user && (
                                <NavLink to="/profile/orders" className={navLinkClass}>
                                    <MdOutlineLocalShipping size={17} /> Orders
                                </NavLink>
                            )}
                        </div>

                        {/* Spacer on mobile */}
                        <div className="flex-1 md:hidden" />

                        {/* ── Right Actions ── */}
                        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">

                            {/* Wishlist Icon */}
                            <Link to="/wishlist">
                                <IconButton
                                    onClick={() => navigate("/wishlist")}
                                    size="small"
                                    className="relative hover:bg-gray-100!"
                                    aria-label="Wishlist"
                                >
                                    <HeartIcon size={20} className="text-gray-700" />
                                </IconButton>
                            </Link>


                            {/* Navbar ke right side icons me add karo */}
                            {/* <Link to="/wishlist" className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition">
                                <BsHeart className="text-xl sm:text-2xl" /> 
                            </Link> */} 

                            {/* Cart Icon */} 
                            <IconButton 
                                onClick={() => navigate("/cart")}
                                size="small"
                                className="relative hover:bg-gray-100!"
                                aria-label="Cart"
                            >
                                <ShoppingCartIcon size={20} className="text-gray-700" />
                                {cart?.cart_items?.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 text-mobile-1 font-bold flex items-center justify-center rounded-full w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white border-2 border-white leading-none">
                                        {cart.cart_items.length}
                                    </span>
                                )}
                            </IconButton>

                            {/* Auth — Desktop: Login/Register buttons OR Avatar */}
                            {user ? (
                                /* Avatar — tapping goes directly to profile on all screens */
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="relative group cursor-pointer overflow-hidden rounded-full shrink-0 ml-1"
                                    aria-label="Go to profile"
                                >
                                    <img
                                        src={user?.profile_pic || default_avatar}
                                        className="h-8 w-8 sm:h-9 sm:w-9 object-cover rounded-full"
                                        alt="Profile"
                                    />
                                    <span className="absolute border -skew-x-30 -translate-x-10 group-hover:translate-x-10 duration-500 w-4 h-12 z-10 bg-gray-200/40 -top-2 left-2" />
                                </button>
                            ) : (
                                <div className="flex gap-1 sm:gap-2 ml-1">
                                    <Button
                                        onClick={() => navigate("/login")}
                                        variant="contained"
                                        size="small"
                                        className="rounded-full! shadow-none! capitalize! bg-gray-900! hover:bg-gray-800! text-xs! sm:text-sm!"
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/register")}
                                        variant="outlined"
                                        size="small"
                                        className="rounded-full! capitalize! hidden sm:flex! border-gray-300! text-gray-700! hover:bg-gray-50! text-xs! sm:text-sm!"
                                    >
                                        Register
                                    </Button>
                                </div>
                            )}

                            {/* Hamburger — mobile/tablet only */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-1.5 sm:p-2 ml-1 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>
                    </div>

                    {/* ── Mobile / Tablet Dropdown Menu ── */}
                    {/* <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[80vh] overflow-y-auto opacity-100 pb-4" : "max-h-0 opacity-0"}`}> */}
                    <div className={`absolute top-full left-0 w-full bg-white shadow-xl lg:hidden overflow-hidden transition-all duration-300 ease-in-out z-40 border-b border-gray-100 ${isMobileMenuOpen ? "max-h-[80vh] overflow-y-auto opacity-100 pb-4" : "max-h-0 opacity-0 border-transparent shadow-none"}`}>

                        {/* 🌟 Inner wrapper: Container padding match karne ke liye */}
                        <div className="container mx-auto px-3 sm:px-4">


                            <div className="border-t border-gray-100 pt-3 space-y-0.5">

                                {/* Mobile Search — only shown below md */}
                                <div className="md:hidden px-1 pb-3">
                                    <form onSubmit={handleSearch}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={search}
                                                onChange={handleSearchChange}
                                                className="w-full px-4 py-2.5 pl-10 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <IoSearchSharp className="text-gray-400 text-base" />
                                            </div>
                                            <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <BsArrowRight className="text-gray-500 text-lg" />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Mobile Nav Links */}
                                <NavLink to="/" end className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                    <FaHome size={16} className="shrink-0" /> Home
                                </NavLink>
                                <NavLink to="/products" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                    <FaShop size={16} className="shrink-0" /> Shop
                                </NavLink>
                                <NavLink to="/wishlist" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                    <HeartIcon size={16} className="shrink-0" /> Wishlist
                                </NavLink>

                                {/* ── User Section (only when logged in) ── */}
                                {user && (
                                    // <>
                                    //     {/* Divider with user info */}
                                    //     <div className="pt-3 pb-1 px-3">
                                    //         <div className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-lg border border-gray-100">
                                    //             <img
                                    //                 src={user.profile_pic || default_avatar}
                                    //                 className="h-9 w-9 rounded-full shrink-0 object-cover"
                                    //                 alt=""
                                    //             />
                                    //             <div className="overflow-hidden">
                                    //                 <p className="text-sm font-semibold text-gray-800 truncate">
                                    //                     {user.first_name} {user.last_name}
                                    //                 </p>
                                    //                 <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    //             </div>
                                    //         </div>
                                    //     </div>

                                    //     <NavLink to="/profile" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                    //         <FaUserCircle size={16} className="shrink-0" /> Profile
                                    //     </NavLink>
                                    //     <NavLink to="/profile/orders" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                    //         <MdOutlineLocalShipping size={17} className="shrink-0" /> My Orders
                                    //     </NavLink>
                                    //     <NavLink to="/profile/address" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                    //         <FaAddressBook size={15} className="shrink-0" /> My Addresses
                                    //     </NavLink>

                                    //     {/* Logout */}
                                    //     <button
                                    //         onClick={handleLogout}
                                    //         disabled={loading}
                                    //         className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                                    //     >
                                    //         {loading
                                    //             ? <AiOutlineLoading3Quarters className="animate-spin text-base shrink-0" />
                                    //             : <TbLogout size={17} className="shrink-0" />
                                    //         }
                                    //         Logout
                                    //     </button>
                                    // </>

                                    <>
                                        <NavLink to="/profile" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                            <FaUserCircle size={16} className="shrink-0" /> Profile
                                        </NavLink>
                                        <NavLink to="/profile/orders" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                            <MdOutlineLocalShipping size={17} className="shrink-0" /> My Orders
                                        </NavLink>
                                        <NavLink to="/profile/address" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                                            <FaAddressBook size={15} className="shrink-0" /> My Addresses
                                        </NavLink>

                                        {/* Logout */}
                                        <button
                                            onClick={handleLogout}
                                            disabled={loading}
                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                                        >
                                            {loading
                                                ? <AiOutlineLoading3Quarters className="animate-spin text-base shrink-0" />
                                                : <TbLogout size={17} className="shrink-0" />
                                            }
                                            Logout
                                        </button>
                                    </>


                                )}

                                {/* Guest CTA in mobile menu */}
                                {!user && (
                                    <div className="flex gap-2 pt-3 px-1">
                                        <Button
                                            onClick={() => { navigate("/login"); closeMobileMenu(); }}
                                            variant="contained"
                                            fullWidth
                                            className="rounded-lg! shadow-none! capitalize! bg-gray-900! hover:bg-gray-800!"
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            onClick={() => { navigate("/register"); closeMobileMenu(); }}
                                            variant="outlined"
                                            fullWidth
                                            className="rounded-lg! capitalize! border-gray-300! text-gray-700! hover:bg-gray-50!"
                                        >
                                            Register
                                        </Button>
                                    </div>
                                )}

                            </div>

                        </div>


                    </div>

                </div>
            </nav>
        </>
    );
};

export default Navbar;