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

//         <div className='p-4 md:p-8 lg:p-10 bg-gray-50'>

//             {/* 🌟 FIX 1: Changed md:flex-row to lg:flex-row so tablet shows mobile layout */}
//             <div className='max-w-7xl mx-auto rounded-lg bg-white flex flex-col lg:flex-row min-h-[80vh] shadow'>

//                 {/* 🌟 FIX 2: Fixed sidebar width explicitly to avoid squishing */}
//                 <div className='w-full lg:w-70 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200'>

//                     <div className='border-b border-gray-200 p-4 flex items-center gap-4'>
//                         <div className='h-15 w-15 rounded-full relative aspect-square overflow-hidden shrink-0'>
//                             <img src={user?.profile_pic || default_avatar} className='absolute top-1/2 left-1/2 h-full w-full object-cover -translate-x-1/2 -translate-y-1/2' alt="" />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Hello</p>
//                             <span className='font-bold text-gray-800 line-clamp-1'>{user?.first_name} {user?.last_name} </span>
//                         </div>
//                     </div>

//                     {/* 🌟 FIX 3: Shifted breakpoints from md: to lg: for horizontal scroll on tablet */}
//                     <div className='h-full p-2 flex overflow-x-auto lg:flex-col gap-2 lg:gap-0 lg:space-y-2 scrollbar-hidden'>

//                         {
//                             tabs.map((tab, index) => (
//                                 <NavLink to={tab.to} end={tab.to === '/profile'} key={index} className={({ isActive }) => `border border-transparent lg:border-b lg:border-gray-200 max-lg:border-gray-200 rounded-md px-3 py-2 sm:px-4 sm:py-3 lg:p-4 text-sm flex items-center text-gray-600 gap-3 shrink-0 ${isActive ? "bg-blue-50 font-semibold text-blue-700" : "hover:bg-gray-100 font-medium"}`} >
//                                     <div className="flex items-center justify-baseline gap-2 lg:gap-4">
//                                         {tab.icon}
//                                         <p className="whitespace-nowrap">{tab.name}</p>
//                                     </div>
//                                 </NavLink>
//                             ))
//                         }

//                         <div className={`border border-transparent lg:border-b lg:border-gray-200 max-lg:border-gray-200 rounded-md px-3 py-2 sm:px-4 sm:py-3 lg:p-4 text-sm flex items-center shrink-0 text-gray-600 gap-3 hover:bg-red-500 cursor-pointer hover:text-white hover:font-bold font-medium transition-colors`} >
//                             <div className="flex items-center justify-baseline gap-2 lg:gap-4">
//                                 <FaPowerOff className="text-base sm:text-xl" />
//                                 <p className="whitespace-nowrap">Logout</p>
//                             </div>
//                         </div>

//                     </div>

//                 </div>

//                 {/* 🌟 FIX 4: Removed invalid 'flex-3' and used standard flex-1 */}
//                 <div className='w-full flex-1'>
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
// import React, { useContext } from 'react'
// import { NavLink, Outlet, useNavigate } from 'react-router-dom'
// import { AuthContext } from "../context/AuthContext";
// import { logout } from "../auth";
// import default_avatar from "../assets/default-avatar.png"

// const tabs = [
//     { id: 1, icon: <HiUserCircle className="text-xl" />, name: "Profile", to: "/profile" },
//     { id: 2, icon: <BsFillBoxSeamFill className="text-base" />, name: "Orders", to: "/profile/orders" },
//     { id: 3, icon: <FaRegAddressBook className="text-base" />, name: "Addresses", to: "/profile/address" },
// ]

// const ProfileDashboard = () => {

//     const { user, fetchUser } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logout();
//         fetchUser();
//         navigate("/");
//     };

//     return (
//         <div className='min-h-screen bg-gray-50'>

//             {/* ── Mobile Header ── */}
//             <div className='lg:hidden'>

//                 {/* User Banner */}
//                 <div className='bg-gradient-to-r from-slate-800 to-slate-700 px-4 pt-8 pb-16 relative overflow-hidden'>
//                     {/* decorative circles */}
//                     <div className='absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5' />
//                     <div className='absolute top-4 right-10 w-16 h-16 rounded-full bg-white/5' />

//                     <div className='flex items-center gap-4 relative z-10'>
//                         <div className='h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg shrink-0'>
//                             <img
//                                 src={user?.profile_pic || default_avatar}
//                                 className='w-full h-full object-cover'
//                                 alt="profile"
//                             />
//                         </div>
//                         <div>
//                             <p className='text-white/60 text-xs font-medium tracking-wide uppercase'>My Account</p>
//                             <h2 className='text-white font-bold text-lg leading-tight'>
//                                 {user?.first_name} {user?.last_name}
//                             </h2>
//                             <p className='text-white/50 text-xs mt-0.5 truncate max-w-[200px]'>{user?.email}</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tab Pills — float over banner */}
//                 <div className='px-3 -mt-8 relative z-10 mb-2'>
//                     <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-1.5 flex gap-1 overflow-x-auto scrollbar-hidden'>
//                         {tabs.map((tab) => (
//                             <NavLink
//                                 key={tab.id}
//                                 to={tab.to}
//                                 end={tab.to === '/profile'}
//                                 className={({ isActive }) =>
//                                     `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${isActive
//                                         ? 'bg-slate-800 text-white shadow-sm'
//                                         : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
//                                     }`
//                                 }
//                             >
//                                 {tab.icon}
//                                 {tab.name}
//                             </NavLink>
//                         ))}
//                         <button
//                             onClick={handleLogout}
//                             className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all shrink-0 ml-auto'
//                         >
//                             <FaPowerOff className="text-sm" />
//                             Logout
//                         </button>
//                     </div>
//                 </div>

//                 {/* Mobile Content */}
//                 <div className='px-3 py-2'>
//                     <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
//                         <Outlet />
//                     </div>
//                 </div>
//             </div>

//             {/* ── Desktop Layout ── */}
//             <div className='hidden lg:block p-6 xl:p-10'>
//                 <div className='max-w-6xl mx-auto flex gap-6 items-start'>

//                     {/* Sidebar */}
//                     <div className='w-72 shrink-0 sticky top-24'>

//                         {/* User Card */}
//                         <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-5 mb-3 relative overflow-hidden'>
//                             <div className='absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5' />
//                             <div className='absolute top-2 right-6 w-12 h-12 rounded-full bg-white/5' />
//                             <div className='flex items-center gap-3 relative z-10'>
//                                 <div className='h-12 w-12 rounded-xl overflow-hidden border-2 border-white/20 shrink-0'>
//                                     <img
//                                         src={user?.profile_pic || default_avatar}
//                                         className='w-full h-full object-cover'
//                                         alt="profile"
//                                     />
//                                 </div>
//                                 <div className='overflow-hidden'>
//                                     <p className='text-white/50 text-[10px] uppercase tracking-widest font-medium'>Account</p>
//                                     <p className='text-white font-bold text-sm leading-tight truncate'>
//                                         {user?.first_name} {user?.last_name}
//                                     </p>
//                                     <p className='text-white/40 text-[10px] truncate'>{user?.email}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Nav */}
//                         <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
//                             {tabs.map((tab, index) => (
//                                 <NavLink
//                                     key={tab.id}
//                                     to={tab.to}
//                                     end={tab.to === '/profile'}
//                                     className={({ isActive }) =>
//                                         `flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-none ${isActive
//                                             ? 'bg-slate-50 text-slate-800 font-semibold border-l-2 border-l-slate-800 pl-[14px]'
//                                             : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
//                                         }`
//                                     }
//                                 >
//                                     <span className={`shrink-0`}>{tab.icon}</span>
//                                     {tab.name}
//                                 </NavLink>
//                             ))}
//                             <button
//                                 onClick={handleLogout}
//                                 className='w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all'
//                             >
//                                 <FaPowerOff className="text-sm shrink-0" />
//                                 Logout
//                             </button>
//                         </div>
//                     </div>

//                     {/* Main Content */}
//                     <div className='flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[70vh]'>
//                         <Outlet />
//                     </div>

//                 </div>
//             </div>

//         </div>
//     );
// };

// export default ProfileDashboard;



import { HiUserCircle } from "react-icons/hi";
import { FaPowerOff, FaRegAddressBook } from "react-icons/fa";
import { BsFillBoxSeamFill } from "react-icons/bs";
import React, { useContext } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";
import { logout } from "../auth";
import default_avatar from "../assets/default-avatar.png"
import Swal from "sweetalert2";

const tabs = [
    { id: 1, icon: <HiUserCircle className="text-xl" />, name: "Profile", to: "/profile" },
    { id: 2, icon: <BsFillBoxSeamFill className="text-base" />, name: "Orders", to: "/profile/orders" },
    { id: 3, icon: <FaRegAddressBook className="text-base" />, name: "Addresses", to: "/profile/address" },
]

const ProfileDashboard = () => {

    const { user, fetchUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout?',
            text: "Are you sure you want to logout?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Logout',
            cancelButtonText: 'Stay',
            confirmButtonColor: '#1e293b',
            cancelButtonColor: '#c1c1c2',
            customClass: {
                cancelButton: '!text-gray-700',
                popup: '!rounded-xl',
                confirmButton: '!rounded-lg',
                cancelButton: '!rounded-lg',
            }
        });

        if (result.isConfirmed) {
            logout();
            fetchUser();
            navigate("/");
        }
    };

    const tabClass = ({ isActive }) =>
        `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${isActive
            ? 'bg-slate-800 text-white shadow-sm'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
        }`;

    const desktopTabClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-none ${isActive
            ? 'bg-slate-50 text-slate-800 font-semibold border-l-2 border-l-slate-800 pl-[14px]'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
        }`;

    return (
        <div className='min-h-screen bg-gray-50'>

            {/* ── Mobile / Tablet Layout (below lg) ── */}
            <div className='lg:hidden'>

                {/* Banner */}
                <div className='bg-linear-to-r from-slate-800 to-slate-700 px-4 pt-8 pb-16 relative overflow-hidden'>
                    <div className='absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5' />
                    <div className='absolute top-4 right-10 w-16 h-16 rounded-full bg-white/5' />
                    <div className='flex items-center gap-4 relative z-10'>
                        <div className='h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg shrink-0'>
                            <img src={user?.profile_pic || default_avatar} className='w-full h-full object-cover' alt="profile" />
                        </div>
                        <div className='overflow-hidden'>
                            <p className='text-white/50 text-mobile-1 uppercase tracking-widest font-medium'>My Account</p>
                            <h2 className='text-white font-bold text-base sm:text-lg leading-tight'>
                                {user?.first_name} {user?.last_name}
                            </h2>
                            <p className='text-white/40 text-xs mt-0.5 truncate max-w-55'>{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Floating Tab Pills */}
                <div className='px-3 -mt-8 relative z-10 mb-3'>
                    <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-1.5 flex gap-1 overflow-x-auto scrollbar-hidden'>
                        {tabs.map((tab) => (
                            <NavLink key={tab.id} to={tab.to} end={tab.to === '/profile'} className={tabClass}>
                                {tab.icon}
                                {tab.name}
                            </NavLink>
                        ))}
                        <button
                            onClick={handleLogout}
                            className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all shrink-0 ml-auto'
                        >
                            <FaPowerOff className="text-sm" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className='px-3 pb-6'>
                    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* ── Desktop Layout (lg+) ── */}
            <div className='hidden lg:block p-6 xl:p-10'>
                <div className='max-w-6xl mx-auto flex gap-6 items-start'>

                    {/* Sidebar */}
                    <div className='w-72 shrink-0 sticky top-24'>

                        <div className='bg-linear-to-br from-slate-800 to-slate-700 rounded-2xl p-5 mb-3 relative overflow-hidden'>
                            <div className='absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5' />
                            <div className='absolute top-2 right-6 w-12 h-12 rounded-full bg-white/5' />
                            <div className='flex items-center gap-3 relative z-10'>
                                <div className='h-12 w-12 rounded-xl overflow-hidden border-2 border-white/20 shrink-0'>
                                    <img src={user?.profile_pic || default_avatar} className='w-full h-full object-cover' alt="profile" />
                                </div>
                                <div className='overflow-hidden'>
                                    <p className='text-white/50 text-mobile-1 uppercase tracking-widest font-medium'>Account</p>
                                    <p className='text-white font-bold text-sm leading-tight truncate'>
                                        {user?.first_name} {user?.last_name}
                                    </p>
                                    <p className='text-white/40 text-mobile-1 truncate'>{user?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                            {tabs.map((tab) => (
                                <NavLink key={tab.id} to={tab.to} end={tab.to === '/profile'} className={desktopTabClass}>
                                    <span className='shrink-0'>{tab.icon}</span>
                                    {tab.name}
                                </NavLink>
                            ))}
                            <button
                                onClick={handleLogout}
                                className='w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-all'
                            >
                                <FaPowerOff className="text-sm shrink-0" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main */}
                    <div className='flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[70vh]'>
                        <Outlet />
                    </div>

                </div>
            </div>

        </div>
    );
};

export default ProfileDashboard;






