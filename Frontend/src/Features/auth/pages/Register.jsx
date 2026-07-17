import React, { useState } from 'react'
import { Link } from 'react-router'
import AnimatedBackground from '../components/AnimatedBackground'

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  }

  const getStrength = () => {
    const p = formData.password
    if (!p) return null
    if (p.length < 6) return { pct: 33, color: 'bg-red-500', label: 'Weak' }
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { pct: 66, color: 'bg-amber-500', label: 'Fair' }
    return { pct: 100, color: 'bg-emerald-500', label: 'Strong' }
  }

  const strength = getStrength()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c] relative overflow-hidden font-[system-ui]">
      <AnimatedBackground />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/[0.07] rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-600/[0.05] rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-[420px] mx-4">
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent mb-8 rounded-full" />

        <div className="bg-[#141414] border border-[#1f1f1f] rounded-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="mb-9">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="text-white/40 text-sm font-medium tracking-wider uppercase">Perplexity</span>
            </div>
            <h1 className="text-[28px] font-bold text-white tracking-tight">Create account</h1>
            <p className="text-[#555] mt-1.5 text-[15px]">Start your journey with Perplexity</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-[13px] font-medium text-[#888] mb-2">Username</label>
              <input
                id="username" name="username" type="text" required
                value={formData.username} onChange={handleChange}
                placeholder="johndoe"
                className="w-full px-4 py-3 bg-[#0c0c0c] border border-[#222] rounded-xl text-white placeholder-[#333] text-[14px] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-[#888] mb-2">Email</label>
              <input
                id="email" name="email" type="email" required
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#0c0c0c] border border-[#222] rounded-xl text-white placeholder-[#333] text-[14px] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-[#888] mb-2">Password</label>
              <div className="relative">
                <input
                  id="password" name="password" required
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#0c0c0c] border border-[#222] rounded-xl text-white placeholder-[#333] text-[14px] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all duration-200 pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-orange-400 transition-colors cursor-pointer">
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
              {strength && (
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} rounded-full transition-all duration-500`} style={{ width: `${strength.pct}%` }} />
                  </div>
                  <span className={`text-[11px] font-medium ${strength.pct <= 33 ? 'text-red-400' : strength.pct <= 66 ? 'text-amber-400' : 'text-emerald-400'}`}>{strength.label}</span>
                </div>
              )}
            </div>

            <button type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-[14px] tracking-wide cursor-pointer shadow-lg shadow-orange-500/15 mt-2">
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-center mt-8 text-[13px] text-[#444]">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>

        {/* Bottom accent */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent mt-8" />
      </div>
    </div>
  )
}

export default Register