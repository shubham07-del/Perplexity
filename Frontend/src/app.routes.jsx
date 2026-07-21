import {createBrowserRouter} from "react-router"
import Register from "./Features/auth/pages/Register"
import Login from "./Features/auth/pages/Login"
import Dashboard from "./Features/chat/pages/Dashboard"
import VerifyEmail from "./Features/auth/components/VerifyEmail"

export const router = createBrowserRouter([
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/verify-email",
        element:<VerifyEmail/>
    },
    {
        path:"/",
        element:<Dashboard/>
    }
])