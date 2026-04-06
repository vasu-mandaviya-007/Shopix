import { Skeleton } from "@mui/material";
import Skel from "./Skel";

const ProductListSkeleton = () => {
    return (
        <div className="p-2">

            {/* Breadcrom Skeleton */}
            <Skel className="h-5 mx-2! my-2!" />

            <div className="flex gap-2 mt-4 px-2">

                {/* 1. Sidebar */}
                <Skel className="h-[82vh] w-70" />

                {/* 2. Main Content */}
                <div className="flex-1 px-6 pb-6">

                    <div className='flex items-center justify-between pr-4 mb-2'>
                        <Skel className="w-35 h-8 mb-6" />
                        <Skel className="w-10 h-5 mb-6" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        
                        {
                            Array.from({length : 4}).map((_,index) => (
                                <Skel key={index} className="h-100" />
                            ))
                        }

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductListSkeleton;
