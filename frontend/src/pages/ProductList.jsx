import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API_BASE_URL from '../config/config.js';

const ProductList = () => {

    const { slug } = useParams()

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products/${slug}`)
            .then((res) => res.json())
            .then((data) => { console.log(data.data), console.log(data.sub_categories) })
    }, [])

    return (

        <div>

            <div>

            </div>

            <div className='flex min-h-300'>

                <div className='flex-1 h-full border'>
                    Hi
                </div>

                <div className='flex-4 h-full border'>
                    Hi
                </div>

            </div>

        </div>

    )

}

export default ProductList
