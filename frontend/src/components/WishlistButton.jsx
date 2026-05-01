import React, { useState, useEffect, useContext } from 'react';
import { IconButton } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { getAccess } from '../auth';
import API_BASE_URL from '../config/config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WishlistButton = ({ productId }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initial status check
    useEffect(() => {
        const checkStatus = async () => { 
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const token = getAccess();
                const res = await axios.get(`${API_BASE_URL}/api/cart/wishlist/check/${productId}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsInWishlist(res.data.is_in_wishlist);
                // console.log
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        if(productId) checkStatus();
    }, [productId, user]);

    // Toggle logic
    const handleToggle = async (e) => {
        e.preventDefault(); // Agar kisi Link tag ke andar ho toh page navigate na ho
        e.stopPropagation();

        if (!user) {
            toast.info("Please login to save items");
            navigate('/login');
            return;
        }

        try {
            const token = getAccess();
            const res = await axios.post(`${API_BASE_URL}/api/cart/wishlist/`, 
                { variant_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setIsInWishlist(res.data.is_in_wishlist);
                toast.success(res.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    if (loading) return null; // Skeleton dikha sakte ho idhar

    return (
        <IconButton 
            onClick={handleToggle} 
            sx={{ 
                backgroundColor: 'white', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': { backgroundColor: '#f9fafb' }
            }}
        >
            {isInWishlist ? (
                // Filled Heart (Material SVG)
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            ) : (
                // Outline Heart
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            )}
        </IconButton>
    );
};

export default WishlistButton;