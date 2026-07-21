import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from './Features/auth/hooks/useAuth'
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {

  const auth = useAuth()
  useEffect(()=>{
    auth.handleGetMe()
  },[])
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#141416] text-white">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        transition={Slide}
        toastClassName="!bg-[#1c1c1f] !border !border-white/[0.08] !rounded-2xl !shadow-[0_8px_40px_rgba(0,0,0,0.5)] mt-3 mr-0 sm:mr-2 !max-w-[calc(100vw-1rem)]"
        bodyClassName="!font-sans !text-[13.5px] !font-medium !text-[#e4e4e7] flex items-center p-1"
      />
    </div>
  )
}

export default App