<template>
    <div class="search-container pt-8">
        <template v-for="user in subUsers">
            <div v-if="!user.user?.isDeleted"  @click="$event=>opentConversation(user.room._id)">
                <UserCard :user="user.user" :room="user.room"/>
            </div>
        </template>
    </div>
</template>

<script setup>
import UserCard from './UserCard.vue';
import { useStore } from '../store';
import {ref,onMounted,watchEffect} from "vue"
import { useRouter } from 'vue-router';

const store = useStore()
const allUsers = ref([])
const router = useRouter()
const subUsers = ref([])
onMounted(() => {
    store.rooms.forEach((room)=>{
        allUsers.value.push({user:getFriend(room.members),room})
    })
})

const getFriend = (members)=>{
    return members?.find(mem=>mem._id != store.user?.information?._id)
}

watchEffect(()=>{
    if(store.searchText)
        subUsers.value = allUsers.value.filter(user => user?.user?.name?.toUpperCase().includes(store.searchText.toUpperCase()))
    else subUsers.value = allUsers.value
})

const opentConversation = _id => {
    router.push({name:"MESSAGE_BOX",params:{id:_id}})
    store.unSetSearch()
    store.toggleLayout()
}


</script>




<style>

.search-container {
    animation: animate .3s linear forwards;
}
@keyframes animate{
    0%{
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

</style>