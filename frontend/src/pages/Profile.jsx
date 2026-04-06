import { Button, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaPen } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getAccess } from '../auth'
import default_avatar from "../assets/default-avatar.png"
import API_BASE_URL from '../config/config'


const Profile = () => {

    const profilePicRef = useRef(null)

    const { user, fetchUser } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false)

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

    // const handleSave = () => {
    //     console.log(profile)
    // }

    const handleSave = async () => {

        // 🔥 FIX: Image bhejney ke liye FormData banayein
        const formData = new FormData();
        formData.append('first_name', profile.first_name || '');
        formData.append('last_name', profile.last_name || '');
        formData.append('phone_number', profile.phone_number || '');

        // if (profile.date_of_birth) {
        //     formData.append('date_of_birth', profile.date_of_birth);
        // }

        // Agar user ne nayi photo select ki hai, tabhi usko bhejenge
        if (profilePic) {
            formData.append('profile_pic', profilePic);
            console.log(profilePic)
        }

        try {

            const token = getAccess();

            const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // ⚠️ DHYAN DEIN: Yahan 'Content-Type' nahi likhna hai! 
                    // Browser automatically 'multipart/form-data' set kar dega
                },
                body: formData // JSON ki jagah formData bhej rahe hain
            });

            if (response.ok) {
                // setIsEditing(false);
                // setImageFile(null); // File upload hone ke baad state clear karein
                setProfilePic(null);
                setIsEditing(false);
                fetchUser(); // Nayi photo ka URL laane ke liye dobara fetch karein
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }

    };

    return (

        <div className='px-8 py-6'>

            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-lg'>Personal Information</h1>
                <Button onClick={() => setIsEditing(true)} variant='contained' startIcon={<FaPen size={15} />}>
                    Edit
                    {/* <NavLink to="/profile/edit">Edit</NavLink> */}
                </Button>
            </div>

            <div className='mt-8'>

                <div onClick={() => { isEditing && profilePicRef.current.click()}} className='h-30 w-30 bg-gray-200 border border-gray-400 rounded-full group overflow-hidden relative cursor-pointer'>

                    <input ref={profilePicRef} onChange={handleImageChange} type="file" className='hidden' id='profile-pic' />

                    {
                        isEditing && (

                            <div className='bg-white/50 text-black/90 font-semibold absolute text-center w-full h-full flex items-center justify-center rounded-full opacity-0 -z-1 pointer-events-none top-0 left-0 group-hover:opacity-100 group-hover:z-10' >
                                add profile <br /> pic
                            </div>

                        )
                    }

                    <img src={`${profile?.profile_pic || profilePic || default_avatar}`} className='absolute top-1/2 left-1/2 h-full -translate-1/2' alt="" />

                </div>

                <div className='flex mt-6 gap-5'>

                    <div className='w-full'>

                        <span className='text-black/70 font-semibold'>First Name</span>

                        <TextField
                            placeholder=''
                            name='first_name'
                            value={profile?.first_name || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            className='mt-2!'
                        // label="First Name"
                        />
                    </div>

                    <div className='w-full'>

                        <span className='text-black/70 font-semibold'>Last Name</span>

                        <TextField
                            placeholder=''
                            name='last_name'
                            value={profile?.last_name || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            className='mt-2!'
                        // label="Last Name"
                        />

                    </div>

                </div>

                {/* <div className='mt-6 pl-1'>

                    <span className='text-black/70 font-semibold'>Gender</span>

                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="male"
                        name="radio-buttons-group"
                        className='flex'
                    >
                        <div className='flex'>
                            <FormControlLabel disabled={!isEditing} value="female" control={<Radio />} label="Female" />
                            <FormControlLabel disabled={!isEditing} value="male" control={<Radio />} label="Male" />
                        </div>
                    </RadioGroup>
                </div> */}

                <div className='mt-6 w-1/2'>

                    <span className='text-black/70 font-semibold'>Email</span>

                    <TextField
                        placeholder=''
                        name='email'
                        value={profile?.email || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                        className='mt-2!'
                    // label="Email"
                    />
                </div>

                <div className='mt-6 w-1/2'>

                    <span className='text-black/70 font-semibold'>Phone Number</span>

                    <TextField
                        placeholder=''
                        name='phone_number'
                        value={profile?.phone_number || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                        className='mt-2!'
                    // label="Email"
                    />
                </div>

                {
                    isEditing && (

                        <div className='flex gap-5 mt-6'>

                            <Button onClick={handleSave} className='py-4!' variant='contained' fullWidth  >
                                Save Changes
                            </Button>

                            <Button onClick={() => setIsEditing(false)} className='py-4!' variant='contained' color='warning' fullWidth  >
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
