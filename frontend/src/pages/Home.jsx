import React, { useContext } from 'react'
import Hero from '../components/Hero'
import FeaturedProduct from '../components/FeaturedProduct'
import CategoryList from '../components/CategoryList'
import { ShopContext } from '../context/ShopContext'
import DealsOfTheDay from '../components/DealsOfTheDay'

const Home = () => {
    

    return (
        <div className='container mx-auto px-4 lg:px-10 mb-6 lg:mb-16'>
            <Hero />
            <CategoryList  />
            <DealsOfTheDay /> 
            <FeaturedProduct /> 
        </div>
    )
}

export default Home
