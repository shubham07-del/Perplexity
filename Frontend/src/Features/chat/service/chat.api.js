import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000/api/chats",
    withCredentials:true
})

export async function sendMessage({message, chatId}) {
    const response = await api.post("/message",{message, chat:chatId})
    return response.data
}

export async function streamMessage({message, chatId}, onChunk, onStart, onDone) {
    const response = await fetch("http://localhost:3000/api/chats/message", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, chat: chatId })
    });

    if (!response.ok) {
        throw new Error("Failed to stream message");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ""; // Keep the incomplete line in the buffer
        
        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6));
                    if (data.type === 'start') {
                        onStart(data);
                    } else if (data.type === 'chunk') {
                        onChunk(data.content);
                    } else if (data.type === 'done') {
                        onDone();
                    }
                } catch (e) {
                    console.error("Failed to parse SSE data:", e);
                }
            }
        }
    }
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