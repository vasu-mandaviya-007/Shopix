import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import {Navigate} from "react-router-dom";

const PublicRoute = ({children}) => {

    const {user,authLoading} = useContext(AuthContext)

    if( authLoading ) return <div>Loading...</div> 

    return user ? <Navigate to="/" replace /> : children
    
}

export default PublicRoute
