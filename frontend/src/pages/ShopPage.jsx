// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useSearchParams } from 'react-router-dom';
// import Sidebar from '../components/Sidebar.jsx';
// import { FaAngleRight } from 'react-icons/fa';
// import SpecListLayout from '../components/layout/SpecListLayout.jsx';
// import ProductListSkeleton from '../components/skeleton/ProductListSkeleton.jsx';
// import { PiSpinner } from 'react-icons/pi';
// import { Button, Pagination, Stack } from '@mui/material';
// import { FaFilter } from 'react-icons/fa6';
// import API_BASE_URL from '../config/config.js';
// import { keepPreviousData, useQuery } from '@tanstack/react-query';

// const fetchProducts = async ({ queryKey }) => {

//     try {

//         const [_key, categorySlug, finalQueryString] = queryKey;

//         let url = categorySlug
//             ? `${API_BASE_URL}/api/products/category/${categorySlug}?${finalQueryString}`
//             : `${API_BASE_URL}/api/products/?${finalQueryString}`

//         const response = await fetch(url);

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json()

//         return result;

//     } catch (err) {
//         console.log(err)
//     }
// }

// const ShopPage = () => {

//     const [searchParams, setSearchParams] = useSearchParams();

//     const { slug } = useParams("");
//     const [isOpen, setIsOpen] = useState(false)

//     const [selectedFilters, setSelectedFilters] = useState({});

//     // Pagination
//     const currentPage = parseInt(searchParams.get("page")) || 1;

//     // const queryString = searchParams.toString();
//     const paramsForFetch = new URLSearchParams(searchParams);
//     if (!paramsForFetch.has("page")) {
//         paramsForFetch.set("page", "1");
//     }
//     const finalQueryString = paramsForFetch.toString(); // Yeh hamesha "page=1" dega agar khali hua toh

//     const fetchData = async () => {

//         try {
//             // setLoading(true);
//             setProductLoading(true)

//             const queryString = searchParams.toString();

//             let url = ""
//             if (slug) {
//                 url = `${API_BASE_URL}/api/products/category/${slug}?${queryString}`
//             } else {
//                 url = `${API_BASE_URL}/api/products/?${queryString}`
//             }

//             const response = await fetch(url);

//             const result = await response.json()

//             console.log(result);

//             setData(result);
//             setAvailableFilters(result.filters)


//         } catch (err) {
//             console.log(err)
//         } finally {
//             setLoading(false);
//             setProductLoading(false);
//         }

//     }

//     // useEffect(() => {
//     //     fetchData();
//     // }, [slug, selectedFilters, currentPage, searchParams]);


//     const {
//         data,
//         isLoading,
//         isFetching,
//         isError,
//     } = useQuery({
//         queryKey: ["products", slug, finalQueryString],
//         queryFn: fetchProducts,
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         placeholderData: keepPreviousData,
//     })

//     const handlePageChange = (event, value) => {
//         const newParams = new URLSearchParams(searchParams);
//         newParams.set("page", value);
//         setSearchParams(newParams);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }

//     if (isLoading) {
//         return <ProductListSkeleton />
//     }

//     if (isError) {
//         return <div className="text-center py-20 text-red-500">Error loading products!</div>;
//     }

//     return (

//         <div className='p-2 '>

//             {/* BreadCrum */}
//             <div className='flex max-sm:hidden items-center gap-2 text-xs px-4 py-1 my-2 text-nowrap overflow-clip' >

//                 <Link to={"/"} className='text-[#878787] cursor-pointer hover:text-blue-400 text-sm font-medium' >Home</Link>

//                 {data?.breadcrumbs?.length > 0 && data?.breadcrumbs.map((cat, index) => (
//                     <div className='flex items-center' key={index}>
//                         <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
//                         <Link to={`/products/${cat.slug}`} className="text-[#878787] text-sm cursor-pointer hover:text-blue-400 font-medium">
//                             {cat.name}
//                         </Link>
//                     </div>
//                 ))}

//                 <div className='text-gray-500 flex items-center' >
//                     <span className='text-gray-500 mr-2' > <FaAngleRight /> </span>
//                     <p className='font-semibold text-sm text-black/80'>{data.category_name}</p>
//                 </div>

//             </div>

//             <div className="flex gap-2">

//                 {/* 1. Sidebar */}
//                 <Sidebar
//                     isOpenMenu={isOpen}
//                     setIsOpenMenu={setIsOpen}
//                     slug={slug}
//                     availableFilters={data.filters || []}
//                     selectedFilters={selectedFilters}
//                     setSelectedFilters={setSelectedFilters}
//                     category_name={data.category_name}
//                     sub_category={data.sub_category}
//                     searchParams={searchParams}
//                     setSearchParams={setSearchParams}
//                 />

//                 {/* 2. Main Content */}
//                 <div className="flex-1 h-full w-full bg-white overflow-y-auto px-6 py-4 pb-6">

//                     <Button
//                         variant='contained'
//                         onClick={() => setIsOpen(true)}
//                         startIcon={<FaFilter className='text-sm!' />}
//                         className='block md:hidden! mb-2!'>
//                         Filter
//                     </Button>

//                     {/* <CategoryList className="" categories={data?.sub_category} /> */}

//                     {/* Product Grid */}
//                     <div className='flex items-center justify-between pr-4 mb-6'>
//                         <h1 className="text-2xl font-bold ">{data?.category_name}</h1>
//                         <p>{data?.products?.length} Items</p>
//                     </div>

//                     {isFetching ? (
//                         <div className='flex items-center justify-center'>

//                             <PiSpinner className='text-3xl mt-5 animate-spin' />

//                         </div>
//                     ) : (
//                         <div>

//                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

//                                 {data?.products?.length > 0 ? (
//                                     data.products.map((product, index) => (
//                                         <SpecListLayout key={index} product={product} />
//                                     ))
//                                 ) : (
//                                     <p className="text-gray-500">No products found in this category.</p>
//                                 )}

//                             </div>

//                             {/* Pagination */}

//                             {data.pagination && data.pagination.total_pages > 1 && (
//                                 <Stack spacing={2} className="items-center mt-10 mb-6 flex justify-center w-full">
//                                     <Pagination
//                                         count={data.pagination.total_pages} // Backend se total pages
//                                         page={currentPage}                  // Current active page
//                                         onChange={handlePageChange}         // Handle click
//                                         color="primary"
//                                         size="large"
//                                         showFirstButton
//                                         showLastButton
//                                     />
//                                 </Stack>
//                             )}

//                         </div>

//                     )}
//                 </div>
//             </div>
//         </div>

//     );

// };

// export default ShopPage;


import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { FaAngleRight } from 'react-icons/fa';
import SpecListLayout from '../components/layout/SpecListLayout.jsx';
import ProductListSkeleton from '../components/skeleton/ProductListSkeleton.jsx';
import { PiSpinner } from 'react-icons/pi';
import { Button, Pagination, Stack } from '@mui/material';
import { FaFilter } from 'react-icons/fa6';
import API_BASE_URL from '../config/config.js';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const fetchProducts = async ({ queryKey }) => {
    try {
        const [_key, categorySlug, finalQueryString] = queryKey;
        let url = categorySlug
            ? `${API_BASE_URL}/api/products/category/${categorySlug}?${finalQueryString}`
            : `${API_BASE_URL}/api/products/?${finalQueryString}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const ShopPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { slug } = useParams("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

    const currentPage = parseInt(searchParams.get("page")) || 1;

    const paramsForFetch = new URLSearchParams(searchParams);
    if (!paramsForFetch.has("page")) paramsForFetch.set("page", "1");
    const finalQueryString = paramsForFetch.toString();

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ["products", slug, finalQueryString],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });

    const handlePageChange = (event, value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", value);
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return <ProductListSkeleton />;
    if (isError) return <div className="text-center py-20 text-red-500 text-sm sm:text-base">Error loading products!</div>;

    return (

        <div className='p-1 sm:p-2'>

            {/* Breadcrumb */}
            <div className='hidden sm:flex items-center gap-2 text-xs px-3 sm:px-4 py-1 my-2 text-nowrap overflow-clip'>
                <Link to={"/"} className='text-[#878787] cursor-pointer hover:text-blue-400 text-xs sm:text-sm font-medium'>
                    Home
                </Link>
                {data?.breadcrumbs?.length > 0 && data.breadcrumbs.map((cat, index) => (
                    <div className='flex items-center' key={index}>
                        <span className='text-gray-500 mr-2'><FaAngleRight /></span>
                        <Link to={`/products/${cat.slug}`} className="text-[#878787] text-xs sm:text-sm cursor-pointer hover:text-blue-400 font-medium">
                            {cat.name}
                        </Link>
                    </div>
                ))}
                <div className='text-gray-500 flex items-center'>
                    <span className='text-gray-500 mr-2'><FaAngleRight /></span>
                    <p className='font-semibold text-xs sm:text-sm text-black/80'>{data?.category_name}</p>
                </div>
            </div>

            <div className="flex gap-1 sm:gap-2">

                {/* Sidebar */}
                <Sidebar
                    isOpenMenu={isOpen}
                    setIsOpenMenu={setIsOpen}
                    slug={slug}
                    availableFilters={data?.filters || []}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    category_name={data?.category_name}
                    sub_category={data?.sub_category}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                />

                {/* Main Content */}
                <div className="flex-1 min-w-0 bg-white px-2 sm:px-4 lg:px-6 py-3 sm:py-4 pb-6">

                    <Button
                        variant='contained'
                        onClick={() => setIsOpen(true)}
                        startIcon={<FaFilter className='text-xs! sm:text-sm!' />}
                        size='small'
                        className='lg:hidden! mb-4!'
                    >
                        Filter
                    </Button>

                    <div className='flex items-center justify-between pr-4 mb-6'>
                        <h1 className="text-base sm:text-lg lg:text-2xl font-bold leading-tight">
                            {data?.category_name}
                        </h1>
                        <p className='text-xs sm:text-sm text-gray-500 shrink-0 ml-2'>
                            {data?.products?.length} Items
                        </p>
                    </div>


                    {isFetching ? (
                        <div className='flex items-center justify-center py-10 sm:py-16'>
                            <PiSpinner className='text-2xl sm:text-3xl animate-spin text-blue-500' />
                        </div>
                    ) : (
                        <div>
                            {/* Product Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                                {data?.products?.length > 0 ? (
                                    data.products.map((product, index) => (
                                        <SpecListLayout key={index} product={product} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm col-span-full py-10 text-center">
                                        No products found in this category.
                                    </p>
                                )}
                            </div>

                            {/* Pagination */}
                            {data?.pagination && data.pagination.total_pages > 1 && (
                                <Stack spacing={2} className="items-center mt-6 sm:mt-10 mb-4 sm:mb-6 flex justify-center w-full">
                                    <Pagination
                                        count={data.pagination.total_pages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size="small"
                                        className="sm:size-medium! lg:size-large!"
                                        showFirstButton
                                        showLastButton
                                    />
                                </Stack>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;