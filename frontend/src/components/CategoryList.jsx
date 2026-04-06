import React, { useContext, useEffect, useState } from 'react'
import API_BASE_URL from "../config/config.js";
import axios from "axios";
import { ShopContext } from '../context/ShopContext.jsx';
import { useNavigate } from 'react-router-dom';
import Skel from './skeleton/Skel.jsx';
import { Skeleton } from '@mui/material';

const CategoryList = ({ className = "" }) => {

    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    const [categories, setCategories] = useState([])

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                setLoading(true)

                const response = await axios.get(`${API_BASE_URL}/api/categories/`);

                setCategories(response.data.categories);

            } catch (error) {

                console.error("Error fetching categories:", error);

            } finally {

                setLoading(false)

            }

        }

        fetchCategories();

    }, [])


    return (

        <div className={`${className} mt-4`}>

            <h1 className='font-bold text-xl lg:text-2xl text-center lg:text-left'>Shop by Category</h1>

            <div className='w-full grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-8'>

                {

                    loading
                        ?
                        Array.from({ length: 8 }).map((_, index) => (

                            <div key={index}>
                                <Skeleton className='aspect-square transform-none! rounded-full!' />
                                <Skeleton className=' mt-3! transform-none! w-[90%]! mx-auto!' />
                            </div>

                        ))
                        :
                        categories.map((category, index) => (

                            <div key={index} onClick={() => { navigate(`/products/${category.slug}`), scrollTo(0, 0) }} className='min-w-1/9 flex flex-col items-center cursor-pointer'>
                                <div key={index} className='relative bg-gray-100 hover:brightness-98 rounded-full aspect-square w-full'>
                                    <img src={category.category_image} className='p-2 absolute left-1/2 top-1/2 -translate-1/2 max-h-full! max-w-full! ' alt="" />
                                </div>
                                <span className='font-semibold text-mobile-1 sm:text-mobile-2 md:text-mobile-3 lg:text-sm text-center grow mt-2'>{category.name}</span>
                            </div>

                        ))
                }

            </div>

            {/* <div style={{ scrollbarWidth: "thin" }} className='w-full border mt-4 overflow-x-auto'>
                <div className='flex gap-3'>
                    {
                        category.map((category, index) => (
                            <div key={index} className={`cursor-pointer min-w-1/9 p-1 rounded-xs`}>
                                <div className='relative p-1.25 h-full grow overflow-hidden w-full'>
                                    <img src={category?.category_image} className=' absolute top-1/2 left-1/2 -translate-1/2 max-h-full! max-w-full! ' alt="" />
                                </div>
                                <span>{category.name}</span>
                            </div>
                        ))
                    }
                </div>
            </div> */}

        </div>
    )
}

export default CategoryList
