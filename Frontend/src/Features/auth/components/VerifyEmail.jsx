import React from 'react'
import { Link, useSearchParams } from 'react-router'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') // success | error | already-verified
  const message = searchParams.get('message') || ''

  const isSuccess = status === 'success' || status === 'already-verified'
  const isError = status === 'error'
  const noStatus = !status

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#141416] px-3 py-4 sm:px-4 sm:py-6 md:py-8 relative overflow-hidden font-sans">

      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] max-w-md max-h-96 bg-indigo-500/[0.06] rounded-full blur-[100px] sm:blur-[150px]" />
      <div className="absolute bottom-[-5%] right-[-10%] w-[70vw] h-[70vw] max-w-sm max-h-80 bg-indigo-600/[0.04] rounded-full blur-[80px] sm:blur-[120px]" />

      {/* Animated floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-indigo-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-indigo-300/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent mb-6 sm:mb-8 rounded-full" />

        <div className="bg-[#1c1c1f] border border-white/[0.07] rounded-2xl p-5 sm:p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">

          {/* Brand header */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <img src="/signature.ai" alt="Signature logo" className="w-full h-auto object-contain" />
            </div>
            <span className="text-white/40 text-sm sm:text-[15px] font-medium tracking-wider uppercase">Signature</span>
          </div>

          {/* ─── SUCCESS STATE ─── */}
          {isSuccess && (
            <div className="flex flex-col items-center py-6">
              {/* Animated check icon */}
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full bg-emerald-500/[0.08] animate-ping" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-9 h-9 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-2">
                {status === 'already-verified' ? 'Already Verified' : 'Email Verified!'}
              </h1>
              <p className="text-[#71717a] text-sm sm:text-[15px] text-center mb-2">
                {status === 'already-verified'
                  ? 'Your email has already been verified. You can sign in.'
                  : 'Your email has been verified successfully!'}
              </p>

              {/* Success info card */}
              <div className="w-full mt-6 bg-emerald-500/[0.06] border border-emerald-500/[0.12] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/[0.15] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] text-emerald-300 font-medium">Account Activated</p>
                    <p className="text-[12px] text-[#71717a] mt-1 leading-relaxed">Your account is now fully active. You can sign in and start using all features of Signature.</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                to="/login"
                className="w-full mt-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-[14px] tracking-wide cursor-pointer shadow-lg shadow-indigo-500/20 text-center block no-underline"
              >
                Continue to Sign In
              </Link>

              <p className="text-[11px] text-[#3f3f46] mt-4 text-center">
                You'll be redirected to the login page
              </p>
            </div>
          )}

          {/* ─── CHECK YOUR EMAIL STATE (post-registration) ─── */}
          {noStatus && (
            <div className="flex flex-col items-center py-6">
              {/* Animated email icon */}
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full bg-indigo-500/[0.08] animate-ping" style={{ animationDuration: '2.5s' }} />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-9 h-9 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-2">Check your email</h1>
              <p className="text-[#71717a] text-sm sm:text-[15px] text-center mb-2">
                We've sent a verification link to your email address.
              </p>

              {/* Info card */}
              <div className="w-full mt-6 bg-indigo-500/[0.06] border border-indigo-500/[0.12] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/[0.15] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5-1.963a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] text-indigo-300 font-medium">What to do next</p>
                    <ul className="text-[12px] text-[#71717a] mt-1.5 leading-relaxed space-y-1 list-none p-0 m-0">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400/50 flex-shrink-0" />
                        Open your email inbox
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400/50 flex-shrink-0" />
                        Click the verification link we sent you
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-indigo-400/50 flex-shrink-0" />
                        Check your spam folder if you don't see it
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/login"
                className="w-full mt-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-[14px] tracking-wide cursor-pointer shadow-lg shadow-indigo-500/20 text-center block no-underline"
              >
                Go to Sign In
              </Link>

              <p className="text-[11px] text-[#3f3f46] mt-4 text-center">
                Didn't receive the email? Check your spam folder or try registering again.
              </p>
            </div>
          )}

          {/* ─── ERROR STATE ─── */}
          {isError && (
            <div className="flex flex-col items-center py-6">
              {/* Error icon */}
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 rounded-full bg-red-500/[0.06]" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/15 to-red-600/10 border border-red-500/15" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-9 h-9 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mb-2">Verification Failed</h1>
              <p className="text-[#71717a] text-sm sm:text-[15px] text-center mb-2">
                {message || 'The verification link is invalid or has expired.'}
              </p>

              {/* Error info card */}
              <div className="w-full mt-6 bg-red-500/[0.05] border border-red-500/[0.1] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/[0.12] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[13px] text-red-300 font-medium">What you can try</p>
                    <ul className="text-[12px] text-[#71717a] mt-1.5 leading-relaxed space-y-1 list-none p-0 m-0">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#4a4a52] flex-shrink-0" />
                        Check if the link in your email is complete
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#4a4a52] flex-shrink-0" />
                        Request a new verification email
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#4a4a52] flex-shrink-0" />
                        Contact support if the problem persists
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="w-full flex flex-col gap-3 mt-8">
                <Link
                  to="/register"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-[14px] tracking-wide cursor-pointer shadow-lg shadow-indigo-500/20 text-center block no-underline"
                >
                  Try Registering Again
                </Link>
                <Link
                  to="/login"
                  className="w-full py-3 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] text-[#a1a1aa] hover:text-white font-semibold rounded-xl transition-all duration-200 text-[14px] tracking-wide cursor-pointer text-center block no-underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Bottom accent */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mt-8" />
      </div>
    </div>
  )
}

export default VerifyEmail