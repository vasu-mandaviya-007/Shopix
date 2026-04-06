import axios from "axios";
import { getAccess, getRefresh, logout, setTokens } from "../auth";
import { createContext, useEffect, useState } from "react";
import { apiFetch } from "../api";
import API_BASE_URL from '../config/config.js';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null) 
    const [authLoading, setAuthLoading] = useState(true) 
    

    const getData = async (url) => {
        const BASE_URL = `${API_BASE_URL}/api`;
        const access = getAccess();

        let response = await fetch(BASE_URL + url, {
            headers: {
                "Content-Type": "application/json",
                ...(access && { Authorization: `Bearer ${access}` }),
            },
        });

        // Access token expired
        if (response.status === 401) {
            const refresh = getRefresh();
            if (!refresh) return null;

            const refreshRes = await fetch(BASE_URL + "/auth/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            if (!refreshRes.ok) return null;

            const data = await refreshRes.json();
            setTokens(data.access, refresh);

            // retry once
            response = await fetch(BASE_URL + url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.access}`,
                },
            });
        }

        return response.ok ? response : null;
    };

    const fetchUser = async () => {
        setAuthLoading(true)
        const access = getAccess();
        const refresh = getRefresh();

        if (!access && !refresh) {
            setUser(null);
            setAuthLoading(false);
            return;
        }

        try {

            const res = await getData("/auth/profile/");
            
            if (!res) throw new Error("Unauthenticated");

            const data = await res.json();
            setUser(data);
            console.log(data)

        } catch (err) {
            console.log("Auth failed:", err.message);
            console.log(err)
            // logout();
            setUser(null);

        } finally {
            setAuthLoading(false);
        }
    };



    // const fetchUser = async () => {

    //     // ✅ 1. No tokens → no fetch
    //     const access = getAccess();
    //     const refresh = getRefresh();

    //     if (!access && !refresh) {
    //         setUser(null);
    //         setAuthLoading(false);
    //         return;
    //     }

    //     try {

    //         const res = await getData("/auth/profile/");
    //         // const res = await apiFetch("/auth/profile/");
    //         if (!res || !res.ok) throw new Error();

    //         const data = await res.json();
    //         setUser(data);

    //     } catch {

    //         setUser(null);
    //         logout();
    //         alert("Fail profile logout")

    //     } finally {

    //         setAuthLoading(false);

    //     }

    // }

    useEffect(() => {
        fetchUser()
    }, []);

    const value = {
        user, setUser,
        fetchUser,
        authLoading, setAuthLoading
    };

    return (
        <AuthContext.Provider value={value} >
            {/* {authLoading ? <div>Loading</div> : children} */}
            {children}
        </AuthContext.Provider>
    )

}
