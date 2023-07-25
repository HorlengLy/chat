import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/lara-light-indigo/theme.css";     
import "primevue/resources/primevue.min.css";
import "./assets/style/messageBox.css"
import "primeflex/primeflex.css"
import 'primeicons/primeicons.css';
import "./assets/style/defaultLayout.css"
import "./assets/style/login.css"
import ToastService from "primevue/toastservice"
import router from "./routes"
import { createPinia } from 'pinia';
import middleware from "./middleware"
import resetStore from './store/plugins/resetStore';

const pinia = createPinia()
pinia.use(resetStore)
const app = createApp(App)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(router)
app.use(pinia)
app.use(middleware)
app.mount('#app')
