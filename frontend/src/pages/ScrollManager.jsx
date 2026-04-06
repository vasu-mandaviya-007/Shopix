import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollManager = () => {
    const location = useLocation();
    const navigationType = useNavigationType(); // 🔥 key part

    useEffect(() => {
        if (navigationType === "POP") {
            // 🔁 Back/Forward → restore scroll
            const savedPosition = sessionStorage.getItem(location.pathname);

            if (savedPosition) {
                window.scrollTo(0, parseInt(savedPosition));
            }
        } else {
            // 🆕 New navigation → go to top
            window.scrollTo(0, 0);
        }

        return () => {
            sessionStorage.setItem(location.pathname, window.scrollY);
        };
    }, [location.pathname, navigationType]);

    return null;
};

export default ScrollManager;