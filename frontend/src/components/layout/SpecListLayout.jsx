import React, { useContext } from 'react'
import { CiCircleInfo } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { formatPriceINR } from '../../utils/formatPriceINR';
import { CartContext } from '../../context/CartContext';
import { Button } from '@mui/material';
import { FaShoppingCart } from 'react-icons/fa';


const SpecListLayout = ({ product }) => {

    // const variant = product.display_variant;
    const { addToCart } = useContext(CartContext);

    const navigate = useNavigate();

    const isNewProduct = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();

        const diffTime = currentDate - createdDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return diffDays <= 7;
    };

    return (

        <div className="bg-white shadow border border-gray-200 p-2 lg:p-4 flex flex-col transition-shadow hover:shadow-md" data-id="${product.id}">

            <Link to={`/product/${product.product_slug}/?variant=${product.uid}`} className="text-sm font-medium text-gray-800 mb-2 leading-snug line-clamp-1">

                <div className="relative w-full overflow-hidden ">

                    {
                        isNewProduct(product.created_at) &&
                        <span className="absolute top-0 md:top-2.5 right-0 md:right-2.5 bg-gray-800 text-white px-2 py-1 z-2 text-mobile-1 md:text-xs font-medium uppercase tracking-wide">new</span>
                    }

                    <div className={`${product?.primary_category == "Mobiles" ? 'h-50 lg:h-70' : 'h-50 lg:h-70'} max-w-30 m-auto flex items-center justify-center bg-white`}>
                        <img src={product?.images?.filter(img => img.is_main)[0]?.image || product?.images[0]?.image} alt="${product.name}" className="absolute top-1/2 p-1 lg:p-4 left-1/2 -translate-1/2 max-w-full! max-h-full! m-auto"
                            loading='lazy' onError={() => "this.src='https://via.placeholder.com/500?text=Product+Image'"} />
                    </div>

                </div>

                <div className="flex mt-2 lg:mt-0 flex-col grow">

                    <div className="text-mobile-1 lg:text-mobile-2 text-gray-400 uppercase tracking-wide mb-1.5 font-semibold">{product?.primary_category}</div>

                    <h1 className="text-xs md:text-sm font-medium text-gray-800 mb-1 lg:mb-2 leading-snug line-clamp-1">{product.product_name}</h1>

                    <div className='mb-2 hidden md:flex line-clamp-2 items-center grow text-mobile-2 text-gray-500 font-medium'>
                        {
                            product?.attribute_values?.slice(0, 2).map((attribute, index) => (
                                `${attribute?.attribute_name.charAt(0).toUpperCase() + attribute?.attribute_name.slice(1).toLowerCase() + " : "} ${attribute?.value} ${index !== product?.attribute_values?.slice(0, 2).length - 1 ? ', ' : ''}`
                            )).join("")
                        }
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 mb-3">
                        <div className="flex gap-0.5">
                            <span className="text-orange-500 text-sm">★</span>
                            <span className="text-orange-500 text-sm">★</span>
                            <span className="text-orange-500 text-sm">★</span>
                            <span className="text-orange-500 text-sm">★</span>
                        </div>
                        <span className="text-xs text-gray-400">5 (reviews)</span>
                    </div>

                    <div className='flex flex-col-reverse items-start gap-1 md:flex-row md:items-center md:gap-4'>
                        <div className='flex items-center gap-4 '>

                            {
                                product?.mrp > 0
                                    ?
                                    <>
                                        <span className='font-semibold text-sm lg:text-lg' >{formatPriceINR(Math.trunc(product?.price))}</span>
                                        {product?.price > 0 && <strike className='text-gray-400 text-xs lg:text-sm' >{formatPriceINR(Math.trunc(product?.mrp))}</strike>}
                                    </>
                                    :
                                    <span className='font-semibold text-sm lg:text-lg' >{formatPriceINR(Math.trunc(product?.price))}</span>
                            }
                        </div>
                        {product?.discount_percent > 0 && <p className='text-green-600 font-semibold text-mobile-2 lg:text-sm'>{product?.discount_percent}% off</p>}
                        {/* <h4 className='inline-flex items-center gap-3' >
                        {variant?.discount_percent > 0 && <div className='relative group'>
                            <CiCircleInfo className='text-lg text-gray-400' />
                            <div className='absolute text-[12px] text-nowrap bg-white z-10 invisible opacity-0 scale-y-0 delay-0 duration-300 transition-opacity origin-top group-hover:visible group-hover:opacity-100 group-hover:scale-y-100 group-hover:delay-1000 border border-gray-200 shadow-xl left-0 top-full'>
                                <div>
                                    <h3 className='font-semibold px-4  pt-4'>Price Details</h3>
                                    <div className='px-4'>
                                        <div className='flex my-4 justify-between'>
                                            <div className=''>
                                                <p className='text-nowrap font-semibold text-gray-500'>Maximum Retail Price</p>
                                                <p className='text-[10px] text-gray-400'>(incl. of all taxes)</p>
                                            </div>
                                            <span className='line-through'>₹{product?.product?.display_variant?.price}</span>
                                        </div>
                                        <div className='flex justify-between pb-3 border-dashed border-b border-b-gray-300'>
                                            <p className='text-nowrap font-semibold text-gray-500'>Seeling Price</p>
                                            <span className='line-through'>₹{product?.product?.display_variant?.discount_price}</span>
                                        </div>
                                        <div className='flex justify-between py-3 border-solid border-b border-b-gray-300'>
                                            <p className='text-nowrap font-semibold'>Special Price</p>
                                            <span>₹{product?.product?.display_variant?.discount_price}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='px-4 py-3'>
                                    <p className='text-green-500'>Overall you save ₹{product?.product?.display_variant?.price - product?.product?.display_variant?.discount_price} ({product?.product?.display_variant?.discount_percent}%) on this product </p>
                                </div>

                            </div>
                        </div>}
                    </h4> */}
                    </div>

                </div>

            </Link>

            <div className="hidden lg:flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-0 mt-auto pt-3 border-t border-gray-100">

                <Button
                    variant='contained'
                    className='bg-gray-800!'
                    onClick={() => addToCart(product)}
                    startIcon={<FaShoppingCart className='text-base!' />}
                >
                    Add to Cart
                </Button>
            </div>

        </div>

    )

}

export default SpecListLayout
