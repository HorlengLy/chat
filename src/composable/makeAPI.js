
import axios from "../plugin/axios"


export default class API {

    get = (url,config={})=>{
        return axios.get(url,config)
                    .then(data=>data)
                    .catch(error=>Promise.reject(error))
    }

    post = (url,data,config={})=>{
        return axios.post(url,data,config)
                    .then(data=>data)
                    .catch(error=>error)
    }

    patch = (url,data,config={})=>{
        return axios.patch(url,data,config)
                    .then(data=>data)
                    .catch(error=>error)
    }

    delete = (url,data,config={})=>{
        return axios.delete(url,data,config)
                    .then(data=>data)
                    .catch(error=>error)
    }
    
    
}