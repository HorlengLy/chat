<template>
    <nav class="navbarLayout hidden navbarAnimate">
        <ul>
            <li class="navItem" v-for="menu in menus" @click="menu.command">
                <i class="pi" :class="menu.icon"></i>
                <span>
                    {{ menu.title }}
                </span>
            </li>
            <template v-if="true">
                <li class="navItem" @click="toDashboard">
                    <i class="pi pi-user-edit"></i>
                    <span>
                        Dashboard
                    </span>
                </li>
            </template>
        </ul>
    </nav>
</template>
<script setup>
import { useStore } from "../store"
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()
const store = useStore()
const props = defineProps({
    toggleNavbar: {
        type: Function,
        required: true,
    },
    toggleProfile: {
        type: Function,
        required: true
    },
    toggleAddContact: {
        type: Function,
        required: true
    }
})
const menus = ref([
    { icon: 'pi-user', title: 'Settings', command: () => { props.toggleNavbar(); props.toggleProfile() } },
    { icon: 'pi-user-plus', title: 'Add Contact', command: () => { props.toggleNavbar(); props.toggleAddContact() } },
    { icon: 'pi-info-circle', title: 'About', command: () => { props.toggleNavbar(); window.open("https://t.me/Horlenggg") } },
    { icon: 'pi-sign-out', title: 'Logout', command: () => { Logout() } },
],)
const Logout = () => {
    store.$reset();
    localStorage.clear('token');
    router.push({ name: "LOGIN" })
}
const isAdmin = computed(() => {
    return (store.user?.role == "ADMIN" || store.user?.role == "SUPER_ADMIN")
})
const toDashboard = ()=>{
    router.push({name:'DASHBOARD'})
    props.toggleNavbar()
}
</script>

<style>
.navbarLayout {
    position: absolute;
    top: 55px;
    left: 1rem;
    background-color: #fff;
    z-index: 100;
    width: 250px;
    padding: 20px 5px;
    border-radius: 15px;
    box-shadow: 0 0.25rem 0.5rem 0.125rem #d2d2d288;
}

.navItem {
    display: flex;
    align-items: center;
    /* justify-content: space-between; */
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: all .3s linear;
}

.navItem:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.navItem>span {
    flex: .8;
    font-weight: 600;
    letter-spacing: .3px;
    font-size: 14px;
}

.navItem>i {
    flex: .2;
    font-size: 16px;
    font-weight: 700;
}

.navItem>i,
.navItem>span {
    color: #343434;
}

.navbarAnimate {
    animation: _zoomout .4s ease-out forwards;
}

.navbarAnimateOut {
    animation: to_hidden .3s ease-out forwards;
}

@keyframes _zoomout {
    0% {
        transform: translate(-10px, -10px);
        opacity: 0;
        z-index: -10;
    }

    70% {
        opacity: .3;
        z-index: 1;
    }

    100% {
        opacity: 1;
        z-index: 10;
        transform: translate(0, 0);
    }
}

@keyframes to_hidden {
    0% {
        transform: translate(0, 0);
        opacity: 1;
        z-index: 10;
    }

    100% {
        transform: translate(-10px, -10px);
        opacity: 0;
        z-index: -10;
    }
}
</style>