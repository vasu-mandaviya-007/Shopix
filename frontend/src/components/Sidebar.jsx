import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion"
import { Button, Checkbox, IconButton } from '@mui/material';
import { FiPlus, FiMinus, FiArrowDown, FiArrowUp } from "react-icons/fi";
import { FaAngleDown, FaAngleUp, FaXmark } from "react-icons/fa6"



const Sidebar = ({ isOpenMenu, setSearchParams, searchParams, setIsOpenMenu, slug, selectedFilters, setSelectedFilters, availableFilters = [], category_name, sub_category }) => {

    const [categories, setCategories] = useState(sub_category || []);
    const [isOpen, setIsOpen] = useState(true)
    const [expandFilterId, setExpandFilterId] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        !sub_category?.length > 0 && setIsOpen(false)
    }, [slug, sub_category])

    useEffect(() => {
        setCategories(sub_category)
    }, [sub_category])

    const appliedFilters = []
    const excludeParams = ["page", "sort", "q", "category"]

    searchParams.forEach((valueStr, key) => {
        if (!excludeParams.includes(key) && valueStr) {
            const valArr = valueStr.split(",");
            valArr.forEach(val => {
                appliedFilters.push({ key: key, value: val })
            })
        }
    })

    const handleFilterChange = (filterName, optionValue) => {

        setIsOpenMenu(false)
        // setSelectedFilters((prevFilters) => {
        //     // If the option is already selected, uncheck it (set to null/remove it)
        //     if (prevFilters[filterName] && prevFilters[filterName].includes(option)) {
        //         const updatedFilters = [...prevFilters[filterName]];
        //         const return_option = updatedFilters.filter(o => o !== option)
        //         console.log(return_option.length)
        //         if (return_option.length > 0) {
        //             return { ...prevFilters, [filterName]: return_option };
        //         } else {
        //             const updatedFilters = { ...prevFilters };
        //             delete updatedFilters[filterName];
        //             console.log("updated filter", updatedFilters)
        //             return updatedFilters;
        //         }
        //     }
        //     // Otherwise, select the new option
        //     return {
        //         ...prevFilters,
        //         [filterName]: prevFilters[filterName] ? [...prevFilters[filterName], option] : [option],
        //     };
        // });


        // 1. Current URL parameters uthao
        const newParams = new URLSearchParams(searchParams);

        // 2. Pehle se selected values nikalo (Agar hain, toh comma se split karke array banao)
        const currentValuesString = newParams.get(filterName);
        let currentValuesArray = currentValuesString ? currentValuesString.split(',') : [];

        // 3. Check/Uncheck Logic
        if (currentValuesArray.includes(optionValue)) {
            // Agar pehle se checked tha, toh use array se hata do (Uncheck)
            currentValuesArray = currentValuesArray.filter(val => val !== optionValue);
        } else {
            // Agar checked nahi tha, toh array mein daal do (Check)
            currentValuesArray.push(optionValue);
        }

        // 4. URL Update karo
        if (currentValuesArray.length > 0) {
            // Array ko wapas comma-string banakar URL mein set karo
            newParams.set(filterName, currentValuesArray.join(','));
        } else {
            // Agar user ne saare untick kar diye, toh filter ko URL se hi hata do
            newParams.delete(filterName);
        }

        // 5. Page ko hamesha 1 par reset karo jab bhi naya filter lage
        newParams.set('page', 1);

        // 6. URL update kar do (Isse automatically useEffect chal jayega)
        setSearchParams(newParams);

    };


    return (

        // <div style={{ scrollbarWidth: "thin" }} className={`w-full md:w-70 bg-white shadow-xl top-20 h-[calc(100vh-88px)] p-4 border border-gray-100 overflow-y-auto fixed ${isOpenMenu ? "translate-x-0" : "-translate-x-full"} duration-300 left-0 z-10 md:z-1 md:translate-x-0 md:sticky md:block `}>
        <div style={{ scrollbarWidth: "thin" }} className={`w-full md:w-65 lg:w-60 xl:w-70 bg-white shadow-xl top-16 lg:top-20 h-screen md:h-[calc(100vh-88px)] p-4 border border-gray-100 overflow-y-auto fixed ${isOpenMenu ? "translate-x-0" : "-translate-x-full"} duration-300 left-0 z-10 lg:z-1 lg:translate-x-0 lg:sticky lg:block `}>

            <div className='relative'>

                {/* <div className='absolute top-0 left-0 h-full w-full bg-white/60 z-5'></div> */}

                <div className='mb-3 pb-3 border-b border-b-gray-200'>

                    <div className='flex justify-between items-center'>

                        <h3 className="font-bold text-lg ">Filters</h3>

                        <IconButton color='error' className='block lg:hidden!' size='small' onClick={() => setIsOpenMenu(!isOpenMenu)}>
                            <FaXmark />
                        </IconButton>

                        {
                            selectedFilters && Object.keys(selectedFilters).length > 0 &&
                            <Button onClick={() => setSelectedFilters({})} variant='text' size='small' >clear all</Button>
                        }

                    </div>

                    {
                        appliedFilters && Object.keys(appliedFilters).length > 0 &&

                        <div className='mt-2 max-h-25 overflow-hidden relative pb-6'>

                            <div className=' flex flex-wrap gap-2 text-xs text-gray-800'>

                                {
                                    appliedFilters.map((filter, index) => (
                                        <button key={index} onClick={() => handleFilterChange(filter.key, filter.value)} className='rounded-sm cursor-pointer hover:line-through border border-gray-300 bg-gray-200 hover:bg-gray-300 p-2 inline-flex items-center gap-1'> <FaXmark /> {filter.value}</button>
                                        // value?.map((val, i) => (
                                        // ))
                                    ))
                                }

                            </div>

                            <button className='absolute bottom-0 bg-white w-full cursor-pointer text-left text-blue-500 text-sm font-semibold' onClick={(e) => e.target.parentElement.classList.toggle('max-h-25')}>See more</button>

                        </div>
                    }

                </div>

                {/* <button onClick={() => console.log(selectedFilters)}>Print</button> */}

                <div className='bg-white dark:bg-sidebar-dark category-container rounded overflow-hidden border-b border-b-black/10 dark:border-b-white/25'>

                    <Button
                        onClick={(e) => { categories.length > 0 && setIsOpen(!isOpen) }}
                        endIcon={categories?.length > 0 ? isOpen ? <FiMinus /> : <FiPlus /> : <></>}
                        className={`${isOpen ? "bg-[#F5F7FC]! dark:bg-sidebar-dark-active!" : ""} w-full! text-black/70! dark:text-white/90! normal-case! text-sm! text-left! justify-between! py-3! px-4! font-semibold`}
                    >
                        {category_name}
                    </Button>

                    {/* <CategoryItem key={cat.uid} category={cat} /> */}
                    <AnimatePresence >

                        {isOpen &&

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: isOpen ? "auto" : 0,
                                    opacity: isOpen ? 1 : 0,
                                }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <ul className='category-list space-y-1 text-black dark:text-[#b3b3b3] px-4 pb-4 pt-2 '>
                                    {categories && categories.map(category => (

                                        <li key={category.uid} className='flex items-center gap-3 px-2 py-1.5 '>
                                            <Link to={`/products/${category.slug}`} className='w-full cursor-pointer text-[13px]' >
                                                {category.name}
                                            </Link>
                                        </li>

                                    ))}
                                </ul>
                            </motion.div>
                        }
                    </AnimatePresence>

                </div>

                {
                    availableFilters.map((filter, index) => {

                        const activeValuesString = searchParams.get(filter.filterName);
                        const activeValuesArray = activeValuesString ? activeValuesString.split(',') : [];

                        return (

                            <div key={index} className='bg-white dark:bg-sidebar-dark category-container rounded overflow-hidden border-b border-b-black/10 dark:border-b-white/25'>

                                <Button
                                    onClick={(e) => { setExpandFilterId(expandFilterId === index ? null : index) }}
                                    endIcon={expandFilterId === index ? <FaAngleUp className='text-sm!' /> : <FaAngleDown className='text-sm!' />}
                                    // endIcon={expandFilterId === index ? <FiMinus /> : <FiPlus />}
                                    className={`${expandFilterId === index ? "bg-[#F5F7FC]! dark:bg-sidebar-dark-active!" : ""} w-full! text-black/80! dark:text-white/90! normal-case! text-[13px]! text-left! justify-between! py-3! px-4! font-medium!`}
                                >
                                    {filter.filterName}
                                </Button>

                                {/* <CategoryItem key={cat.uid} category={cat} /> */}
                                <AnimatePresence >

                                    {expandFilterId === index &&

                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: expandFilterId === index ? "auto" : 0,
                                                opacity: expandFilterId === index ? 1 : 0,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <ul className='category-list  text-gray-600 dark:text-[#b3b3b3] px-2 pb-4  pt-2  '>

                                                {filter.options && filter.options.map((option, id) => (

                                                    <li key={id} className='flex items-center gap-3'>
                                                        <Checkbox
                                                            id={`${option + id}`}
                                                            value={option}
                                                            onChange={() => handleFilterChange(filter.filterName, option)}
                                                            // checked={selectedFilters[filter.filterName] && selectedFilters[filter.filterName]?.includes(option) ? true : false}
                                                            checked={activeValuesArray.includes(option)}
                                                            className='dark:text-white/80!'
                                                            size="small"
                                                        />
                                                        <label className='cursor-pointer text-[13px]' htmlFor={`${option + id}`}>{option}</label>
                                                    </li>

                                                ))}
                                            </ul>
                                        </motion.div>
                                    }
                                </AnimatePresence>

                            </div>

                        )
                    })
                }
            </div>


        </div>
    );
};

export default Sidebar;