import axios from "axios"

const api = axios.create({
    baseURL:"https://perplexity-s7gf.onrender.com/api/auth",
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function login({email, password}) {
    const response = await api.post("/login",{email, password})
    return response.data
}

export async function register({username, email, password}) {
    const response = await api.post("/register",{username, email, password})
    return response.data
}

export async function getMe() {
    const response = await api.get("/get-me")
    return response.data
}

export async function logout(){
    const response = await api.get("/logout")
    return response.data
}