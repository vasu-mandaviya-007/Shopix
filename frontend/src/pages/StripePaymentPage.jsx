import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getAccess } from '../auth';
import { CartContext } from '../context/CartContext';
// import { CartContext } from './context/CartContext';

// Initialize Stripe (Replace with your Test Publishable Key)
const stripePromise = loadStripe('pk_test_51T3zrLEE4mQq25JrCrngVvrbX2Wm4VDm1QGyaMcfII7j2BTPEoAoI8ATDMVZfNqBtL5tpAwMlbDBG5N1F8OHuZtd00a30fl46o');

const CheckoutForm = ({ addressId }) => {
    
    const stripe = useStripe();
    const elements = useElements();
    const { setCart } = useContext(CartContext);
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePayment = async (e) => {

        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) return;

        // const token = localStorage.getItem('token');
        const token = getAccess();
        const headers = { Authorization: `Bearer ${token}` };

        try {
            // 1. Ask Django for Stripe Client Secret
            const intentRes = await axios.post('http://127.0.0.1:8000/api/orders/create-payment-intent/', {}, { headers });
            const clientSecret = intentRes.data.clientSecret;

            // 2. Confirm Payment with Stripe
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) }
            });

            if (result.error) throw new Error(result.error.message);

            // 3. If Success, finalize order in Django
            if (result.paymentIntent.status === 'succeeded') {
                const orderRes = await axios.post('http://127.0.0.1:8000/api/orders/finalize-order/', {
                    address_id: addressId,
                    transaction_id: result.paymentIntent.id
                }, { headers });

                alert("Payment Successful! Order Placed.");
                setCart(null)
                // fetchCart(); // Empty the cart state
                navigate('/'); // Redirect to home or order success page
            }
        } catch (err) {
            setError(err.message || "Payment Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePayment} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <CardElement />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <button type="submit" disabled={!stripe || loading} style={{ width: '100%', padding: '15px', background: 'green', color: 'white', border: 'none', fontSize: '1.2rem' }}>
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

const StripePaymentPage = () => {
    // Retrieve the addressId passed from AddressSelectionPage
    const location = useLocation();
    const addressId = location.state?.addressId;

    if (!addressId) {
        return <h2>Error: No address selected. Please go back.</h2>;
    }

    return (
        <div className='w-full' style={{ maxWidth: '500px', margin: '3rem auto' }}>
            <h2>Step 2: Payment Details</h2>
            <Elements stripe={stripePromise}>
                <CheckoutForm addressId={addressId} />
            </Elements>
        </div>
    );
};

export default StripePaymentPage;