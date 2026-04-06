import { Button, duration, Fab, Radio } from '@mui/material';
import React, { useEffect, useState } from 'react'

import { PatternFormat } from 'react-number-format';
import { PiSpinner } from 'react-icons/pi';
import { MdDelete } from "react-icons/md";
import { FaAngleRight, FaArrowLeft, FaPen, FaTrash, FaXmark } from 'react-icons/fa6';
import { FaPlus, FaTruck } from 'react-icons/fa';
import ConfirmDialog from '../components/UI/ConfirmDialog.jsx';
import { toast } from "react-toastify";
import { formatPriceINR } from "../utils/formatPriceINR.js"
import axios from 'axios';
import { getAccess } from '../auth.js';
import { ArrowBigRightDash } from 'lucide-react';
import Stepper from '../components/Stepper.jsx';
import API_BASE_URL from '../config/config.js';
import Swal from 'sweetalert2';
import Loading from '../components/Loading.jsx';

const states = [
    {
        id: 101,
        name: "Karnataka",
        cities: [
            "Bagalkot", "Ballari", "Bengaluru", "Bidar", "Chikkamagaluru", "Davangere", "Dharwad", "Hassan", "Hubballi", "Kalaburagi",
            "Karwar", "Kolar", "Mandya", "Mangaluru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Vijayapura"
        ]
    },
    {
        id: 102,
        name: "Gujarat",
        cities: [
            "Ahmedabad", "Anand", "Bharuch", "Bhavnagar", "Bhuj", "Botad", "Dahod", "Gandhinagar", "Godhra", "Jamnagar", "Junagadh",
            "Morbi", "Mehsana", "Nadiad", "Navsari", "Palanpur", "Porbandar", "Rajkot", "Surat", "Surendranagar", "Vadodara", "Vapi"
        ]
    },
    {
        id: 103,
        name: "Tamil Nadu",
        cities: [
            "Ariyalur", "Chennai", "Coimbatore", "Dindigul", "Erode", "Hosur", "Karur", "Kanchipuram", "Madurai", "Namakkal", "Nagapattinam",
            "Perambalur", "Ramanathapuram", "Salem", "Sivakasi", "Tiruchirappalli", "Tirunelveli", "Thoothukudi", "Tiruppur", "Vellore",
            "Virudhunagar", "Udhagamandalam", "Krishnagiri", "Bengaluru"
        ]
    },
    {
        id: 104,
        name: "Maharashtra",
        cities: [
            "Akola", "Amravati", "Aurangabad", "Beed", "Chandrapur", "Dhule", "Gondia", "Jalgaon", "Kolhapur", "Latur", "Nagpur", "Nanded",
            "Nashik", "Osmanabad", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Satara", "Solapur", "Thane", "Wardha", "Yavatmal"
        ]
    },
    {
        id: 105,
        name: "West Bengal",
        cities: [
            "Alipurduar", "Asansol", "Baharampur", "Balurghat", "Bardhaman", "Barasat", "Basirhat", "Chandannagar", "Dankuni", "Durgapur",
            "Habra", "Howrah", "Jalpaiguri", "Krishnanagar", "Malda", "Medinipur", "Raiganj", "Siliguri"
        ]
    },
    {
        id: 106,
        name: "Rajasthan",
        cities: [
            "Ajmer", "Alwar", "Amravati", "Bagalkot", "Balurghat", "Bansberia", "Barasat", "Barmer", "Bikaner", "Bhilwara", "Chandannagar",
            "Chittorgarh", "Dholpur", "Dindigul", "Haldia", "Habra", "Jaisalmer", "Jhunjhunu", "Jhalawar", "Jodhpur", "Kota", "Nagaur",
            "Pali", "Rajsamand", "Sawai Madhopur", "Sikar", "Tonk", "Udaipur"
        ]
    }
]

const MyAddresses = () => {

    const [address, setAddresses] = useState([])
    const [editingId, setEditingId] = useState(null);
    const [actionLoading, setActionLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [open, setOpen] = useState(false)

    const [formData, setFormData] = useState({
        addressType: "Home",
        full_name: "",
        phone: "",
        alternative_phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
    })

    const fetchAddresses = async () => {

        setLoading(true)

        try {

            const token = getAccess();
            if (!token) return navigate("/login")

            const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            setAddresses(response.data.addresses)

            // if (!response.data.addresses.length > 0) {
            //     setShowForm(true)
            // }

        } catch (err) {
            toast.error(err?.message || "Failed To Fetch Address")
        } finally {
            setLoading(false)
            // setTimeout(() => {
            // }, 2000);
        }

    }

    useEffect(() => {

        fetchAddresses();

    }, [])

    const handleAddAddress = async () => {

        const token = getAccess()

        setActionLoading(true)

        try {

            const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/add/`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                setShowForm(false)
                // setSelectedAddress(response.data.address.uid);
                setAddresses([...address, response.data.address])
                toast.success("Address Added.")
            } else {
                toast.error(response?.data?.error || "Failed to Add Address")
            }

        } catch (e) {
            console.log(e)
            toast.error("Failed to Add Address")
        } finally {
            setActionLoading(false)
        }

    }

    const handleEditAddress = async () => {

        try {

            const token = getAccess();

            const response = await axios.put(`${API_BASE_URL}/api/orders/addresses/${editingId}/`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                setShowForm(false)
                setAddresses(address.map(addr => addr.uid === editingId ? response.data.address : addr));
                toast.success("Address Updated.")
            } else {
                toast.error(response?.data?.error || "Failed to Update Address")
            }

        } catch (e) {
            console.log(e)
            toast.error("Failed to Update Address")
        }
    }

    const handleDeleteAddress = async (address) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "Are you sure you want to delete this address?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `${<FaTrash />} Delete`,
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
        })
            .then(async (result) => {

                if (result.isConfirmed) {


                    try {

                        const token = getAccess();

                        const response = await axios.delete(`${API_BASE_URL}/api/orders/addresses/${address.uid}/`, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            }
                        })

                        if (response.data.success) {
                            setShowForm(false)
                            setOpen(false);
                            fetchAddresses()
                            await Swal.fire({
                                title: "Address Deleted Successfull",
                                icon: "success",
                                timer: 3000,
                                timerProgressBar: true,
                            });
                            // toast.success("Address Deleted")
                        } else {
                            toast.error(response?.data?.error || "Failed to Delete Address")
                        }

                    } catch (e) {
                        console.log(e)
                        toast.error("Failed to Delete Address")
                    }

                }

            })

    }

    const handleOpenAddForm = () => {

        setEditingId(null);
        setFormData({ addressType: "Home", full_name: "", phone: "", alternative_phone: "", address_line: "", city: "", state: "", pincode: "", landmark: "" })
        setShowForm(true);

    };

    const handleOpenEditForm = (address) => {
        setEditingId(address.uid);
        setFormData({
            addressType: address.addressType,
            full_name: address.full_name,
            phone: address.phone,
            alternative_phone: address.alternative_phone,
            address_line: address.address_line,
            state: address.state,
            city: address.city,
            pincode: address.pincode,
            landmark: address.landmark
        });
        setShowForm(true);
    };

    const handleInputChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value })

    }


    return (


        <div className="bg-white rounded-lg overflow-hidden">

            <div className="p-6 flex justify-between items-center border-b border-gray-200">

                <h2 className="text-xl font-semibold text-gray-800">
                    {
                        showForm && address.length > 0 &&
                        <Button onClick={handleOpenAddForm} size='small' variant='contained' className='mr-4!' startIcon={<FaArrowLeft className='text-sm!' />} >Back</Button>
                    }
                    {
                        !showForm
                            ? "Manage Addresses"
                            : editingId
                                ? "Edit Delivery Address"
                                : "Add New Address"
                    }
                </h2>

                {
                    !showForm && (
                        <Button onClick={handleOpenAddForm} variant='contained' startIcon={<FaPlus className='text-sm!' />} >Add New Delivery Address</Button>
                    )
                }

            </div>

            {

                loading
                    ?

                    <Loading size={30} />

                    :

                    <div className="divide-y gap-4 p-4 divide-gray-200">

                        {
                            !showForm
                                ? (

                                    <div className='grid grid-cols-2 gap-4'>
                                        {
                                            address.map((address, id) => (

                                                <div key={id} className={`flex relative border p-3 gap-2 border-gray-200 cursor-pointer`}>

                                                    <div className='w-full items-center p-2'>
                                                        <div className='flex gap-4'>
                                                            <h3 className='text-black/70 font-semibold' >{address.full_name}</h3>
                                                            <span className='bg-gray-100 text-gray-500 font-semibold px-2 py-1 text-xs' >{address.addressType}</span>
                                                        </div>
                                                        <p className='mt-2 text-sm text-black/70'>{address.address_line}, {address.city}, {address.state} - {address.country} <span className='text-black font-medium'>{address.postal_code}</span></p>
                                                        <div className='flex gap-1 mt-2 text-sm'>
                                                            <h3>Mobile : </h3>
                                                            <p className='text-gray-600'>{address.phone}</p>
                                                        </div>

                                                    </div>

                                                    {/* <ConfirmDialog
                                                open={open}
                                                title="Remove Address"
                                                message="Are you sure you want to remove this address?"
                                                confirmText="Remove"
                                                onConfirm={() => handleDeleteAddress(address)}
                                                onCancel={() => setOpen(false)}
                                            /> */}

                                                    <div className='absolute top-0 right-0 p-2'>

                                                        <Fab color="primary" size='small' className='scale-80! z-1!' onClick={() => handleOpenEditForm(address)} aria-label="Edit">
                                                            <FaPen />
                                                        </Fab>

                                                        {/* <Fab color="error" size='small' className='scale-80! z-1!' onClick={() => setOpen(true)} aria-label="Delete"> */}
                                                        <Fab color="error" size='small' className='scale-80! z-1!' onClick={() => handleDeleteAddress(address)} aria-label="Delete">
                                                            <MdDelete />
                                                        </Fab>

                                                    </div>

                                                </div>

                                            ))
                                        }
                                    </div>

                                )
                                :
                                (
                                    <div className='px-5'>

                                        <div className='border-b border-b-gray-200 pb-8'>

                                            <div>
                                                <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Address Type</label>
                                                <div className="flex gap-4">

                                                    {
                                                        ["Home", "Work"].map((label, index) => (

                                                            <button key={index} onClick={() => setFormData({ ...formData, addressType: label })} className={`flex items-center gap-3 pr-10 rounded-sm font-semibold cursor-pointer ${formData.addressType === label ? "text-blue-400 border-blue-500 bg-blue-50/50" : "text-black/60 border-gray-300"} border  py-3 px-5`}>
                                                                <span className={`h-4 w-4 rounded-full flex items-center justify-center border ${formData.addressType === label ? "border-blue-500" : "border-black/50"}`}>
                                                                    <span className={`h-2 w-2 ${formData.addressType === label && "bg-blue-500"} rounded-full`}></span>
                                                                </span>
                                                                <span>{label}</span>
                                                            </button>

                                                        ))
                                                    }

                                                </div>
                                            </div>

                                            <div className="input-group mt-4 flex items-center w-full gap-5">

                                                <div className='w-full'>
                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Full Name</label>
                                                    <input
                                                        name='full_name'
                                                        value={formData.full_name}
                                                        onChange={handleInputChange}
                                                        className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
                                                        type="text"
                                                        placeholder='Enter Your Name'
                                                    />
                                                </div>

                                                <div className='w-full'>

                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Phone Number</label>
                                                    <PatternFormat
                                                        value={formData.phone}
                                                        name='phone'
                                                        onValueChange={(values) => {
                                                            setFormData({
                                                                ...formData,
                                                                phone: values.value
                                                            });
                                                        }}
                                                        className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
                                                        placeholder='Enter Your Phone Number'
                                                        format="+91 ##### #####"
                                                        allowEmptyFormatting
                                                        mask="&bull;"
                                                        inputMode="numeric"
                                                    />

                                                </div>

                                            </div>

                                            <div className="input-group mt-4 flex items-center w-full gap-5">

                                                <div className='w-full'>

                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>
                                                        Address
                                                    </label>

                                                    <textarea
                                                        value={formData.address_line}
                                                        name='address_line'
                                                        onChange={handleInputChange}
                                                        className='w-full resize-none border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
                                                        rows={3}
                                                        placeholder='Address (Area and Street)'
                                                    />

                                                </div>

                                            </div>

                                            <div className="input-group mt-4 flex items-center w-full gap-5">

                                                <div className='w-full'>
                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>State</label>
                                                    <select name='state' value={formData.state} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Enter Your Name'>
                                                        <option defaultValue={"default"} >Select State</option>
                                                        {
                                                            states.map((state) => (
                                                                <option key={state.id} value={state.name}  >{state.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                <div className='w-full'>
                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>City</label>
                                                    <select name='city' value={formData.city} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Enter Your Name'>
                                                        <option value="default" className='text-gray-600' >Select City</option>
                                                        {
                                                            states.filter(state => state.name === formData.state)[0]?.cities?.map((city, index) => (
                                                                <option key={index} value={city}>{city}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>

                                                <div className='w-full'>

                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Pincode</label>
                                                    <PatternFormat
                                                        name='pincode'
                                                        value={formData.pincode}
                                                        onValueChange={(values) => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                pincode: values.value
                                                            }))
                                                        }}
                                                        className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
                                                        placeholder='Enter Pincode'
                                                        format="######"
                                                        mask=""
                                                        inputMode="numeric"
                                                    />

                                                </div>

                                            </div>

                                            <div className="input-group mt-4 flex items-center w-full gap-5">

                                                <div className='w-full'>
                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Landmark</label>
                                                    <input name='landmark' value={formData.landmark} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Landmark (Optional)' />
                                                </div>

                                                <div className='w-full'>
                                                    <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Alternative Phone Number</label>
                                                    <input name='alternative_phone' value={formData.alternative_phone} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Alternative Phone (Optional)' />
                                                </div>

                                            </div>

                                        </div>

                                        <div className='flex gap-5 mt-8 mb-6'>
                                            <Button
                                                onClick={editingId ? handleEditAddress : handleAddAddress}
                                                loading={actionLoading}
                                                loadingPosition='start'
                                                loadingIndicator={<PiSpinner className='text-xl text-gray-600 animate-spin' />}
                                                variant='contained'
                                                className='h-12'
                                                fullWidth
                                            >
                                                {
                                                    editingId ? "Update" : "Save"
                                                }
                                            </Button>

                                            {
                                                address.length > 0 && (
                                                    <Button onClick={() => setShowForm(false)} variant='outlined' className='h-12' fullWidth >
                                                        Cancel
                                                    </Button>
                                                )
                                            }
                                        </div>

                                    </div>
                                )

                        }


                    </div>

            }

        </div>
    )
}

export default MyAddresses
