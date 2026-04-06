
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import SpecListLayout from './layout/SpecListLayout';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const FeaturedProduct = () => {
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false); 


    useEffect(() => {

        setLoading(true);

        const fetchProducts = async () => {

            try {

                const res = await axios.get(`http://localhost:8000/api/products/homepage/?page=${page}`)

                // Purane products me naye products JOD (append) rahe hain
                setProducts(prevProducts => [...prevProducts, ...res.data.trending_products.results]);

                // Agar 'next' me URL hai, iska matlab aur products bache hain
                setHasMore(res.data.trending_products.next !== null);

            } catch (err) {
                console.error("Error fetching products", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();

    }, [page]); // Jab bhi 'page' state change hogi, yeh chalega

    // ---- INFINITE SCROLL LOGIC (The Magic) ----
    const observer = useRef();

    const lastProductElementRef = useCallback(node => {
        if (loading) return; // Agar data aa raha hai, toh aur fetch mat karo

        // Purane observer ko disconnect karo
        if (observer.current) observer.current.disconnect();

        // Naya observer banao
        observer.current = new IntersectionObserver(entries => {
            // Agar aakhiri product screen par dikh gaya aur aur products bache hain
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1); // Page number badha do (useEffect trigger hoga)
            }
        });

        // Aakhiri node ko observe karo
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div className="container mx-auto px-4 mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b border-b-gray-300 pb-4">
                Explore All Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

                {products.map((product, index) => {

                    // Agar yeh array ka aakhiri product hai, toh ispe 'ref' laga do

                    if (products.length === index + 1) {
                        return (
                            <div ref={lastProductElementRef} key={product.uid}>
                                {/* <ProductCard product={product} /> */}
                                <SpecListLayout product={product} key={index} />
                            </div>
                        );
                    } else {
                        return <SpecListLayout product={product} key={index} />
                    }

                })}
            </div>

            {/* Loading Spinner jab naya data aa raha ho */}
            {loading && (
                <div className="flex justify-center items-center py-10 mt-4">
                    {/* <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gray-900"></div> */}
                    <AiOutlineLoading3Quarters className="animate-spin h-10 w-10 text-blue-500" />
                </div>
            )}

            {/* Jab saare products khatam ho jayein */}
            {!hasMore && !loading && products.length > 0 && (
                <div className="text-center py-10 text-gray-500 font-medium">
                    You have seen all the products! 🎉
                </div>
            )}
        </div>
    );
}; 

export default FeaturedProduct;
