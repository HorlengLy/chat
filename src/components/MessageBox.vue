<template>
    <div class="flex relative">
        <div ref="messageLayout" class="h-screen transition-layout w-full">
            <MessageHeader :last-message="getLastMessage" :toggleViewProfile="toggleViewProfile" style="height: 8vh;"/>
            <div class="flex flex-column justify-content-between" style="height: 80vh;">
                <div class="overflow-y-auto">
                    <!-- message contain -->
                    <div class="w-10 lg:w-8 mx-auto flex flex-column gap-3 pt-5">
                        <template v-if="loading">
                            <MessageLoading />
                        </template>
                        <template v-else>
                            <template v-if="messages.length">
                                <template v-for="message in messages" :key="message._id">
                                    <span class="date-string" v-if="checkDate(message.createdAt)">
                                        {{ prepareDate(message.createdAt) }}
                                    </span>
                                    <MessageCard :message="message" :selfId="store.user?.information?._id"/>
                                </template>
                            </template>
                        </template>
                    </div>
                    <span ref="viewLates"></span>
                </div>
                <div class="absolute bottom-0 w-full z-5">
                    <!-- send box -->
                    <MessageSendBox :addMessage="addMessage" :scrollToLatesMessage="scrollToLatesMessage"/>
                </div>
            </div>
        </div>
        <div ref="friendViewLayout" class="user-info-layout transition-layout hidden-view-layout">
            <ProfileViews :toggleViewProfile="toggleViewProfile"/>
        </div>
    </div>
</template>
<script setup>
import MessageHeader from './MessageHeader.vue';
import MessageSendBox from "./MessageSendBox.vue"
import MessageCard from './MessageCard.vue';
import MessageLoading from "./loading/MessageLoading.vue"
import { watch, ref,computed, reactive, onMounted } from 'vue';
import ProfileViews from "../views/ProfileViews.vue"
import API from '../service';
import { useStore } from '../store';
import { useRoute } from "vue-router"
import { useToast } from 'primevue/usetoast';

const friendViewLayout = ref(null)
const messageLayout = ref(null)
const toast = useToast()
const api = new API();
const store = useStore()
const viewLates = ref(null)
const preDate = ref("")
const route = useRoute()
const loading = ref(false)
const messages = ref([])

const getMessages = async(id)=>{
    console.log("getting messages from server");
    try{
        loading.value = true
        const { response, data } = await api.GET_MESSAGES({ id, token: localStorage.getItem("token") })
        if(response){
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        if(data?.data?.statusCode == 200){
            messages.value = data.data.messages ?? []
            setTimeout(()=>{
                scrollToLatesMessage()
            },200)
        }

    }catch(error){
        throw new Error(error)
    }
    finally{
        loading.value = false
    }
}

watch(()=>route.params.id,()=>{
    console.log("route changed");
    preDate.value = ""
    getMessages(route.params.id)
},{deep:true,immediate:true})

const getLastMessage = computed(() => messages.length ? messages[messages.length - 1] : null)

const addMessage = (message)=>{
    messages.value.push(message)
    setTimeout(()=>{
        scrollToLatesMessage()
    },200)
}

const toggleViewProfile = ()=>{
    messageLayout.value?.classList.toggle('full-message-layout');
    friendViewLayout.value?.classList.toggle('hidden-view-layout');
    friendViewLayout.value?.classList.toggle('friend-view-layout');
}

onMounted(()=>{
    store.setAddMessage(addMessage)
})

const scrollToLatesMessage = () => {
    if(messages.value?.length)
        viewLates.value.scrollIntoView({ behavior: "smooth" })
}

const prepareDate = (date) => {
    let currentDate = new Date(date).toDateString()
    return currentDate
}

const checkDate = (date) => {
    let dateString = new Date(date).toDateString()
    if (!preDate.value) {
        preDate.value = dateString
        return true
    }
    if (preDate.value == dateString) return false
    preDate.value = dateString
    return true
}

const addToast = (message,severity)=>{
    toast.add({
        summary : "KHMER CHAT",
        detail : message,
        life : 5000,
        severity
    })
}


</script>