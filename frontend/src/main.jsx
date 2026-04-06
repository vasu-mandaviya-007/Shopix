import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import { ToastContainer } from "react-toastify"
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId="792264098314-fp421iu05keo8jbm85tshd2oluu7mers.apps.googleusercontent.com">

    <AuthProvider>

      <ShopProvider>

        <QueryClientProvider client={queryClient} >

          <App />

          <ToastContainer pauseOnFocusLoss={false} theme='dark' autoClose={3000} position='bottom-center' />

        </QueryClientProvider>

      </ShopProvider>

    </AuthProvider>

  </GoogleOAuthProvider>

)
