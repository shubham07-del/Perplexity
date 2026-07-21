import {useDispatch} from "react-redux"
import { setError, setLoading, setUser } from "../auth.slice"
import { getMe, login, logout, register } from "../services/auth.api"

export function useAuth(){
    const dispatch = useDispatch()

    async function handleRegister({username, email, password}) {
        try{
            dispatch(setError(true))
            const data = await register({username, email, password})
        }catch(err){
            dispatch(setError(err.response?.data?.message || "Registration failed."))
        }finally{
            dispatch(setLoading(false))
        }
    }
    async function handleLogin({email, password}) {
        try{
            dispatch(setError(true))
            const data = await login({email, password})
            dispatch(setUser(data.user))
        }catch(err){
            dispatch(setError(err.response?.data?.message || "Login failed."))
        }finally{
            dispatch(setLoading(false))
        }
    }
    async function handleGetMe() {
        try{
            dispatch(setError(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        }catch(err){
            dispatch(setError(err.response?.data?.message || "User fetching failed."))
        }finally{
            dispatch(setLoading(false))
        }
    }
    async function handleLogout() {
        try{dispatch(setLoading(true))
        const data = logout()
        dispatch(setUser(null))}
        catch(err){
            dispatch(setError(err.response?.data?.message || "User fetching failed."))
        }finally{
            dispatch(setLoading(false))
        }
    }

    
    return {
        handleGetMe,
        handleLogin,
        handleRegister,
        handleLogout
    }

}