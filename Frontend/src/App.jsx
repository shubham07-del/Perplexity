import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from './Features/auth/hooks/useAuth'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  const auth = useAuth()
  useEffect(()=>{
    auth.handleGetMe()
  },[])
  return (
    <div>
      <RouterProvider router={router}/>
       <ToastContainer 
       position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  pauseOnHover
  draggable
  theme="colored"/>
    </div>
  )
}

export default App