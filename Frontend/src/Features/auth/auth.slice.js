import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        err:null
    },
    reducers:{
        setUser:(state, action)=>{
            state.user = action.payload
        },
        setLoading:(state, action)=>{
            state.loading = action.payload
        },
        setError:(state, action)=>{
            state.err = action.payload
        },
    }
})


export const {setError, setLoading, setUser} = authSlice.actions
export default authSlice.reducer 