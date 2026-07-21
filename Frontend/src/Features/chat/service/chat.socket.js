import {io} from "socket.io-client"

let socket = null;

export const initSocketConnection = ()=>{
    if (!socket) {
        const token = localStorage.getItem("token");
        socket = io("https://perplexity-s7gf.onrender.com",{
            withCredentials:true,
            auth: { token }
        })
        socket.on("connect", ()=>{
            console.log("connected to socket.io server")
        })
    }
    return socket;
}