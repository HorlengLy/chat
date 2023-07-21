import axios from "axios"
import authenticate from "../service/authenticate"

axios.defaults.baseURL = import.meta.env.VITE_API_URL

axios.interceptors.request.use(config=>{
    config.headers.Authorization = "Bearer " + localStorage.getItem('token')
    return config
},error=>{
    return Promise.reject(error)
})

axios.interceptors.response.use(response=>{
    return response
},error=>{
    console.log({error});
    authenticate(error?.response?.status)
    return Promise.reject(error)
})

export default axios