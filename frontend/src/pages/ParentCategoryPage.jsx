import React from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaAngleRight } from 'react-icons/fa';
import SpecListLayout from '../components/layout/SpecListLayout';
import CategoryList from '../components/CategoryList';

const ParentCategoryPage = ({ data, slug }) => {

    console.log(data)

    return (

        <div className='p-2'>

            {/* BreadCrum */}
            <div className='flex max-sm:hidden items-center gap-2 text-xs px-4 py-1 my-2 text-nowrap overflow-clip' >

                <Link to={"/"} className='text-[#878787] cursor-pointer hover:text-blue-400 text-sm font-medium' >Home</Link>

                <div className='text-gray-500 flex items-center' >
                    <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
                    <p className='font-semibold text-sm text-black/80'>{data.category.name}</p>
                </div>

            </div>

            <div className="flex">

                {/* 1. Sidebar */}
                <Sidebar slug={slug} category_name={data?.category?.name} sub_category={data?.sub_category} />

                <div className='flex-1 px-6 pb-6'>

                    {/* <CategoryList className="" categories={data?.sub_category} /> */}

                    {

                        Object.keys(data?.products).map((key, index) => (

                            data?.products[key]?.length > 0 &&

                            <div key={index} className="mb-4">

                                {/* Product Grid */}

                                <div className='flex items-center justify-between pr-4 mb-6'>
                                    <h1 className="text-2xl font-bold capitalize">{key}</h1>
                                    <p>{data?.products[key]?.length} Items</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {/* {data?.products?.length > 0 ? (
                                        data.products.map(product => (
                                            // <ProductCard key={product.uid} product={product} />
                                            <SpecListLayout key={product.uid} product={product} />
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No products found in this category.</p>
                                    )} */}
                                    {
                                        data.products[key]?.map((product, index) => (
                                            // <ProductCard key={product.uid} product={product} />
                                            <SpecListLayout key={index} product={product} />
                                        ))
                                    }

                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>
        </div>
        
    )
}

export default ParentCategoryPage
