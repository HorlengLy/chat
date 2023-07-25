import { useRouter } from "vue-router"
import router from "../routes";
export default function (status) {
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