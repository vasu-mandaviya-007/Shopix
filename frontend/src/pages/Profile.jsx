// import { Button, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
// import React, { useContext, useEffect, useRef, useState } from 'react'
// import { FaPen } from 'react-icons/fa'
// import { NavLink } from 'react-router-dom'
// import { AuthContext } from '../context/AuthContext'
// import { getAccess } from '../auth'
// import default_avatar from "../assets/default-avatar.png"
// import API_BASE_URL from '../config/config'
// import { toast } from 'react-toastify'
// import { ImSpinner3 } from 'react-icons/im'


// const Profile = () => {

//     const profilePicRef = useRef(null)

//     const { user, fetchUser } = useContext(AuthContext);

//     const [isEditing, setIsEditing] = useState(false)
//     const [loading, setLoading] = useState(false)

//     const [profile, setProfile] = useState({
//         email: '',
//         first_name: '',
//         last_name: '',
//         phone_number: '',
//         profile_pic: '',
//     });

//     useEffect(() => {

//         setProfile(user)

//     }, [user])

//     const [profilePic, setProfilePic] = useState("")

//     const handleChange = (e) => {
//         setProfile({
//             ...profile,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleImageChange = (e) => {
//         const image = e.target.files[0]
//         if (image) {

//             setProfile({
//                 ...profile,
//                 profile_pic: URL.createObjectURL(image)
//             });

//             setProfilePic(image)
//         }
//     }

//     // const handleSave = () => {
//     //     console.log(profile)
//     // }

//     const handleSave = async () => {

//         setLoading(true)

//         // 🔥 FIX: Image bhejney ke liye FormData banayein
//         const formData = new FormData();
//         formData.append('first_name', profile.first_name || '');
//         formData.append('last_name', profile.last_name || '');
//         formData.append('phone_number', profile.phone_number || '');

//         // if (profile.date_of_birth) {
//         //     formData.append('date_of_birth', profile.date_of_birth);
//         // }

//         // Agar user ne nayi photo select ki hai, tabhi usko bhejenge
//         if (profilePic) {
//             formData.append('profile_pic', profilePic);
//             console.log(profilePic)
//         }

//         try {

//             const token = getAccess();

//             const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     // ⚠️ DHYAN DEIN: Yahan 'Content-Type' nahi likhna hai! 
//                     // Browser automatically 'multipart/form-data' set kar dega
//                 },
//                 body: formData // JSON ki jagah formData bhej rahe hain
//             });

//             if (response.ok) {
//                 // setIsEditing(false);
//                 // setImageFile(null); // File upload hone ke baad state clear karein
//                 setProfilePic(null);
//                 setIsEditing(false);
//                 fetchUser(); // Nayi photo ka URL laane ke liye dobara fetch karein
//                 toast.success("Profile updated");

//             } else {
//                 alert("Failed to update profile.");
//             }
//         } catch (error) {
//             console.error("Error updating profile:", error);
//         } finally {
//             setLoading(true)
//         }

//     };

//     return (

//         <div className='relative px-8 py-6'>

//             <div className='flex items-center justify-between'>

//                 <h1 className='font-semibold text-lg'>Personal Information</h1>
//                 {

//                     !isEditing && (
//                         <Button onClick={() => setIsEditing(true)} variant='contained' startIcon={<FaPen size={15} />}>
//                             Edit
//                         </Button>
//                     )
//                 }
//             </div>

//             <div className='mt-8'>

//                 <div onClick={() => { isEditing && !loading && profilePicRef.current.click() }} className='h-30 w-30 bg-gray-200 border border-gray-400 rounded-full group overflow-hidden relative cursor-pointer'>

//                     <input ref={profilePicRef} onChange={handleImageChange} type="file" accept='.png, .jpg, .jpeg' className='hidden' id='profile-pic' />

//                     {
//                         isEditing && !loading && (

//                             <div className='bg-white/50 text-black/90 font-semibold absolute text-center w-full h-full flex items-center justify-center rounded-full opacity-0 -z-1 pointer-events-none top-0 left-0 group-hover:opacity-100 group-hover:z-10' >
//                                 add profile <br /> pic
//                             </div>

//                         )
//                     }

//                     <img src={`${profile?.profile_pic || profilePic || default_avatar}`} className={`absolute top-1/2 left-1/2 h-full ${loading || !isEditing ? "cursor-default" : "cursor-pointer"} -translate-1/2`} alt="" />

//                 </div>

//                 <div className='flex mt-6 gap-5'>

//                     <div className='w-full'>

//                         <span className='text-black/70 font-semibold'>First Name</span>

//                         <TextField
//                             placeholder=''
//                             name='first_name'
//                             value={profile?.first_name || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing || loading}
//                             fullWidth
//                             className='mt-2!'
//                         // label="First Name"
//                         />
//                     </div>

//                     <div className='w-full'>

//                         <span className='text-black/70 font-semibold'>Last Name</span>

//                         <TextField
//                             placeholder=''
//                             name='last_name'
//                             value={profile?.last_name || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing || loading}
//                             fullWidth
//                             className='mt-2!'
//                         // label="Last Name"
//                         />

//                     </div>

//                 </div>

//                 {/* <div className='mt-6 pl-1'>

//                     <span className='text-black/70 font-semibold'>Gender</span>

//                     <RadioGroup
//                         aria-labelledby="demo-radio-buttons-group-label"
//                         defaultValue="male"
//                         name="radio-buttons-group"
//                         className='flex'
//                     >
//                         <div className='flex'>
//                             <FormControlLabel disabled={!isEditing || loading} value="female" control={<Radio />} label="Female" />
//                             <FormControlLabel disabled={!isEditing || loading} value="male" control={<Radio />} label="Male" />
//                         </div>
//                     </RadioGroup>
//                 </div> */}

//                 <div className='mt-6 w-1/2'>

//                     <span className='text-black/70 font-semibold'>Email</span>

//                     <TextField
//                         placeholder=''
//                         name='email'
//                         value={profile?.email || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing || loading}
//                         fullWidth
//                         className='mt-2!'
//                     // label="Email"
//                     />
//                 </div>

//                 <div className='mt-6 w-1/2'>

//                     <span className='text-black/70 font-semibold'>Phone Number</span>

//                     <TextField
//                         placeholder=''
//                         name='phone_number'
//                         value={profile?.phone_number || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing || loading}
//                         fullWidth
//                         className='mt-2!'
//                     // label="Email"
//                     />
//                 </div>

//                 {
//                     isEditing && (

//                         <div className='flex gap-5 mt-6'>

//                             <Button onClick={handleSave} loading={loading} loadingIndicator={<ImSpinner3 className='text-xl animate-spin' />} loadingPosition='start' className='py-4!' variant='contained' fullWidth  >
//                                 {
//                                     loading ? "Saving..." : "Save Changes"
//                                 }
//                             </Button>

//                             <Button onClick={() => setIsEditing(false)} className='py-4!' disabled={loading} variant='contained' color='warning' fullWidth  >
//                                 Cancel
//                             </Button>

//                         </div>
//                     )
//                 }

//             </div>

//         </div>
//     )
// }

// export default Profile



// import { Button, FormControlLabel, Radio, RadioGroup, TextField, useMediaQuery, useTheme } from '@mui/material'
// import React, { useContext, useEffect, useRef, useState } from 'react'
// import { FaPen } from 'react-icons/fa'
// import { NavLink } from 'react-router-dom'
// import { AuthContext } from '../context/AuthContext'
// import { getAccess } from '../auth'
// import default_avatar from "../assets/default-avatar.png"
// import API_BASE_URL from '../config/config'
// import { toast } from 'react-toastify'
// import { ImSpinner3 } from 'react-icons/im'


// const Profile = () => {

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     const profilePicRef = useRef(null)

//     const { user, fetchUser } = useContext(AuthContext);

//     const [isEditing, setIsEditing] = useState(false)
//     const [loading, setLoading] = useState(false)

//     const [profile, setProfile] = useState({
//         email: '',
//         first_name: '',
//         last_name: '',
//         phone_number: '',
//         profile_pic: '',
//     });

//     useEffect(() => {

//         setProfile(user)

//     }, [user])

//     const [profilePic, setProfilePic] = useState("")

//     const handleChange = (e) => {
//         setProfile({
//             ...profile,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleImageChange = (e) => {
//         const image = e.target.files[0]
//         if (image) {

//             setProfile({
//                 ...profile,
//                 profile_pic: URL.createObjectURL(image)
//             });

//             setProfilePic(image)
//         }
//     }

//     const handleSave = async () => {

//         setLoading(true)

//         const formData = new FormData();
//         formData.append('first_name', profile.first_name || '');
//         formData.append('last_name', profile.last_name || '');
//         formData.append('phone_number', profile.phone_number || '');

//         if (profilePic) {
//             formData.append('profile_pic', profilePic);
//             console.log(profilePic)
//         }

//         try {

//             const token = getAccess();

//             const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: formData
//             });

//             if (response.ok) {
//                 setProfilePic(null);
//                 setIsEditing(false);
//                 fetchUser();
//                 toast.success("Profile updated");

//             } else {
//                 alert("Failed to update profile.");
//             }
//         } catch (error) {
//             console.error("Error updating profile:", error);
//         } finally {
//             setLoading(false) // Fixed: Loading ko end me false karna zaroori hai
//         }

//     };

//     return (

//         <div className='relative px-4 py-5 md:px-8 md:py-6'>

//             <div className='flex items-center justify-between'>

//                 <h1 className='font-semibold text-lg'>Personal Information</h1>
//                 {

//                     !isEditing && (
//                         <Button onClick={() => setIsEditing(true)} variant='contained' size="small" className="md:px-4" startIcon={<FaPen size={15} />}>
//                             Edit
//                         </Button>
//                     )
//                 }
//             </div>

//             <div className='mt-6 md:mt-8'>

//                 <div onClick={() => { isEditing && !loading && profilePicRef.current.click() }} className='h-24 w-24 md:h-30 md:w-30 bg-gray-200 border border-gray-400 rounded-full group overflow-hidden relative cursor-pointer'>

//                     <input ref={profilePicRef} onChange={handleImageChange} type="file" accept='.png, .jpg, .jpeg' className='hidden' id='profile-pic' />

//                     {
//                         isEditing && !loading && (

//                             <div className='bg-white/50 text-black/90 font-semibold absolute text-center w-full h-full flex items-center justify-center rounded-full opacity-0 -z-1 pointer-events-none top-0 left-0 group-hover:opacity-100 group-hover:z-10' >
//                                 add profile <br /> pic
//                             </div>

//                         )
//                     }

//                     <img src={`${profile?.profile_pic || profilePic || default_avatar}`} className={`absolute top-1/2 left-1/2 h-full ${loading || !isEditing ? "cursor-default" : "cursor-pointer"} -translate-x-1/2 -translate-y-1/2`} alt="" />

//                 </div>

//                 <div className='flex flex-col md:flex-row mt-6 gap-4 md:gap-5'>

//                     <div className='w-full'>

//                         <span className='text-black/70 font-semibold text-sm md:text-base'>First Name</span>

//                         <TextField
//                             placeholder=''
//                             size={isMobile ? "small" : "medium"}
//                             sx={{
//                                 '& .MuiInputBase-input': {
//                                     fontSize: {
//                                         xs: '13px',  // mobile
//                                         sm: '15px',  // tablet
//                                         md: '16px',  // laptop
//                                     },
//                                 },
//                             }}
//                             name='first_name'
//                             value={profile?.first_name || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing || loading}
//                             fullWidth
//                             className='mt-2!'
//                         />
//                     </div>

//                     <div className='w-full'>

//                         <span className='text-black/70 font-semibold text-sm md:text-base'>Last Name</span>

//                         <TextField
//                             placeholder=''
//                             size={isMobile ? "small" : "medium"}
//                             sx={{
//                                 '& .MuiInputBase-input': {
//                                     fontSize: {
//                                         xs: '13px',  // mobile
//                                         sm: '15px',  // tablet
//                                         md: '16px',  // laptop
//                                     },
//                                 },
//                             }}
//                             name='last_name'
//                             value={profile?.last_name || ""}
//                             onChange={handleChange}
//                             disabled={!isEditing || loading}
//                             fullWidth
//                             className='mt-2!'
//                         />

//                     </div>

//                 </div>

//                 <div className='mt-5 md:mt-6 w-full md:w-1/2'>

//                     <span className='text-black/70 font-semibold text-sm md:text-base'>Email</span>

//                     <TextField
//                         placeholder=''
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                             '& .MuiInputBase-input': {
//                                 fontSize: {
//                                     xs: '13px',  // mobile
//                                     sm: '15px',  // tablet
//                                     md: '16px',  // laptop
//                                 },
//                             },
//                         }}
//                         name='email'
//                         value={profile?.email || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing || loading}
//                         fullWidth
//                         className='mt-2!'
//                     />
//                 </div>

//                 <div className='mt-5 md:mt-6 w-full md:w-1/2'>

//                     <span className='text-black/70 font-semibold text-sm md:text-base'>Phone Number</span>

//                     <TextField
//                         placeholder=''
//                         size={isMobile ? "small" : "medium"}
//                         sx={{
//                             '& .MuiInputBase-input': {
//                                 fontSize: {
//                                     xs: '13px',  // mobile
//                                     sm: '15px',  // tablet
//                                     md: '16px',  // laptop
//                                 },
//                             },
//                         }}
//                         name='phone_number'
//                         value={profile?.phone_number || ""}
//                         onChange={handleChange}
//                         disabled={!isEditing || loading}
//                         fullWidth
//                         className='mt-2!'
//                     />
//                 </div>

//                 {
//                     isEditing && (

//                         <div className='flex flex-col md:flex-row gap-4 md:gap-5 mt-6 md:mt-8'>

//                             <Button onClick={handleSave} disabled={loading} loading={loading} loadingIndicator={<ImSpinner3 className='text-xl animate-spin' />} loadingPosition='start' className='py-3 md:py-4!' variant='contained' fullWidth  >
//                                 {
//                                     loading ? "Saving..." : "Save Changes"
//                                 }
//                             </Button>

//                             <Button onClick={() => setIsEditing(false)} className='py-3 md:py-4!' disabled={loading} variant='contained' color='warning' fullWidth  >
//                                 Cancel
//                             </Button>

//                         </div>
//                     )
//                 }

//             </div>

//         </div>
//     )
// }

// export default Profile


import { Button, TextField, useMediaQuery, useTheme } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaPen } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'
import { getAccess } from '../auth'
import default_avatar from "../assets/default-avatar.png"
import API_BASE_URL from '../config/config'
import { toast } from 'react-toastify'
import { ImSpinner3 } from 'react-icons/im'

const Profile = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const profilePicRef = useRef(null)
    const { user, fetchUser } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const [profile, setProfile] = useState({
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        profile_pic: '',
    });

    useEffect(() => {
        setProfile(user)
    }, [user])

    const [profilePic, setProfilePic] = useState("")

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const image = e.target.files[0]
        if (image) {
            setProfile({
                ...profile,
                profile_pic: URL.createObjectURL(image)
            });
            setProfilePic(image)
        }
    }

    const handleSave = async () => {
        setLoading(true)

        const formData = new FormData();
        formData.append('first_name', profile.first_name || '');
        formData.append('last_name', profile.last_name || '');
        formData.append('phone_number', profile.phone_number || '');

        if (profilePic) {
            formData.append('profile_pic', profilePic);
        }

        try {
            const token = getAccess();
            const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                setProfilePic(null);
                setIsEditing(false);
                fetchUser();
                toast.success("Profile updated");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false)
        }
    };

    return (

        <div className='relative px-4 py-6 md:px-8 lg:py-8'>

            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-lg sm:text-xl text-gray-800'>Personal Information</h1>
                {
                    !isEditing && (
                        <Button onClick={() => setIsEditing(true)} variant='contained' size="small" className="sm:px-4" startIcon={<FaPen size={12} />}>
                            Edit
                        </Button>
                    )
                }
            </div>

            <div className='mt-6 md:mt-8'>

                <div onClick={() => { isEditing && !loading && profilePicRef.current.click() }} className='h-24 w-24 md:h-28 md:w-28 bg-gray-100 border border-gray-300 rounded-full group overflow-hidden relative cursor-pointer shadow-sm'>

                    <input ref={profilePicRef} onChange={handleImageChange} type="file" accept='.png, .jpg, .jpeg' className='hidden' id='profile-pic' />

                    {
                        isEditing && !loading && (
                            <div className='bg-black/40 text-white font-semibold text-sm absolute text-center w-full h-full flex items-center justify-center rounded-full opacity-0 -z-1 pointer-events-none top-0 left-0 group-hover:opacity-100 group-hover:z-10 transition-opacity' >
                                Change <br /> Photo
                            </div>
                        )
                    }

                    <img src={`${profile?.profile_pic || profilePic || default_avatar}`} className={`absolute top-1/2 left-1/2 h-full w-full object-cover ${loading || !isEditing ? "cursor-default" : "cursor-pointer"} -translate-x-1/2 -translate-y-1/2`} alt="" />

                </div>

                <div className='flex flex-col sm:flex-row mt-6 md:mt-8 gap-4 sm:gap-5'>

                    <div className='w-full'>
                        <span className='text-gray-700 font-semibold text-sm md:text-base mb-1 block'>First Name</span>
                        <TextField
                            placeholder=''
                            size={isMobile ? "small" : "medium"}
                            name='first_name'
                            value={profile?.first_name || ""}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            fullWidth
                        />
                    </div>

                    <div className='w-full'>
                        <span className='text-gray-700 font-semibold text-sm md:text-base mb-1 block'>Last Name</span>
                        <TextField
                            placeholder=''
                            size={isMobile ? "small" : "medium"}
                            name='last_name'
                            value={profile?.last_name || ""}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            fullWidth
                        />
                    </div>

                </div>

                {/* 🌟 FIX: Email aur Phone ko bhi 'flex-row' me wrap kiya taaki ajeeb se aade na katen */}
                <div className='flex flex-col sm:flex-row mt-5 sm:mt-6 gap-4 sm:gap-5'>

                    <div className='w-full'>
                        <span className='text-gray-700 font-semibold text-sm md:text-base mb-1 block'>Email</span>
                        <TextField
                            placeholder=''
                            size={isMobile ? "small" : "medium"}
                            name='email'
                            value={profile?.email || ""}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            fullWidth
                        />
                    </div>

                    <div className='w-full'>
                        <span className='text-gray-700 font-semibold text-sm md:text-base mb-1 block'>Phone Number</span>
                        <TextField
                            placeholder=''
                            size={isMobile ? "small" : "medium"}
                            name='phone_number'
                            value={profile?.phone_number || ""}
                            onChange={handleChange}
                            disabled={!isEditing || loading}
                            fullWidth
                        />
                    </div>

                </div>

                {
                    isEditing && (
                        <div className='flex flex-col sm:flex-row gap-4 mt-8 pt-4 border-t border-gray-100'>
                            <Button onClick={handleSave} disabled={loading} loading={loading} loadingIndicator={<ImSpinner3 className='text-xl animate-spin' />} loadingPosition='start' className='py-2.5 sm:py-3!' variant='contained' fullWidth >
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>

                            <Button onClick={() => setIsEditing(false)} className='py-2.5 sm:py-3!' disabled={loading} variant='outlined' color='inherit' fullWidth >
                                Cancel
                            </Button>
                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default Profile