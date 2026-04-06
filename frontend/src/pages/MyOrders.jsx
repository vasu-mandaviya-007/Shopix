import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import API_BASE_URL from "../config/config";
import { getAccess } from "../auth";
import Loading from "../components/Loading";
import order_icon from "../assets/order-icon.png"
import { useNavigate } from "react-router-dom";

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

    useEffect(() => {

        fetchOrder()

    }, [])

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">

            <h1 className="text-2xl font-bold pb-4 mb-8 border-b border-b-gray-300 text-gray-900">My Orders</h1>

            {
                loading
                    ?
                    <Loading size={30} />
                    :
                    orders && orders.length > 0
                        ?
                        orders.map((order, index) => (
                            <OrderCard key={index} order={order} />
                        ))
                        :
                        <div className="py-10 flex items-center justify-center flex-col">

                            <img src={order_icon} className="w-1/3" alt="" />
                            
                            <h1 className="text-2xl font-semibold mt-6">You have no orders to show</h1>

                            <h1 className="text-base text-gray-500 mt-4">Looks Like You haven't placed any order yet!</h1>

                            <Button
                                variant="contained"
                                className="py-3! px-8! mt-5! rounded-full!"
                                onClick={()=>navigate("/")}
                            >
                                Continue Shopping
                            </Button>

                        </div>
                     
 
            }
        </div>
    );
};

export default MyOrders;