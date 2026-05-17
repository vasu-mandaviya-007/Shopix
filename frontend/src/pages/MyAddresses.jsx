// import { Button, duration, Fab, IconButton, Radio } from '@mui/material';
// import React, { useEffect, useState } from 'react'

// import { PatternFormat } from 'react-number-format';
// import { PiSpinner } from 'react-icons/pi';
// import { MdDelete } from "react-icons/md";
// import { FaAngleRight, FaArrowLeft, FaPen, FaTrash, FaXmark } from 'react-icons/fa6';
// import { FaPlus, FaTruck } from 'react-icons/fa';
// import ConfirmDialog from '../components/UI/ConfirmDialog.jsx';
// import { toast } from "react-toastify";
// import { formatPriceINR } from "../utils/formatPriceINR.js"
// import axios from 'axios';
// import { getAccess } from '../auth.js';
// import { ArrowBigRightDash } from 'lucide-react';
// import Stepper from '../components/Stepper.jsx';
// import API_BASE_URL from '../config/config.js';
// import Swal from 'sweetalert2';
// import Loading from '../components/Loading.jsx';

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

// const MyAddresses = () => {

//     const [address, setAddresses] = useState([])
//     const [editingId, setEditingId] = useState(null);
//     const [actionLoading, setActionLoading] = useState(false)
//     const [loading, setLoading] = useState(true)
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

//     const fetchAddresses = async () => {

//         setLoading(true)

//         try {

//             const token = getAccess();
//             if (!token) return navigate("/login")

//             const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/`, {}, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })

//             setAddresses(response.data.addresses)

//             // if (!response.data.addresses.length > 0) {
//             //     setShowForm(true)
//             // }

//         } catch (err) {
//             toast.error(err?.message || "Failed To Fetch Address")
//         } finally {
//             setLoading(false)
//             // setTimeout(() => {
//             // }, 2000);
//         }

//     }

//     useEffect(() => {

//         fetchAddresses();

//     }, [])

//     const handleAddAddress = async () => {

//         const token = getAccess()

//         setActionLoading(true)

//         try {

//             const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/add/`, formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })

//             if (response.data.success) {
//                 setShowForm(false)
//                 // setSelectedAddress(response.data.address.uid);
//                 setAddresses([...address, response.data.address])
//                 toast.success("Address Added.")
//             } else {
//                 toast.error(response?.data?.error || "Failed to Add Address")
//             }

//         } catch (e) {
//             console.log(e)
//             toast.error("Failed to Add Address")
//         } finally {
//             setActionLoading(false)
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
//                 setAddresses(address.map(addr => addr.uid === editingId ? response.data.address : addr));
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

//         Swal.fire({
//             title: 'Are you sure?',
//             text: "Are you sure you want to delete this address?",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: `<i class="fa-solid fa-trash "></i> Delete`,
//             cancelButtonText: 'Cancel',
//             confirmButtonColor: '#d33',
//             showLoaderOnConfirm: true,
//         })
//             .then(async (result) => {

//                 if (result.isConfirmed) {


//                     try {

//                         const token = getAccess();

//                         const response = await axios.delete(`${API_BASE_URL}/api/orders/addresses/${address.uid}/`, {
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 Authorization: `Bearer ${token}`
//                             }
//                         })

//                         if (response.data.success) {
//                             setShowForm(false)
//                             setOpen(false);
//                             fetchAddresses()
//                             await Swal.fire({
//                                 title: "Address Deleted Successfull",
//                                 icon: "success",
//                                 timer: 3000,
//                                 timerProgressBar: true,
//                             });
//                             // toast.success("Address Deleted")
//                         } else {
//                             toast.error(response?.data?.error || "Failed to Delete Address")
//                         }

//                     } catch (e) {
//                         console.log(e)
//                         toast.error("Failed to Delete Address")
//                     }

//                 }

//             })

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


//     return (


//         <div className="bg-white rounded-lg overflow-hidden">

//             <div className="p-6 flex justify-between items-center border-b border-gray-200">

//                 <h2 className="text-xl font-semibold text-gray-800">
//                     {
//                         showForm && address.length > 0 &&
//                         // <Button onClick={() => setShowForm(false)}  variant='contained' className='mr-4!' startIcon={<FaArrowLeft className='text-sm!' />} ></Button>
//                         <IconButton className='mr-4!' onClick={() => setShowForm(false)} color='primary'>
//                             <FaArrowLeft className='text-lg!' />
//                         </IconButton>

//                     }
//                     {
//                         !showForm
//                             ? "Manage Addresses"
//                             : editingId
//                                 ? "Edit Delivery Address"
//                                 : "Add New Address"
//                     }
//                 </h2>

//                 {
//                     !showForm && (
//                         <Button onClick={handleOpenAddForm} variant='contained' startIcon={<FaPlus className='text-sm!' />} >Add New Delivery Address</Button>
//                     )
//                 }

//             </div>

//             {

//                 loading
//                     ?

//                     <Loading size={30} />

//                     :

//                     <div className="divide-y gap-4 p-4 divide-gray-200">

//                         {
//                             !showForm
//                                 ? (

//                                     <div className='grid grid-cols-2 gap-4'>
//                                         {
//                                             address.map((address, id) => (

//                                                 <div key={id} className={`flex relative border p-3 gap-2 border-gray-200 cursor-pointer`}>

//                                                     <div className='w-full items-center p-2'>
//                                                         <div className='flex gap-4'>
//                                                             <h3 className='text-black/70 font-semibold' >{address.full_name}</h3>
//                                                             <span className='bg-gray-100 text-gray-500 font-semibold px-2 py-1 text-xs' >{address.addressType}</span>
//                                                         </div>
//                                                         <p className='mt-2 text-sm text-black/70'>{address.address_line}, {address.city}, {address.state} - {address.country} <span className='text-black font-medium'>{address.postal_code}</span></p>
//                                                         <div className='flex gap-1 mt-2 text-sm'>
//                                                             <h3>Mobile : </h3>
//                                                             <p className='text-gray-600'>{address.phone}</p>
//                                                         </div>

//                                                     </div>

//                                                     {/* <ConfirmDialog
//                                                 open={open}
//                                                 title="Remove Address"
//                                                 message="Are you sure you want to remove this address?"
//                                                 confirmText="Remove"
//                                                 onConfirm={() => handleDeleteAddress(address)}
//                                                 onCancel={() => setOpen(false)}
//                                             /> */}

//                                                     <div className='absolute top-0 right-0 p-2'>

//                                                         <Fab color="primary" size='small' className='scale-80! z-1!' onClick={() => handleOpenEditForm(address)} aria-label="Edit">
//                                                             <FaPen />
//                                                         </Fab>

//                                                         {/* <Fab color="error" size='small' className='scale-80! z-1!' onClick={() => setOpen(true)} aria-label="Delete"> */}
//                                                         <Fab color="error" size='small' className='scale-80! z-1!' onClick={() => handleDeleteAddress(address)} aria-label="Delete">
//                                                             <MdDelete />
//                                                         </Fab>

//                                                     </div>

//                                                 </div>

//                                             ))
//                                         }
//                                     </div>

//                                 )
//                                 :
//                                 (
//                                     <div className='px-5'>

//                                         <div className='border-b border-b-gray-200 pb-8'>

//                                             <div>
//                                                 <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Address Type</label>
//                                                 <div className="flex gap-4">

//                                                     {
//                                                         ["Home", "Work"].map((label, index) => (

//                                                             <button key={index} onClick={() => setFormData({ ...formData, addressType: label })} className={`flex items-center gap-3 pr-10 rounded-sm font-semibold cursor-pointer ${formData.addressType === label ? "text-blue-400 border-blue-500 bg-blue-50/50" : "text-black/60 border-gray-300"} border  py-3 px-5`}>
//                                                                 <span className={`h-4 w-4 rounded-full flex items-center justify-center border ${formData.addressType === label ? "border-blue-500" : "border-black/50"}`}>
//                                                                     <span className={`h-2 w-2 ${formData.addressType === label && "bg-blue-500"} rounded-full`}></span>
//                                                                 </span>
//                                                                 <span>{label}</span>
//                                                             </button>

//                                                         ))
//                                                     }

//                                                 </div>
//                                             </div>

//                                             <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Full Name</label>
//                                                     <input
//                                                         name='full_name'
//                                                         value={formData.full_name}
//                                                         onChange={handleInputChange}
//                                                         className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                         type="text"
//                                                         placeholder='Enter Your Name'
//                                                     />
//                                                 </div>

//                                                 <div className='w-full'>

//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Phone Number</label>
//                                                     <PatternFormat
//                                                         value={formData.phone}
//                                                         name='phone'
//                                                         onValueChange={(values) => {
//                                                             setFormData({
//                                                                 ...formData,
//                                                                 phone: values.value
//                                                             });
//                                                         }}
//                                                         className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                         placeholder='Enter Your Phone Number'
//                                                         format="+91 ##### #####"
//                                                         allowEmptyFormatting
//                                                         mask="&bull;"
//                                                         inputMode="numeric"
//                                                     />

//                                                 </div>

//                                             </div>

//                                             <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                 <div className='w-full'>

//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>
//                                                         Address
//                                                     </label>

//                                                     <textarea
//                                                         value={formData.address_line}
//                                                         name='address_line'
//                                                         onChange={handleInputChange}
//                                                         className='w-full resize-none border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                         rows={3}
//                                                         placeholder='Address (Area and Street)'
//                                                     />

//                                                 </div>

//                                             </div>

//                                             <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>State</label>
//                                                     <select name='state' value={formData.state} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Enter Your Name'>
//                                                         <option defaultValue={"default"} >Select State</option>
//                                                         {
//                                                             states.map((state) => (
//                                                                 <option key={state.id} value={state.name}  >{state.name}</option>
//                                                             ))
//                                                         }
//                                                     </select>
//                                                 </div>

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>City</label>
//                                                     <select name='city' value={formData.city} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Enter Your Name'>
//                                                         <option value="default" className='text-gray-600' >Select City</option>
//                                                         {
//                                                             states.filter(state => state.name === formData.state)[0]?.cities?.map((city, index) => (
//                                                                 <option key={index} value={city}>{city}</option>
//                                                             ))
//                                                         }
//                                                     </select>
//                                                 </div>

//                                                 <div className='w-full'>

//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Pincode</label>
//                                                     <PatternFormat
//                                                         name='pincode'
//                                                         value={formData.pincode}
//                                                         onValueChange={(values) => {
//                                                             setFormData(prev => ({
//                                                                 ...prev,
//                                                                 pincode: values.value
//                                                             }))
//                                                         }}
//                                                         className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400'
//                                                         placeholder='Enter Pincode'
//                                                         format="######"
//                                                         mask=""
//                                                         inputMode="numeric"
//                                                     />

//                                                 </div>

//                                             </div>

//                                             <div className="input-group mt-4 flex items-center w-full gap-5">

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Landmark</label>
//                                                     <input name='landmark' value={formData.landmark} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Landmark (Optional)' />
//                                                 </div>

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-600 font-semibold text-sm mb-2'>Alternative Phone Number</label>
//                                                     <input name='alternative_phone' value={formData.alternative_phone} onChange={handleInputChange} className='w-full border border-gray-300 rounded-sm text-black/90 px-5 py-3 focus:outline-blue-400' type="text" placeholder='Alternative Phone (Optional)' />
//                                                 </div>

//                                             </div>

//                                         </div>

//                                         <div className='flex gap-5 mt-8 mb-6'>
//                                             <Button
//                                                 onClick={editingId ? handleEditAddress : handleAddAddress}
//                                                 loading={actionLoading}
//                                                 loadingPosition='start'
//                                                 loadingIndicator={<PiSpinner className='text-xl text-gray-600 animate-spin' />}
//                                                 variant='contained'
//                                                 className='h-12'
//                                                 fullWidth
//                                             >
//                                                 {
//                                                     editingId ? "Update" : "Save"
//                                                 }
//                                             </Button>

//                                             {
//                                                 address.length > 0 && (
//                                                     <Button onClick={() => setShowForm(false)} variant='outlined' className='h-12' fullWidth >
//                                                         Cancel
//                                                     </Button>
//                                                 )
//                                             }
//                                         </div>

//                                     </div>
//                                 )

//                         }


//                     </div>

//             }

//         </div>
//     )
// }

// export default MyAddresses



// import { Button, Fab, IconButton, useTheme, useMediaQuery, TextField, Select, MenuItem } from '@mui/material';
// import React, { useEffect, useState } from 'react'

// import { PatternFormat } from 'react-number-format';
// import { PiSpinner } from 'react-icons/pi';
// import { MdDelete } from "react-icons/md";
// import { FaArrowLeft, FaPen } from 'react-icons/fa6';
// import { FaPlus } from 'react-icons/fa';
// import { toast } from "react-toastify";
// import axios from 'axios';
// import { getAccess } from '../auth.js';
// import API_BASE_URL from '../config/config.js';
// import Swal from 'sweetalert2';
// import Loading from '../components/Loading.jsx';

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

// const MyAddresses = () => {

//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//     const inputFontSize = {
//         '& .MuiInputBase-input': {
//             fontSize: {
//                 xs: '13px',  // mobile
//                 sm: '14px',  // tablet
//                 md: '16px',  // laptop
//             },
//         },
//     }


//     const [address, setAddresses] = useState([])
//     const [editingId, setEditingId] = useState(null);
//     const [actionLoading, setActionLoading] = useState(false)
//     const [loading, setLoading] = useState(true)
//     const [showForm, setShowForm] = useState(false)

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

//     const fetchAddresses = async () => {
//         setLoading(true)
//         try {
//             const token = getAccess();
//             if (!token) return navigate("/login")

//             const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/`, {}, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })

//             setAddresses(response.data.addresses)
//         } catch (err) {
//             toast.error(err?.message || "Failed To Fetch Address")
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchAddresses();
//     }, [])

//     const handleAddAddress = async () => {
//         const token = getAccess()
//         setActionLoading(true)
//         try {
//             const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/add/`, formData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             if (response.data.success) {
//                 setShowForm(false)
//                 setAddresses([...address, response.data.address])
//                 toast.success("Address Added.")
//             } else {
//                 toast.error(response?.data?.error || "Failed to Add Address")
//             }
//         } catch (e) {
//             console.log(e)
//             toast.error("Failed to Add Address")
//         } finally {
//             setActionLoading(false)
//         }
//     }

//     const handleEditAddress = async () => {
//         setActionLoading(true)
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
//                 setAddresses(address.map(addr => addr.uid === editingId ? response.data.address : addr));
//                 toast.success("Address Updated.")
//             } else {
//                 toast.error(response?.data?.error || "Failed to Update Address")
//             }
//         } catch (e) {
//             console.log(e)
//             toast.error("Failed to Update Address")
//         } finally {
//             setActionLoading(false)
//         }
//     }

//     const handleDeleteAddress = async (address) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "Are you sure you want to delete this address?",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: `<i class="fa-solid fa-trash "></i> Delete`,
//             cancelButtonText: 'Cancel',
//             confirmButtonColor: '#d33',
//             showLoaderOnConfirm: true,
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 try {
//                     const token = getAccess();
//                     const response = await axios.delete(`${API_BASE_URL}/api/orders/addresses/${address.uid}/`, {
//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`
//                         }
//                     })

//                     if (response.data.success) {
//                         setShowForm(false)
//                         fetchAddresses()
//                         await Swal.fire({
//                             title: "Address Deleted Successfully",
//                             icon: "success",
//                             timer: 3000,
//                             timerProgressBar: true,
//                         });
//                     } else {
//                         toast.error(response?.data?.error || "Failed to Delete Address")
//                     }
//                 } catch (e) {
//                     console.log(e)
//                     toast.error("Failed to Delete Address")
//                 }
//             }
//         })
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

//     return (

//         <div className="bg-white rounded-lg overflow-hidden">

//             {/* 🌟 Responsive Header: Added flex-col sm:flex-row to prevent button crowding on small phones */}
//             <div className="p-4 md:p-6 flex justify-between items-start sm:items-center gap-4 sm:gap-0 border-b border-gray-200">

//                 <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center">
//                     {
//                         showForm && address.length > 0 &&
//                         <IconButton className='mr-2 md:mr-4!' onClick={() => setShowForm(false)} color='primary'>
//                             <FaArrowLeft className='text-base md:text-lg!' />
//                         </IconButton>
//                     }
//                     {
//                         !showForm
//                             ? "Manage Addresses"
//                             : editingId
//                                 ? "Edit Delivery Address"
//                                 : "Add New Address"
//                     }
//                 </h2>

//                 {
//                     !showForm && (
//                         <Button size="small" onClick={handleOpenAddForm} variant='contained' className="max-sm:px-3! max-sm:py-1.5! max-sm:text-mobile-1!" startIcon={<FaPlus className='text-xs! sm:text-sm!' />} >
//                             Add New
//                         </Button>
//                     )
//                 }

//             </div>

//             {
//                 loading
//                     ?
//                     <Loading size={30} />
//                     :
//                     <div className="divide-y gap-4 p-4 md:p-6 divide-gray-200">

//                         {
//                             !showForm
//                                 ? (
//                                     // 🌟 Responsive Grid: grid-cols-1 for mobile, md:grid-cols-2 for desktop
//                                     <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                         {
//                                             address.map((address, id) => (

//                                                 <div key={id} className={`flex relative border p-3 md:p-4 gap-2 border-gray-200 rounded-lg cursor-pointer hover:shadow-sm transition-shadow`}>

//                                                     <div className='w-full items-center p-1 md:p-2 pr-12'>
//                                                         <div className='flex flex-wrap items-center gap-2 md:gap-4'>
//                                                             <h3 className='text-black/80 text-sm md:text-base font-bold' >{address.full_name}</h3>
//                                                             <span className='bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-sm text-mobile-1 md:text-xs tracking-wider' >
//                                                                 {address.addressType.toUpperCase()}
//                                                             </span>
//                                                         </div>
//                                                         <p className='mt-2 text-xs md:text-sm text-gray-600 leading-relaxed'>
//                                                             {address.address_line}, {address.city}, {address.state} - {address.country} <span className='text-gray-800 font-semibold'>{address.pincode}</span>
//                                                         </p>
//                                                         <div className='flex gap-1.5 mt-2 text-xs md:text-sm'>
//                                                             <h3 className="font-semibold text-gray-700">Mobile : </h3>
//                                                             <p className='text-gray-600 font-medium'>{address.phone}</p>
//                                                         </div>
//                                                     </div>

//                                                     <div className='absolute top-2 right-2 flex flex-col gap-2'>
//                                                         <Fab color="primary" size='small' className='scale-[0.7] md:scale-80! z-1! shadow-sm' onClick={() => handleOpenEditForm(address)} aria-label="Edit">
//                                                             <FaPen />
//                                                         </Fab>

//                                                         <Fab color="error" size='small' className='scale-[0.7] md:scale-80! z-1! shadow-sm' onClick={() => handleDeleteAddress(address)} aria-label="Delete">
//                                                             <MdDelete />
//                                                         </Fab>
//                                                     </div>

//                                                 </div>
//                                             ))
//                                         }
//                                     </div>

//                                 )
//                                 :
//                                 (
//                                     <div className='px-2 md:px-5'>

//                                         <div className='border-b border-b-gray-200 pb-6 md:pb-8'>

//                                             <div>
//                                                 <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-2 md:mb-3'>Address Type</label>
//                                                 <div className="flex gap-3 md:gap-4">
//                                                     {
//                                                         ["Home", "Work"].map((label, index) => (
//                                                             <button key={index} onClick={() => setFormData({ ...formData, addressType: label })} className={`flex items-center gap-2 md:gap-3 pr-6 md:pr-10 rounded-md font-semibold cursor-pointer transition-all ${formData.addressType === label ? "text-blue-600 border-blue-500 bg-blue-50" : "text-gray-500 border-gray-300 hover:bg-gray-50"} border py-2 px-3 md:py-2.5 md:px-5 text-xs sm:text-sm`}>
//                                                                 <span className={`h-3.5 w-3.5 md:h-4 md:w-4 rounded-full flex items-center justify-center border ${formData.addressType === label ? "border-blue-500" : "border-gray-400"}`}>
//                                                                     <span className={`h-1.5 w-1.5 md:h-2 md:w-2 ${formData.addressType === label ? "bg-blue-500" : "bg-transparent"} rounded-full transition-colors`}></span>
//                                                                 </span>
//                                                                 <span>{label}</span>
//                                                             </button>
//                                                         ))
//                                                     }
//                                                 </div>
//                                             </div>

//                                             {/* 🌟 Responsive Form Row: flex-col on mobile, md:flex-row on desktop */}
//                                             <div className="input-group mt-5 md:mt-6 flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-5">

//                                                 <div className='w-full'>
//                                                     {/* 
//                                                     <input
//                                                     name='full_name'
//                                                     value={formData.full_name}
//                                                     onChange={handleInputChange}
//                                                     className='w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'
//                                                     type="text"
//                                                     placeholder='Enter Your Name'
//                                                     /> */}
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Full Name</label>
//                                                     <TextField
//                                                         size={isMobile ? "small" : "medium"}
//                                                         sx={inputFontSize}
//                                                         placeholder='Enter Your Name'
//                                                         name='full_name'
//                                                         value={formData.full_name || ""}
//                                                         onChange={handleInputChange}
//                                                         // disabled={!isEditing || loading}
//                                                         fullWidth
//                                                     />
//                                                 </div>

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Phone Number</label>
//                                                     <PatternFormat
//                                                         value={formData.phone}
//                                                         name='phone'
//                                                         onValueChange={(values) => {
//                                                             setFormData({ ...formData, phone: values.value });
//                                                         }}
//                                                         className='w-full border border-gray-300 rounded-sm hover:border-gray-800 text-gray-800 px-4 py-2 md:px-5 md:py-4 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'
//                                                         placeholder='Enter Your Phone Number'
//                                                         format="+91 ##### #####"
//                                                         allowEmptyFormatting
//                                                         size={isMobile ? "small" : "medium"}
//                                                         mask="&bull;"
//                                                         inputMode="numeric"
//                                                     />
//                                                 </div>

//                                             </div>

//                                             <div className="input-group mt-4 md:mt-5 flex items-center w-full">

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>
//                                                         Address
//                                                     </label>
//                                                     {/* <textarea
//                                                         value={formData.address_line}
//                                                         name='address_line'
//                                                         onChange={handleInputChange}
//                                                         className='w-full resize-y border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'
//                                                         rows={3}
//                                                         placeholder='Address (Area and Street)'
//                                                     /> */}
//                                                     <TextField
//                                                         multiline
//                                                         rows={3}
//                                                         size={isMobile ? "small" : "medium"}
//                                                         placeholder='Address (Area and Street)'
//                                                         sx={inputFontSize}
//                                                         name='address_line'
//                                                         value={formData.address_line}
//                                                         onChange={handleInputChange}
//                                                         // disabled={!isEditing || loading}
//                                                         fullWidth
//                                                     // className='text-3xl!'
//                                                     />
//                                                 </div>

//                                             </div>

//                                             {/* 🌟 Responsive Form Row: flex-col on mobile, md:flex-row on desktop */}
//                                             <div className="input-group mt-4 md:mt-5 flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-5">

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>State</label>
//                                                     {/* <select name='state' value={formData.state} onChange={handleInputChange} className='w-full border bg-white border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'>
//                                                         <option value="default" >Select State</option>
//                                                         {
//                                                             states.map((state) => (
//                                                                 <option key={state.id} value={state.name}>{state.name}</option>
//                                                             ))
//                                                         }
//                                                     </select> */}

//                                                     <Select
//                                                         sx={inputFontSize}
//                                                         name='state'
//                                                         size={isMobile ? "small" : "medium"}
//                                                         defaultValue={"default"}
//                                                         value={formData.state || "default"}
//                                                         onChange={(e) => { handleInputChange(e); setFormData(prev => ({ ...prev, city: "" })) }}
//                                                         fullWidth
//                                                     >
//                                                         <MenuItem sx={{ fontSize: { xs: '13px', sm: '14px', md: '15px' }, }} key="default" value={"default"}> Select State </MenuItem>

//                                                         {
//                                                             states.map((state) => (
//                                                                 <MenuItem sx={{
//                                                                     fontSize: {
//                                                                         xs: '13px',  // mobile
//                                                                         sm: '14px',  // tablet
//                                                                         md: '15px',  // laptop
//                                                                     },
//                                                                 }} key={state.id} value={state.name}>{state.name}</MenuItem>
//                                                             ))
//                                                         }
//                                                     </Select>
//                                                 </div>

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>City</label>
//                                                     {/* <select name='city' value={formData.city} onChange={handleInputChange} className='w-full border bg-white border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors'>
//                                                         <option value="default" className='text-gray-500' >Select City</option>
//                                                         {
//                                                             states.filter(state => state.name === formData.state)[0]?.cities?.map((city, index) => (
//                                                                 <option key={index} value={city}>{city}</option>
//                                                             ))
//                                                         }
//                                                     </select> */}

//                                                     <Select
//                                                         sx={inputFontSize}
//                                                         name='city'
//                                                         value={formData.city || "default"}
//                                                         size={isMobile ? "small" : "medium"}
//                                                         defaultValue={"default"}
//                                                         onChange={handleInputChange}
//                                                         fullWidth
//                                                     >
//                                                         <MenuItem sx={{ fontSize: { xs: '13px', sm: '14px', md: '15px' }, }} key="default" value={"default"}> Select City </MenuItem>

//                                                         {
//                                                             states.filter(state => state.name === formData.state)[0]?.cities?.map((city, index) => (
//                                                                 <MenuItem sx={{
//                                                                     fontSize: {
//                                                                         xs: '13px',  // mobile
//                                                                         sm: '14px',  // tablet
//                                                                         md: '15px',  // laptop
//                                                                     },
//                                                                 }} key={index} value={city}>{city}</MenuItem>
//                                                             ))
//                                                         }
//                                                     </Select>

//                                                 </div>

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Pincode</label>
//                                                     <PatternFormat
//                                                         name='pincode'
//                                                         value={formData.pincode}
//                                                         onValueChange={(values) => {
//                                                             setFormData(prev => ({ ...prev, pincode: values.value }))
//                                                         }}
//                                                         className='w-full border border-gray-300 rounded-sm hover:border-gray-800 text-gray-800 px-4 py-2 md:px-5 md:py-4 focus:outline-blue-500 focus:border-blue-500 text-[13px] sm:text-sm md:text-base transition-colors'
//                                                         placeholder='Enter Pincode'
//                                                         format="######"
//                                                         mask=""
//                                                         inputMode="numeric"
//                                                     />
//                                                 </div>

//                                             </div>

//                                             {/* 🌟 Responsive Form Row: flex-col on mobile, md:flex-row on desktop */}
//                                             <div className="input-group mt-4 md:mt-5 flex flex-col md:flex-row items-start md:items-center w-full gap-4 md:gap-5">

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Landmark</label>
//                                                     {/* <input name='landmark' value={formData.landmark} onChange={handleInputChange} className='w-full border border-gray-300 rounded-md text-gray-800 px-4 py-2.5 md:px-5 md:py-3 focus:outline-blue-500 focus:border-blue-500 text-sm md:text-base transition-colors' type="text" placeholder='Landmark (Optional)' /> */}
//                                                     <TextField
//                                                         name='landmark'
//                                                         value={formData.landmark || ""}
//                                                         onChange={handleInputChange}
//                                                         placeholder='Landmark (Optional)'
//                                                         size={isMobile ? "small" : "medium"}
//                                                         sx={inputFontSize}
//                                                         // disabled={!isEditing || loading}
//                                                         fullWidth
//                                                     />
//                                                 </div>

//                                                 <div className='w-full'>
//                                                     <label htmlFor="" className='block text-gray-700 font-semibold text-xs md:text-sm mb-1.5 md:mb-2'>Alternative Phone Number</label>
//                                                     <PatternFormat
//                                                         name='alternative_phone'
//                                                         value={formData.alternative_phone}
//                                                         onValueChange={(values) => setFormData(prev => ({ ...prev, alternative_phone: values.value }))}
//                                                         className='w-full border border-gray-300 rounded-sm hover:border-gray-800 text-gray-800 px-4 py-2.5 md:px-5 md:py-4 focus:outline-blue-500 focus:border-blue-500 text-[13px] sm:text-sm md:text-base transition-colors'
//                                                         placeholder='Alternative Phone (Optional)'
//                                                         format="+91 ##### #####"
//                                                         allowEmptyFormatting
//                                                         mask="&bull;"
//                                                         inputMode="numeric"
//                                                     />
//                                                 </div>

//                                             </div>

//                                         </div>

//                                         <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 md:mt-8 mb-4 md:mb-6'>
//                                             <Button
//                                                 onClick={editingId ? handleEditAddress : handleAddAddress}
//                                                 loading={actionLoading}
//                                                 loadingPosition='start'
//                                                 loadingIndicator={<PiSpinner className='text-lg md:text-xl text-gray-200 animate-spin' />}
//                                                 variant='contained'
//                                                 className='h-11 md:h-12 w-full sm:w-1/2'
//                                             >
//                                                 {
//                                                     editingId ? "Update Address" : "Save Address"
//                                                 }
//                                             </Button>

//                                             {
//                                                 address.length > 0 && (
//                                                     <Button onClick={() => setShowForm(false)} variant='outlined' className='h-11 md:h-12 w-full sm:w-1/2' >
//                                                         Cancel
//                                                     </Button>
//                                                 )
//                                             }
//                                         </div>

//                                     </div>
//                                 )
//                         }

//                     </div>
//             }

//         </div>
//     )
// }

// export default MyAddresses




import { Button, Fab, IconButton, TextField, Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { PatternFormat } from 'react-number-format';
import { PiSpinner } from 'react-icons/pi';
import { MdDelete, MdLocationOn } from "react-icons/md";
import { FaArrowLeft, FaPen } from 'react-icons/fa6';
import { FaPlus, FaHome, FaBriefcase } from 'react-icons/fa';
import { toast } from "react-toastify";
import axios from 'axios';
import { getAccess } from '../auth.js';
import API_BASE_URL from '../config/config.js';
import Swal from 'sweetalert2';
import Loading from '../components/Loading.jsx';

const states = [
    { id: 101, name: "Karnataka", cities: ["Bagalkot","Ballari","Bengaluru","Bidar","Chikkamagaluru","Davangere","Dharwad","Hassan","Hubballi","Kalaburagi","Karwar","Kolar","Mandya","Mangaluru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Vijayapura"] },
    { id: 102, name: "Gujarat", cities: ["Ahmedabad","Anand","Bharuch","Bhavnagar","Bhuj","Botad","Dahod","Gandhinagar","Godhra","Jamnagar","Junagadh","Morbi","Mehsana","Nadiad","Navsari","Palanpur","Porbandar","Rajkot","Surat","Surendranagar","Vadodara","Vapi"] },
    { id: 103, name: "Tamil Nadu", cities: ["Ariyalur","Chennai","Coimbatore","Dindigul","Erode","Hosur","Karur","Kanchipuram","Madurai","Namakkal","Nagapattinam","Perambalur","Ramanathapuram","Salem","Sivakasi","Tiruchirappalli","Tirunelveli","Thoothukudi","Tiruppur","Vellore","Virudhunagar","Udhagamandalam","Krishnagiri"] },
    { id: 104, name: "Maharashtra", cities: ["Akola","Amravati","Aurangabad","Beed","Chandrapur","Dhule","Gondia","Jalgaon","Kolhapur","Latur","Nagpur","Nanded","Nashik","Osmanabad","Parbhani","Pune","Raigad","Ratnagiri","Satara","Solapur","Thane","Wardha","Yavatmal"] },
    { id: 105, name: "West Bengal", cities: ["Alipurduar","Asansol","Baharampur","Balurghat","Bardhaman","Barasat","Basirhat","Chandannagar","Dankuni","Durgapur","Habra","Howrah","Jalpaiguri","Krishnanagar","Malda","Medinipur","Raiganj","Siliguri"] },
    { id: 106, name: "Rajasthan", cities: ["Ajmer","Alwar","Barmer","Bikaner","Bhilwara","Chittorgarh","Dholpur","Jaisalmer","Jhunjhunu","Jhalawar","Jodhpur","Kota","Nagaur","Pali","Rajsamand","Sawai Madhopur","Sikar","Tonk","Udaipur"] },
]

const inputSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '13px' },
    '& .MuiInputBase-input': { fontSize: { xs: '13px', sm: '13px', md: '14px' } },
}

const selectSx = {
    borderRadius: '10px',
    fontSize: '13px',
}

const menuItemSx = { fontSize: { xs: '13px', sm: '13px', md: '14px' } }

const MyAddresses = () => {

    const [addresses, setAddresses] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    const [formData, setFormData] = useState({
        addressType: "Home",
        full_name: "", phone: "", alternative_phone: "",
        address_line: "", city: "", state: "", pincode: "", landmark: "",
    })

    const fetchAddresses = async () => {
        setLoading(true)
        try {
            const token = getAccess()
            const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/`, {}, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            })
            setAddresses(response.data.addresses)
        } catch (err) {
            toast.error(err?.message || "Failed to fetch addresses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAddresses() }, [])

    const handleAddAddress = async () => {
        setActionLoading(true)
        try {
            const token = getAccess()
            const response = await axios.post(`${API_BASE_URL}/api/orders/addresses/add/`, formData, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            })
            if (response.data.success) {
                setShowForm(false)
                setAddresses(prev => [...prev, response.data.address])
                toast.success("Address Added.")
            } else {
                toast.error(response?.data?.error || "Failed to Add Address")
            }
        } catch (e) {
            toast.error("Failed to Add Address")
        } finally {
            setActionLoading(false)
        }
    }

    const handleEditAddress = async () => {
        setActionLoading(true)
        try {
            const token = getAccess()
            const response = await axios.put(`${API_BASE_URL}/api/orders/addresses/${editingId}/`, formData, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            })
            if (response.data.success) {
                setShowForm(false)
                setAddresses(prev => prev.map(a => a.uid === editingId ? response.data.address : a))
                toast.success("Address Updated.")
            } else {
                toast.error(response?.data?.error || "Failed to Update Address")
            }
        } catch (e) {
            toast.error("Failed to Update Address")
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteAddress = async (addr) => {
        const result = await Swal.fire({
            title: 'Delete Address?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#e5e7eb',
            customClass: {
                cancelButton: '!text-gray-700',
                popup: '!rounded-2xl',
                confirmButton: '!rounded-xl',
                cancelButton: '!rounded-xl',
            }
        })
        if (!result.isConfirmed) return
        try {
            const token = getAccess()
            const response = await axios.delete(`${API_BASE_URL}/api/orders/addresses/${addr.uid}/`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            })
            if (response.data.success) {
                setAddresses(prev => prev.filter(a => a.uid !== addr.uid))
                toast.success("Address deleted.")
            } else {
                toast.error(response?.data?.error || "Failed to delete")
            }
        } catch (e) {
            toast.error("Failed to delete address")
        }
    }

    const handleOpenAddForm = () => {
        setEditingId(null)
        setFormData({ addressType: "Home", full_name: "", phone: "", alternative_phone: "", address_line: "", city: "", state: "", pincode: "", landmark: "" })
        setShowForm(true)
    }

    const handleOpenEditForm = (addr) => {
        setEditingId(addr.uid)
        setFormData({
            addressType: addr.addressType, full_name: addr.full_name, phone: addr.phone,
            alternative_phone: addr.alternative_phone, address_line: addr.address_line,
            state: addr.state, city: addr.city, pincode: addr.pincode, landmark: addr.landmark
        })
        setShowForm(true)
    }

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const patternInputClass = "w-full border border-gray-300 rounded-[10px] hover:border-gray-700 text-gray-800 px-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[13px] md:text-sm transition-colors"

    return (
        <div className="bg-white rounded-lg overflow-hidden">

            {/* Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center border-b border-gray-100">
                <div className='flex items-center gap-2'>
                    {showForm && addresses.length > 0 && (
                        <button
                            onClick={() => setShowForm(false)}
                            className='w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors'
                        >
                            <FaArrowLeft className='text-sm' />
                        </button>
                    )}
                    <div>
                        <h2 className="text-sm sm:text-base font-bold text-gray-900">
                            {!showForm ? "My Addresses" : editingId ? "Edit Address" : "Add New Address"}
                        </h2>
                        {!showForm && (
                            <p className='text-xs text-gray-400 mt-0.5'>
                                {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
                            </p>
                        )}
                    </div>
                </div>
                {!showForm && (
                    <button
                        onClick={handleOpenAddForm}
                        className='flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors'
                    >
                        <FaPlus className='text-[10px]' />
                        Add New
                    </button>
                )}
            </div>

            {loading ? (
                <Loading size={30} />
            ) : (
                <div className="p-4 sm:p-6">

                    {/* ── Address List ── */}
                    {!showForm ? (

                        addresses.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-16 text-center'>
                                <div className='w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4'>
                                    <MdLocationOn className='text-2xl text-gray-300' />
                                </div>
                                <h3 className='font-semibold text-gray-700 text-sm mb-1'>No addresses saved</h3>
                                <p className='text-xs text-gray-400 mb-5'>Add a delivery address to get started</p>
                                <button
                                    onClick={handleOpenAddForm}
                                    className='flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors'
                                >
                                    <FaPlus className='text-[10px]' /> Add Address
                                </button>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4'>
                                {addresses.map((addr) => (
                                    <div
                                        key={addr.uid}
                                        className='relative border border-gray-100 rounded-2xl p-4 hover:border-gray-200 hover:shadow-sm transition-all bg-gray-50/50'
                                    >
                                        {/* Type badge */}
                                        <div className='flex items-center gap-2 mb-3'>
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${addr.addressType === 'Home' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {addr.addressType === 'Home' ? <FaHome className='text-[9px]' /> : <FaBriefcase className='text-[9px]' />}
                                                {addr.addressType}
                                            </span>
                                            <span className='font-bold text-gray-800 text-sm truncate'>{addr.full_name}</span>
                                        </div>

                                        <p className='text-xs text-gray-500 leading-relaxed mb-2 pr-14'>
                                            {addr.address_line}, {addr.city}, {addr.state} — <span className='font-semibold text-gray-700'>{addr.pincode}</span>
                                        </p>

                                        <div className='flex items-center gap-1.5 text-xs text-gray-500'>
                                            <span className='font-semibold text-gray-600'>📞</span>
                                            {addr.phone}
                                        </div>

                                        {/* Action buttons */}
                                        <div className='absolute top-3 right-3 flex flex-col gap-1.5'>
                                            <button
                                                onClick={() => handleOpenEditForm(addr)}
                                                className='w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm'
                                            >
                                                <FaPen className='text-[11px]' />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(addr)}
                                                className='w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm'
                                            >
                                                <MdDelete className='text-sm' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )

                    ) : (

                        /* ── Address Form ── */
                        <div className='max-w-2xl'>

                            {/* Address Type */}
                            <div className='mb-5'>
                                <label className='block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide'>Address Type</label>
                                <div className="flex gap-3">
                                    {["Home", "Work"].map((label) => (
                                        <button
                                            key={label}
                                            onClick={() => setFormData(prev => ({ ...prev, addressType: label }))}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${formData.addressType === label
                                                ? "bg-slate-800 text-white border-slate-800"
                                                : "text-gray-500 border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            {label === 'Home' ? <FaHome className='text-[11px]' /> : <FaBriefcase className='text-[11px]' />}
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className='space-y-4'>

                                {/* Name + Phone */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-600 mb-1.5'>Full Name</label>
                                        <TextField size="small" sx={inputSx} placeholder='Enter your name' name='full_name' value={formData.full_name || ""} onChange={handleInputChange} fullWidth />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-600 mb-1.5'>Phone Number</label>
                                        <PatternFormat
                                            value={formData.phone}
                                            onValueChange={(values) => setFormData(prev => ({ ...prev, phone: values.value }))}
                                            className={patternInputClass}
                                            placeholder='Phone Number'
                                            format="+91 ##### #####"
                                            allowEmptyFormatting
                                            mask="•"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className='block text-xs font-semibold text-gray-600 mb-1.5'>Address</label>
                                    <TextField multiline rows={3} size="small" sx={inputSx} placeholder='Area and street' name='address_line' value={formData.address_line} onChange={handleInputChange} fullWidth />
                                </div>

                                {/* State + City + Pincode */}
                                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-600 mb-1.5'>State</label>
                                        <Select
                                            size="small"
                                            name='state'
                                            value={formData.state || "default"}
                                            onChange={(e) => { handleInputChange(e); setFormData(prev => ({ ...prev, city: "" })) }}
                                            fullWidth
                                            sx={{ ...selectSx, fontSize: '13px' }}
                                        >
                                            <MenuItem sx={menuItemSx} value="default">Select State</MenuItem>
                                            {states.map(s => <MenuItem sx={menuItemSx} key={s.id} value={s.name}>{s.name}</MenuItem>)}
                                        </Select>
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-600 mb-1.5'>City</label>
                                        <Select
                                            size="small"
                                            name='city'
                                            value={formData.city || "default"}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ ...selectSx, fontSize: '13px' }}
                                        >
                                            <MenuItem sx={menuItemSx} value="default">Select City</MenuItem>
                                            {states.find(s => s.name === formData.state)?.cities?.map((city, i) => (
                                                <MenuItem sx={menuItemSx} key={i} value={city}>{city}</MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-600 mb-1.5'>Pincode</label>
                                        <PatternFormat
                                            name='pincode'
                                            value={formData.pincode}
                                            onValueChange={(values) => setFormData(prev => ({ ...prev, pincode: values.value }))}
                                            className={patternInputClass}
                                            placeholder='Pincode'
                                            format="######"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                {/* Landmark + Alt Phone */}
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-600 mb-1.5'>Landmark <span className='text-gray-400 font-normal'>(Optional)</span></label>
                                        <TextField size="small" sx={inputSx} name='landmark' value={formData.landmark || ""} onChange={handleInputChange} placeholder='Nearby landmark' fullWidth />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-gray-600 mb-1.5'>Alt. Phone <span className='text-gray-400 font-normal'>(Optional)</span></label>
                                        <PatternFormat
                                            name='alternative_phone'
                                            value={formData.alternative_phone}
                                            onValueChange={(values) => setFormData(prev => ({ ...prev, alternative_phone: values.value }))}
                                            className={patternInputClass}
                                            placeholder='Alternative phone'
                                            format="+91 ##### #####"
                                            allowEmptyFormatting
                                            mask="•"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Form Actions */}
                            <div className='flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-100'>
                                <Button
                                    onClick={editingId ? handleEditAddress : handleAddAddress}
                                    loading={actionLoading}
                                    loadingPosition='start'
                                    loadingIndicator={<PiSpinner className='text-base text-gray-200 animate-spin' />}
                                    variant='contained'
                                    fullWidth
                                    className='h-11! rounded-xl! shadow-none! capitalize! bg-slate-800! hover:bg-slate-700!'
                                >
                                    {editingId ? "Update Address" : "Save Address"}
                                </Button>
                                {addresses.length > 0 && (
                                    <Button
                                        onClick={() => setShowForm(false)}
                                        variant='outlined'
                                        fullWidth
                                        className='h-11! rounded-xl! capitalize! border-gray-200! text-gray-600! hover:bg-gray-50!'
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MyAddresses

