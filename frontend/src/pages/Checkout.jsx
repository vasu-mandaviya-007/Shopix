

// import React, { useContext, useState, useEffect } from 'react'
// import { CartContext } from '../context/CartContext';
// import { Button, Fab, Radio } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// import { FaPlus, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
// import { MdDelete } from "react-icons/md";
// import { FaCcAmex, FaCcMastercard, FaCcVisa, FaGooglePay, FaHeadset, FaPaypal, FaPen } from 'react-icons/fa6';
// import { PiSpinner } from 'react-icons/pi';

// import ConfirmDialog from '../components/UI/ConfirmDialog';
// import { toast } from "react-toastify";
// import { formatPriceINR } from "../utils/formatPriceINR"
// import axios from 'axios';
// import { getAccess } from '../auth';
// import Stepper from '../components/Stepper';
// import { PatternFormat } from "react-number-format";
// import API_BASE_URL from '../config/config.js';


// const states = [
//     {
//         id: 101,
//         name: "Karnataka",
//         cities: [
//             "Bagalkot", "Ballari", "Bengaluru", "Bidar", "Chikkamagaluru", "Davangere", "Dharwad", "Hassan", "Hubballi", "Kalaburagi",
//             "Karwar", "Kolar", "Mandya", "Mangaluru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Vijayapura"
//         ]
//     },
//     {
//         id: 102,
//         name: "Gujarat",
//         cities: [
//             "Ahmedabad", "Anand", "Bharuch", "Bhavnagar", "Bhuj", "Botad", "Dahod", "Gandhinagar", "Godhra", "Jamnagar", "Junagadh",
//             "Morbi", "Mehsana", "Nadiad", "Navsari", "Palanpur", "Porbandar", "Rajkot", "Surat", "Surendranagar", "Vadodara", "Vapi"
//         ]
//     },
//     {
//         id: 103,
//         name: "Tamil Nadu",
//         cities: [
//             "Ariyalur", "Chennai", "Coimbatore", "Dindigul", "Erode", "Hosur", "Karur", "Kanchipuram", "Madurai", "Namakkal", "Nagapattinam",
//             "Perambalur", "Ramanathapuram", "Salem", "Sivakasi", "Tiruchirappalli", "Tirunelveli", "Thoothukudi", "Tiruppur", "Vellore",
//             "Virudhunagar", "Udhagamandalam", "Krishnagiri", "Bengaluru"
//         ]
//     },
//     {
//         id: 104,
//         name: "Maharashtra",
//         cities: [
//             "Akola", "Amravati", "Aurangabad", "Beed", "Chandrapur", "Dhule", "Gondia", "Jalgaon", "Kolhapur", "Latur", "Nagpur", "Nanded",
//             "Nashik", "Osmanabad", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Satara", "Solapur", "Thane", "Wardha", "Yavatmal"
//         ]
//     },
//     {
//         id: 105,
//         name: "West Bengal",
//         cities: [
//             "Alipurduar", "Asansol", "Baharampur", "Balurghat", "Bardhaman", "Barasat", "Basirhat", "Chandannagar", "Dankuni", "Durgapur",
//             "Habra", "Howrah", "Jalpaiguri", "Krishnanagar", "Malda", "Medinipur", "Raiganj", "Siliguri"
//         ]
//     },
//     {
//         id: 106,
//         name: "Rajasthan",
//         cities: [
//             "Ajmer", "Alwar", "Amravati", "Bagalkot", "Balurghat", "Bansberia", "Barasat", "Barmer", "Bikaner", "Bhilwara", "Chandannagar",
//             "Chittorgarh", "Dholpur", "Dindigul", "Haldia", "Habra", "Jaisalmer", "Jhunjhunu", "Jhalawar", "Jodhpur", "Kota", "Nagaur",
//             "Pali", "Rajsamand", "Sawai Madhopur", "Sikar", "Tonk", "Udaipur"
//         ]
//     }
// ]

// const Checkout = () => {

//     const { cart, loading: cartLoading } = useContext(CartContext);
//     const navigate = useNavigate();

//     const [address, setAddress] = useState([])
//     const [selectedAddress, setSelectedAddress] = useState(null)
//     const [editingId, setEditingId] = useState(null);
//     const [loading, setLoading] = useState(false)
//     const [showForm, setShowForm] = useState(false)
//     const [open, setOpen] = useState(false)

//     const [formData, setFormData] = useState({
//         addressType: "Home",
//         full_name: "",
//         phone: "",
//         alternative_phone: "",
//         address_line: "",
//         city: "",
//         state: "",
//         pincode: "",
//         landmark: "",
//     })

//     useEffect(() => {

//         const token = getAccess();
//         if (!token) return navigate("/login")

//         axios.post(`${API_BASE_URL}/api/orders/addresses/`, {}, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             }
//         }).then(response => {

//             setAddress(response.data.addresses)
//             if (!selectedAddress && response.data.addresses.length > 0) {
//                 setSelectedAddress(response.data.addresses[0].uid);
//                 const address = response.data.addresses[0];
//                 setFormData({
//                     addressType: address.addressType,
//                     full_name: address.full_name,
//                     phone: address.phone,
//                     alternative_phone: address.alternative_phone,
//                     address_line: address.address_line,
//                     state: address.state,
//                     city: address.city,
//                     pincode: address.pincode,
//                     landmark: address.landmark
//                 });
//             }
//             if (!response.data.addresses.length > 0) {
//                 setShowForm(true)
//             }
//             console.log(response.data)

//         }).catch(e => {
//             console.log(e)
//         })

//     }, [])

//     const handleAddAddress = async () => {

//         const token = getAccess()

//         try {

//             const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/add/`, formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })

//             if (response.data.success) {
//                 setShowForm(false)
//                 setSelectedAddress(response.data.address.uid);
//                 setAddress([...address, response.data.address])
//                 toast.success("Address Added.")
//             } else {
//                 toast.error(response?.data?.error || "Failed to Add Address")
//             }

//         } catch (e) {
//             console.log(e)
//             toast.error("Failed to Add Address")
//         }

//     }

//     const handleEditAddress = async () => {

//         try {

//             const token = getAccess();

//             const response = await axios.put(`${API_BASE_URL}/api/orders/addresses/${editingId}/`, formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })

//             if (response.data.success) {
//                 setShowForm(false)
//                 setAddress(address.map(addr => addr.uid === editingId ? response.data.address : addr));
//                 toast.success("Address Updated.")
//             } else {
//                 toast.error(response?.data?.error || "Failed to Update Address")
//             }

//         } catch (e) {
//             console.log(e)
//             toast.error("Failed to Update Address")
//         }
//     }

//     const handleDeleteAddress = async (address) => {

//         try {

//             const token = getAccess();

//             const response = await axios.delete(`${API_BASE_URL}/api/orders/addresses/${address.uid}/`, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })

//             if (response.data.success) {
//                 setShowForm(false)
//                 setOpen(false);
//                 toast.success("Address Deleted")
//             } else {
//                 toast.error(response?.data?.error || "Failed to Delete Address")
//             }

//         } catch (e) {
//             console.log(e)
//             toast.error("Failed to Delete Address")
//         }

//     }

//     const handleOpenAddForm = () => {

//         setEditingId(null);
//         setFormData({ addressType: "Home", full_name: "", phone: "", alternative_phone: "", address_line: "", city: "", state: "", pincode: "", landmark: "" })
//         setShowForm(true);

//     };

//     const handleOpenEditForm = (address) => {
//         setEditingId(address.uid);
//         setFormData({
//             addressType: address.addressType,
//             full_name: address.full_name,
//             phone: address.phone,
//             alternative_phone: address.alternative_phone,
//             address_line: address.address_line,
//             state: address.state,
//             city: address.city,
//             pincode: address.pincode,
//             landmark: address.landmark
//         });
//         setShowForm(true);
//     };

//     const handleInputChange = (e) => {

//         setFormData({ ...formData, [e.target.name]: e.target.value })

//     }

//     const handlePayment = async () => {
//         // const stripe = await stripePromise;
//         setLoading(true)
//         try {

//             const token = getAccess();

//             const response = await fetch(`${API_BASE_URL}/api/orders/create-checkout-session/`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     cartItems: cart.cart_items,
//                     ...formData
//                 })
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to Initiate Payment")
//             }

//             const data = await response.json();
//             // console.log(data)

//             // redirect user to Stripe checkout
//             window.location.href = data.checkout_url;
//         } catch (err) {
//             console.log(err)
//             toast.error("Failed to Initiate Payment")
//         } finally {
//             setTimeout(() => {
//                 setLoading(false)
//             }, 2000);
//         }

//     };

//     useEffect(() => {
//         if (loading || cartLoading) {
//             document.body.style.overflow = "hidden";
//         } else {
//             document.body.style.overflow = "auto";
//         }

//         return () => {
//             document.body.style.overflow = "auto";
//         };

//     }, [loading, cartLoading]);

//     useEffect(() => {
//         if (!cartLoading && (!cart || !cart.cart_items || cart.cart_items.length === 0)) {
//             navigate('/cart');
//         }
//     }, [cart, cartLoading, navigate]);

//     if (cartLoading) {

//         return (

//             <div className='min-h-screen'>

//                 <div className="fixed inset-0 bg-white/60 z-9999 flex items-center justify-center">

//                     <div className="text-center">
//                         <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
//                         <p className="mt-4 text-gray-700 font-medium">Loading Your Order Details...</p>
//                     </div>
//                 </div>

//             </div>
//         )

//     }

//     return (

//         <div className="container mx-auto px-4 py-8 ">

//             {loading && (
//                 <div className="fixed inset-0 bg-white/60 z-9999 flex items-center justify-center">
//                     <div className="text-center">
//                         <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
//                         <p className="mt-4 text-gray-700 font-medium">Processing...</p>
//                     </div>
//                 </div>
//             )}

//             {/* {
//                 cartLoading && (
//                     <div className="fixed inset-0 bg-white/60 z-9999 flex items-center justify-center">
//                         <div className="text-center">
//                             <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
//                             <p className="mt-4 text-gray-700 font-medium">Loading Your Order Details...</p>
//                         </div>
//                     </div>
//                 )
//             } */}

//             <Stepper activeStep={2} />

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" >

//                 <div className="lg:col-span-2 space-y-6">

//                     <div className="bg-white shadow-box rounded-lg overflow-hidden">

//                         <div className="p-6 flex justify-between items-center border-b border-gray-200">

//                             <h2 className="text-xl font-semibold text-gray-800">
//                                 {
//                                     !showForm
//                                         ? "Select Delivery Address"
//                                         : editingId
//                                             ? "Edit Delivery Address"
//                                             : "Add New Address"
//                                 }
//                             </h2>

//                             {
//                                 !showForm && (
//                                     <Button onClick={handleOpenAddForm} variant='contained' startIcon={<FaPlus className='text-sm!' />} >Add New Delivery Address</Button>
//                                 )
//                             }

//                         </div>

//                         <div className="divide-y flex flex-col gap-4 p-4 divide-gray-200">

//                             {
//                                 !showForm
//                                     ? (

//                                         address.map((address, id) => (

//                                             <div onClick={() => setSelectedAddress(address.uid)} key={id} className={`flex relative border p-2 gap-2 ${selectedAddress === address.uid ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} cursor-pointer`}>

//                                                 <div>
//                                                     <Radio
//                                                         value="a"
//                                                         checked={address.uid === selectedAddress}
//                                                         onChange={() => setSelectedAddress(address.uid)}
//                                                         name="radio-buttons"
//                                                     />
//                                                 </div>

//                                                 <div className='w-full items-center p-2'>
//                                                     <div className='flex gap-4'>
//                                                         <h3 className='text-black/70 font-semibold' >{address.full_name}</h3>
//                                                         <span className='bg-gray-100 text-gray-500 font-semibold px-2 py-1 text-xs' >{address.addressType}</span>
//                                                     </div>
//                                                     <p className='mt-2 text-sm text-black/70'>{address.address_line}, {address.city}, {address.state} - {address.country} <span className='text-black font-medium'>{address.postal_code}</span></p>
//                                                     <div className='flex gap-1 mt-2 text-sm'>
//                                                         <h3>Mobile : </h3>
//                                                         <p className='text-gray-600'>{address.phone}</p>
//                                                     </div>

//                                                     {
//                                                         selectedAddress === address.uid && (
//                                                             <Button
//                                                                 onClick={handlePayment}
//                                                                 loading={loading}
//                                                                 loadingPosition='end'
//                                                                 variant="contained"
//                                                                 color='warning'
//                                                                 size='small'
//                                                                 endIcon={<FaTruck className='text-sm!' />}
//                                                                 className="mt-3!"
//                                                             >
//                                                                 Deliver Here
//                                                             </Button>
//                                                         )
//                                                     }

//                                                 </div>

//                                                 <ConfirmDialog
//                                                     open={open}
//                                                     title="Remove Address"
//                                                     message="Are you sure you want to remove this address?"
//                                                     confirmText="Remove"
//                                                     onConfirm={() => handleDeleteAddress(address)}
//                                                     onCancel={() => setOpen(false)}
//                                                 />

//                                                 <div className='absolute top-0 right-0 p-2'>

//                                                     <Fab color="primary" size='small' className='scale-80! z-1!' onClick={() => handleOpenEditForm(address)} aria-label="Edit">
//                                                         <FaPen />
//                                                     </Fab>

//                                                     <Fab color="error" size='small' className='scale-80! z-1!' onClick={() => setOpen(true)} aria-label="Delete">
//                                                         <MdDelete />
//                                                     </Fab>

//                                                 </div>

//                                             </div>

//                                         ))

//                                     )
//                                     :
//                                     (
//                                         <div className='px-5'>

//                                             <div className='border-b border-b-gray-200 pb-8'>

//                                                 <div>
//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Address Type</label>
//                                                     <div className="flex gap-4">

//                                                         {
//                                                             ["Home", "Work"].map((label, index) => (

//                                                                 <button key={index} onClick={() => setFormData({ ...formData, addressType: label })} className={`flex items-center gap-3 pr-10 rounded-sm font-semibold cursor-pointer ${formData.addressType === label ? "text-blue-400 border-blue-500 bg-blue-50/50" : "text-black/60 border-gray-300"} border  py-3 px-5`}>
//                                                                     <span className={`h-4 w-4 rounded-full flex items-center justify-center border ${formData.addressType === label ? "border-blue-500" : "border-black/50"}`}>
//                                                                         <span className={`h-2 w-2 ${formData.addressType === label && "bg-blue-500"} rounded-full`}></span>
//                                                                     </span>
//                                                                     <span>{label}</span>
//                                                                 </button>

//                                                             ))
//                                                         }

//                                                     </div>
//                                                 </div>

//                                                 <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                     <div className='w-full'>
//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Full Name</label>
//                                                         <input
//                                                             name='full_name'
//                                                             value={formData.full_name}
//                                                             onChange={handleInputChange}
//                                                             className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                             type="text"
//                                                             placeholder='Enter Your Name'
//                                                         />
//                                                     </div>

//                                                     <div className='w-full'>

//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Phone Number</label>
//                                                         <PatternFormat
//                                                             value={formData.phone}
//                                                             name='phone'
//                                                             onValueChange={(values) => {
//                                                                 setFormData({
//                                                                     ...formData,
//                                                                     phone: values.value
//                                                                 });
//                                                             }}
//                                                             className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                             placeholder='Enter Your Phone Number'
//                                                             format="+91 ##### #####"
//                                                             allowEmptyFormatting
//                                                             mask="&bull;"
//                                                             inputMode="numeric"
//                                                         />

//                                                     </div>

//                                                 </div>

//                                                 <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                     <div className='w-full'>

//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>
//                                                             Address
//                                                         </label>

//                                                         <textarea
//                                                             value={formData.address_line}
//                                                             name='address_line'
//                                                             onChange={handleInputChange}
//                                                             className='w-full resize-none border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                             rows={3}
//                                                             placeholder='Address (Area and Street)'
//                                                         />

//                                                     </div>

//                                                 </div>

//                                                 <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                     <div className='w-full'>
//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>State</label>
//                                                         <select name='state' value={formData.state} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Enter Your Name'>
//                                                             <option defaultValue={"default"} >Select State</option>
//                                                             {
//                                                                 states.map((state) => (
//                                                                     <option key={state.id} value={state.name}  >{state.name}</option>
//                                                                 ))
//                                                             }
//                                                         </select>
//                                                     </div>

//                                                     <div className='w-full'>
//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>City</label>
//                                                         <select name='city' value={formData.city} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Enter Your Name'>
//                                                             <option value="default" className='text-gray-600' >Select City</option>
//                                                             {
//                                                                 states.filter(state => state.name === formData.state)[0]?.cities?.map((city, index) => (
//                                                                     <option key={index} value={city}>{city}</option>
//                                                                 ))
//                                                             }
//                                                         </select>
//                                                     </div>

//                                                     <div className='w-full'>

//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Pincode</label>
//                                                         <PatternFormat
//                                                             name='pincode'
//                                                             value={formData.pincode}
//                                                             onValueChange={(values) => {
//                                                                 setFormData(prev => ({
//                                                                     ...prev,
//                                                                     pincode: values.value
//                                                                 }))
//                                                             }}
//                                                             className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                             placeholder='Enter Pincode'
//                                                             format="######"
//                                                             mask=""
//                                                             inputMode="numeric"
//                                                         />

//                                                     </div>

//                                                 </div>

//                                                 <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                     <div className='w-full'>
//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Landmark</label>
//                                                         <input name='landmark' value={formData.landmark} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Landmark (Optional)' />
//                                                     </div>

//                                                     <div className='w-full'>
//                                                         <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Alternative Phone Number</label>
//                                                         <input name='alternative_phone' value={formData.alternative_phone} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Alternative Phone (Optional)' />
//                                                     </div>

//                                                 </div>

//                                             </div>

//                                             <div className='flex gap-5 mt-8 mb-6'>
//                                                 <Button
//                                                     onClick={editingId ? handleEditAddress : handleAddAddress}
//                                                     loading={loading}
//                                                     loadingPosition='start'
//                                                     loadingIndicator={<PiSpinner className='text-xl animate-spin' />}
//                                                     variant='contained'
//                                                     className='h-12'
//                                                     fullWidth
//                                                 >
//                                                     Save
//                                                 </Button>

//                                                 {
//                                                     address.length > 0 && (
//                                                         <Button onClick={() => setShowForm(false)} variant='outlined' className='h-12' fullWidth >
//                                                             Cancel
//                                                         </Button>
//                                                     )
//                                                 }
//                                             </div>

//                                         </div>
//                                     )

//                             }


//                         </div>

//                     </div>


//                 </div>

//                 {/* Order Summary */}
//                 <div className="sticky top-24 lg:col-span-1 flex flex-col gap-6">

//                     <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">

//                         <div className="p-5 border-b border-gray-100 bg-gray-50/50">
//                             <h2 className="text-lg font-bold text-gray-800">
//                                 Order Summary
//                             </h2>
//                         </div>

//                         <div className="p-5 md:p-6 text-sm font-medium text-gray-600 space-y-3.5">

//                             <div className="flex justify-between items-center">
//                                 <span>Subtotal ({cart?.cart_items?.length} items)</span>
//                                 <span className="text-gray-900 font-bold">{formatPriceINR(cart.mrp_total)}</span>
//                             </div>

//                             <div className="flex justify-between items-center">
//                                 <span>Shipping</span>
//                                 <span className="text-gray-900 font-bold">
//                                     {cart?.shipping_cost > 0 ? `+ ${formatPriceINR(cart?.shipping_cost)}` : <span className="text-green-600">FREE</span>}
//                                 </span>
//                             </div>

//                             {cart?.discount_on_mrp > 0 && (
//                                 <div className="flex justify-between items-center text-green-600">
//                                     <span>Discount on MRP</span>
//                                     <span className="font-bold">- {formatPriceINR(cart?.discount_on_mrp)}</span>
//                                 </div>
//                             )}

//                             {cart?.coupon?.discount_percentage > 0 && (
//                                 <div className="flex justify-between items-center text-green-600">
//                                     <span>Coupon ({cart?.coupon?.discount_percentage}% OFF)</span>
//                                     <span className="font-bold">- {formatPriceINR(cart?.discount_amount)}</span>
//                                 </div>
//                             )}

//                             <hr className="border-gray-100 my-4" />

//                             <div className="flex justify-between items-center text-lg md:text-xl">
//                                 <span className="font-bold text-gray-900">Total</span>
//                                 <span className="font-extrabold text-blue-600">{formatPriceINR(cart?.total_price)}</span>
//                             </div>

//                             {/* Trust & Payment Info */}
//                             <div className="pt-6">
//                                 <p className="text-xs text-center text-gray-400 mb-3 font-semibold uppercase tracking-wider">
//                                     Guaranteed Safe Checkout
//                                 </p>
//                                 <div className="flex justify-center items-center gap-3 text-2xl">
//                                     <FaCcVisa className='text-[#1a1f71]' />
//                                     <FaCcMastercard className='text-[#eb001b]' />
//                                     <FaCcAmex className='text-[#2e77bc]' />
//                                     <FaPaypal className='text-[#00457c]' />
//                                     <FaGooglePay className='text-gray-600 text-3xl' />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6 mt-2 border-t border-gray-100">
//                                 <div className="flex flex-col items-center text-center gap-1.5">
//                                     <FaShieldAlt className="text-xl text-emerald-500" />
//                                     <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">Secure Payment</span>
//                                 </div>
//                                 <div className="flex flex-col items-center text-center gap-1.5">
//                                     <FaTruck className="text-xl text-blue-500" />
//                                     <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">Free Shipping</span>
//                                 </div>
//                                 <div className="flex flex-col items-center text-center gap-1.5">
//                                     <FaUndo className="text-xl text-purple-500" />
//                                     <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">Easy Returns</span>
//                                 </div>
//                                 <div className="flex flex-col items-center text-center gap-1.5">
//                                     <FaHeadset className="text-xl text-orange-500" />
//                                     <span className="text-mobile-1 text-gray-500 font-semibold uppercase tracking-wide">24/7 Support</span>
//                                 </div>
//                             </div>

//                         </div>
//                     </div>

//                 </div>
                

//             </div >

//         </div >

//     )
// }

// export default Checkout



import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../context/CartContext';
import { Button, Fab, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { FaPlus, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";
import { FaCcAmex, FaCcMastercard, FaCcVisa, FaGooglePay, FaHeadset, FaPaypal, FaPen } from 'react-icons/fa6';
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

            if (!response.ok) {
                throw new Error("Failed to Initiate Payment")
            }

            const data = await response.json();

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

    }, [loading, cartLoading]);

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

        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">

            {loading && (
                <div className="fixed inset-0 bg-white/60 z-9999 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto"></div>
                        <p className="mt-4 text-gray-700 font-medium">Processing...</p>
                    </div>
                </div>
            )}

            <Stepper activeStep={2} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8" >

                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">

                        {/* 🌟 Header Responsive Layout */}
                        <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-gray-200 bg-gray-50/50">

                            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
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
                                    <Button onClick={handleOpenAddForm} variant='contained' size="small" className="sm:px-4" startIcon={<FaPlus className='text-sm!' />} >
                                        Add New Address
                                    </Button>
                                )
                            }

                        </div>

                        <div className="divide-y flex flex-col gap-4 p-3 md:p-4 divide-gray-200">

                            {
                                !showForm
                                    ? (
                                        address.map((address, id) => (

                                            <div onClick={() => setSelectedAddress(address.uid)} key={id} className={`flex relative border p-3 md:p-4 gap-2 md:gap-3 rounded-lg ${selectedAddress === address.uid ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 hover:border-blue-100 transition-colors'} cursor-pointer`}>

                                                <div className="pt-0.5 md:pt-1">
                                                    <Radio
                                                        value="a"
                                                        checked={address.uid === selectedAddress}
                                                        onChange={() => setSelectedAddress(address.uid)}
                                                        name="radio-buttons"
                                                        size="small"
                                                    />
                                                </div>

                                                {/* 🌟 Pr-12 to prevent text overlapping with absolute buttons */}
                                                <div className='w-full items-center py-1 md:py-2 pr-12 md:pr-16'>
                                                    <div className='flex flex-wrap items-center gap-2 md:gap-4'>
                                                        <h3 className='text-black/80 font-bold text-sm md:text-base'>{address.full_name}</h3>
                                                        <span className='bg-gray-100 border border-gray-200 text-gray-500 font-semibold px-2 py-0.5 rounded-sm text-mobile-1 md:text-xs tracking-wider uppercase' >{address.addressType}</span>
                                                    </div>
                                                    <p className='mt-1.5 md:mt-2 text-xs md:text-sm text-gray-600 leading-relaxed'>{address.address_line}, {address.city}, {address.state} - {address.country} <span className='text-gray-800 font-semibold'>{address.pincode}</span></p>
                                                    <div className='flex items-center gap-1.5 mt-2 text-xs md:text-sm text-gray-600'>
                                                        <span className="font-semibold text-gray-700">Mobile : </span>
                                                        <span>{address.phone}</span>
                                                    </div>

                                                    {
                                                        selectedAddress === address.uid && (
                                                            <div className="mt-4">
                                                                <Button
                                                                    onClick={(e) => { e.stopPropagation(); handlePayment(); }}
                                                                    loading={loading}
                                                                    loadingPosition='end'
                                                                    variant="contained"
                                                                    color='warning'
                                                                    size='small'
                                                                    endIcon={<FaTruck className='text-xs md:text-sm!' />}
                                                                    className="px-6! py-2! shadow-md!"
                                                                >
                                                                    Deliver Here
                                                                </Button>
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                                {/* 🌟 Actions positioning fixed for small screens */}
                                                <div className='absolute top-2 right-2 flex flex-col gap-1.5 md:gap-2'>
                                                    <Fab color="primary" size='small' className='scale-75 md:scale-[0.8] z-1! shadow-sm!' onClick={(e) => { e.stopPropagation(); handleOpenEditForm(address); }} aria-label="Edit">
                                                        <FaPen />
                                                    </Fab>
                                                    <Fab color="error" size='small' className='scale-75 md:scale-[0.8] z-1! shadow-sm!' onClick={(e) => { e.stopPropagation(); setOpen(true); }} aria-label="Delete">
                                                        <MdDelete />
                                                    </Fab>
                                                </div>

                                                <ConfirmDialog
                                                    open={open}
                                                    title="Remove Address"
                                                    message="Are you sure you want to remove this address?"
                                                    confirmText="Remove"
                                                    onConfirm={() => handleDeleteAddress(address)}
                                                    onCancel={() => setOpen(false)}
                                                />

                                            </div>

                                        ))

                                    )
                                    :
                                    (
                                        <div className='px-2 md:px-5'>

                                            <div className='border-b border-gray-100 pb-6 md:pb-8'>

                                                <div>
                                                    <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-2 md:mb-3'>Address Type</label>
                                                    <div className="flex flex-wrap gap-3 md:gap-4">
                                                        {
                                                            ["Home", "Work"].map((label, index) => (

                                                                <button key={index} onClick={() => setFormData({ ...formData, addressType: label })} className={`flex items-center gap-2 md:gap-3 pr-6 md:pr-10 rounded-md font-semibold cursor-pointer transition-all ${formData.addressType === label ? "text-blue-600 border-blue-500 bg-blue-50" : "text-gray-500 border-gray-300 hover:bg-gray-50"} border py-2 px-3 md:py-2.5 md:px-5 text-sm`}>
                                                                    <span className={`h-3.5 w-3.5 md:h-4 md:w-4 rounded-full flex items-center justify-center border ${formData.addressType === label ? "border-blue-500" : "border-gray-400"}`}>
                                                                        <span className={`h-1.5 w-1.5 md:h-2 md:w-2 ${formData.addressType === label ? "bg-blue-500" : "bg-transparent"} rounded-full transition-colors`}></span>
                                                                    </span>
                                                                    <span>{label}</span>
                                                                </button>

                                                            ))
                                                        }
                                                    </div>
                                                </div>

                                                {/* 🌟 Form Layout Responsive fixes (flex-col on mobile, flex-row on desktop) */}
                                                <div className="mt-4 md:mt-5 flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-5">

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Full Name</label>
                                                        <input
                                                            name='full_name'
                                                            value={formData.full_name}
                                                            onChange={handleInputChange}
                                                            className='w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'
                                                            type="text"
                                                            placeholder='Enter Your Name'
                                                        />
                                                    </div>

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Phone Number</label>
                                                        <PatternFormat
                                                            value={formData.phone}
                                                            name='phone'
                                                            onValueChange={(values) => {
                                                                setFormData({ ...formData, phone: values.value });
                                                            }}
                                                            className='w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'
                                                            placeholder='Enter Your Phone Number'
                                                            format="+91 ##### #####"
                                                            allowEmptyFormatting
                                                            mask="&bull;"
                                                            inputMode="numeric"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="mt-4 md:mt-5 flex items-center w-full">

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>
                                                            Address
                                                        </label>
                                                        <textarea
                                                            value={formData.address_line}
                                                            name='address_line'
                                                            onChange={handleInputChange}
                                                            className='w-full resize-y border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'
                                                            rows={3}
                                                            placeholder='Address (Area and Street)'
                                                        />
                                                    </div>

                                                </div>

                                                <div className="mt-4 md:mt-5 flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-5">

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>State</label>
                                                        <select name='state' value={formData.state} onChange={handleInputChange} className='w-full border bg-white border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'>
                                                            <option value="default" >Select State</option>
                                                            {
                                                                states.map((state) => (
                                                                    <option key={state.id} value={state.name}  >{state.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>City</label>
                                                        <select name='city' value={formData.city} onChange={handleInputChange} className='w-full border bg-white border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'>
                                                            <option value="default" className='text-gray-500' >Select City</option>
                                                            {
                                                                states.filter(state => state.name === formData.state)[0]?.cities?.map((city, index) => (
                                                                    <option key={index} value={city}>{city}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Pincode</label>
                                                        <PatternFormat
                                                            name='pincode'
                                                            value={formData.pincode}
                                                            onValueChange={(values) => {
                                                                setFormData(prev => ({ ...prev, pincode: values.value }))
                                                            }}
                                                            className='w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'
                                                            placeholder='Enter Pincode'
                                                            format="######"
                                                            mask=""
                                                            inputMode="numeric"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="mt-4 md:mt-5 flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-5">

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Landmark</label>
                                                        <input name='landmark' value={formData.landmark} onChange={handleInputChange} className='w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors' type="text" placeholder='Landmark (Optional)' />
                                                    </div>

                                                    <div className='w-full'>
                                                        <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Alternative Phone</label>
                                                        <PatternFormat 
                                                            name='alternative_phone' 
                                                            value={formData.alternative_phone} 
                                                            onValueChange={(values) => setFormData(prev => ({ ...prev, alternative_phone: values.value }))}
                                                            className='w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors' 
                                                            placeholder='Alt Phone (Optional)' 
                                                            format="+91 ##### #####"
                                                            allowEmptyFormatting
                                                            mask="&bull;"
                                                            inputMode="numeric"
                                                        />
                                                    </div>

                                                </div>

                                            </div>

                                            <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 md:mt-8 mb-4 md:mb-6'>
                                                <Button
                                                    onClick={editingId ? handleEditAddress : handleAddAddress}
                                                    loading={loading}
                                                    loadingPosition='start'
                                                    loadingIndicator={<PiSpinner className='text-xl animate-spin' />}
                                                    variant='contained'
                                                    className='h-11 md:h-12 w-full sm:w-1/2'
                                                >
                                                    Save Address
                                                </Button>

                                                {
                                                    address.length > 0 && (
                                                        <Button onClick={() => setShowForm(false)} variant='outlined' className='h-11 md:h-12 w-full sm:w-1/2' >
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
                <div className="sticky top-24 lg:col-span-1 flex flex-col gap-6">

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">

                        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-800">
                                Order Summary
                            </h2>
                        </div>

                        <div className="p-5 md:p-6 text-sm font-medium text-gray-600 space-y-3.5">

                            <div className="flex justify-between items-center">
                                <span>Subtotal ({cart?.cart_items?.length} items)</span>
                                <span className="text-gray-900 font-bold">{formatPriceINR(cart.mrp_total)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span>Shipping</span>
                                <span className="text-gray-900 font-bold">
                                    {cart?.shipping_cost > 0 ? `+ ${formatPriceINR(cart?.shipping_cost)}` : <span className="text-green-600">FREE</span>}
                                </span>
                            </div>

                            {cart?.discount_on_mrp > 0 && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span>Discount on MRP</span>
                                    <span className="font-bold">- {formatPriceINR(cart?.discount_on_mrp)}</span>
                                </div>
                            )}

                            {cart?.coupon?.discount_percentage > 0 && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span>Coupon ({cart?.coupon?.discount_percentage}% OFF)</span>
                                    <span className="font-bold">- {formatPriceINR(cart?.discount_amount)}</span>
                                </div>
                            )}

                            <hr className="border-gray-100 my-4" />

                            <div className="flex justify-between items-center text-lg md:text-xl">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-extrabold text-blue-600">{formatPriceINR(cart?.total_price)}</span>
                            </div>

                            {/* Trust & Payment Info */}
                            <div className="pt-6">
                                <p className="text-xs text-center text-gray-400 mb-3 font-semibold uppercase tracking-wider">
                                    Guaranteed Safe Checkout
                                </p>
                                <div className="flex justify-center items-center gap-3 text-2xl">
                                    <FaCcVisa className='text-[#1a1f71]' />
                                    <FaCcMastercard className='text-[#eb001b]' />
                                    <FaCcAmex className='text-[#2e77bc]' />
                                    <FaPaypal className='text-[#00457c]' />
                                    <FaGooglePay className='text-gray-600 text-3xl' />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-6 mt-2 border-t border-gray-100">
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <FaShieldAlt className="text-xl text-emerald-500" />
                                    <span className="text-mobile-1 md:text-xs text-gray-500 font-semibold uppercase tracking-wide">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <FaTruck className="text-xl text-blue-500" />
                                    <span className="text-mobile-1 md:text-xs text-gray-500 font-semibold uppercase tracking-wide">Free Shipping</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <FaUndo className="text-xl text-purple-500" />
                                    <span className="text-mobile-1 md:text-xs text-gray-500 font-semibold uppercase tracking-wide">Easy Returns</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <FaHeadset className="text-xl text-orange-500" />
                                    <span className="text-mobile-1 md:text-xs text-gray-500 font-semibold uppercase tracking-wide">24/7 Support</span>
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