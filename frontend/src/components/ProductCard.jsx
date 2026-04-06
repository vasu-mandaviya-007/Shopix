import { Button } from '@mui/material';
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {

    const variant = product.display_variant;     

    const {addToCart} = useContext(CartContext);

    const navigate = useNavigate();

    return (
        <div className="bg-white border border-gray-300 flex flex-col transition-shadow hover:shadow-md" data-id="${product.id}">
            <div className="relative w-full overflow-hidden">
                <span className="absolute top-2.5 right-2.5 bg-gray-800 text-white px-2 py-1 z-10 text-xs font-medium uppercase tracking-wide">new</span>
                <div className='h-90 max-w-55 m-auto relative flex items-center justify-center p-5 bg-white'>
                    <img src={variant?.images?.filter(img => img.is_main)[0]?.image || variant?.images[0]?.image} alt="${product.name}" className="absolute top-1/2 left-1/2 -translate-1/2 max-w-full! max-h-full! m-auto"
                        onError={() => "this.src='https://via.placeholder.com/500?text=Product+Image'"} />
                </div>
            </div>
            <div className="p-4 flex flex-col grow">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 font-normal">{product?.primary_category}</div>
                <Link onClick={() => scrollTo(0, 0)} to={`/product/${product.slug}`} className="text-base font-medium text-gray-800 mb-2 leading-snug line-clamp-1">{product.title}</Link>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed grow line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex gap-0.5">
                        <span className="text-orange-500 text-sm">★</span>
                        <span className="text-orange-500 text-sm">★</span>
                        <span className="text-orange-500 text-sm">★</span>
                        <span className="text-orange-500 text-sm">★</span>
                    </div>
                    <span className="text-xs text-gray-400">5 (reviews)</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold text-gray-800">{product?.display_variant?.variant_price}</span>
                        <span className="text-sm text-gray-400 line-through">{product?.display_variant?.variant_price}</span>
                    </div>
                    {/* <button className="bg-gray-800 text-white px-4 py-2 text-sm font-medium cursor-pointer transition-colors hover:bg-gray-600 active:bg-gray-900 w-full sm:w-auto add-to-cart-btn" onClick={() => "addToCart(${product.id})"}>
                        Add to Cart
                    </button> */}
                    <Button onClick={() => addToCart(product, variant)} variant='contained' className='bg-gray-800! hover:bg-gray-950! rounded-xs!' >Add to Cart</Button>
                </div>
            </div>
        </div>
    )

}

export default ProductCard
