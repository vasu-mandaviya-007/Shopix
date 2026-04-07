import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../context/CartContext';
import { Button, Fab, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { FaPlus, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import {  FaCcAmex, FaCcMastercard, FaCcVisa, FaGooglePay, FaHeadset, FaPaypal, FaPen } from 'react-icons/fa6';
import { PiSpinner } from 'react-icons/pi';

import ConfirmDialog from '../components/UI/ConfirmDialog';
import { toast } from "react-toastify";
import { formatPriceINR } from "../utils/formatPriceINR"
import axios from 'axios';
import { getAccess } from '../auth';
import Stepper from '../components/Stepper';
import { PatternFormat } from "react-number-format";
import API_BASE_URL from '../config/config.js';


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

const Checkout = () => {

    const { cart, loading: cartLoading } = useContext(CartContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState([])
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false)
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

    useEffect(() => {

        const token = getAccess();
        if (!token) return navigate("/login")

        axios.post(`${API_BASE_URL}/api/orders/addresses/`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }).then(response => {

            setAddress(response.data.addresses)
            if (!selectedAddress && response.data.addresses.length > 0) {
                setSelectedAddress(response.data.addresses[0].uid);
                const address = response.data.addresses[0];
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
            }
            if (!response.data.addresses.length > 0) {
                setShowForm(true)
            }
            console.log(response.data)

        }).catch(e => {
            console.log(e)
        })

    }, [])

    const handleAddAddress = async () => {

        const token = getAccess()

        try {

            const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/add/`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                setShowForm(false)
                setSelectedAddress(response.data.address.uid);
                setAddress([...address, response.data.address])
                toast.success("Address Added.")
            } else {
                toast.error(response?.data?.error || "Failed to Add Address")
            }

        } catch (e) {
            console.log(e)
            toast.error("Failed to Add Address")
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
                setAddress(address.map(addr => addr.uid === editingId ? response.data.address : addr));
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
                toast.success("Address Deleted")
            } else {
                toast.error(response?.data?.error || "Failed to Delete Address")
            }

        } catch (e) {
            console.log(e)
            toast.error("Failed to Delete Address")
        }

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

    const handlePayment = async () => {
        // const stripe = await stripePromise;
        setLoading(true)
        try {

            const token = getAccess();

            const response = await fetch(`${API_BASE_URL}/api/orders/create-checkout-session/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    cartItems: cart.cart_items,
                    ...formData
                })
            });

            const data = await response.json();
            // console.log(data)

            // redirect user to Stripe checkout
            window.location.href = data.checkout_url;
        } catch (err) {
            console.log(err)
            toast.error("Failed to Initiate Payment")
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }

    };

    useEffect(() => {
        if (loading || cartLoading) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };

    }, [loading,cartLoading]);

    useEffect(() => {
        if (!cartLoading && (!cart || !cart.cart_items || cart.cart_items.length === 0)) {
            navigate('/cart');
        }
    }, [cart, cartLoading, navigate]);

    if (cartLoading) {

        return (

            <div className='min-h-screen'>

                <div className="fixed inset-0 bg-white/60 z-9999 flex items-center justify-center">

                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-700 font-medium">Loading Your Order Details...</p>
                    </div>
                </div>

            </div>
        )

    }

    return (

        <div className="container mx-auto px-4 py-8 ">

            {loading && (
                <div className="fixed inset-0 bg-white/60 z-9999 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-700 font-medium">Processing...</p>
                    </div>
                </div>
            )}

            {/* {
                cartLoading && (
                    <div className="fixed inset-0 bg-white/60 z-9999 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-gray-700 font-medium">Loading Your Order Details...</p>
                        </div>
                    </div>
                )
            } */}

            <Stepper activeStep={2} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" >

                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white shadow-box rounded-lg overflow-hidden">

                        <div className="p-6 flex justify-between items-center border-b border-gray-200">

                            <h2 className="text-xl font-semibold text-gray-800">
                                {
                                    !showForm
                                        ? "Select Delivery Address"
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

                        <div className="divide-y flex flex-col gap-4 p-4 divide-gray-200">

                            {
                                !showForm
                                    ? (

                                        address.map((address, id) => (

                                            <div onClick={() => setSelectedAddress(address.uid)} key={id} className={`flex relative border p-2 gap-2 ${selectedAddress === address.uid ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} cursor-pointer`}>

                                                <div>
                                                    <Radio
                                                        value="a"
                                                        checked={address.uid === selectedAddress}
                                                        onChange={() => setSelectedAddress(address.uid)}
                                                        name="radio-buttons"
                                                    />
                                                </div>

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

                                                    {
                                                        selectedAddress === address.uid && (
                                                            <Button
                                                                onClick={handlePayment}
                                                                loading={loading}
                                                                loadingPosition='end'
                                                                variant="contained"
                                                                color='warning'
                                                                size='small'
                                                                endIcon={<FaTruck className='text-sm!' />}
                                                                className="mt-3!"
                                                            >
                                                                Deliver Here
                                                            </Button>
                                                        )
                                                    }

                                                </div>

                                                <ConfirmDialog
                                                    open={open}
                                                    title="Remove Address"
                                                    message="Are you sure you want to remove this address?"
                                                    confirmText="Remove"
                                                    onConfirm={() => handleDeleteAddress(address)}
                                                    onCancel={() => setOpen(false)}
                                                />

                                                <div className='absolute top-0 right-0 p-2'>

                                                    <Fab color="primary" size='small' className='scale-80! z-1!' onClick={() => handleOpenEditForm(address)} aria-label="Edit">
                                                        <FaPen />
                                                    </Fab>

                                                    <Fab color="error" size='small' className='scale-80! z-1!' onClick={() => setOpen(true)} aria-label="Delete">
                                                        <MdDelete />
                                                    </Fab>

                                                </div>

                                            </div>

                                        ))

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
                                                    loading={loading}
                                                    loadingPosition='start'
                                                    loadingIndicator={<PiSpinner className='text-xl animate-spin' />}
                                                    variant='contained'
                                                    className='h-12'
                                                    fullWidth
                                                >
                                                    Save
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

                    </div>


                </div>

                {/* Order Summary */}
                <div className="sticky top-24 h-fit lg:col-span-1">

                    <div className="bg-white rounded-lg shadow-box">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Order Summary
                            </h2>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Subtotal ({cart?.cart_items?.length} items)</span>
                                <span className="font-semibold"> {formatPriceINR(cart?.mrp_total)}</span>
                                {/* <span className="font-semibold">₹{cart.cart_items}</span> */}
                            </div>

                            {/* Shipping */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold text-green-600"> + {cart?.shipping_cost > 0 ? `₹${cart?.shipping_cost}` : "FREE"}</span>
                            </div>

                            {/* Tax */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Discount on MRP</span>
                                <span className="font-semibold"> - {formatPriceINR(cart?.discount_on_mrp)} </span>
                            </div>

                            {
                                cart?.discount_amount > 0 && (


                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Coupon Discount ({cart?.coupon?.discount_percentage}%)</span>
                                        <span className="font-semibold"> - {formatPriceINR(cart?.discount_amount)} </span>
                                    </div>
                                )

                            }

                            <hr className="border-gray-200" />


                            <div className="flex justify-between items-center text-lg">
                                <span className="font-semibold text-gray-800">Total</span>
                                <span className="font-bold text-xl text-primary-600"> {formatPriceINR(cart?.total_price)}</span>
                            </div>


                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600 mb-3">
                                    We accept:
                                </p>
                                <div className="flex justify-center space-x-3">
                                    <FaCcVisa className='text-2xl text-blue-600' />
                                    <FaCcMastercard className='text-2xl text-red-600' />
                                    <FaCcAmex className='text-2xl text-green-600' />
                                    <FaPaypal className='text-2xl text-blue-500' />
                                    <FaGooglePay className='text-2xl text-green-500' />
                                </div>
                            </div>


                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                <div className="text-center">
                                    <FaShieldAlt className="fas fa-shield-alt inline-flex text-2xl text-green-600 mb-2" />
                                    <p className="text-xs text-gray-600">
                                        Secure Payment
                                    </p>
                                </div>
                                <div className="text-center">
                                    <FaTruck className="fas fa-truck inline-flex text-2xl text-blue-600 mb-2" />
                                    <p className="text-xs text-gray-600">
                                        Free Shipping
                                    </p>
                                </div>
                                <div className="text-center">
                                    <FaUndo className="fas fa-undo inline-flex text-2xl text-purple-600 mb-2" />
                                    <p className="text-xs text-gray-600">
                                        Easy Returns
                                    </p>
                                </div>
                                <div className="text-center">
                                    <FaHeadset className="fas fa-headset inline-flex text-2xl text-orange-600 mb-2" />
                                    <p className="text-xs text-gray-600">
                                        24/7 Support
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div >

        </div >

    )
}

export default Checkout 

