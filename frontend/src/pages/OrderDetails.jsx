import { ImSpinner3 } from "react-icons/im";
import React, { useEffect, useState } from 'react'

import {
    Stepper, Step, StepLabel, Button,
    StepConnector, stepConnectorClasses
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    LocalShipping as ShippingIcon,
    Inventory as InventoryIcon,
    Payment as PaymentIcon,
    Home as HomeIcon,
    CheckCircle as DeliveredIcon,
    ArrowBack,
    Cancel as CancelIcon,
    Undo as UndoIcon,
    AccountBalance as BankIcon,
    CheckCircle as SuccessIcon
} from '@mui/icons-material';

import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccess } from '../auth';
import API_BASE_URL from '../config/config';
import { FaTrash, FaUser } from 'react-icons/fa6'; // Added FaUndo
import { formatPriceINR } from '../utils/formatPriceINR';
import Swal from 'sweetalert2';


import { createRoot } from "react-dom/client";
import { FaUndo } from "react-icons/fa";
import Loading from "../components/Loading";

const STATUS_STEPS = [
    'Pending',
    'Paid',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
];

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient(136deg, #34d399 0%, #059669 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: 'linear-gradient(136deg, #34d399 0%, #059669 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ ownerState }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage: 'linear-gradient(136deg, #38bdf8 0%, #0284c7 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage: 'linear-gradient(136deg, #34d399 0%, #059669 100%)',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className, icon } = props;
    const icons = {
        1: <InventoryIcon />,
        2: <PaymentIcon />,
        3: <InventoryIcon />,
        4: <ShippingIcon />,
        5: <HomeIcon />,
        6: <DeliveredIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(icon)]}
        </ColorlibStepIconRoot>
    );
}



// ==========================================
// REFUND & CANCEL STEPPER DESIGN (MUI)
// ==========================================
const RefundStepIconRoot = styled('div')(({ ownerState, iscancelled }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    // Processing state (Yellow/Orange)
    ...(ownerState.active && {
        backgroundImage: 'linear-gradient(136deg, #f59e0b 0%, #d97706 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    // Completed state (Green)
    ...(ownerState.completed && {
        backgroundImage: 'linear-gradient(136deg, #34d399 0%, #059669 100%)',
    }),
    // Special Rule: First step should remain Red(Cancel) or Orange(Return)
    ...(String(ownerState.icon) === '1' && !ownerState.completed && {
        backgroundImage: iscancelled === 'true'
            ? 'linear-gradient(136deg, #ef4444 0%, #b91c1c 100%)' // Red for Cancel
            : 'linear-gradient(136deg, #f59e0b 0%, #d97706 100%)', // Orange for Return
    })
}));

function RefundStepIcon(props) {
    const { active, completed, className, icon, iscancelled } = props;
    const icons = {
        1: iscancelled === 'true' ? <CancelIcon /> : <UndoIcon />,
        2: <BankIcon />,
        3: <SuccessIcon />,
    };

    return (
        <RefundStepIconRoot ownerState={{ completed, active, icon: String(icon) }} iscancelled={iscancelled} className={className}>
            {icons[String(icon)]}
        </RefundStepIconRoot>
    );
}

const OrderDetails = () => {


    const [loading, setLoading] = useState(true)
    const [activeStep, setActiveStep] = useState(0)
    const [order, setOrder] = useState(null)

    const { order_id } = useParams()
    const navigate = useNavigate()

    const [isCancelled, setIsCancelled] = useState(false)
    const [isReturned, setIsReturned] = useState(false)
    const [isProcessingAction, setIsProcessingAction] = useState(false)

    const fetchOrderDetails = async (order_id) => {

        setLoading(true)

        try {
            const res = await axios.get(`${API_BASE_URL}/api/orders/order_details/${order_id}/`, {
                headers: {
                    Authorization: `Bearer ${getAccess()}`
                }
            });

            const orderData = res.data.order;
            setOrder(orderData)

            setIsCancelled(orderData.status === 'Cancelled');
            setIsReturned(orderData.status === 'Returned');

            if (orderData.status === 'Cancelled' || orderData.status === 'Returned') {
                setActiveStep(-1);
            } else {
                setActiveStep(STATUS_STEPS.indexOf(orderData.status));
            }

        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrderDetails(order_id)
    }, [order_id])

    // =========================================
    // HELPER: SWEETALERT LOADER
    // =========================================
    const showLoadingAlert = (titleText) => {
        Swal.fire({
            title: titleText,
            html: `<div id="react-loader"></div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                const container = document.getElementById("react-loader");
                const root = createRoot(container);
                root.render(
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                        <ImSpinner3 size={40} style={{ animation: "spin 1s linear infinite", color: "#3b82f6" }} />
                        <p className="text-gray-600 font-medium mt-2">Please wait...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                );
            }
        });
    }

    // =========================================
    // CANCEL ORDER LOGIC
    // =========================================
    const handleCancelOrder = async () => {

        const confirmCancel = await Swal.fire({
            title: 'Cancel Order?',
            text: "Are you sure you want to cancel this order?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: `Yes, Cancel it`,
            cancelButtonText: 'No, Keep it',
        })

        if (!confirmCancel.isConfirmed) return

        showLoadingAlert("Cancelling Order...");
        setIsProcessingAction(true);

        try {
            const token = getAccess();
            await axios.post(`${API_BASE_URL}/api/orders/${order_id}/cancel/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            Swal.fire({
                toast: true, position: 'top-end', icon: "success",
                title: "Order Cancelled Successfully", timer: 2000, showConfirmButton: false
            })
            fetchOrderDetails(order_id); // Refresh Data
        } catch (err) {
            console.log("Failed To Cancel Order : ", err)
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'Something went wrong!' })
        } finally {
            setIsProcessingAction(false);
        }
    }

    // =========================================
    // RETURN ORDER LOGIC
    // =========================================
    const handleReturnOrder = async () => {
        const confirmReturn = await Swal.fire({
            title: 'Return Order?',
            text: "Are you sure you want to return this item? Our delivery partner will pick it up within 2-3 days.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b', // Amber color for return
            confirmButtonText: 'Yes, Return it',
            cancelButtonText: 'Cancel',
        })

        if (!confirmReturn.isConfirmed) return

        showLoadingAlert("Initiating Return...");
        setIsProcessingAction(true);

        try {
            const token = getAccess();
            await axios.post(`${API_BASE_URL}/api/orders/${order_id}/return/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            Swal.fire({
                toast: true, position: 'top-end', icon: "success",
                title: "Return Initiated Successfully", timer: 2000, showConfirmButton: false
            })
            fetchOrderDetails(order_id); // Refresh Data
        } catch (err) {
            console.log("Failed To Return Order : ", err)
            Swal.fire({ icon: 'error', title: 'Return Failed', text: err.response?.data?.error || 'Something went wrong!' })
        } finally {
            setIsProcessingAction(false);
        }
    }

    // =========================================
    // DOWNLOAD INVOICE
    // =========================================
    const handleDownloadInvoice = () => {
        const token = getAccess()
        fetch(`${API_BASE_URL}/api/orders/invoice/${order_id}/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to generate PDF");
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Shopix_Invoice_${order_id}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(err => {
                console.error("Download error:", err);
                alert("Could not download the invoice. Please try again.");
            });
    };

    // if (!order) return <div></div> 

    // Math Logic
    const totalMRP = order?.items?.reduce((total, item) => {
        const sellPrice = Number(item.price) || 0;
        const origPrice = Number(item.original_price);

        // Agar original price 0, null, ya invalid hai, toh selling price ko hi MRP maan lo
        const effectiveMRP = origPrice > 0 ? origPrice : sellPrice;

        return total + (effectiveMRP * item.quantity);
    }, 0) || 0;

    const totalSellingPrice = order?.items?.reduce((total, item) => {
        const sellPrice = Number(item.price) || 0;
        return total + (sellPrice * item.quantity);
    }, 0) || 0;

    const mrpDiscount = totalMRP - totalSellingPrice;

    const invoiceDownloadStatus = ['Paid', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']

    return (

        loading
            ?
            <div className="min-h-screen pt-20">
                <Loading size={50} />
            </div>
            :
            <div className='space-y-6 container p-10 min-h-screen w-full mx-auto'>

                {/* Top Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/profile/orders')}
                        variant="outlined"
                        size="small"
                        className="rounded-md! normal-case!"
                    >
                        Back
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-900 m-0">Order Details</h2>
                    <span className="text-gray-500 font-mono text-sm bg-gray-100 px-2.5 py-1 rounded-md mt-1 border border-gray-200 shadow-sm">
                        #{order.uid}
                    </span>
                </div>

                <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">

                    {/* Info & Action Buttons */}
                    <div className='flex items-center justify-between px-2 md:px-10 border-b border-b-gray-200 pb-5 mb-10 flex-wrap gap-4'>

                        <div className='flex gap-10'>

                            <div>
                                <p className='text-gray-400 mb-1 text-sm'>Order Date</p>
                                <span className='font-semibold text-gray-700'>
                                    {/* {order.date || order.created_at?.split('T')[0]} */}
                                    {order?.created_at}
                                </span>
                            </div>

                            {order.status === 'Delivered' && order.delivered_at && (
                                <div>
                                    <p className='text-gray-400 mb-1 text-sm'>Delivered On</p>
                                    <span className='font-semibold text-green-700'>
                                        {/* Date ko Indian format (DD/MM/YYYY) mein dikhane ka aasaan tarika */}
                                        {order?.delivered_at}
                                    </span>
                                </div>
                            )}

                            <div>
                                <p className='text-gray-400 mb-1 text-sm'>Payment Status</p>
                                {order.is_paid || order.status === 'Paid' || order.status === 'Delivered'
                                    ? <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">Paid</span>
                                    : <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700">Pending</span>
                                }
                            </div>
                        </div>

                        <div className='flex gap-3'>
                            {/* 1. Download Invoice Button */}
                            {invoiceDownloadStatus.includes(order.status) && (
                                <Button variant='outlined' onClick={handleDownloadInvoice}>
                                    Download Invoice
                                </Button>
                            )}

                            {/* 2. Cancel Button (Only if NOT shipped/delivered/cancelled) */}
                            {['Pending', 'Paid', 'Processing'].includes(order.status) && (
                                <Button variant='outlined' onClick={handleCancelOrder} color='error' disabled={isProcessingAction}>
                                    Cancel Order
                                </Button>
                            )}

                            {/* 3. Return Button (Only if Delivered) */}
                            {order.status === 'Delivered' && (
                                <Button variant='outlined' onClick={handleReturnOrder} color='warning' disabled={isProcessingAction} startIcon={<FaUndo />}>
                                    Return Order
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tracker UI Section */}
                    <div className="w-full mb-12 mt-2 px-2 md:px-10">

                        {(isCancelled || isReturned) ? (

                            <div className="py-6 border-b border-gray-100 mb-8">

                                {/* Status Heading */}
                                <div className="text-center mb-10">
                                    <h2 className={`text-2xl font-bold ${isCancelled ? 'text-red-600'
                                        : (order.refund_status === 'Completed' ? 'text-green-600' : 'text-orange-600')
                                        }`}>
                                        {isCancelled
                                            ? 'Order Cancelled'
                                            : (order.refund_status === 'Completed' ? 'Return Successful' : 'Return Initiated')
                                        }
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1 font-medium">
                                        {isCancelled
                                            ? "You have successfully cancelled this order."
                                            : (order.refund_status === 'Completed'
                                                ? "Your item has been returned and the refund process is complete."
                                                : "You have requested a return. Our partner will pick it up soon.")
                                        }
                                    </p>
                                </div>

                                {/* MUI Stepper for Refund Tracker (Only if paid) */}
                                {order.is_paid && (
                                    <div className="max-w-3xl mx-auto">
                                        <Stepper
                                            // Agar refund completed hai toh step 3, warna step 1 (processing)
                                            activeStep={order.refund_status === 'Completed' ? 3 : 1}
                                            alternativeLabel
                                            connector={<ColorlibConnector />}
                                        >
                                            <Step>
                                                <StepLabel StepIconComponent={(props) => <RefundStepIcon {...props} iscancelled={isCancelled ? 'true' : 'false'} />}>
                                                    <span className="font-semibold text-gray-800">
                                                        {isCancelled ? 'Cancelled' : 'Returned'}
                                                    </span>
                                                </StepLabel>
                                            </Step>

                                            <Step>
                                                <StepLabel StepIconComponent={(props) => <RefundStepIcon {...props} iscancelled={isCancelled ? 'true' : 'false'} />}>
                                                    <span className="font-semibold text-gray-800">Bank Processing</span>
                                                </StepLabel>
                                            </Step>

                                            <Step>
                                                <StepLabel StepIconComponent={(props) => <RefundStepIcon {...props} iscancelled={isCancelled ? 'true' : 'false'} />}>
                                                    <span className="font-semibold text-gray-800">Refund Successful</span>
                                                </StepLabel>
                                            </Step>
                                        </Stepper>

                                        {/* Refund Information Text */}
                                        <div className={`mt-10 p-4 mx-auto max-w-lg rounded-xl border text-sm text-center ${order.refund_status === 'Completed' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-orange-50 border-orange-200 text-orange-800'}`}>
                                            <p>
                                                A refund of <span className="font-bold">{formatPriceINR(order.total_amount)}</span> has been
                                                {order.refund_status === 'Completed' ? ' successfully credited ' : ' successfully initiated '}
                                                to your original payment method.
                                            </p>

                                            {order.refund_status !== 'Completed' && (
                                                <p className="mt-2 text-xs opacity-80 font-medium">
                                                    Please allow 3 to 5 business days for the amount to reflect in your bank account.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>

                        ) : (
                            /* Normal Status Stepper */
                            <Stepper activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />}>
                                {STATUS_STEPS.map((label) => (
                                    <Step key={label}>
                                        <StepLabel StepIconComponent={ColorlibStepIcon}>
                                            <span className="font-semibold text-gray-800">{label}</span>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )}

                    </div>


                    {/* Items & Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 border-t border-gray-200 pt-10 gap-8">
                        <div className="md:col-span-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-3">Ordered Items ({order?.items?.length})</h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-black border-b text-white border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Product</th>
                                            <th className="px-4 py-3 font-semibold text-center">Qty</th>
                                            <th className="px-4 py-3 font-semibold text-right">Price</th>
                                            <th className="px-4 py-3 font-semibold text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {order?.items?.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-15 h-15 bg-gray-100 cursor-pointer rounded-md border-2 overflow-hidden relative transition-all duration-200 border-gray-200 hover:border-gray-400">
                                                            <img
                                                                src={item.product_image?.replace("/upload/", "/upload/w_200/")}
                                                                alt={item.product_name}
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full! max-h-full!"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Link to={`/product/${item.product_id}`} className="font-medium text-gray-900 block">{item.product_name}</Link>
                                                            {item?.attribute_values?.slice(0, 2).map((attr, i) => (
                                                                <span className="text-mobile-2 text-gray-400 block mt-0.5" key={i}>
                                                                    {attr?.attribute_name}: {attr?.value}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">{formatPriceINR(item.price)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatPriceINR(item.total_price || (item.price * item.quantity))}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Math Summary */}
                            <div className="mt-10 w-full">
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h3>
                                <div className="bg-white border border-gray-200 shadow rounded-lg p-4 space-y-2.5 text-sm">
                                    <div className="flex justify-between font-medium text-gray-600">
                                        <span>Subtotal (MRP)</span>
                                        <span className="font-medium">{formatPriceINR(totalMRP)}</span>
                                    </div>
                                    {mrpDiscount > 0 && (
                                        <div className="flex justify-between font-medium text-gray-600">
                                            <span>Product Discount</span>
                                            <span className="text-green-600 font-medium">-{formatPriceINR(mrpDiscount)}</span>
                                        </div>
                                    )}
                                    {order.coupon_used && (
                                        <div className="flex font-medium justify-between text-gray-600">
                                            <span>Coupon ({order.coupon_used})</span>
                                            <span className="text-green-600 font-medium">-{formatPriceINR(order.discount_amount)}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-gray-200 my-2"></div>
                                    <div className="flex justify-between text-gray-900 font-bold text-base">
                                        <span>Total Paid</span>
                                        <span>{formatPriceINR(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Details */}
                        <div className="md:col-span-4 space-y-4">
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Customer Details</h3>
                                <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {order.full_name}</p>
                                <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Email:</span> {order.email}</p>
                            </div>

                            <div className="bg-white text-[#555555] text-[13px] border border-gray-200 shadow shadow-gray-100 rounded-lg py-5 px-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-3">Shipping Address</h3>
                                <p className="flex items-center gap-2 font-medium text-gray-800 mb-1"> <FaUser className='text-xs' /> {order?.full_name}</p>
                                <p>{order?.address_line}</p>
                                <p>{order?.landmark}</p>
                                <p>{order?.city}, {order?.state} - {order?.postal_code}</p>
                                <p className="mt-2 font-medium">Ph: +91 {order?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    )
}

export default OrderDetails