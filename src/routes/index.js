import { createWebHistory,createRouter } from "vue-router"
const router = createRouter({
    history:createWebHistory(),
    routes:[
        {
            path : "/k",
            component : ()=> import("../components/DefaultMessageBox.vue"),
            name : "HOME",
            meta:{
                requiredAuth : true
            }
        },
        {
            path : "/k/:id",
            component : ()=>import("../components/MessageBox.vue"),
            name : "MESSAGE_BOX",
            meta:{
                requiredAuth : true
            }
        },
        {
            path:'/:pathMatch(.*)*',
            name:"NOTFOUND",
            component:()=>import ("../views/NotFound.vue"),
            meta : {
                cleanLayout:true,
            }
        },
        {
            path:"/",
            name:"LOGIN",
            component:()=>import("../views/auth/Login.vue"),
            meta:{
                cleanLayout:true,
            }
        },
        {
            path:"/register",
            name:"SIGNUP",
            component:()=>import("../views/auth/Register.vue"),
            meta:{
                cleanLayout:true,
            }
        },
        {
            path:"/recover-password",
            name:"RECOVER_PASSWORD",
            component:()=>import("../views/auth/ForgetPassword.vue"),
            meta:{
                cleanLayout:true,
            },
            
        },
        {
            path : '/change-password',
            name : "CHANGE_PASSWORD",
            component : ()=>import("../components/ChangePasswordForm.vue"),
            meta:{
                cleanLayout:true,
            },
        },
        {
            path : "/dashbord",
            name : "DASHBOARD",
            component : ()=> import("../views/Dashboard.vue"),
            meta : {
                requiredAuth  :true,
                requiredAdmin : true,
                dashboardLayout:true
            }
        }
    ]
})

export default router