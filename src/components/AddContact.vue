<template>
    <Dialog modal v-model:visible="viewDialog" class="add-contact">
        <template #header>
            <div class="py-3 px-5 flex justify-content-between align-items-center bg-white w-full">
                <h1 class="text-xl lg:text-2xl">Add Contact</h1>
            </div>
        </template>
        <template #default>
            <div class="px-5 py-3">
                <div class="flex sm:flex-row flex-column align-items-center md:gap-5 gap-2">
                    <span class="">
                        <span class="image-cover overflow-hidden">
                            <img src="https://cdn.pixabay.com/photo/2016/08/29/11/55/emoticon-1628080_640.png" alt="" class="w-full h-auto">
                        </span>
                    </span>
                    <div class="w-full">
                        <span class="input-cover">
                            <input v-model="searchText" class="my-input" :class="{'border-error':val.searchText.$error}" @keyup.enter="hadleSearch"
                            type="text" id="email" required autocomplete="OFF" :spellcheck="false"/>
                            <label for="email" :class="val.searchText.$error?'color-error border-error':''">
                                Username or email
                            </label>
                            <p v-if="val.searchText.$error" class="error-message">
                                {{ val.searchText.$errors[0].$message }}
                            </p>
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex align-items-center gap-2 justify-content-end py-3 px-4 bg-white">
                <Button label="Close" severity="danger" class="button-custom button-outline-none" @click="toggleAddContact" outlined :disabled="loading"/>
                <Button label="Add" class="button-custom button-outline-none bg-base" @click="hadleSearch" :loading="loading"/>
            </div>
        </template>
    </Dialog>
</template>


<script setup>
import Dialog from "primevue/dialog"
import { computed, onMounted } from "vue";
import Button from "primevue/button"
import { ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required,helpers } from "@vuelidate/validators";
import API from "../service";
import { useToast } from "primevue/usetoast";
import { useStore } from "../store";
import { useRouter } from "vue-router";

const store = useStore()
const viewDialog = ref(false);
const toast = useToast()
onMounted(()=>viewDialog.value = props.isView)
const props = defineProps({
    isView:{
        type : Boolean ,
        required : true
    },
    toggleAddContact : {
        type : Function ,
        required : true
    }
})
const router = useRouter()
const api = new API()
const searchText = ref("")
const loading = ref(false)
const rule = computed(()=>({
    searchText : {
        required : helpers.withMessage('search field required an username or email address',required)
    }
}))
const val = useVuelidate(rule,{searchText})

const hadleSearch =async()=>{
    const re = await val.value.$validate()
    if(!re) return
    if(searchText.value == store.user.username || searchText.value == store.user.email) {
        addToast('Are you crazy?. you type your account now','error')
        return
    }
    try{
        loading.value = true
        const {data,response} = await api.SEARCH_USER(searchText.value)
        if(response){
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        if(data){
            let id = data.data?.user?.information._id
            if(!id) return addToast('something is wrong','error')
            const checkroom = checkFriend(id,store.user.information._id)
            if(checkroom){
                router.push({name:"MESSAGE_BOX",params:{id:checkroom._id}})
                props.toggleAddContact()
                store.toggleLayout()
                return
            }
            const room = await api.CREATE_ROOM(id)
            if(room.response){
                room.response.data?.data?.message && addToast(room.response.data.data.message)
                return
            }
            if(room.data?.data?.room){
                let roomId = room.data.data.room._id
                if(!roomId) return addToast('something is wrong','error')
                room.data.data?.message && addToast(room.data.data.message,'success')
                store.addFriends(room.data.data.getInfo,room.data.data.room)
                router.push({name:"MESSAGE_BOX",params:{id:roomId}})
                props.toggleAddContact()
                store.toggleLayout()
            }
        }
    }catch(error){
        throw new Error(error)
    }
    finally{
        loading.value = false
    }
}
const addToast = (message, severity) => {
    toast.add({
        summary: "KHMER CHAT",
        detail: message,
        life: 5000,
        severity
    })
}
const checkFriend = (userId,authId)=>{
    let data = null
    store.rooms?.forEach(room=>{
        if(room.members[0]._id == userId && room.members[1]._id == authId){
            data = room
            return
        }
        if(room.members[1]._id == userId && room.members[0]._id == authId){
            data = room
            return
        }
    })
    return data
}


</script>



<style>

.add-contact .p-dialog-header-icons .p-dialog-header-icon{
    display: none;
}
.add-contact {
    border-radius: 20px !important;
    overflow: hidden;
    width: 600px !important;
    background-color: #F3F8FC;
}
.add-contact .p-dialog-header,.add-contact .p-dialog-footer ,.add-contact .p-dialog-content {
    padding: 0 !important;
}
@media only screen and (max-width: 500px){
    .add-contact {
        width: 90% !important;
    }
}
.image-cover {
    display: flex;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
}
.image-cover img {
    transform: scale(1.5);
}
</style>