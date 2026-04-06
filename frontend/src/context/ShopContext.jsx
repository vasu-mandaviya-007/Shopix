import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'

export const ShopContext = createContext();
import API_BASE_URL from '../config/config.js';

export const ShopProvider = ({ children }) => {

    const [homeData, setHomeData] = useState({
        categories: [],
        deals_of_the_day: [], 
        trending_products: [],
        banners: []
    });

    const [loading, setLoading] = useState(false)

    // const fetchHomeData = async () => {

    //     try {

    //         setLoading(true)
    //         const res = await axios.get(`${API_BASE_URL}/api/products/homepage/`);
    //         setHomeData(res.data);

    //     } catch (err) {
    //         console.log("Failed to load data", err)
    //     } finally {
    //         setLoading(false)
    //     }

    // }

    // useEffect(() => {

    //     fetchHomeData();

    // }, []);

    const value = {
        homeData
    }

    return (
        <ShopContext.Provider value={value} >
            {children}
        </ShopContext.Provider>
    );

}