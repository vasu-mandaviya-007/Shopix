// import React, { useRef, useCallback } from 'react';
// import axios from 'axios';
// import SpecListLayout from './layout/SpecListLayout';
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import API_BASE_URL from '../config/config';
// import { useInfiniteQuery } from '@tanstack/react-query';

// const fetchFeaturedProducts = async ({ pageParam = 1 }) => {

//     const res = await axios.get(`${API_BASE_URL}/api/products/homepage/?page=${pageParam}`);
//     return res.data.trending_products;

// }

// const FeaturedProduct = () => {

//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//         isError,
//     } = useInfiniteQuery({
//         queryKey: ['featuredProducts'],
//         queryFn: fetchFeaturedProducts,
//         initialPageParam: 1,
//         getNextPageParam: (lastPage, allPages, lastPageParam) => {
//             if (!lastPage.next) return undefined;
//             return lastPageParam + 1;
//         },
//         staleTime: 1000 * 60 * 5, // 5 minute
//     })

//     const products = data ? data.pages.flatMap(page => page.results) : [];


//     // ---- INFINITE SCROLL LOGIC ----
//     const observer = useRef();

//     const lastProductElementRef = useCallback(node => {

//         if (isFetchingNextPage) return; // Agar data aa raha hai, toh aur fetch mat karo

//         // Purane observer ko disconnect karo
//         if (observer.current) observer.current.disconnect();

//         // Naya observer banao
//         observer.current = new IntersectionObserver(entries => {
//             // Agar aakhiri product screen par dikh gaya aur aur products bache hain
//             if (entries[0].isIntersecting && hasNextPage) {
//                 fetchNextPage();
//             }
//         });

//         // Aakhiri node ko observe karo
//         if (node) observer.current.observe(node);

//     }, [isFetchingNextPage, hasNextPage, fetchNextPage]);


//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center py-20 mt-16">
//                 <AiOutlineLoading3Quarters className="animate-spin h-12 w-12 text-blue-500" />
//             </div>
//         );
//     }

//     if (isError) {
//         return <div className="text-center text-red-500 mt-16">Error loading products!</div>;
//     }

//     return (

//         <div className="container mx-auto px-4 mt-16">

//             <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b border-b-gray-300 pb-4">
//                 Explore All Products
//             </h2>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

//                 {products.map((product, index) => {

//                     // Agar yeh array ka aakhiri product hai, toh ispe 'ref' laga do

//                     if (products.length === index + 1) {
//                         return (
//                             <div ref={lastProductElementRef} key={product.uid}>
//                                 {/* <ProductCard product={product} /> */}
//                                 <SpecListLayout product={product} key={index} />
//                             </div>
//                         );
//                     } else {
//                         return <SpecListLayout product={product} key={index} />
//                     }

//                 })}
//             </div>

//             {isFetchingNextPage && (
//                 <div className="flex justify-center items-center py-10 mt-4">
//                     <AiOutlineLoading3Quarters className="animate-spin h-10 w-10 text-blue-500" />
//                 </div>
//             )}

//             {!hasNextPage && products.length > 0 && (
//                 <div className="text-center py-10 text-gray-500 font-medium">
//                     You have seen all the products! 🎉
//                 </div>
//             )}

//         </div>

//     );
    
// };

// export default FeaturedProduct;



import React, { useRef, useCallback } from 'react';
import axios from 'axios';
import SpecListLayout from './layout/SpecListLayout';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import API_BASE_URL from '../config/config';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchFeaturedProducts = async ({ pageParam = 1 }) => {
    const res = await axios.get(`${API_BASE_URL}/api/products/homepage/?page=${pageParam}`);
    return res.data.trending_products;
}

const FeaturedProduct = () => {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['featuredProducts'],
        queryFn: fetchFeaturedProducts,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (!lastPage.next) return undefined;
            return lastPageParam + 1;
        },
        staleTime: 1000 * 60 * 5,
    })

    const products = data ? data.pages.flatMap(page => page.results) : [];

    const observer = useRef();

    const lastProductElementRef = useCallback(node => {
        if (isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);


    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16 sm:py-20 mt-10 sm:mt-16">
                <AiOutlineLoading3Quarters className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-blue-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-500 mt-10 sm:mt-16 text-sm sm:text-base">
                Error loading products!
            </div>
        );
    }

    return (

        <div className="container mx-auto px-3 sm:px-4 mt-10 sm:mt-16">

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-5 sm:mb-8 text-center border-b border-b-gray-300 pb-3 sm:pb-4">
                Explore All Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">

                {products.map((product, index) => {
                    if (products.length === index + 1) {
                        return (
                            <div ref={lastProductElementRef} key={product.uid}>
                                <SpecListLayout product={product} />
                            </div>
                        );
                    }
                    return <SpecListLayout product={product} key={product.uid} />;
                })}

            </div>

            {isFetchingNextPage && (
                <div className="flex justify-center items-center py-8 sm:py-10 mt-4">
                    <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
                </div>
            )}

            {!hasNextPage && products.length > 0 && (
                <div className="text-center py-8 sm:py-10 text-gray-500 font-medium text-sm sm:text-base">
                    You have seen all the products! 🎉
                </div>
            )}

        </div>
    );
};

export default FeaturedProduct;