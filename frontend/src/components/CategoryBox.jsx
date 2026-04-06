import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryBox = ({ category, hover_img = "",slug, image = "" }) => {

     const navigate = useNavigate();

     return (
          <div data-aos="fade-up" data-aos-once="false" data-aos-duration="1500" className='category-box bg-white dark:bg-dark-primary rounded overflow-hidden group relative shadow-sm dark:[box-shadow:inset_6px_6px_12px_rgba(0,0,0,0.5),inset_-6px_-6px_12px_rgba(255,255,255,.065)] flex items-center flex-col justify-center py-10 px-4'>

               <div
                    className='category-overlay absolute top-0 left-0 w-full h-full z-0'
                    style={{
                         background: `url(${hover_img})`,
                         backgroundPosition: "top",
                         backgroundSize: "cover"
                    }}
               ></div>
               <div className='z-2 text-center'>
                    <div className='w-full flex items-center justify-center'>
                         <div className='w-20 h-20 bg-[#f7f7f7] group-hover:bg-white rounded '>
                              <img src={image} alt="" />
                         </div>
                    </div>
                    <div className='mt-4 w-full flex flex-col gap-2'>
                         <h1 className='font-bold text-lg hover:text-sky-500 dark:text-white cursor-pointer'>{category}</h1>
                         <p className='text-blue-500 font-semibold text-sm'>110 Jobs</p>
                         <p className='text-[#919191] dark:text-gray-200 group-hover:text-white text-sm'>Software, Hardware, Seo</p>
                         <Button onClick={()=> navigate(`/products/${slug}`)} variant='outlined' className='hover:bg-primary! border-none! outline-1! group-hover:text-white! hover:text-white! hover:outline-primary! mt-3!' >
                              Show
                         </Button>
                    </div>
               </div>
          </div>
     );
}

export default CategoryBox;
