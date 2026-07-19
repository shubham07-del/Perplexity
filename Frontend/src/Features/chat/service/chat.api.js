import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000/api/chats",
    withCredentials:true
})

export async function sendMessage({message, chatId}) {
    const response = await api.post("/message",{message, chatId})
    return response.data
}

export async function getChats() {
    const response = await api.get("/")
    return response.data
}

export async function getMessages(chatId) {
    const response = await api.get(`/${chatId}/messages`)
    return response.data
}

export async function deleteChat(chatId) {
    const response = await api.delete(`/delete/${chatId}`)
    return response.data
}