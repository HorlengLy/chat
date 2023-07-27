import { useStore } from "../store";
import router from "../routes"
import API from "../service";

const api = new API();

export default function () {
    router.beforeEach(async (to, from) => {
        const store = useStore()
        const token = localStorage.getItem("token")
        try {
            store.setLoading(true)
            if (to.matched.some(record => record.meta.requiredAuth)) {
                if (!token)
                    return { name: "LOGIN" }
                if (token && !store.user) {
                    const { data } = await api.VERIFY_TOKEN(`Bearer ${token}`)
                    if (data?.data?.statusCode == 200) {
                        const user = data.data.data
                        user && store.setUser(user)
                        user?.information?._id && store.socketConected(user.information._id)
                        // user.information?._id && store.createPeerJs(user.information._id)
                        if (to.meta.requiredAdmin) {
                            if (user?.information?.role == "ADMIN" || user?.information?.role == "SUPER_ADMIN")
                                return true
                            else return { name: "HOME" }
                        }
                        else return true
                    }
                    else {
                        localStorage.clear('token')
                        return { name: "LOGIN" }
                    }
                }
                else {
                    if (to.meta.requiredAdmin) {
                        if (user?.information?.role == "ADMIN" || user?.information?.role == "SUPER_ADMIN")
                            return true
                        else return { name: "HOME" }
                    }
                    else return true
                }
            }
            else {
                if (token)
                    return { name: "HOME" }
                else return true
            }
        } catch (err) {
            throw new Error(err)
        }
        finally {
            store.setLoading(false)
        }
    })

}
