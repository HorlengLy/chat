<template>
    <div class="relative">
        <div class="cover-image bg-default overflow-hidden relative">
            <template v-if="state.profileCover">
                <img :src="state.profileCover" alt="" class="w-full h-full z-5">
            </template>
            <template v-if="state.isChnageCV">
                <span class="btn-close-change flex gap-1 align-items-center">
                    <Button icon="pi pi-times" class="my-btn-change btn-clost" severity="danger"  :disabled="state.loading" @click="clostProfileCover"/>
                    <Button icon="pi pi-check" class="my-btn-change btn-save" severity="success" :autofocus="true" :loading="state.loading"  @click="changeCover" />
                </span>
            </template>
            <template v-else>
                <label for="cover" class="cover-input cursor-pointer">
                    <input type="file" id="cover" hidden @change="setCoverImage">
                    <i class="pi pi-file-edit"></i>
                </label>
            </template>
        </div>
        <span class="relative inline-block left-50" style="width: fit-content;">
            <div class="w-8rem h-8rem border-circle overflow-hidden absolute left-50 bg-default"
                style="bottom: -50px;transform: translateX(-50%);">
                <template v-if="state.profileImage">
                    <img :src="state.profileImage" alt="" class="w-full h-full border-circle"
                        style="transform: scale(.8);">
                </template>
            </div>
            <span class="file-choose" :class="{ 'btn-save-close': state.isChangePF }">
                <template v-if="!state.isChangePF">
                    <label for="profile" class="cursor-pointer border-circle p-2 flex justify-content-center"
                        style="background-color: #d4dee7;">
                        <input type="file" id="profile" hidden @change="setProfileImage" />
                        <i class="pi pi-camera" style="font-size: 1rem;color: #4EB91F;"></i>
                    </label>
                </template>
                <template v-else>
                    <span class="flex gap-1 align-items-center">
                        <Button icon="pi pi-times" class="my-btn-change btn-clost" severity="danger" @click="clostProfileImage" :disabled="state.loading"/>
                        <Button icon="pi pi-check" class="my-btn-change btn-save" severity="success" :autofocus="true" @click="changeProfile" :loading="state.loading"/>
                    </span>
                </template>
            </span>
        </span>
    </div>
    <div class="mt-7 flex flex-column align-items-center">
        <span class="font-semibold text-xl text-blue-500" style="letter-spacing: 1px;">
            {{ store.user?.information?.name }}
        </span>
        <span class="font-hanuman w-10 mx-auto text-center mt-2 text-blue-400" style="font-size: 12px;">
            {{ store.user?.information?.bio }}
        </span>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from '../store';
import Button from 'primevue/button';
const store = useStore()
import API from '../service/updateProfile';
import { useToast } from 'primevue/usetoast';

const state = reactive({
    error: null,
    loading: false,
    profileImage: "",
    profileCover: "",
    isChangePF: false,
    isChnageCV: false
})

const api = new API()
const toast = useToast()
onMounted(() => {
    state.profileCover = store.user?.information?.profileCover
    state.profileImage = store.user?.information?.profileImage
})

const changeProfile = async () => {
    if (!state.profileImage) return;
    try {
        state.loading = true
        const {data,response} = await api.CHANGE_IMAGE({
            profileImage : state.profileImage,
            token : localStorage.getItem('token')
        })
        console.log({data,response} );
        if(response){
            if(response.data?.data){
                const {message} = response.data.data
                message && toast.add({
                    summary : "KHMER-CHAT",
                    detail : message,
                    severity : "error",
                })
            }
            return
        }
        if(data.data){
            const {token,user,message} = data.data
            user && store.setUser(user)
            token && localStorage.setItem('token', token)
            toast.add({
                summary : "KHMER-CHAT",
                detail : "profile image was changed",
                severity : "success",
                life : 5000
            })
            state.isChangePF = false
        }
    } catch (error) {
        throw new Error(error);
    }
    finally {
        state.loading = false;
    }
}

const changeCover = async () => {
    if (!state.profileCover) return;
    try {
        state.loading = true
        const {data,response} = await api.CHANGE_COVER({
            profileCover : state.profileCover,
            token : localStorage.getItem('token')
        })
        console.log({data,response} );
        if(response){
            if(response.data?.data){
                const {message} = response.data.data
                message && toast.add({
                    summary : "KHMER-CHAT",
                    detail : message,
                    severity : "error",
                })
            }
            return
        }
        if(data.data){
            const {token,user} = data.data
            user && store.setUser(user)
            token && localStorage.setItem('token', token)
            toast.add({
                summary : "KHMER-CHAT",
                detail : "profile image was changed",
                severity : "success",
                life : 5000
            })
            state.isChnageCV = false
        }
    } catch (error) {
        throw new Error(error);
    }
    finally {
        state.loading = false;
    }
}

const setProfileImage = (e) => {
    if (!e.target.files[0]) return
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        state.profileImage = reader.result
        state.isChangePF = true
    }
}
const setCoverImage = (e) => {
    if (!e.target.files[0]) return
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onload = () => {
        state.profileCover = reader.result
        state.isChnageCV = true
    }
}
const clostProfileCover = ()=>{
    state.isChnageCV = false
    state.profileCover = store.user?.information.profileCover
}
const clostProfileImage = ()=>{
    state.isChangePF = false
    state.profileImage = store.user?.information.profileImage
}
</script>

<style scoped>
.cover-image {
    min-height: 150px;
    width: 100%;
    border-radius: 10px 10px 0 0;
}

.input-custom {
    padding: 7px;
    border: none;
    border-bottom: 1px solid #009fff;
    outline: none;
    letter-spacing: .6px;
    width: 100%;
}

.input-custom:disabled {
    background: none;
}

.card:hover {
    background: #F5F7F7;
}

.file-choose {
    position: absolute;
    right: -65px;
}

.btn-save-close {
    right: -120px !important;
}

.cover-input {
    position: absolute;
    right: 20px;
    color: #009fff;
    bottom: 20px;
    width: 40px;
    height: 40px;
    background-color: #4EB91F;
    border-radius: 50%;
    background-color: #d4dee7;
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn-close-change {
    position: absolute;
    right: 20px;
    top: 10px;
}
</style>