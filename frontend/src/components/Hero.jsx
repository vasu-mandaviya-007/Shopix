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

        loading
            ?
            <div className="mb-20 mt-10">

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* 🔹 Slider */}
                    <div className="w-full lg:w-2/3">

                        <Skeleton height={525} className='w-full transform-none!' />

                    </div>


                    <div className="w-full lg:w-1/3 grid grid-cols-2 lg:grid-cols-1 gap-4">

                        <Skeleton className='w-full transform-none!' />
                        <Skeleton className='w-full transform-none!' />

                    </div>


                </div>

            </div>
            :
            <div className="w-full mt-10 mb-20 relative group">
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
                    className="mySwiper relative"

                >
                    <button ref={prevRef} className="custom-prev hidden! sm:flex!"><LiaAngleLeftSolid /></button>
                    <button ref={nextRef} className="custom-next hidden! sm:flex!"><LiaAngleRightSolid /></button>

                    {banners.map((banner) => (

                        <SwiperSlide key={banner.id}>


                            <div
                                style={{ backgroundImage: `url(${banner_bg})`, backgroundRepeat : "no-repeat" , backgroundSize : "cover" }}
                                className={`w-full h-full min-h-130 md:min-h-143 flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-24`}
                            >

                                {/* TEXT & CTA SECTION (Left Template) */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left z-10 pb-8 md:pb-0">
                                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/60 text-gray-800 font-bold text-xs tracking-widest uppercase mb-4 w-max mx-auto md:mx-0 backdrop-blur-sm border border-white/50">
                                        {banner.tag}
                                    </span>

                                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
                                        {banner.title}
                                    </h1>

                                    <p className="text-gray-700 text-base mb-8 max-w-md mx-auto md:mx-0 font-medium">
                                        {banner.subtitle}
                                    </p>

                                    <div>
                                        {/* Link Category par ja raha hai, exactly like Flipkart */}
                                        <Link
                                            to={banner.cta_link}
                                            className="inline-flex z-20 items-center gap-2 bg-gray-900 text-white font-bold text-lg px-8 py-3.5 rounded-full hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1"
                                        >
                                            {"Explore Category"}
                                        </Link>
                                    </div>
                                </div>

                                {/* PRODUCT INJECTION SECTION (Right Template) */}
                                <div className="w-full md:w-1/2 flex items-center justify-center p-10 relative">
                                    {/* The Dynamic Image */}
                                    <img
                                        src={banner.product_image}
                                        alt={banner.title}
                                        className="max-w-full max-h-full object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.20)] hover:scale-105 transition-transform duration-700 z-10"
                                    />

                                    {/* The Floating Price Tag Badge (Crucial for Conversion!) */}
                                    <div className="absolute top-10 right-10 md:top-20 md:right-20 bg-white px-5 py-4 rounded-lg shadow-2xl z-20 animate-bounce animate-duration-[3000ms]">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider text-center mb-1">Starting At</p>
                                        <p className="text-2xl font-extrabold text-blue-600">{formatPriceINR(banner.price)}</p>
                                        {banner.mrp > banner.price && (
                                            <p className="text-xs text-gray-400 line-through text-center">{formatPriceINR(banner.mrp)}</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

    )
}

export default Hero
