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

    { id: 1, icon: <HiUserCircle className="" size={25} />, name: "Profile Information", to: "/profile" },
    { id: 2, icon: <BsFillBoxSeamFill className="text-xl" />, name: "Orders", to: "/profile/orders" },
    { id: 3, icon: <FaRegAddressBook className="text-xl" />, name: "Addresses", to: "/profile/address" },
]

const ProfileDashbord = () => {

    const {user} = useContext(AuthContext);

    return (

        <div className='p-10 bg-gray-50 '>

            <div className='max-w-7xl mx-auto rounded-lg bg-white flex min-h-[80vh] shadow '>

                <div className='flex-1 border-r border-gray-200'>

                    <div className='border-b border-gray-200 p-4 flex items-center gap-4'>
                        <div className='h-15 rounded-full relative aspect-square overflow-hidden '>
                            <img src={user?.profile_pic || default_avatar} className='absolute top-1/2 left-1/2 h-full -translate-1/2' alt="" />

                        </div>
                        <div>
                            <p>Hello</p>
                            <span className='font-bold'>{user?.first_name} {user?.last_name} </span>
                        </div>
                    </div>

                    <div className='h-full p-2 space-y-2'>

                        {
                            tabs.map((tab, index) => (
                                <NavLink to={tab.to} end={tab.to === '/profile'} key={index} className={({ isActive }) => `border-b border-gray-200 rounded-md p-4 text-sm flex items-center text-gray-600 gap-4 ${isActive ? "bg-blue-50 font-semibold" : "hover:bg-gray-100 font-medium"}`} >
                                    <div className="flex items-center justify-baseline gap-4">
                                        {tab.icon}
                                        <p>{tab.name}</p>
                                    </div>
                                </NavLink>
                            ))
                        }

                        <div className={`border-b border-gray-200 rounded-md p-4 text-sm flex items-center text-gray-600 gap-4 hover:bg-red-400 cursor-pointer hover:text-white hover:font-bold font-medium `} >
                            <div className="flex items-center justify-baseline gap-4">
                                <FaPowerOff size={20} />
                                <p>Logout</p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='flex-3 w-full'>

                    <Outlet />

                </div>

            </div>

        </div >

    )

}

export default ProfileDashbord
