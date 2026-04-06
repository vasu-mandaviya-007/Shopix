export const setTokens = (access, refresh) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
};

export const getAccess = () => localStorage.getItem("access");
export const getRefresh = () => localStorage.getItem("refresh");

export const logout = () => { 
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};
