<template>
    <!-- profile view -->
    <!-- header -->
    <div class="bg-white w-full flex gap-3 align-items-center shadow-1 px-4" style="padding-top:.6rem ;padding-bottom: .6rem;">
        <Button class="button-no-shadow arrow-button" rounded @click="toggleViewProfile">
            <template #icon>
                <span class="times-cion">
                    <i class="pi pi-times" style="color: gray;font-size: 18px;"></i>
                </span>
                <span class="arrow-icon">
                    <i class="pi pi-arrow-left" style="color: gray;font-size: 18px;"></i>
                </span>
            </template>
        </Button>
        <span class="text-lg font-semibold text-gray-800">
            User Info
        </span>
    </div>
    <div class="w-11 mx-auto pt-2 z-5">
        <div class="relative">
            <div class="user-cover bg-default">
                <template v-if="getCurrentUserFromRooms?.profileCover">
                    <img :src="getCurrentUserFromRooms.profileCover" alt="" class="w-full h-full">
                </template>
            </div>
            <div class="user-profile bg-default">
                <template v-if="getCurrentUserFromRooms?.profileImage">
                    <img :src="getCurrentUserFromRooms.profileImage" alt="" class="w-full h-full">
                </template>
            </div>
        </div>
        <div class="mt-7 flex flex-column align-items-center">
            <span class="flex gap-2 align-items-center">
                <span class="font-semibold text-lg text-blue-500" :class="{'font-hanuman':!isEnglish(getCurrentUserFromRooms?.name)}">
                    {{ getCurrentUserFromRooms?.name }}
                </span>
                <template v-if="isAdmin(getCurrentUserFromRooms?.role)">
                    <Button icon="pi pi-check" class="verify-button button-no-shadow" rounded />
                </template>
            </span>
            <span class="w-10 mx-auto text-center mt-2 text-sm text-gray-700" :class="{'font-hanuman':!isEnglish(getCurrentUserFromRooms?.bio)}" style="font-size: 12px;">
                {{ getCurrentUserFromRooms?.bio }}
            </span>
        </div>
    </div>
</template>

<script setup>
import {computed } from 'vue';
import Button from "primevue/button"
import { useStore } from '../store';
import { useRoute } from 'vue-router';

const store = useStore()
const route = useRoute()
const props = defineProps({
    toggleViewProfile: {
        type: Function,
        required: true
    }
})
const getCurrentUserFromRooms = computed(() => {
    let currentRoom = store.rooms.find(ro => ro._id == route.params.id)
    return currentRoom?.members?.find(user => user._id != store.user?.information?._id)
})

const isAdmin = (role) => ((role == "ADMIN") || (role == "SUPER_ADMIN"))
const isEnglish = (text)=>{
    let reg = /[a-zA-Z]/;
    return reg.test(text)
}


</script>

<style scoped>
.user-profile {
    width: 7rem;
    height: 7rem;
    overflow: hidden;
    border-radius: 50%;
    position: absolute;
    bottom: -50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #3333;
}

.user-cover {
    position: relative;
    width: 100%;
    min-height: 150px;
}

.user-cover img {
    border-radius: 5px 5px 0 0;
}

.times-cion {
    display: inline;
}   
.arrow-icon {
    display: none;
}
@media only screen and (max-width:1000px){
    .times-cion {
    display: none;
    }   
    .arrow-icon {
        display: inline;
    }
}
</style>