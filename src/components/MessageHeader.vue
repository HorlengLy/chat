<template>
    <div class="bg-white shadow-2 flex gap-3 py-2 lg:px-4 px-2">
        <div class="flex gap-2 align-items-center">
            <span class="md:hidden inline-block">
                <Button class="arrow-button button-no-shadow" @click="backToHomePage" icon="pi pi-arrow-left" rounded size="small" />
            </span>
            <span class="relative">
                <div class="profile overflow-hidden border-1 border-gray-300">
                    <img :src="friend?.profileImage" alt="" class="w-full h-full">
                </div>
                <span class="p-1 border-circle absolute bg-green-500" style="right:5px;bottom: 2px;"></span>
            </span>
        </div>
        <div>
            <h5 class="text-gray-800">
                {{ friend?.name }}
            </h5>
            <p class="text-xs mt-1">Last sent a message</p>
        </div>
    </div>
</template>
<script setup>
import {useRouter ,useRoute } from "vue-router"
import { useStore } from "../store";
import Button from "primevue/button";
import { ref } from "vue";
import { watchEffect } from "vue";
const store = useStore()
const router = useRouter()
const backToHomePage = ()=> {
    store.toggleLayout()
    router.push({name : "HOME"})
}
const route = useRoute()
const friend = ref(null)

watchEffect(()=>{
    const id = route.params.id
    friend.value = getFriend(getCurrentRoom(store.friends,id),store.user?.information._id)
},{
    flush : "post"
})


const getCurrentRoom = (rooms,id) => {
    return rooms?.filter(room => room._id == id)[0]?.members
}

const getFriend = (members,selfId) =>{
    return members?.filter(member => member._id != selfId)[0]
}


</script>

<style scoped>
.profile {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
}
</style>