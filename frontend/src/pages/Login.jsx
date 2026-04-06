import { ImSpinner3 } from "react-icons/im";
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material'
import React, { useContext, useState } from 'react'
import { FaGoogle, FaPaperPlane, FaXmark } from 'react-icons/fa6'
import { AuthContext } from '../context/AuthContext'
import OtpInput from "react-otp-input"
import axios from 'axios'
import { toast } from 'react-toastify'
import { setTokens } from '../auth'
import { GoogleLogin } from '@react-oauth/google'
import API_BASE_URL from '../config/config.js';
import { CartContext } from '../context/CartContext.jsx'
import { useLocation, useNavigate } from 'react-router-dom'
import login_banner from "../assets/login-banner.png"

const Login = () => {

    const { authLoading, setAuthLoading, fetchUser } = useContext(AuthContext)

    const { mergeCart } = useContext(CartContext);

    const [email, setEmail] = useState("")
    const [otp, setotp] = useState("");
    const [step, setStep] = useState(1)

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const location = useLocation();

    const redirectPath = location.state?.from || "/"

    const sendOtp = async (e) => {

        e.preventDefault()

        setLoading(true)
        try {

            const response = await axios.post(`${API_BASE_URL}/api/auth/send-otp/`, { email });

            toast.success(response.data?.message || "OTP sent t email")

            setStep(2)

        } catch (err) {

            toast.error(err.response.data.error || "Failed to send email");

        } finally {

            setLoading(false)

        }
    }

    const verifyOtp = async () => {
        setLoading(true)

        try {

            const response = await axios.post(`${API_BASE_URL}/api/auth/verify-otp/`, { email, otp })

            setTokens(response.data.access, response.data.refresh);

            await mergeCart(response.data.access);
            await fetchUser()

            toast.success(response.data.message || "Login Successfully")

            navigate(redirectPath, { replace: true });

        } catch (err) {

            toast.error(err.response.data.error || "Verification Failed");

        } finally {

            setLoading(false)

        }
    }

    const googleSuccess = async (credentialResponse) => {
        setAuthLoading(true)
        const res = await axios.post(`${API_BASE_URL}/api/auth/google/`, {
            token: credentialResponse.credential
        })
        console.log(res)
        localStorage.setItem("access", res.data.access)
        localStorage.setItem("refresh", res.data.refresh)
        toast.success("Google login success")
        await fetchUser()
        await mergeCart(res.data.access);
        setAuthLoading(false)
    }


    return (

        <div className={` w-full flex items-center justify-center h-full`}>

            <div className={`lg:max-w-4xl max-w-140 relative my-4 border border-gray-200 flex mx-auto duration-300 w-full min-h-88 h-140 shadow-xl bg-white`}>

                <div style={{ background: `url(${login_banner})` }} className='flex-4 px-5 max-lg:hidden w-full h-auto'>

                </div>


                {
                    step === 1 && (

                        <div className='flex-5 flex justify-between h-auto flex-col px-15 py-10'>

                            <div className='pt-10'>

                                <form action="" onSubmit={sendOtp}>

                                    {/* <TextField
                                    type='email'
                                    id="standard-basic"
                                    value={email}
                                    onChange={(e)=> setEmail(e.target.value)}
                                    label="Enter Mobile Number"
                                    variant="standard"
                                    
                                    className='border-b border-b-red-500'
                                /> */}
                                    <div className="relative w-full z-0">
                                        <input
                                            type="email"
                                            id="email"
                                            name='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block py-2.5 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-b-gray-400 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                            placeholder=" "
                                        />
                                        <label htmlFor="email" className="absolute text-gray-500 text-sm text-body duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-left peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Enter Email</label>
                                    </div>

                                    <p className='mt-4 text-xs text-gray-400'>By continuing, you agree to our <a href="" className='text-blue-500 hover:text-blue-600'>Terms of Use</a> and <a href="" className='text-blue-500 hover:text-blue-600' >Privacy Policy</a>.</p>

                                    {/* <Button onClick={sendOtp} loading={loading} variant='contained' className='w-full bg-black/80! hover:bg-black! rounded-full! py-3! mt-8!' >Request OTP</Button> */}
                                    <Button
                                        onClick={sendOtp}
                                        fullWidth
                                        loading={loading}
                                        loadingPosition='end'
                                        endIcon={<FaPaperPlane />}
                                        variant='contained'
                                        className=' rounded-full! py-3! mt-8! '
                                    >
                                        Request OTP
                                    </Button>

                                </form>
                                <p className='text-gray-500 font-semibold my-10 text-center '>OR</p>


                                <GoogleLogin onSuccess={googleSuccess} onError={() => alert("Failed")} />


                            </div>

                            <p className='text-sm text-center font-semibold mt-6'>Already have an account? <a onClick={() => setAuthState({ isOpen: true, page: "login" })} className='underline text-black hover:text-blue-500 cursor-pointer'>Sign In </a> </p>

                        </div>
                    )
                }

                {
                    step === 2 && (

                        <div className='flex-5 flex justify-between h-auto flex-col px-15 py-10'>

                            <div className='pt-10 w-full'>

                                <div className='flex items-center text-center flex-col mb-10'>
                                    <h3>Please Enter the OTP sent to <span className='font-semibold'>{email}</span> </h3>
                                </div>

                                <div className='flex justify-between w-[90%] mb-8'>
                                    <OtpInput
                                        value={otp}
                                        inputType='tel'
                                        onChange={setotp}
                                        disabled={false}
                                        containerStyle="flex justify-between w-full"
                                        autoFocus
                                        numInputs={6}
                                        renderInput={(props) => <input {...props} className='out-input' />}
                                    ></OtpInput>
                                </div>

                                <Button
                                    onClick={verifyOtp}
                                    loading={loading}
                                    loadingIndicator={<ImSpinner3 size={20} className="animate-spin" />}
                                    loadingPosition='end'
                                    fullWidth
                                    sx={{
                                        backgroundColor: '#222',
                                        borderRadius: "100px",
                                        paddingY: "12px ",
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#000',
                                        },
                                    }}
                                    variant='contained'
                                // className='w-full bg-black/80! hover:bg-black! rounded-full! py-3! my-8!'
                                >
                                    {loading ? "Verifying OTP..." : "Verify OTP"}
                                </Button>

                                <p className='text-sm text-center font-medium mt-6 text-gray-400'>Not received youe code? <a onClick={() => setAuthState({ isOpen: true, page: "login" })} className='hover:text-blue-600 text-blue-500 cursor-pointer'>Resend Code </a> </p>

                            </div>

                        </div>

                    )
                }

            </div>

        </div>

        // </div>

    )

}

export default Login
