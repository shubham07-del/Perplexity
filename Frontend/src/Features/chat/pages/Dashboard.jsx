import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChatId } from "../chat.slice";
import { useChat } from "../hooks/useChat";
import { useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../auth/hooks/useAuth";

const Dashboard = () => {
  const chat = useChat();
  const { user } = useSelector((state) => state.auth);
  const loading = useSelector((state) => state.auth.loading);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);

  // Only init socket & fetch chats if user is logged in
  useEffect(() => {
    if (user) {
      chat.initSocketConnection();
      chat.handleGetChats();
    }
  }, [user]);

  // Restore saved message from localStorage after login redirect
  useEffect(() => {
    const savedMessage = localStorage.getItem("pendingMessage");
    if (savedMessage) {
      setInput(savedMessage);
      localStorage.removeItem("pendingMessage");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // If user is not logged in, save message and redirect to login
    if (!user) {
      localStorage.setItem("pendingMessage", input);
      navigate("/login");
      return;
    }

    chat.handleSendMessage({ message: input, chatId: currentChatId });
    setInput("");
  };

  const {handleLogout} = useAuth()

  const handleLogoutFn = async ()=>{
    await handleLogout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#141416] text-white font-sans overflow-x-hidden">
      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-full z-50
          flex flex-col flex-shrink-0
          bg-[#1c1c1f] border-r border-white/[0.06]
          transition-all duration-300 overflow-hidden
          ${sidebarOpen ? "w-[85vw] max-w-[270px] sm:w-[270px] sm:min-w-[270px] opacity-100" : "w-0 min-w-0 opacity-0 pointer-events-none"}
        `}
      >
        {/* Inner width wrapper so content doesn't squish during animation */}
        <div className="w-full max-w-[270px] flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.05] flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#141416"
                  strokeWidth="2"
                />
                <path
                  d="M8 12l3 3 5-5"
                  stroke="#141416"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight">
              Signature
            </span>
          </div>

          {/* Search */}
          <div className="mx-3 mt-3 mb-1.5 flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/[0.07] rounded-[9px]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4a4a52"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent border-none outline-none text-[12.5px] text-[#a1a1aa] placeholder:text-[#4a4a52] font-sans"
            />
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-[#4a4a52] bg-white/[0.05] rounded px-1 py-px">
                ⌘
              </span>
              <span className="text-[10px] text-[#4a4a52] bg-white/[0.05] rounded px-1 py-px">
                F
              </span>
            </div>
          </div>

          {/* Nav */}
          <div className="px-2.5 pt-1 pb-0.5 flex flex-col gap-px flex-shrink-0">
            <button
              onClick={() => dispatch(setCurrentChatId(null))}
              className="flex items-center gap-2.5 w-full px-3 py-[9px] rounded-[9px] border-none bg-transparent text-[#a1a1aa] text-[13.5px] font-medium font-sans cursor-pointer hover:bg-white/[0.05] hover:text-white transition-all"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.05] mx-3.5 my-1" />

          {/* Conversations label */}
          <div className="px-5 pt-3 pb-1.5 text-[10.5px] font-semibold text-[#4a4a52] uppercase tracking-widest flex-shrink-0">
            Conversations
          </div>

          {/* Chat list */}
          <nav className="flex-1 overflow-y-auto px-2.5 flex flex-col gap-px py-1">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <p className="text-[12px] text-[#4a4a52] leading-relaxed">
                  Sign in to view your
                  <br />
                  conversations.
                </p>
              </div>
            ) : Object.keys(chats).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <p className="text-[12px] text-[#4a4a52] leading-relaxed">
                  No conversations yet.
                  <br />
                  Start a new chat!
                </p>
              </div>
            ) : (
              Object.values(chats)
                .filter(
                  (c) =>
                    !searchQuery ||
                    (c.title || "Untitled Chat")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                )
                .map((c) => {
                  const isActive = currentChatId === c._id;
                  return (
                    <button
                      key={c._id}
                      onClick={() => chat.handleOpenMessage(c._id)}
                      className={`flex items-center gap-2.5 w-full px-3 py-[9px] rounded-[9px] border-none text-[13px] font-medium font-sans cursor-pointer transition-all text-left ${
                        isActive
                          ? "text-white"
                          : "text-[#71717a] hover:bg-white/[0.05] hover:text-[#a1a1aa]"
                      }`}
                      style={
                        isActive
                          ? {
                              background:
                                "linear-gradient(90deg,#4f46e5 0%,#6366f1 60%,rgba(99,102,241,0.5) 100%)",
                            }
                          : {}
                      }
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {c.title || "Untitled Chat"}
                      </span>
                      {c.updatedAt && (
                        <span
                          className={`text-[10px] flex-shrink-0 whitespace-nowrap ${isActive ? "text-white/50" : "text-[#4a4a52]"}`}
                        >
                          {new Date(c.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {isActive && (
                        <div className="w-[5px] h-[5px] rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.7)] flex-shrink-0" />
                      )}
                    </button>
                  );
                })
            )}
          </nav>

          {/* User row */}
          <div className="flex items-center gap-2.5 px-3.5 py-3 border-t border-white/[0.05] bg-[#1c1c1f] flex-shrink-0">
            {user ? (
              <>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white truncate">
                    {user?.username || "User"}
                  </div>
                  <div className="text-[11px] text-[#4a4a52] truncate mt-px">
                    {user?.email || "user@email.com"}
                  </div>
                </div>
                <div 
                onClick={handleLogout}
                className="cursor-pointer p-3 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800" title="logout">
                  <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="M16 17l5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-[13px] font-semibold cursor-pointer border-none hover:from-indigo-500 hover:to-indigo-400 transition-all"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#141416]">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-white/[0.05] flex-shrink-0 bg-[#141416]/95 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-[30px] h-[30px] rounded-[7px] border border-white/[0.08] bg-transparent cursor-pointer flex items-center justify-center text-[#71717a] hover:bg-white/[0.06] hover:text-[#a1a1aa] transition-all flex-shrink-0"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="w-px h-4 bg-white/[0.06]" />
          <h2 className="flex-1 text-sm sm:text-[14px] font-semibold text-white truncate">
            {chats[activeChat]?.title || "New Conversation"}
          </h2>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-400/[0.08] border border-emerald-400/[0.15]">
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse flex-shrink-0" />
            <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium">
              Online
            </span>
          </div>
        </header>

        {/* Content column */}
        <div className="flex-1 flex flex-col min-h-0 max-w-[900px] w-full mx-auto">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-6 flex flex-col gap-3 no-scrollbar">
            {chats[currentChatId]?.messages?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[86%] sm:max-w-[72%] px-3 sm:px-4 py-[10px] sm:py-[11px] text-sm sm:text-[13.5px] leading-relaxed ${
                    msg.role === "user"
                      ? "text-indigo-100 font-medium rounded-[18px_18px_4px_18px] shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
                      : "bg-[#212126] border border-white/[0.07] text-[#d1d5db] rounded-[18px_18px_18px_4px] shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
                  }`}
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg,#4338ca,#6366f1)",
                        }
                      : {}
                  }
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : msg.content === "" ? (
                    <div className="flex items-center gap-2 text-indigo-400/80 text-[13px] font-medium animate-pulse px-1 py-0.5">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-[spin_3s_linear_infinite]"
                      >
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                      </svg>
                      Thinking...
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-indigo-300 prose-p:text-[#d1d5db] prose-strong:text-indigo-200 prose-a:text-indigo-400 prose-code:bg-black/40 prose-code:text-indigo-300 prose-code:border prose-code:border-indigo-500/20 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-li:text-[#d1d5db] prose-table:border-collapse prose-table:w-full prose-table:border prose-table:border-white/10 prose-table:rounded-lg prose-th:bg-white/[0.06] prose-th:border prose-th:border-white/10 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-indigo-300 prose-th:text-[12px] prose-th:font-semibold prose-th:uppercase prose-th:tracking-wider prose-td:border prose-td:border-white/[0.07] prose-td:px-3 prose-td:py-2 prose-td:text-[#d1d5db] prose-tr:even:bg-white/[0.02]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box */}
          <div className="flex-shrink-0 px-2 sm:px-3 pb-3 sm:pb-4 pt-2">
            <div className="bg-[#1c1c1f] border border-white/[0.07] rounded-[14px] sm:rounded-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Textarea */}
              <div className="px-3 sm:px-4 pt-3 pb-2.5">
                <textarea
                  value={input}
                  rows={2}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything…"
                  className="w-full bg-transparent border-none outline-none resize-none text-[#e4e4e7] text-sm sm:text-[14px] leading-relaxed font-sans caret-indigo-500 placeholder:text-[#3f3f46]"
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.05] mx-3.5" />

              {/* Bottom bar */}
              <div className="flex items-center gap-2 px-3 sm:px-3.5 py-2.5">
                <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                  {user ? user.username?.charAt(0)?.toUpperCase() || "S" : "?"}
                </div>
                <span className="hidden sm:block flex-1 text-[10px] sm:text-[11px] text-[#3f3f46] select-none">
                  {user
                    ? "Enter to send · Shift+Enter for newline"
                    : "Sign in required to send messages"}
                </span>
                <button
                  onClick={handleSend}
                  className={`ml-auto shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold font-sans tracking-wide transition-all ${
                    input.trim()
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white cursor-pointer shadow-[0_2px_14px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_22px_rgba(99,102,241,0.6)]"
                      : "bg-white/[0.04] border border-white/[0.07] text-[#3f3f46] cursor-default"
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-[#27272a] mt-2 tracking-wide px-2">
              Signature AI may produce inaccurate information. Verify important
              facts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
