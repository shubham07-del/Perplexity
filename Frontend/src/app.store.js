import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../src/Features/auth/auth.slice"
import chatReducer from "../src/Features/chat/chat.slice"

export const store = configureStore({
    reducer:{
        auth:authReducer,
        chat:chatReducer,
    }
})