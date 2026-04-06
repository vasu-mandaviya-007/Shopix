import { ImSpinner3 } from "react-icons/im";
import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
const Loading = ({ size = 20, variant = "loader", className = "" }) => {

    return (

        <div className='flex justify-center items-center' >

            {
                variant === "spinner"
                    ?
                    <ImSpinner3 size={size} className={`${className} animate-spin my-5`} />
                    :
                    <AiOutlineLoading3Quarters size={size} className={`${className} text-blue-700 animate-spin [animation-duration:.8s] my-5`} />
            }




        </div>
 
    )
}

export default Loading
