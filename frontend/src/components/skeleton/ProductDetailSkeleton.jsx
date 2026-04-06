import React from 'react'
import Skel from './Skel'

const ProductDetailSkeleton = () => {
    return (
        <div className="container lg:px-10 max-md:px-10 mx-auto mt-10">

            {/* Breadcrom Skeleton */} 
            <Skel className="w-full h-5 mb-6!" />

            <div className="flex items-start flex-col md:flex-row justify-between xl:gap-20 lg:gap-10 gap-6">

                {/* Left Side */}
                <div className="flex-5 md:sticky top-10">

                    {/* Image Section */}
                    <div className='flex gap-7 mb-10'>

                        <div className='w-full'>

                            <Skel className="w-full h-96 md:h-120 lg:h-120!" />

                            {/* Sub Images */}
                            <div style={{ scrollbarWidth: "thin" }} className='mt-4 flex overflow-x-auto gap-4'>
                                {
                                    Array.from({ length: 4 }).map((_, index) => (
                                        // <Skeleton key={index} className="w-20! h-20! m-0! " />
                                        <Skel key={index} className="h-20 w-20" />
                                    ))
                                }
                            </div>

                        </div>

                        <div className='flex flex-col gap-4'>
                            <Skel className="w-10 h-10" />
                            <Skel className="w-10 h-10" />
                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="flex-6 top-0">
                    <Skel className="w-1/4 h-8 mb-6" />
                    <Skel className="w-full h-8 mb-6" />
                    <Skel className="w-1/2 h-6 mb-4" />
                    <Skel className="w-1/4 h-6 mb-4" />
                </div>

            </div>

        </div>
    )
}

export default ProductDetailSkeleton
