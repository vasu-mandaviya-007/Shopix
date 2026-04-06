import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}) => { 
    
    const {user,authLoading} = useContext(AuthContext);

    if( authLoading ) return <div>Loading...</div> 

    return user ? children : <Navigate to="/login" replace />

}

export default PrivateRoute
