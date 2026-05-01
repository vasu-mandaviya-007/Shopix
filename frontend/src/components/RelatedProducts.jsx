import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpecListLayout from './layout/SpecListLayout';
import API_BASE_URL from '../config/config';

const RelatedProducts = ({ currentProductSlug }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/products/detail/${currentProductSlug}/related/`);
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to load related products", err);
            }
            setLoading(false);
        };

        if (currentProductSlug) fetchRelatedProducts();
    }, [currentProductSlug]);

    if (loading) return (
        <div className="py-6 sm:py-8 text-center text-gray-500 text-sm sm:text-base">
            Loading related products...
        </div>
    );
    if (products.length === 0) return null;

    return (
        <div className="mt-0 pt-6 sm:pt-8 mb-6 sm:mb-10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                You Might Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {products.map((product) => (
                    <SpecListLayout product={product} key={product?.uid} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;