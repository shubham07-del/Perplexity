import { initSocketConnection } from "../service/chat.socket";
import {sendMessage, streamMessage, getChats, getMessages} from "../service/chat.api"
import {setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages, appendMessageChunk} from "../chat.slice"
import {useDispatch} from "react-redux"

export const useChat = ()=>{

    const dispatch = useDispatch()

    async function handleSendMessage({message, chatId}) {
        dispatch(setLoading(true));
        
        // Temporarily use a local variable to track the active chat ID 
        // in case this is a new conversation and the server returns a new ID
        let activeChatId = chatId;

        // 1. Immediately add the user message to the UI if we already have a chat
        if (activeChatId) {
            dispatch(addNewMessage({
                chatId: activeChatId,
                content: message,
                role: "user"
            }));
        }

        try {
            await streamMessage(
                { message, chatId: activeChatId },
                // onChunk
                (content) => {
                    if (activeChatId) {
                        dispatch(appendMessageChunk({ chatId: activeChatId, content }));
                    }
                },
                // onStart
                (data) => {
                    // If it was a new chat, the server created it
                    if (!activeChatId) {
                        activeChatId = data.chatId;
                        dispatch(createNewChat({
                            chatId: activeChatId,
                            title: data.title
                        }));
                        // Add the user message now that we have a chat ID
                        dispatch(addNewMessage({
                            chatId: activeChatId,
                            content: message,
                            role: "user"
                        }));
                        dispatch(setCurrentChatId(activeChatId));
                    }
                    
                    // Add an empty AI message to start appending chunks to
                    dispatch(addNewMessage({
                        chatId: activeChatId,
                        content: "",
                        role: "ai"
                    }));
                },
                // onDone
                () => {
                    dispatch(setLoading(false));
                }
            );
        } catch (error) {
            console.error("Streaming error:", error);
            dispatch(setLoading(false));
        }
    }

    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const {chat: chats} = data
        dispatch(setChats(chats.reduce((acc, chat)=>{
            acc[chat._id]={
                _id:chat._id,
                title:chat.title,
                messages:[],
                lastUpdate:chat.updatedAt,
            }
            return acc
        }, {})))

        dispatch(setLoading(false))
    }


    async function handleOpenMessage(chatId) {
        dispatch(setLoading(true))
        const data = await getMessages(chatId)
        const {messages} = data
        
        const formattedMessage = messages.map(msg=>({
            content:msg.content,
            role: msg.role
        }))

        dispatch(addMessages({
            chatId,
            messages:formattedMessage
        }))

        dispatch(setCurrentChatId(chatId))
    }


    return {
        initSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenMessage
    }
    
}