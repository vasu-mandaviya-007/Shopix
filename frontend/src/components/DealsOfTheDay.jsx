import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductCard from './ProductCard';
import SpecListLayout from './layout/SpecListLayout';
import { Link, useNavigate } from 'react-router-dom';
import { formatPriceINR } from '../utils/formatPriceINR';
import { LiaAngleLeftSolid, LiaAngleRightSolid } from "react-icons/lia";
import axios from "axios";
import API_BASE_URL from "../config/config";

const DealsOfTheDay = () => {

    // const { products } = useContext(ShopContext);

    const scrollRef = useRef(null);

    const [showLeft, setShowLeft] = useState(false)
    const [showRight, setShowRight] = useState(true)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const fetchDeals = async () => {

            setLoading(true)

            try {

                const response = await axios.get(`${API_BASE_URL}/api/products/deals-of-the-day/`);

                setProducts(response.data.deals_of_the_day || [])

            } catch (error) {

                console.error("Error fetching deals of the day:", error);

            } finally {
                setLoading(false)
            }
        }

        fetchDeals();

    }, [])

    const handleNext = () => {

        scrollRef.current.scrollBy({
            left: 250,
            behavior: 'smooth'
        })

    }

    const handlePrev = () => {

        scrollRef.current.scrollBy({
            left: -250,
            behavior: 'smooth'
        })

    }

    useEffect(() => {

        if (!scrollRef.current) return;

        const handleScroll = () => {

            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            setShowLeft(scrollLeft > 0);

            setShowRight(!(scrollLeft + clientWidth >= scrollWidth - 1));

        }

        
        scrollRef.current?.addEventListener("scroll", handleScroll);

        handleScroll();

        return () => {
            scrollRef.current?.removeEventListener("scroll", handleScroll);
        }

    }, [products])



    return (

        <div className='my-15'>

            <div className='mb-8 pb-4 border-b-2 border-gray-200 flex items-center justify-between'>

                <h1 className='font-bold text-xl lg:text-2xl text-center lg:text-left'>Deals of the Day</h1>
                <span className='text-gray-500 font-semibold text-sm'>{products.length || 0} Items</span>

            </div>

            <div className='relative'>

                <button onClick={handlePrev} className={`absolute ${showLeft ? 'block' : 'hidden'} top-1/2 -translate-y-1/2 z-10 bg-white px-4 py-10 shadow border border-gray-200 hover:bg-gray-50 rounded-r-lg text-gray-500 cursor-pointer text-lg left-0`}><FaAngleLeft /></button>

                <button onClick={handleNext} className={`absolute ${showRight ? 'block' : 'hidden'} top-1/2 -translate-y-1/2 z-10 bg-white px-4 py-10 shadow border border-gray-200 hover:bg-gray-50 rounded-l-lg text-gray-500 cursor-pointer text-lg right-0`}><FaAngleRight /></button>

                <div ref={scrollRef} className="flex scrollbar-hidden overflow-x-auto py-5 scroll-px-1 snap-x snap-mandatory gap-2 md:gap-4 lg:gap-5">


                    {products && products.map((product, index) => (

                        // <ProductCard product={product} key={index} />
                        // <SpecListLayout product={product} key={index} />
                        <div key={index} className="bg-white relative snap-start border md:min-w-[31.80%] xl:min-w-2/9 max-w-2/9 border-gray-200 p-2 lg:p-4 flex flex-col transition-shadow hover:shadow-md" data-id="${product.id}">

                            {product?.discount_percent > 0 && <p className='text-white ribbon z-10 text-center p-1 font-semibold '>{product?.discount_percent}% off</p>}

                            <Link onClick={() => scrollTo(0, 0)} to={`/product/${product.product_slug}/?variant=${product.uid}`} className="text-sm font-medium text-gray-800 mb-2 leading-snug line-clamp-1">

                                <div className="relative w-full overflow-hidden ">

                                    <div className={`${product?.primary_category == "Mobiles" ? 'h-50 lg:h-70' : 'h-50 lg:h-70'} max-w-30 m-auto flex items-center justify-center bg-white`}>
                                        <img src={product?.images?.filter(img => img.is_main)[0]?.image || product?.images[0]?.image} alt="${product.name}" className="absolute top-1/2 p-1 lg:p-4 left-1/2 -translate-1/2 max-w-full! max-h-full! m-auto"
                                            loading='lazy' onError={() => "this.src='https://via.placeholder.com/500?text=Product+Image'"} />
                                    </div>

                                </div>

                                <div className="flex mt-2 lg:mt-0 flex-col">

                                    <div className="text-mobile-1 lg:text-mobile-2 text-gray-400 uppercase tracking-wide mb-1.5 font-semibold">{product?.primary_category}</div>

                                    <h1 className="text-xs md:text-sm font-medium text-gray-800 mb-1 lg:mb-2 leading-snug line-clamp-1 ">{product.product_name}</h1>

                                    <div className='flex flex-col-reverse items-start gap-1 md:flex-row md:items-center md:gap-4'>
                                        <div className='flex items-center gap-4 '>

                                            {
                                                product?.mrp > 0
                                                    ?
                                                    <>
                                                        <span className='font-bold text-green-500 text-sm lg:text-lg' >{formatPriceINR(Math.trunc(product?.price))}</span>
                                                        {product?.price > 0 && <strike className='text-gray-500 font-semibold text-xs lg:text-sm' >{formatPriceINR(Math.trunc(product?.mrp))}</strike>}
                                                    </>
                                                    :
                                                    <span className='font-bold text-green-500 text-sm lg:text-lg' >{formatPriceINR(Math.trunc(product?.price))}</span>
                                            }
                                        </div>

                                    </div>

                                </div>

                            </Link>

                        </div>

                    ))}


                </div>

            </div>

        </div>

    )

}

export default DealsOfTheDay
