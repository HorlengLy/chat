import { useRouter } from "vue-router"

export default function (status) {
    const router = useRouter()
    switch (status) {
        case 403:
            router.push({ name: "HOME" })
            break;
        case 401:
            localStorage.clear('token')
            router.push({ name: "LOGIN" })
            break;
        default : return;
    }

}