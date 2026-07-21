import {io} from "socket.io-client"

let socket = null;

export const initSocketConnection = ()=>{
    if (!socket) {
        socket = io("https://perplexity-s7gf.onrender.com",{
            withCredentials:true
        })
        socket.on("connect", ()=>{
            console.log("connected to socket.io server")
        })
    }
    return socket;
}