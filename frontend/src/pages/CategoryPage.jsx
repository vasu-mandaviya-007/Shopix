import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaAngleRight } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import SpecListLayout from '../components/layout/SpecListLayout';
import ParentCategoryPage from './ParentCategoryPage';
import ProductListSkeleton from '../components/skeleton/ProductListSkeleton';
import { PiSpinner } from 'react-icons/pi';
import { Button } from '@mui/material';
import { FaFilter } from 'react-icons/fa6';
import API_BASE_URL from '../config/config.js';

const CategoryPage = () => {
 
    const { slug } = useParams();
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState({ products: [], breadcrumbs: [], category_name: '' });
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState(slug);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [availableFilters, setAvailableFilters] = useState([])

    const fetchData = async () => {

        setLoading(true);

        let queryParams = `?`;
        for (const [key, value] of Object.entries(selectedFilters)) {
            if (value) {
                queryParams += `${key}=${value}&`;
            }
        }
        queryParams = queryParams.endsWith('&') ? queryParams.slice(0, -1) : queryParams;
        if (queryParams === '?') queryParams = '';
        console.log(queryParams);

        const response = await fetch(`${API_BASE_URL}/api/products/category/${slug}${queryParams}`);

        const result = await response.json()

        console.log(result)

        setData(result);
        setAvailableFilters(result.filters)

        setTimeout(() => {
            setLoading(false);
        }, 500);

    }

    useEffect(() => {
        fetchData();
    }, [slug, selectedFilters]);

    return (
        // loading
        //     ?
        //     <ProductListSkeleton />
        //     :
        data.IsParent
            ?
            <ParentCategoryPage data={data} slug={slug} />
            :
            <div className='p-2 bg-gray-100 '>

                {/* BreadCrum */}
                <div className='flex max-sm:hidden items-center gap-2 text-xs px-4 py-1 my-2 text-nowrap overflow-clip' >

                    <Link to={"/"} className='text-[#878787] cursor-pointer hover:text-blue-400 text-sm font-medium' >Home</Link>

                    {data.breadcrumbs.length > 0 && data?.breadcrumbs.map((cat, index) => (
                        <div className='flex items-center' key={index}>
                            <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
                            <Link to={`/products/${cat.slug}`} className="text-[#878787] text-sm cursor-pointer hover:text-blue-400 font-medium">
                                {cat.name}
                            </Link>
                        </div>
                    ))}

                    <div className='text-gray-500 flex items-center' >
                        <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
                        <p className='font-semibold text-sm text-black/80'>{data.category_name}</p>
                    </div>

                </div>

                <div className="flex gap-2">

                    {/* 1. Sidebar */}
                    <Sidebar isOpenMenu={isOpen} setIsOpenMenu={setIsOpen} slug={slug} availableFilters={availableFilters} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} category_name={data.category_name} sub_category={data.sub_category} />

                    {/* 2. Main Content */}
                    <div className="flex-1 h-full w-full bg-white overflow-y-auto px-6 py-4 pb-6">

                        <Button
                            variant='contained'
                            onClick={()=> setIsOpen(true)}
                            startIcon={<FaFilter className='text-sm!'/>}
                            className='block md:hidden! mb-2!'>
                            Filter
                        </Button>

                        {/* Product Grid */}
                        <div className='flex items-center justify-between pr-4 mb-6'>
                            <h1 className="text-2xl font-bold ">{data?.category_name}</h1>
                            <p>{data?.products?.length} Items</p>
                        </div>

                        {loading ? (
                            <div className='flex items-center justify-center'>

                                <PiSpinner className='text-3xl mt-5 animate-spin' />

                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {data?.products?.length > 0 ? (
                                    data.products.map((product,index) => (
                                        // <ProductCard key={product.uid} product={product} />
                                        <SpecListLayout key={index} product={product} />
                                    ))
                                ) : (
                                    <p className="text-gray-500">No products found in this category.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

    );

};

export default CategoryPage;