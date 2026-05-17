// import { useEffect, useState } from "react";
// import { Button } from "@mui/material";
// import OrderCard from "../components/OrderCard";
// import axios from "axios";
// import API_BASE_URL from "../config/config";
// import { getAccess } from "../auth";
// import Loading from "../components/Loading";
// import order_icon from "../assets/order-icon.png"
// import { useNavigate } from "react-router-dom";

// const MyOrders = () => {

//     const navigate = useNavigate();

//     const [orders, setOrders] = useState([])

//     const [loading, setLoading] = useState(true)

//     const fetchOrder = async () => {

//         setLoading(true)

//         try {


//             const response = await axios.post(`${API_BASE_URL}/api/orders/my_orders/`, {}, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getAccess()}`
//                 }
//             });

//             setOrders(response.data)

//         } catch (err) {
//             console.log(err)
//         } finally {
//             setLoading(false)
//         }

//     }

//     useEffect(() => {

//         fetchOrder()

//     }, [])

//     return (
//         <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">

//             <h1 className="text-2xl font-bold pb-4 mb-8 border-b border-b-gray-300 text-gray-900">My Orders</h1>

//             {
//                 loading
//                     ?
//                     <Loading size={30} />
//                     :
//                     orders && orders.length > 0
//                         ?
//                         orders.map((order, index) => (
//                             <OrderCard key={index} order={order} />
//                         ))
//                         :
//                         <div className="py-10 flex items-center justify-center flex-col">

//                             <img src={order_icon} className="w-1/3" alt="" />

//                             <h1 className="text-2xl font-semibold mt-6">You have no orders to show</h1>

//                             <h1 className="text-base text-gray-500 mt-4">Looks Like You haven't placed any order yet!</h1>

//                             <Button
//                                 variant="contained"
//                                 className="py-3! px-8! mt-5! rounded-full!"
//                                 onClick={()=>navigate("/")}
//                             >
//                                 Continue Shopping
//                             </Button>

//                         </div>


//             }
//         </div>
//     );
// };

// export default MyOrders;






// import { useEffect, useState } from "react";
// import { Button } from "@mui/material";
// import OrderCard from "../components/OrderCard";
// import axios from "axios";
// import API_BASE_URL from "../config/config";
// import { getAccess } from "../auth";
// import Loading from "../components/Loading";
// import order_icon from "../assets/order-icon.png"
// import { useNavigate } from "react-router-dom";

// const MyOrders = () => {

//     const navigate = useNavigate();

//     const [orders, setOrders] = useState([])
//     const [loading, setLoading] = useState(true)

//     const fetchOrder = async () => {

//         setLoading(true)

//         try {
//             const response = await axios.post(`${API_BASE_URL}/api/orders/my_orders/`, {}, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${getAccess()}`
//                 }
//             });

//             setOrders(response.data)

//         } catch (err) {
//             console.log(err)
//         } finally {
//             setLoading(false)
//         }

//     }

//     useEffect(() => {
//         fetchOrder()
//     }, [])

//     return (
//         <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">

//             <h1 className="text-xl md:text-2xl font-bold pb-3 md:pb-4 mb-6 md:mb-8 border-b border-b-gray-300 text-gray-900">My Orders</h1>

//             {
//                 loading
//                     ?
//                     <Loading size={30} />
//                     : (

//                         orders && orders.length > 0
//                             ?
//                             orders.map((order, index) => (
//                                 <OrderCard key={index} order={order} />
//                             ))
//                             :
//                             <div className="py-10 flex items-center justify-center flex-col text-center px-4">

//                                 {/* Image slightly larger on mobile, exact same on desktop */}
//                                 <img src={order_icon} className="w-1/2 md:w-1/3 lg:w-1/4 max-w-50" alt="" />

//                                 <h1 className="text-xl md:text-2xl font-semibold mt-4 md:mt-6">You have no orders to show</h1>

//                                 <h1 className="text-sm md:text-base text-gray-500 mt-2 md:mt-4">Looks Like You haven't placed any order yet!</h1>

//                                 <Button
//                                     variant="contained"
//                                     className="py-2.5 px-6 md:py-3! md:px-8! mt-5! rounded-full!"
//                                     onClick={() => navigate("/")}
//                                 >
//                                     Continue Shopping
//                                 </Button>

//                             </div>
//                     )

//             }
//         </div>
//     );
// };

// export default MyOrders;






import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import API_BASE_URL from "../config/config";
import { getAccess } from "../auth";
import Loading from "../components/Loading";
import order_icon from "../assets/order-icon.png"
import { useNavigate } from "react-router-dom";
import { BsFillBoxSeamFill } from "react-icons/bs";

const MyOrders = () => {

    const navigate = useNavigate();
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrder = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/api/orders/my_orders/`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getAccess()}`
                }
            });
            setOrders(response.data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOrder() }, [])

    return (
        <div className="px-4 sm:px-6 py-4 sm:py-6">

            {/* Header */}
            <div className='flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-gray-100'>
                <div>
                    <h1 className="text-sm sm:text-base font-bold text-gray-900">My Orders</h1>
                    {!loading && orders.length > 0 && (
                        <p className='text-xs text-gray-400 mt-0.5'>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
                    )}
                </div>
                {!loading && orders.length > 0 && (
                    <span className='bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg'>
                        {orders.length} Total
                    </span>
                )}
            </div>

            {loading ? (
                <Loading size={30} />
            ) : orders.length > 0 ? (
                <div className='space-y-3 sm:space-y-4'>
                    {orders.map((order, index) => (
                        <OrderCard key={index} order={order} />
                    ))}
                </div>
            ) : (
                <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center px-4">

                    <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 sm:mb-5'>
                        <BsFillBoxSeamFill className='text-2xl sm:text-3xl text-gray-200' />
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1.5">No orders yet</h2>
                    <p className="text-xs sm:text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
                        Looks like you haven't placed any orders yet. Start shopping to see them here!
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className='bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors'
                    >
                        Start Shopping
                    </button>

                </div>
            )}
        </div>
    );
};

export default MyOrders;






