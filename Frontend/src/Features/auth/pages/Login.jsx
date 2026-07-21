import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const user = useSelector(state => state.auth.user)
  const loading = useSelector(state => state.auth.loading)

  const { handleLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await handleLogin({ email, password })
    if(success) {
      navigate("/")
    }
  }

  if (!loading && user) {
    return <Navigate to={"/"} replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141416] relative overflow-hidden font-sans">

      {/* Ambient glows */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/[0.06] rounded-full blur-[150px]" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[400px] h-[400px] bg-indigo-600/[0.04] rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent mb-8 rounded-full" />

        <div className="bg-[#1c1c1f] border border-white/[0.07] rounded-2xl p-8 sm:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="mb-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <img src="/signature.ai" alt="Signature logo" />
                
              </div>
              <span className="text-white/40 text-sm font-medium tracking-wider uppercase">Signature</span>
            </div>
            <h1 className="text-[28px] font-bold text-white tracking-tight">Sign in</h1>
            <p className="text-[#71717a] mt-1.5 text-[15px]">Enter your credentials to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-[#a1a1aa] mb-2">Email</label>
              <input
                id="email" name="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#141416] border border-white/[0.08] rounded-xl text-white placeholder-[#3f3f46] text-[14px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-[#a1a1aa] mb-2">Password</label>
              <div className="relative">
                <input
                  id="password" name="password" required
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#141416] border border-white/[0.08] rounded-xl text-white placeholder-[#3f3f46] text-[14px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a52] hover:text-indigo-400 transition-colors cursor-pointer">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-[14px] tracking-wide cursor-pointer shadow-lg shadow-indigo-500/20 mt-2">
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-8 text-[13px] text-[#4a4a52]">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Create one</Link>
          </p>
        </div>

        {/* Bottom accent */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mt-8" />
      </div>
    </div>
  )
}

export default Login