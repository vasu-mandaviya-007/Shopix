import { BsFillBoxSeamFill } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, IconButton } from "@mui/material";
import { ShoppingCartIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { IoSearchSharp } from "react-icons/io5";
import {TbLogout } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { logout } from "../auth";
import { FaAddressBook, FaHome, FaUserCircle } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import logo from "../assets/shopix_logo.png"
import default_avatar from "../assets/default-avatar.png"

const Navbar = () => {

    const [search, setSearch] = useState("");

    const { cart } = useContext(CartContext);
    const { user, fetchUser } = useContext(AuthContext);
    const [showProfile, setshowProfile] = useState(false);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleLogout = () => {

        setLoading(true);

        setTimeout(() => {
            logout();
            fetchUser();
            setLoading(false)
        }, 2000);

    }

    const handleSearch = (e) => {

        e.preventDefault();
        navigate(`/products?q=${search}`);

    };

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">

            <div className="container mx-auto px-4">

                <div className="flex justify-between items-center py-3 lg:py-4">

                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-600">
                            <img src={logo} className="h-8 md:h-10" alt="Shopix Logo" />
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8">
                        <form
                            onSubmit={handleSearch}
                            method="get"
                            className="w-full"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Search products..."
                                    className="w-full px-4 py-1.5 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <IoSearchSharp className="text-gray-500 text-lg font-semibold" />
                                </div>
                                <button
                                    type="submit"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <BsArrowRight className="text-primary-600 hover:text-primary-700 transition-colors" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link to={"/"} className="navbar-link inline-flex items-center gap-2">
                            <FaHome size={18} /> Home
                        </Link>
                        <Link to={"/products/"} className="navbar-link inline-flex items-center gap-2">
                            <FaShop size={18} /> Shop
                        </Link>
                        {/* {% if user.is_authenticated %}
                        <a
                            href=""
                            className="navbar-link"
                        >
                            <i className="fas fa-history mr-2"></i>Orders
                        </a>
                        <a
                            href="{% url 'profile' %}"
                            className="navbar-link"
                        >
                            <i className="fas fa-user mr-2"></i>Profile
                        </a>
                        {% endif %} */}
                    </div>

                    {/* Cart and User Actions */}
                    <div className="flex items-center space-x-4">


                        {user
                            ?
                            // <div className='flex gap-4 items-center'>
                            //     <Button onClick={() => { logout(), fetchUser() }} variant="contained" className="max-md:text-sm! rounded-full! " >
                            //         Logout
                            //     </Button>
                            // </div>
                            <div className='flex items-center gap-3 relative'>

                                <p className='font-semibold'>Hi, {user.first_name}</p>

                                <div style={{ display: showProfile ? "flex" : "none" }} onClick={() => setshowProfile(false)} className='fixed w-full h-full  z-2 left-0 top-0'></div>

                                <button onClick={() => setshowProfile(!showProfile)} className='relative group cursor-pointer overflow-hidden z-5 rounded-full'>
                                    <img src={user?.profile_pic || default_avatar} className='h-8 w-8' alt="" />
                                    <span className='absolute border -skew-x-30 -translate-x-10 group-hover:translate-x-10 duration-600 w-4 h-12 z-10 bg-gray-200/40 -top-2 left-2'></span>
                                </button>

                                <div className={` ${showProfile ? "opacity-100 translate-y-0 z-10 pointer-events-auto" : "opacity-0 translate-y-5 -z-10 pointer-events-none"} duration-300 absolute bg-white text-black w-94 overflow-hidden rounded-xl right-0 top-[120%] border border-gray-300 shadow-2xl `}>

                                    <div className='flex items-center gap-4 py-3.5 px-4 border-b border-b-gray-200'>
                                        <img src={user.profile_pic || default_avatar} className='h-10 w-10 rounded-full' alt="" />
                                        <div>
                                            <p className='text-sm font-medium'>{user.first_name + " " + user.last_name}</p>
                                            <p className='text-xs'>{user.email}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col items-center text-[13px] text-neutral-600'>

                                        <button
                                            onClick={() => {
                                                navigate("/profile")
                                                setshowProfile(false);
                                            }}
                                            className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-6 px-7 py-4 border-b border-gray-200"
                                        >
                                            <FaUserCircle className='text-gray-700 text-base' />
                                            Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/profile/orders")
                                                setshowProfile(false);
                                            }}
                                            className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-6 px-7 py-4 border-b border-gray-200" >
                                            <BsFillBoxSeamFill className="text-gray-700 text-base" />
                                            My Order
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/profile/address")
                                                setshowProfile(false);
                                            }}
                                            className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-6 px-7 py-4 border-b border-gray-200"
                                        >
                                            <FaAddressBook className='text-gray-700 text-base' />
                                            My Addresses
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            disabled={loading}
                                            className="flex cursor-pointer items-center hover:bg-gray-100 w-full gap-6 px-7 py-4 border-b border-gray-200" >
                                            {
                                                loading
                                                    ?
                                                    <AiOutlineLoading3Quarters className='animate-spin duration-100' />
                                                    :
                                                    <TbLogout className='text-gray-700 text-base' />
                                            }
                                            Logout
                                        </button>

                                    </div>

                                </div>

                            </div>
                            :
                            <div className='flex gap-2'>

                                <Button onClick={() => navigate("/login")} variant="contained" className="max-md:text-sm! rounded-full! " >
                                    Login
                                </Button>
                                <Button onClick={() => navigate("/register")} variant="outlined" className="max-md:text-sm! rounded-full!" >
                                    Register
                                </Button>

                                {/* <button onClick={() => navigate("/login")} className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                    Login
                                </button>
                                <button onClick={() => navigate("/register")} className="cursor-pointer px-8 py-2 border border-indigo-500 hover:text-white text-indigo-500 hover:bg-indigo-500 transition rounded-full">
                                    Register
                                </button> */}
                            </div>
                        }

                        <IconButton onClick={() => navigate("/cart")} className="ml-4! relative ">
                            <ShoppingCartIcon fontSize="small" />
                            <span className="absolute -top-1 right-0 text-xs flex items-center justify-center rounded-full w-5 h-5 border bg-primary-500 text-white">
                                {cart?.cart_items?.length || 0}
                            </span>
                            {/* <CartBadge badgeContent={2} color="primary" overlap="circular" /> */}
                        </IconButton>

                        {/* {% endif %} */}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden text-gray-700 hover:text-primary-600 transition-colors"
                            id="mobile-menu-toggle"
                        >
                            <i className="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden hidden" id="mobile-menu">
                    <div className="py-4 border-t border-gray-200">
                        {/* Mobile Search */}
                        <div className="mb-4">
                            <form action="{% url 'products:search' %}" method="get">
                                <div className="relative">
                                    {/* <input
                                        type="text"
                                        name="q"
                                        placeholder="Search products..."
                                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        value="{{ request.GET.q|default:'' }}"
                                    /> */}
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fas fa-search text-gray-400"></i>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Mobile Navigation Links */}
                        <div className="space-y-2">
                            <a
                                href="{% url 'home' %}"
                                className="block py-2 text-gray-700 hover:text-primary-600"
                            >
                                <i className="fas fa-home mr-2"></i>Home
                            </a>
                            <a
                                href="{% url 'products:categories' %}"
                                className="block py-2 text-gray-700 hover:text-primary-600"
                            >
                                <i className="fas fa-th-large mr-2"></i>Categories
                            </a>
                            {/* {% if user.is_authenticated %}
                            <a
                                href=""
                                className="block py-2 text-gray-700 hover:text-primary-600"
                            >
                                <i className="fas fa-history mr-2"></i
                                >Orders
                            </a>
                            <a
                                href="{% url 'profile' %}"
                                className="block py-2 text-gray-700 hover:text-primary-600"
                            >
                                <i className="fas fa-user mr-2"></i>Profile
                            </a>
                            {% endif %} */}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
