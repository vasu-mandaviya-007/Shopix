import React, { useEffect, useRef, useState } from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { LiaAngleLeftSolid, LiaAngleRightSolid } from 'react-icons/lia';
import { Button, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { formatPriceINR } from '../utils/formatPriceINR';
import axios from 'axios';
import API_BASE_URL from '../config/config';
import banner_bg from "../assets/banner_bg.jpeg"


const Hero = () => {

    const [banners, setBanners] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchBanners = async () => {

            setLoading(true)

            try {

                const response = await axios.get(`${API_BASE_URL}/api/products/banners`)

                setBanners(response.data.banners)

                console.log("Fetched Banners:", response.data.banners)


            } catch (error) {

                console.log(error)

            } finally {
                setLoading(false)
            }

        }

        fetchBanners();

    }, [])


    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (

        loading ? (
            // 🌟 1. SKELETON RESPONSIVE FIX
            // Swiper ek full-width block hai, toh skeleton bhi full-width hona chahiye taaki layout jump na ho
            <div className="mb-10 lg:mb-20 mt-6 lg:mt-10">
                <Skeleton height={500} className='w-full rounded-2xl transform-none!' />
            </div>
        ) : (
            <div className="w-full mt-6 lg:mt-10 mb-10 lg:mb-20 relative group">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{ clickable: true }}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    modules={[Pagination, Navigation]}
                    className="mySwiper relative rounded-2xl overflow-hidden shadow-sm"
                >
                    <button ref={prevRef} className="custom-prev hidden sm:flex absolute left-4 z-20"><LiaAngleLeftSolid /></button>
                    <button ref={nextRef} className="custom-next hidden sm:flex absolute right-4 z-20"><LiaAngleRightSolid /></button>

                    {banners?.map((banner) => (
                        <SwiperSlide key={banner?.id}>
                            <div
                                style={{ 
                                    backgroundImage: `url(${banner_bg})`, 
                                    backgroundRepeat: "no-repeat", 
                                    backgroundSize: "cover",
                                    backgroundPosition: "center" // Center image on all screens
                                }}
                                // 🌟 2. HEIGHT & PADDING FIX
                                // Exact pixel height di hai taaki kabhi layout break na ho
                                className={`w-full min-h-112.5 md:min-h-110 lg:min-h-137.5 flex flex-col-reverse md:flex-row items-center justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-10 md:py-0`}
                            >
                                {/* LEFT SECTION: TEXT & CTA */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left z-10 mt-6 md:mt-0">
                                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/70 text-gray-800 font-bold text-mobile-1 sm:text-xs tracking-widest uppercase mb-4 w-max mx-auto md:mx-0 backdrop-blur-sm border border-white/50">
                                        {banner.tag}
                                    </span>

                                    {/* Text scaling based on screen size */}
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3 lg:mb-5">
                                        {banner.title}
                                    </h1>

                                    <p className="text-sm sm:text-base text-gray-700 mb-6 lg:mb-8 max-w-md mx-auto md:mx-0 font-medium line-clamp-3">
                                        {banner.subtitle}
                                    </p>

                                    <div>
                                        <Link
                                            to={banner.cta_link}
                                            className="inline-flex z-20 items-center gap-2 bg-gray-900 text-white font-bold text-sm md:text-lg px-6 md:px-8 py-3 md:py-3.5 rounded-full hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1"
                                        >
                                            Explore Category
                                        </Link>
                                    </div>
                                </div>

                                {/* RIGHT SECTION: PRODUCT IMAGE */}
                                {/* Mobile par minimum height di hai taaki image daba hua na lage */}
                                <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-10 relative h-62.5 sm:h-75 md:h-auto">
                                    
                                    <img
                                        src={banner.product_image}
                                        alt={banner.title}
                                        className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 z-10"
                                    />

                                    {/* 🌟 3. BADGE RESPONSIVE FIX */}
                                    {/* Mobile par padding aur text chota kiya hai */}
                                    <div className="absolute top-0 right-2 sm:top-5 sm:right-5 md:top-10 md:right-10 bg-white px-3 py-2 md:px-5 md:py-4 rounded-lg shadow-2xl z-20 animate-bounce animate-duration-[3000ms]">
                                        <p className="text-9px md:text-xs text-gray-500 font-bold uppercase tracking-wider text-center mb-1">Starting At</p>
                                        <p className="text-lg sm:text-xl md:text-2xl font-extrabold text-blue-600">{formatPriceINR(banner.price)}</p>
                                        {banner.mrp > banner.price && (
                                            <p className="text-mobile-1 md:text-xs text-gray-400 line-through text-center">{formatPriceINR(banner.mrp)}</p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        )
    )

}

export default Hero
