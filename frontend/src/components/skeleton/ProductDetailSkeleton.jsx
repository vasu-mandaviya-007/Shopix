// import React from 'react'
// import Skel from './Skel'

// const ProductDetailSkeleton = () => {
//     return (
//         <div className="container lg:px-10 max-md:px-10 mx-auto mt-10">

//             {/* Breadcrom Skeleton */} 
//             <Skel className="w-full h-5 mb-6!" />

//             <div className="flex items-start flex-col md:flex-row justify-between xl:gap-20 lg:gap-10 gap-6">

//                 {/* Left Side */}
//                 <div className="flex-5 md:sticky top-10">

//                     {/* Image Section */}
//                     <div className='flex gap-7 mb-10'>

//                         <div className='w-full'>

//                             <Skel className="w-full h-96 md:h-120 lg:h-120!" />

//                             {/* Sub Images */}
//                             <div style={{ scrollbarWidth: "thin" }} className='mt-4 flex overflow-x-auto gap-4'>
//                                 {
//                                     Array.from({ length: 4 }).map((_, index) => (
//                                         // <Skeleton key={index} className="w-20! h-20! m-0! " />
//                                         <Skel key={index} className="h-20 w-20" />
//                                     ))
//                                 }
//                             </div>

//                         </div>

//                         <div className='flex flex-col gap-4'>
//                             <Skel className="w-10 h-10" />
//                             <Skel className="w-10 h-10" />
//                         </div>

//                     </div>

//                 </div>

//                 {/* Right Side */}

//                 <div className="flex-6 top-0">
//                     <Skel className="w-1/4 h-8 mb-6" />
//                     <Skel className="w-full h-8 mb-6" />
//                     <Skel className="w-1/2 h-6 mb-4" />
//                     <Skel className="w-1/4 h-6 mb-4" />
//                 </div>

//             </div>

//         </div>
//     )
// }

// export default ProductDetailSkeleton



// import React from 'react'
// import Skel from './Skel'

// const ProductDetailSkeleton = () => {
//     return (
//         <div className="container px-3 sm:px-4 lg:px-10 mx-auto mt-4 sm:mt-6 lg:mt-10">

//             {/* Breadcrumb Skeleton */}
//             <Skel className="w-48 sm:w-64 h-4 mb-4 sm:mb-6!" />

//             <div className="flex items-start flex-col md:flex-row justify-between xl:gap-20 lg:gap-10 gap-4 sm:gap-6">

//                 {/* Left Side — Image */}
//                 <div className="w-full md:flex-5 md:sticky md:top-10">

//                     <div className='flex gap-3 sm:gap-5 lg:gap-7 mb-6 sm:mb-10'>

//                         <div className='w-full'>

//                             {/* Main Image */}
//                             <Skel className="w-full h-64 sm:h-80 md:h-96 lg:h-120!" />

//                             {/* Thumbnails */}
//                             <div style={{ scrollbarWidth: "thin" }} className='mt-3 sm:mt-4 flex overflow-x-auto gap-2 sm:gap-3 md:gap-4'>
//                                 {Array.from({ length: 4 }).map((_, index) => (
//                                     <Skel key={index} className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 shrink-0" />
//                                 ))}
//                             </div>

//                         </div>

//                         {/* Share / Wishlist buttons */}
//                         <div className='flex flex-col gap-2 sm:gap-4'>
//                             <Skel className="w-8 h-8 sm:w-10 sm:h-10" />
//                             <Skel className="w-8 h-8 sm:w-10 sm:h-10" />
//                         </div>

//                     </div>

//                 </div>

//                 {/* Right Side — Info */}
//                 <div className="w-full md:flex-6">

//                     {/* Brand */}
//                     <Skel className="w-1/4 h-5 sm:h-6 mb-3 sm:mb-4!" />

//                     {/* Title */}
//                     <Skel className="w-full h-6 sm:h-8 mb-2 sm:mb-3!" />
//                     <Skel className="w-3/4 h-6 sm:h-8 mb-4 sm:mb-6!" />

//                     {/* Price */}
//                     <Skel className="w-1/3 h-7 sm:h-8 mb-3 sm:mb-4!" />

//                     {/* Discount */}
//                     <Skel className="w-1/4 h-5 sm:h-6 mb-4 sm:mb-6!" />

//                     {/* Variant label */}
//                     <Skel className="w-1/3 h-4 sm:h-5 mb-3 sm:mb-4!" />

//                     {/* Variant options */}
//                     <div className='flex gap-2 sm:gap-3 mb-4 sm:mb-6'>
//                         {Array.from({ length: 4 }).map((_, i) => (
//                             <Skel key={i} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
//                         ))}
//                     </div>

//                     {/* Another variant row */}
//                     <Skel className="w-1/3 h-4 sm:h-5 mb-3 sm:mb-4!" />
//                     <div className='flex gap-2 sm:gap-3 mb-6 sm:mb-8'>
//                         {Array.from({ length: 3 }).map((_, i) => (
//                             <Skel key={i} className="w-16 h-8 sm:w-20 sm:h-9 rounded-md" />
//                         ))}
//                     </div>

//                     {/* CTA Buttons */}
//                     <div className='flex gap-2 sm:gap-4'>
//                         <Skel className="flex-1 h-10 sm:h-11 rounded-md" />
//                         <Skel className="flex-1 h-10 sm:h-11 rounded-md" />
//                     </div>

//                 </div>

//             </div>

//         </div>
//     )
// }

// export default ProductDetailSkeleton


import React from 'react'
import Skel from './Skel'

const ProductDetailSkeleton = () => {
    return (
        <div className="container px-3 sm:px-4 lg:px-10 mx-auto mt-4 sm:mt-6 lg:mt-8">

            {/* Breadcrumb */}
            <div className='hidden sm:flex items-center gap-2 mb-4 sm:mb-6'>
                <Skel className="w-8 h-3" />
                <Skel className="w-2 h-3" />
                <Skel className="w-16 h-3" />
                <Skel className="w-2 h-3" />
                <Skel className="w-24 h-3" />
            </div>

            {/* Main Layout */}
            <div className='flex items-start flex-col md:flex-row justify-between xl:gap-20 lg:gap-10 gap-4 sm:gap-6'>

                {/* ── Left: Image Section ── */}
                <div className='w-full md:min-w-5/11 md:max-w-5/11'>
                    <div className='relative flex gap-3 sm:gap-5 lg:gap-7 w-full mb-6 sm:mb-10'>

                        <div className='w-full sm:w-9/10 sm:min-w-9/10'>

                            {/* Main Product Image */}
                            <Skel className="w-full h-64 sm:h-80 md:h-96 lg:h-120!" />

                            {/* Thumbnail Strip */}
                            <div className='mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skel key={i} className="min-w-14 h-14 sm:min-w-18 sm:h-18 md:min-w-20 md:h-20! shrink-0" />
                                ))}
                            </div>
                        </div>

                        {/* Share / Wishlist buttons */}
                        <div className='max-sm:absolute max-sm:right-1 max-sm:top-2 flex flex-col gap-2 sm:gap-4'>
                            <Skel className="w-8 h-8 sm:w-10 sm:h-10" />
                            <Skel className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>

                    </div>
                </div>

                {/* ── Right: Product Info ── */}
                <div className='w-full md:w-6/11 md:max-w-6/11'>

                    {/* Brand */}
                    <Skel className="w-20 sm:w-24 h-4 sm:h-5 mb-2 sm:mb-3!" />

                    {/* Title — 2 lines like real title */}
                    <Skel className="w-full h-5 sm:h-6 mb-2!" />
                    <Skel className="w-3/4 h-5 sm:h-6 mb-4 sm:mb-6!" />

                    {/* Price row + Rating row */}
                    <div className='flex items-start justify-between gap-3 mt-4 sm:mt-6 flex-wrap'>
                        <div className='flex items-end gap-2 sm:gap-4 flex-wrap'>
                            {/* Price */}
                            <Skel className="w-24 sm:w-28 h-7 sm:h-8!" />
                            {/* MRP strikethrough */}
                            <Skel className="w-16 sm:w-20 h-5 sm:h-6!" />
                            {/* % off */}
                            <Skel className="w-12 sm:w-14 h-5!" />
                        </div>
                        {/* Rating stars + review count */}
                        <div className='flex items-center gap-1'>
                            <Skel className="w-20 sm:w-24 h-4 sm:h-5!" />
                            <Skel className="w-16 h-4!" />
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className='py-4 sm:py-5 my-4 sm:my-5 border-t border-b border-gray-200'>

                        {/* "Variants Available : X" */}
                        <Skel className="w-36 sm:w-44 h-4 sm:h-5 mb-3 sm:mb-4!" />

                        <div className='grid gap-4 sm:gap-6'>

                            {/* Variant row 1 — Color (image swatches) */}
                            <div>
                                <Skel className="w-28 sm:w-32 h-3.5 sm:h-4 mb-3 sm:mb-4!" />
                                <div className='flex gap-2 sm:gap-3 flex-wrap'>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <Skel key={i} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16!" />
                                    ))}
                                </div>
                            </div>

                            {/* Variant row 2 — Text buttons (e.g. RAM / Storage) */}
                            <div>
                                <Skel className="w-24 sm:w-28 h-3.5 sm:h-4 mb-3 sm:mb-4!" />
                                <div className='flex gap-2 sm:gap-3 flex-wrap'>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skel key={i} className="w-14 sm:w-16 h-8 sm:h-9!" />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* CTA Buttons — Add to Cart + Buy Now */}
                    <div className='flex gap-2 sm:gap-4 mt-6 sm:mt-10'>
                        <Skel className="flex-1 h-9 sm:h-11!" />
                        <Skel className="flex-1 h-9 sm:h-11!" />
                    </div>

                </div>
            </div>

            {/* ── Product Tabs ── */}
            <div className="mt-10 sm:mt-16">

                {/* Tab buttons row */}
                <div className='flex gap-4 sm:gap-8 border-b border-gray-200 pb-0'>
                    <Skel className="w-20 sm:w-24 h-4 sm:h-5 mb-3!" />
                    <Skel className="w-24 sm:w-28 h-4 sm:h-5 mb-3!" />
                </div>

                {/* Tab content area — mimics description box */}
                <div className="mt-4 sm:mt-8 border border-gray-200 rounded-md p-4 sm:p-6 lg:p-10">
                    <Skel className="w-40 sm:w-52 h-6 sm:h-7 mb-4 sm:mb-8!" />
                    <Skel className="w-full h-4 mb-3!" />
                    <Skel className="w-full h-4 mb-3!" />
                    <Skel className="w-5/6 h-4 mb-3!" />
                    <Skel className="w-full h-4 mb-3!" />
                    <Skel className="w-4/6 h-4!" />
                </div>

            </div>

        </div>
    )
}

export default ProductDetailSkeleton

