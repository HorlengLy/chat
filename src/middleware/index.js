import { useStore } from "../store";
import router from "../routes"
import API from "../service";

const api = new API();

export default function () {
    router.beforeEach(async (to, from) => {
        const store = useStore()
        const token = localStorage.getItem("token")
        if (!store.user && to.name != "LOGIN" && token) {
            const { data, response } = await api.VERIFY_TOKEN(`Bearer ${token}`)
            if (response) {
                localStorage.clear('token')
                return { name: "LOGIN" }
            }
            if (data?.data?.statusCode == 200) {
                data.data.data?.user && store.setUser(data.data.data.user)
                return { name: "HOME" }
            }
            else {
                localStorage.clear('token')
                return { name: "LOGIN" }
            }

        }
        if (to.name == 'LOGIN' && store.user) {
            return { name: "HOME" }
        }
        if (!store.user && to.name != "LOGIN") return { name: "LOGIN" }
        else return true
    })

}
