<template>
    <div class="search-container pt-8">
        <template v-for="user in subUsers">
            <SearchCard :user="user.user" @click="$event=>opentConversation(user.room_id)"/>
        </template>
    </div>
</template>

<script setup>
import SearchCard from './SearchCard.vue';
import { useStore } from '../store';
import {ref,onMounted,watchEffect} from "vue"
import { useRouter } from 'vue-router';

const store = useStore()
const allUsers = ref([])
const router = useRouter()
const subUsers = ref([])
onMounted(() => {
    store.friends.forEach((room)=>{
        allUsers.value.push({user:getFriend(room.members),room_id:room._id})
    })
})

const getFriend = (members)=>{
    return members?.find(mem=>mem.id != store.user?._id)
}

watchEffect(()=>{
    if(store.searchText)
        subUsers.value = allUsers.value.filter(user => user?.user?.name?.toUpperCase().includes(store.searchText.toUpperCase()))
    else subUsers.value = allUsers.value
})

const opentConversation = _id => {
    router.push({name:"MESSAGE_BOX",params:{id:_id}})
    store.unSetSearch()
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