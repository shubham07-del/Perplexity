import {io} from "socket.io-client"

let socket = null;

export const initSocketConnection = ()=>{
    if (!socket) {
        socket = io("http://localhost:3000",{
            withCredentials:true
        })
        socket.on("connect", ()=>{
            console.log("connected to socket.io server")
        })
    }
    return socket;
}