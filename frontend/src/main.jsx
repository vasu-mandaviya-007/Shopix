import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createTheme, ThemeProvider } from '@mui/material/styles';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#000000", // Primary color ab se Pitch Black hoga
//       light: "#333333", // Hover state ko thoda smooth rakhne ke liye dark gray
//       dark: "#000000", // Active/Click state
//       contrastText: "#ffffff", // Button ke andar ka text white rahega
//     },
//     // Agar future me secondary (jaise warning/danger) badalna ho toh yaha kar sakte ho
//     // secondary: {
//     //   main: '#ff0000',
//     // }
//   },
//   // Optionally: Agar buttons ka border-radius thoda modern rakhna hai
//   // shape: {
//   //   borderRadius: 8,
//   // },
//   components: {
//     // Button ka default styling bhi thoda tweak kar sakte ho (Optional)
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none", // Buttons me default ALL CAPS text hatane ke liye
//           fontWeight: 600, // Text thoda bold karne ke liye
//         },
//       },
//     },
//   },
// });

const theme = createTheme({
  // ... tumhara baki palette (agar rakha hai toh) ...

  components: {
    MuiButton: {
      // 🌟 Yahan se Custom Variants define hote hain
      variants: [
        {
          // Jab koi <Button variant="dark"> likhega, tab ye style apply hoga
          props: { variant: 'dark' },
          style: ({ theme }) => ({
            backgroundColor: '#0f172a', // Slate 900 (Ya pure #000000 use kar sakte ho)
            color: '#ffffff',
            fontWeight: 'bold',
            // textTransform: 'none', // All caps hatane ke liye
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // Thoda premium shadow

            // Hover state ko maintain karne ke liye
            '&:hover': {
              backgroundColor: '#1e293b', // Slate 800 (Hover par thoda light)
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },

            // Disabled state ka logic bhi daal sakte ho
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 0, 0, 0.12)', // Default MUI disabled background
              color: 'rgba(0, 0, 0, 0.26)',           // Default MUI disabled text
              boxShadow: 'none',                      // Disabled me shadow nahi hoti
            },

            [theme.breakpoints.down('sm')]: {
              padding: '4px 6px',    // Padding kam kar di
              fontSize: '10px',      // Font size chota kar diya taaki text wrap na ho
              // borderRadius: '6px',
              minWidth: 'unset',     // Default width hata di
            },

          }),

        },

        // Tum chaho toh combination bhi bana sakte ho (e.g. variant="dark" size="large")
        {
          props: { variant: 'dark', size: 'large' },
          style: {
            padding: '12px 24px',
            fontSize: '16px',
          },
        },

        // 🌟 SMALL Size Customization (Naya Code)
        {
          props: { variant: 'dark', size: 'small' },
          style: {
            padding: '6px 14px',      // Padding kam kar di
            fontSize: '12px',         // Font size chota kar diya
            fontWeight: 600,
            // borderRadius: '6px',      // Radius bhi thoda proportionate kar diya
            height: '32px',           // Fixed compact height
          },
        },
      ],
    },
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(

  <GoogleOAuthProvider clientId="792264098314-fp421iu05keo8jbm85tshd2oluu7mers.apps.googleusercontent.com">

    <AuthProvider>

      <ShopProvider>

        <QueryClientProvider client={queryClient}>

          <ThemeProvider theme={theme}>

            <App />

            <ToastContainer
              pauseOnFocusLoss={false}
              theme="dark"
              autoClose={3000}
              position="bottom-center"
            />

          </ThemeProvider>

        </QueryClientProvider>

      </ShopProvider>

    </AuthProvider>

  </GoogleOAuthProvider>,

);
