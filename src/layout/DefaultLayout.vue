<template>
    <div class="flex h-screen overflow-hidden">
        <div v-if="showProfile"
            class="relative col-12 md:col-5 lg:col-4 xl:col-3 h-full bg-white border-right-1 border-gray-400 transition-all transition-duration-500">
            <div class="w-full absolute left-0 top-0 z-5 border-bottom-1 border-gray-400">
                <ProfileHeader :toggleProfile="toggleProfile" />
            </div>
            <div class="overflow-y-auto py-4 h-full mt-6 z-0">
                <Profile :toggleProfile="toggleProfile" />
            </div>
        </div>
        <div v-else ref="listFriend"
            class="relative col-12 md:col-5 lg:col-4 xl:col-3 h-full bg-white border-right-1 border-gray-400 transition-all transition-duration-500">
            <div class="shadow-1 m-0 p-0 w-full absolute left-0 top-0 z-5">
                <DefaultHeader :toggleProfile="toggleProfile" :toggleClick="toggleClick" />
            </div>
            <template v-if="loading">
                <FriendLoading />
            </template>
            <template v-else>
                <template v-if="!store.isSearch">
                    <div class="friend-list overflow-y-auto h-full pt-7" v-if="store.friends.length">
                        <template v-for="room in store.friends">
                            <div @click="() => toggleLayout(room)">
                                <UserCard :room="room.members" :auth-id="store.user?.information?._id" />
                            </div>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <Search />
                </template>
            </template>
        </div>
        <div ref="msBox"
            class="md:block hidden col-12 md:col-7 lg:col-8 xl:col-9 p-0 h-full transition-all transition-duration-500">
            <router-view></router-view>
        </div>
    </div>
    <template v-if="isView">
        <AddContact :isView="isView" :toggleClick="toggleClick" />
    </template>
</template>
<script setup>
import DefaultHeader from '../components/DefaultHeader.vue';
import UserCard from '../components/UserCard.vue';
import Profile from '../components/Profile.vue';
import ProfileHeader from "../components/ProfileHeader.vue"
import Search from '../components/Search.vue';
import AddContact from '../components/AddContact.vue';
import FriendLoading from "../components/loading/FriendLoading.vue"
import { useStore } from "../store";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue"
import { useToast } from "primevue/usetoast"
import API from '../service';

const store = useStore()
const router = useRouter()
const msBox = ref(null)
const listFriend = ref(null)
const showProfile = ref(false)
const room = ref("")
const isView = ref(false)
const loading = ref(false)
const toast = useToast()
const api = new API()
onMounted(() => store.settoggleLayout(subToggleLayout))
onMounted(() => GET_FRIENDS())

const toggleLayout = (_room) => {
    room.value = _room._id
    store.setCurrentRoom(getFriend(_room.members))
    router.push({ name: "MESSAGE_BOX", params: { id: _room._id } })
    const userScreen = document.body.offsetWidth
    if (userScreen > 760) return
    msBox.value.classList.toggle("hidden")
    listFriend.value.classList.toggle("hidden")
}

const subToggleLayout = () => {
    const userScreen = document.body.offsetWidth
    if (userScreen > 760) return
    msBox.value.classList.toggle("hidden")
    listFriend.value.classList.toggle("hidden")
}

const toggleProfile = () => {
    showProfile.value = !showProfile.value
}

const getFriend = (members) => {
    let friend = members.filter(member => member._id != store.user.information._id)
    return friend[0]
}

const toggleClick = () => isView.value = !isView.value

const GET_FRIENDS = async () => {
    try {
        loading.value = true
        const { data, response } = await api.GET_FRIENDS()
        console.log(data);
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message, 'error')
            return
        }
        if (data?.data?.statusCode == 200) {
            data.data.rooms && store.setFriends(data.data.rooms)
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

</script>


<style>
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
}</style>