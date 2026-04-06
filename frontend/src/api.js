import { toast } from "react-toastify";
import { getAccess, getRefresh, setTokens, logout } from "./auth";
import API_BASE_URL from "./config/config";


const BASE_URL = `${API_BASE_URL}/api`;

export async function apiFetch(url, options = {}) {
    try {

        let access = getAccess();

        let response = await fetch(BASE_URL + url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: access ? `Bearer ${access}` : "",
            },
        });

        if (response.status === 401) {
            const refresh = getRefresh();
            if (!refresh) {
                logout();
                return;
            }

            const refreshRes = await fetch(BASE_URL + "/auth/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh }),
            });

            if (refreshRes.ok) {
                const data = await refreshRes.json();
                console.log(data)
                setTokens(data.access, refresh);
                return apiFetch(url, options); // retry
            } else {
                console.log("Logout")
                logout();
            }
        }

        return response;
        
    }catch(err){
        toast.error("Please Check you Internet Connection")
    }
}
