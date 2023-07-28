<template>
    <div class="fixed w-full z-4 bg-white shadow-1 flex justify-content-between py-2 md:px-5 px-3  cursor-pointer">
        <template v-if="!loading">
            <div class="flex gap-3 align-items-center" @click="toggleViewProfile">
                <div class="flex gap-2 align-items-center">
                    <span class="md:hidden inline-block">
                        <Button class="arrow-button button-no-shadow" @click="backToHomePage" icon="pi pi-arrow-left"
                            rounded size="small" />
                    </span>
                    <span class="relative">
                        <div class="profile overflow-hidden border-1 border-gray-300">
                            <img :src="friend?.profileImage" alt="" class="w-full h-full">
                        </div>
                        <span :class="{ 'active': isActive(friend?._id) }"></span>
                    </span>
                </div>
                <div>
                    <span class="flex gap-2">
                        <h5 :class="[friend?.role == 'SUPER_ADMIN' ? 'admin-name' : 'text-gray-800',!isEnglish(friend?.name)?'font-hanuman':'']">
                            {{ friend?.name }}
                        </h5>
                        <template v-if="friend?.role == 'ADMIN' || friend?.role == 'SUPER_ADMIN'">
                            <Button icon="pi pi-check" class="verify-button button-no-shadow" rounded> </Button>
                        </template>
                    </span>
                    <p v-if="lastMessage" class="text-xs mt-1">
                        Last seen {{ new Date(lastMessage?.createdAt).toDateString() }}
                    </p>
                    <p v-else class="text-xs mt-1">
                        {{ new Date(getCurrentRoom($route.params?.id)?.createdAt).toDateString() }}
                    </p>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex gap-3 align-items-center">
                <Skeleton shape="circle" size="2.5rem" class="mr-2"></Skeleton>
                <div>
                    <Skeleton width="10rem" class=""></Skeleton>
                    <Skeleton width="5rem" class="mt-1"></Skeleton>
                </div>
            </div>
        </template>
    </div>
        <!-- <div class="px-3">
            <Button icon="pi pi-phone" class="button-no-shadow button-call" rounded severity="secondary"/>
        </div> -->
</template>
<script setup>
import { useRouter, useRoute } from "vue-router"
import Skeleton from "primevue/skeleton"
import { useStore } from "../store";
import Button from "primevue/button";
import { computed, ref, inject } from "vue";
import { watchEffect } from "vue";

const store = useStore()
const router = useRouter()
const backToHomePage = () => {
    store.toggleLayout()
    router.push({ name: "HOME" })
}
const route = useRoute()
const friend = ref(null)
const loading = inject('loading')

defineProps({
    toggleViewProfile : {
        type : Function,
        required : true
    },
    lastMessage : {
        type : undefined,
        required : true
    }
})

watchEffect(() => {
    const id = route.params.id
    friend.value = getFriend(getCurrentRoom(id)?.members, store.user?.information._id)
}, {
    flush: "post"
})

const getCurrentRoom = (id) => {
    return store.rooms?.filter(room => room._id == id)[0]
}

const getFriend = (members, selfId) => {
    return members?.filter(member => member._id != selfId)[0]
}

const isActive = (_id) => {
    return store.usersActive?.some(el => el._id == _id);
}
const isEnglish = (text)=>{
    let reg = /[a-zA-Z]/;
    return reg.test(text)
}


</script>

<style scoped>
.profile {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
}
</style>