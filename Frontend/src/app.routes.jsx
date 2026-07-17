import {createBrowserRouter} from "react-router"
import Register from "./Features/auth/pages/Register"
import Login from "./Features/auth/pages/Login"
import Dashboard from "./Features/chat/pages/Dashboard"
import Protected from "./Features/auth/components/Protected"

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
        path:"/",
        element:<Protected><Dashboard/></Protected>
    }
])