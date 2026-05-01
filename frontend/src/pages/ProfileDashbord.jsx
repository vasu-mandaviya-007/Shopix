// import { HiUserCircle } from "react-icons/hi";
// import { FaPowerOff, FaRegAddressBook } from "react-icons/fa";
// import { BsFillBoxSeamFill } from "react-icons/bs";
// import { CgProfile } from "react-icons/cg";
// import React, { useContext } from 'react'
// import { NavLink, Outlet } from 'react-router-dom'
// import { LogOut } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";
// import default_avatar from "../assets/default-avatar.png"

// const tabs = [

//     { id: 1, icon: <HiUserCircle className="" size={25} />, name: "Profile Information", to: "/profile" },
//     { id: 2, icon: <BsFillBoxSeamFill className="text-xl" />, name: "Orders", to: "/profile/orders" },
//     { id: 3, icon: <FaRegAddressBook className="text-xl" />, name: "Addresses", to: "/profile/address" },
// ]

// const ProfileDashbord = () => { 

//     const {user} = useContext(AuthContext);

//     return (

//         <div className='p-10 bg-gray-50 '>

//             <div className='max-w-7xl mx-auto rounded-lg bg-white flex min-h-[80vh] shadow '>

//                 <div className='flex-1 border-r border-gray-200'>

//                     <div className='border-b border-gray-200 p-4 flex items-center gap-4'>
//                         <div className='h-15 rounded-full relative aspect-square overflow-hidden '>
//                             <img src={user?.profile_pic || default_avatar} className='absolute top-1/2 left-1/2 h-full -translate-1/2' alt="" />

//                         </div>
//                         <div>
//                             <p>Hello</p>
//                             <span className='font-bold'>{user?.first_name} {user?.last_name} </span>
//                         </div>
//                     </div>

//                     <div className='h-full p-2 space-y-2'>

//                         {
//                             tabs.map((tab, index) => (
//                                 <NavLink to={tab.to} end={tab.to === '/profile'} key={index} className={({ isActive }) => `border-b border-gray-200 rounded-md p-4 text-sm flex items-center text-gray-600 gap-4 ${isActive ? "bg-blue-50 font-semibold" : "hover:bg-gray-100 font-medium"}`} >
//                                     <div className="flex items-center justify-baseline gap-4">
//                                         {tab.icon}
//                                         <p>{tab.name}</p>
//                                     </div>
//                                 </NavLink>
//                             ))
//                         }

//                         <div className={`border-b border-gray-200 rounded-md p-4 text-sm flex items-center text-gray-600 gap-4 hover:bg-red-400 cursor-pointer hover:text-white hover:font-bold font-medium `} >
//                             <div className="flex items-center justify-baseline gap-4">
//                                 <FaPowerOff size={20} />
//                                 <p>Logout</p>
//                             </div>
//                         </div>

//                     </div>

//                 </div>

//                 <div className='flex-3 w-full'>

//                     <Outlet />

//                 </div>

//             </div> 

//         </div >

//     )

// }

// export default ProfileDashbord



// import { HiUserCircle } from "react-icons/hi";
// import { FaPowerOff, FaRegAddressBook } from "react-icons/fa";
// import { BsFillBoxSeamFill } from "react-icons/bs";
// import { CgProfile } from "react-icons/cg";
// import React, { useContext } from 'react'
// import { NavLink, Outlet } from 'react-router-dom'
// import { LogOut } from "lucide-react";
// import { AuthContext } from "../context/AuthContext";
// import default_avatar from "../assets/default-avatar.png"

// const tabs = [
//     { id: 1, icon: <HiUserCircle className="text-lg sm:text-xl" />, name: "Profile Information", to: "/profile" },
//     { id: 2, icon: <BsFillBoxSeamFill className="text-base sm:text-xl" />, name: "Orders", to: "/profile/orders" },
//     { id: 3, icon: <FaRegAddressBook className="text-base sm:text-xl" />, name: "Addresses", to: "/profile/address" },
// ]

// const ProfileDashbord = () => {

//     const {user} = useContext(AuthContext);

//     return (

//         <div className='p-4 md:p-10 bg-gray-50'>

//             <div className='max-w-7xl mx-auto rounded-lg bg-white flex flex-col md:flex-row min-h-[80vh] shadow'>

//                 <div className='w-full md:flex-1 md:w-auto border-b md:border-b-0 md:border-r border-gray-200'>

//                     <div className='border-b border-gray-200 p-4 flex items-center gap-4'>
//                         <div className='h-15 rounded-full relative aspect-square overflow-hidden '>
//                             {/* Tailwind me center ke liye -translate-x-1/2 -translate-y-1/2 use hota hai */}
//                             <img src={user?.profile_pic || default_avatar} className='absolute top-1/2 left-1/2 h-full -translate-x-1/2 -translate-y-1/2' alt="" />
//                         </div>
//                         <div>
//                             <p>Hello</p>
//                             <span className='font-bold'>{user?.first_name} {user?.last_name} </span>
//                         </div>
//                     </div>

//                     {/* Mobile par horizontal scroll aur Desktop par original space-y-2 */}
//                     <div className='h-full p-2 flex overflow-x-auto md:flex-col gap-2 md:gap-0 md:space-y-2 scrollbar-hidden'>

//                         {
//                             tabs.map((tab, index) => (
//                                 <NavLink to={tab.to} end={tab.to === '/profile'} key={index} className={({ isActive }) => `border border-transparent md:border-b md:border-gray-200 max-md:border-gray-200 rounded-md px-2 py-2 sm:p-3 md:p-4 text-mobile-3 sm:text-sm flex items-center text-gray-600 gap-4 shrink-0 ${isActive ? "bg-blue-50 font-semibold" : "hover:bg-gray-100 font-medium"}`} >
//                                     <div className="flex items-center justify-baseline gap-2 md:gap-4">
//                                         {tab.icon}
//                                         <p>{tab.name}</p>
//                                     </div>
//                                 </NavLink>
//                             ))
//                         }

//                         <div className={`border border-transparent md:border-b md:border-gray-200 max-md:border-gray-200 rounded-md px-2 py-2 sm:p-3 md:p-4 text-mobile-3 sm:text-sm flex items-center shrink-0 text-gray-600 gap-4 hover:bg-red-400 cursor-pointer hover:text-white hover:font-bold font-medium `} >
//                             <div className="flex items-center justify-baseline gap-2 md:gap-4">
//                                 <FaPowerOff className="text-base sm:text-xl" />
//                                 <p>Logout</p>
//                             </div>
//                         </div>

//                     </div>

//                 </div>

//                 <div className='w-full md:flex-3'>

//                     <Outlet />

//                 </div>

//             </div>

//         </div >

//     )

// }

// export default ProfileDashbord



import { HiUserCircle } from "react-icons/hi";
import { FaPowerOff, FaRegAddressBook } from "react-icons/fa";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import React, { useContext } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LogOut } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import default_avatar from "../assets/default-avatar.png"

const tabs = [
    { id: 1, icon: <HiUserCircle className="text-lg sm:text-xl" />, name: "Profile Information", to: "/profile" },
    { id: 2, icon: <BsFillBoxSeamFill className="text-base sm:text-xl" />, name: "Orders", to: "/profile/orders" },
    { id: 3, icon: <FaRegAddressBook className="text-base sm:text-xl" />, name: "Addresses", to: "/profile/address" },
]

const ProfileDashbord = () => {

    const {user} = useContext(AuthContext);

    return (

        <div className='p-4 md:p-8 lg:p-10 bg-gray-50'>

            {/* 🌟 FIX 1: Changed md:flex-row to lg:flex-row so tablet shows mobile layout */}
            <div className='max-w-7xl mx-auto rounded-lg bg-white flex flex-col lg:flex-row min-h-[80vh] shadow'>

                {/* 🌟 FIX 2: Fixed sidebar width explicitly to avoid squishing */}
                <div className='w-full lg:w-70 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200'>

                    <div className='border-b border-gray-200 p-4 flex items-center gap-4'>
                        <div className='h-15 w-15 rounded-full relative aspect-square overflow-hidden shrink-0'>
                            <img src={user?.profile_pic || default_avatar} className='absolute top-1/2 left-1/2 h-full w-full object-cover -translate-x-1/2 -translate-y-1/2' alt="" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Hello</p>
                            <span className='font-bold text-gray-800 line-clamp-1'>{user?.first_name} {user?.last_name} </span>
                        </div>
                    </div>

                    {/* 🌟 FIX 3: Shifted breakpoints from md: to lg: for horizontal scroll on tablet */}
                    <div className='h-full p-2 flex overflow-x-auto lg:flex-col gap-2 lg:gap-0 lg:space-y-2 scrollbar-hidden'>

                        {
                            tabs.map((tab, index) => (
                                <NavLink to={tab.to} end={tab.to === '/profile'} key={index} className={({ isActive }) => `border border-transparent lg:border-b lg:border-gray-200 max-lg:border-gray-200 rounded-md px-3 py-2 sm:px-4 sm:py-3 lg:p-4 text-sm flex items-center text-gray-600 gap-3 shrink-0 ${isActive ? "bg-blue-50 font-semibold text-blue-700" : "hover:bg-gray-100 font-medium"}`} >
                                    <div className="flex items-center justify-baseline gap-2 lg:gap-4">
                                        {tab.icon}
                                        <p className="whitespace-nowrap">{tab.name}</p>
                                    </div>
                                </NavLink>
                            ))
                        }

                        <div className={`border border-transparent lg:border-b lg:border-gray-200 max-lg:border-gray-200 rounded-md px-3 py-2 sm:px-4 sm:py-3 lg:p-4 text-sm flex items-center shrink-0 text-gray-600 gap-3 hover:bg-red-500 cursor-pointer hover:text-white hover:font-bold font-medium transition-colors`} >
                            <div className="flex items-center justify-baseline gap-2 lg:gap-4">
                                <FaPowerOff className="text-base sm:text-xl" />
                                <p className="whitespace-nowrap">Logout</p>
                            </div>
                        </div>

                    </div>

                </div>

                {/* 🌟 FIX 4: Removed invalid 'flex-3' and used standard flex-1 */}
                <div className='w-full flex-1'>
                    <Outlet />
                </div>

            </div>

        </div >

    )

}

export default ProfileDashbord