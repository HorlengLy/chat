<template>
    <!-- navbar overlay -->
    <div v-if="viewNavbar" class="nav-bar-overlay" @click="toggleNavbar"></div>
    <Navbar ref="navbarEle" :toggleNavbar="toggleNavbar" :toggleProfile="toggleProfile" :toggleAddContact="toggleAddContact"/>
    <div class="h-screen w-screen overflow-hidden">
        <div class="h-full overflow-hidden grid mt-0">
            <div v-if="showProfile"
                class="relative col-12 md:col-5 lg:col-4 xl:col-3 h-full bg-white border-right-1 border-gray-400 transition-all transition-duration-500">
                <div class="w-full absolute left-0 top-0 z-5 border-bottom-1 border-gray-400">
                    <ProfileHeader :toggleProfile="toggleProfile" />
                </div>
                <div class="overflow-y-auto py-4 h-full mt-6 z-0">
                    <Profile :toggleProfile="toggleProfile" />
                </div>
            </div>
            <div v-else ref="leftLayout" class="base-layout leftLayout transition-layout">
                <DefaultHeader :toggleProfile="toggleProfile" :toggleNavbar="toggleNavbar" />
                <template v-if="loading">
                    <FriendLoading />
                </template>
                <template v-else>
                    <template v-if="!store.isSearch">
                        <div class="friend-list h-full overflow-y-auto pt-7" v-if="store.rooms.length">
                            <template v-for="room in store.rooms">
                                <div @click="() => openChat(room)" v-if="!getFriend(room.members)?.isDeleted">
                                    <UserCard :user="getFriend(room.members)" :room="room"/>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-else>
                        <Search />
                    </template>
                </template>
            </div>
            <div ref="rightLayout" class="rightLayout hidden-righ-layout transition-layout " style="background-color: #F3F8FC;">
                <router-view></router-view>
            </div>
        </div>
    </div>
    <template v-if="isView">
        <AddContact :isView="isView" :toggle-add-contact="toggleAddContact" />
    </template>
</template>
<script setup>
import DefaultHeader from '../components/DefaultHeader.vue';
import UserCard from '../components/UserCard.vue';
import Navbar from '../components/Navbar.vue';
import Profile from '../components/Profile.vue';
import ProfileHeader from "../components/ProfileHeader.vue"
import Search from '../components/Search.vue';
import AddContact from '../components/AddContact.vue';
import FriendLoading from "../components/loading/FriendLoading.vue"
import { useStore } from "../store";
import { useRouter,useRoute } from "vue-router";
import { onMounted, ref,provide, computed } from "vue"
import { useToast } from "primevue/usetoast"
import API from '../service';

const store = useStore()
const router = useRouter()
const rightLayout = ref(null)
const leftLayout = ref(null)
const navbarEle = ref(null)
const showProfile = ref(false)
const isView = ref(false)
const loading = ref(false)
const toast = useToast()
const api = new API()
const route = useRoute()
const viewNavbar = ref(false)

provide('loading',loading)
onMounted(() => store.settoggleLayout(toggleLayout))
onMounted(() => GET_FRIENDS())
onMounted(()=>{
    let params = window.location.href?.split('k/')
    if(params[1]){
        toggleLayout()
    }
        
})
const openChat = (_room) => {
    router.push({ name: "MESSAGE_BOX", params: { id: _room._id } })
    toggleLayout()
}
const toggleLayout = () => {
    rightLayout.value.classList.toggle("hidden-righ-layout")
    leftLayout.value.classList.toggle("hidden-left-layout")
}
const toggleProfile = () => {
    showProfile.value = !showProfile.value
}
const toggleAddContact = () => isView.value = !isView.value
const getFriend = (members) => {
    return members?.find(mem => mem._id != store.user?.information?._id)
}
const GET_FRIENDS = async () => {
    try {
        loading.value = true
        const { data, response } = await api.GET_FRIENDS()
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message, 'error')
            return
        }
        if (data?.data?.statusCode == 200) {
            data.data.rooms && store.setRooms(data.data.rooms)
        }
    } catch (error) {
        throw new Error(error)
    }
    finally {
        loading.value = false
    }

}
const addToast = (ms, severity) => {
    toast.add({
        summary: "KHMER CHAT",
        detail: ms,
        life: 5000,
        severity
    })
}
function toggleNavbar(){
    viewNavbar.value = !viewNavbar.value
    if (navbarEle.value.$el?.classList.contains('hidden')) {
        navbarEle.value.$el?.classList.remove('hidden')
        navbarEle.value.$el?.classList.toggle('navbarAnimate')
        return
    }
    navbarEle.value.$el?.classList.toggle('navbarAnimate')
    navbarEle.value.$el?.classList.toggle('navbarAnimateOut')
}



</script>


<style scoped>

.nav-bar-overlay {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: transparent;

}
.friend-list {
    animation: zoomOut .3s linear;
}

@keyframes zoomOut {
    0% {
        transform: scale(.9);
    }

    100% {
        transform: scale(1);
    }
}
</style>