import React, { useContext } from 'react'
import Hero from '../components/Hero'
import FeaturedProduct from '../components/FeaturedProduct'
import CategoryList from '../components/CategoryList'
import { ShopContext } from '../context/ShopContext'
import DealsOfTheDay from '../components/DealsOfTheDay'
import BrandList from '../components/BrandList'

const Home = () => {


    return (
        <div className='container mx-auto px-4 sm:px-6 lg:px-10 mb-6 lg:mb-16 overflow-hidden'>

            <Hero />
            <CategoryList />
            <DealsOfTheDay />
            <BrandList className='mt-12 lg:mt-20' />
            <FeaturedProduct />

        </div>
    )
}

export default Home
