import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

        if (currentProductSlug) {
            fetchRelatedProducts();
        }
    }, [currentProductSlug]); // Jab bhi slug change hoga (user naye product par jayega), ye firse chalega

    // Agar loading ho rahi hai, ya koi related product nahi mila, toh component kuch return nahi karega
    if (loading) return <div className="py-8 text-center text-gray-500">Loading related products...</div>;
    if (products.length === 0) return null;

    return (
        <div className="mt-0 pt-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <SpecListLayout product={product} key={product?.uid} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;


    