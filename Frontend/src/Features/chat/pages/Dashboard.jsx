import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const Dashboard = () => {
  const chat = useChat()
  const { user } = useSelector((state) => state.auth)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [activeChat, setActiveChat] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  const chats = useSelector((state)=>state.chat.chats)
  const currentChatId = useSelector((state)=>state.chat.currentChatId)

  useEffect(() => {
    chat.initSocketConnection()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    chat.handleSendMessage({message:input, chatId:currentChatId})
    setInput('')
  }

  return (
    <div className="flex h-screen w-full bg-[#0e0e0e] text-white overflow-hidden font-[Inter,sans-serif]">

      {/* ─── Sidebar Backdrop (mobile only) ─── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
          fixed md:static inset-y-0 left-0 z-50 w-72
          flex flex-col border-r border-[#1f1f1f] bg-[#111111]
          transition-all duration-300 ease-in-out shrink-0
        `}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-[#1f1f1f]">
          <div className="w-9 h-9 rounded-lg bg-linear-to-br from-orange-500 to-amber-400 flex items-center justify-center text-black font-bold text-sm tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.35)]">
            S
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-widest uppercase text-orange-400">
              Signature
            </h1>
            <p className="text-[10px] text-zinc-500 tracking-wide">AI Assistant</p>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pt-4 pb-2">
          <button
            className="
              w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-linear-to-r from-orange-600 to-amber-500
              text-black text-xs font-semibold tracking-wide
              shadow-[0_4px_24px_rgba(249,115,22,0.3)]
              hover:shadow-[0_4px_32px_rgba(249,115,22,0.5)]
              hover:scale-[1.02] active:scale-[0.98]
              transition-all duration-200 cursor-pointer
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
          {Object.keys(chats).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">No conversations yet.<br />Start a new chat!</p>
            </div>
          ) : (
            Object.values(chats).map((c) => (
              <button
                key={c._id}
                onClick={() => setActiveChat(c._id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                  transition-all duration-200 group cursor-pointer
                  ${
                    activeChat === c._id
                      ? 'bg-orange-500/10 border border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.06)]'
                      : 'hover:bg-white/4 border border-transparent'
                  }
                `}
              >
                {/* Chat icon */}
                <div className={`
                  shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                  ${activeChat === c._id ? 'bg-orange-500/20 text-orange-400' : 'bg-[#1a1a1a] text-zinc-500 group-hover:text-zinc-400'}
                  transition-colors duration-200
                `}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>

                {/* Title & meta */}
                <div className="flex-1 min-w-0">
                  <p className={`text-[12.5px] font-medium truncate ${activeChat === c._id ? 'text-orange-300' : 'text-zinc-300 group-hover:text-zinc-200'} transition-colors`}>
                    {c.title || 'Untitled Chat'}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5 truncate">
                    {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Just now'}
                  </p>
                </div>

                {/* Active indicator */}
                {activeChat === c._id && (
                  <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
                )}
              </button>
            ))
          )}
        </nav>

        {/* User Info */}
        <div className="border-t border-[#1f1f1f] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-amber-400 flex items-center justify-center text-black text-xs font-bold uppercase shadow-[0_0_12px_rgba(249,115,22,0.25)]">
              {user?.username?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">
                {user?.email || 'user@email.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="flex items-center gap-3 px-5 py-3.5 border-b border-[#1f1f1f] bg-[#111111]/80 backdrop-blur-md shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/6 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="h-5 w-px bg-[#1f1f1f]" />
          <h2 className="text-sm font-medium text-zinc-300 truncate">
            {chats[activeChat]?.title || 'New Conversation'}
          </h2>
          <div className="ml-auto flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
            <span className="text-[10px] text-zinc-500">Online</span>
          </div>
        </header>

        {/* Messages & Input Wrapper */}
        <div className="flex-1 flex flex-col min-h-0 w-full max-w-6xl mx-auto">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scroll-smooth">
          {chats[currentChatId]?.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[75%] md:max-w-[65%] px-4 py-3 text-[13.5px] leading-relaxed
                  transition-all duration-300
                  ${
                    msg.role === 'user'
                      ? 'bg-linear-to-br from-orange-600 to-amber-500 text-black font-medium rounded-2xl rounded-br-md shadow-[0_4px_24px_rgba(249,115,22,0.25)]'
                      : 'bg-[#1a1a1a] text-zinc-200 rounded-2xl rounded-bl-md border border-[#262626] shadow-[0_2px_12px_rgba(0,0,0,0.3)]'
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="shrink-0 px-4 pb-4 pt-2">
          <form
            onSubmit={handleSend}
            className="
              flex items-center gap-3 px-4 py-2.5
              bg-[#161616] border border-[#262626] rounded-2xl
              focus-within:border-orange-500/40
              focus-within:shadow-[0_0_24px_rgba(249,115,22,0.08)]
              transition-all duration-300
            "
          >
            {/* Attach icon */}
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-white/6 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="
                flex-1 bg-transparent text-sm text-zinc-200
                placeholder:text-zinc-600 outline-none caret-orange-400
              "
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className={`
                p-2 rounded-xl transition-all duration-200 cursor-pointer
                ${
                  input.trim()
                    ? 'bg-linear-to-r from-orange-600 to-amber-500 text-black shadow-[0_2px_16px_rgba(249,115,22,0.3)] hover:shadow-[0_2px_24px_rgba(249,115,22,0.5)] hover:scale-105 active:scale-95'
                    : 'bg-[#1f1f1f] text-zinc-600'
                }
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
          <p className="text-center text-[10px] text-zinc-600 mt-2 tracking-wide">
            Signature AI may produce inaccurate information. Verify important facts.
          </p>
        </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard