<template>
    <div>
        <MessageHeader />
    </div>
    <div class="flex flex-column justify-content-between" style="height: 90%;">
        <div class="overflow-y-auto">
            <!-- message contain -->
            <div class="w-10 lg:w-8 mx-auto flex flex-column gap-3">
                <template v-if="loading">
                    <MessageLoading />
                </template>
                <template v-else>
                    <template v-for="message in store.messages">
                        <span class="date-string" v-if="checkDate(message.createdAt)">
                            {{ prepareDate(message.createdAt) }}
                        </span>
                        <MessageCard :message="message" :selfId="store.user?.information?._id" />
                    </template>
                </template>
            </div>
            <div ref="viewLates"></div>
        </div>
        <div>
            <!-- send box -->
            <MessageSendBox />
        </div>
    </div>
</template>
<script setup>
import MessageHeader from './MessageHeader.vue';
import MessageSendBox from "./MessageSendBox.vue"
import MessageCard from './MessageCard.vue';
import MessageLoading from "./loading/MessageLoading.vue"
import { watchEffect, onMounted, ref } from 'vue';
import API from '../service';
import { useStore } from '../store';
import { useRoute } from "vue-router"
import { useToast } from 'primevue/usetoast';

const toast = useToast()
const api = new API();
const store = useStore()
const viewLates = ref(null)
const preDate = ref("")
const route = useRoute()
const loading = ref(false)

watchEffect(() => {
    store.messages
    if (viewLates.value)
        setTimeout(() => {
            viewLates.value.scrollIntoView({ behavior: "smooth" })
        }, 0)
})
watchEffect(async () => {
    const id = route.params.id;
    console.log("work");
    preDate.value = ""
    getMessages(id)
},{
    flush : "post"
})
onMounted(() => {
    store.setScrollToLatesMessage(scrollToLatesMessage)
})

const scrollToLatesMessage = () => viewLates.value.scrollIntoView({ behavior: "smooth" })
const getMessages = async(id)=>{
    try{
        loading.value = true
        const { response, data } = await api.GET_MESSAGES({ id, token: localStorage.getItem("token") })
        if(response){
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        if(data?.data?.statusCode == 200){
            console.log(data.data.messages);
            data.data.messages && store.setMessages(data.data.messages)
        }

    }catch(error){
        throw new Error(error)
    }
    finally{
        loading.value = false
    }
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