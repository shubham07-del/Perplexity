import {createSlice} from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats:{},
        currentChatId:null,
        isLoading:false,
        error:null
    },
    reducers:{
        createNewChat:(state, action)=>{
            const {chatId, title} = action.payload
            state.chats[chatId] = {
                _id:chatId,
                title,
                messages:[],
                lastUpdated:new Date().toISOString(),
            }
        },
        addNewMessage:(state, action)=>{
            const {chatId, content, role} = action.payload
            state.chats[chatId].messages.push({content, role})
        },
        addMessages:(state, action)=>{
            const {chatId, messages} = action.payload
            state.chats[chatId].messages = messages
        },
        appendMessageChunk: (state, action) => {
            const { chatId, content } = action.payload;
            const chat = state.chats[chatId];
            if (chat && chat.messages.length > 0) {
                // Find the last message (should be the AI's currently generating message)
                const lastMessage = chat.messages[chat.messages.length - 1];
                if (lastMessage.role === "ai") {
                    lastMessage.content += content;
                }
            }
        },
        setChats:(state, action)=>{
            state.chats = action.payload
        },
        setCurrentChatId:(state, action)=>{
            state.currentChatId = action.payload
        },
        setLoading:(state, action)=>{
            state.isLoading = action.payload
        },
        setError:(state, action)=>{
            state.error = action.payload
        }
    }
})


export const {setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, appendMessageChunk} = chatSlice.actions
export default chatSlice.reducer