<template>
    <div @keyup.enter="savePassword" class="form-container py-5 px-4 sm:px-6 lg:h-auto h-screen lg:mt-auto mt-0 lg:shadow-2 shadow-none flipright animation-duration-300">
        <span class="flex gap-3 align-items-center">
            <span>
                <i class="pi pi pi-check-circle" style="font-size: 1.5rem;color: green;"></i>
            </span>
            <span class="default-color text-2xl">
                Add Password
            </span>
        </span>
        <span class="input-cover mt-5">
            <input type="password" id="new-password" class="my-input" required v-model="state.password" :class="{ 'border-error': $v.password.$error }"/>
            <label for="new-password" :class="$v.password.$error ? 'color-error' : 'default-color'">
                New password
            </label>
            <p v-if="$v.password.$error" class="error-message color-error">
                {{ $v.password.$errors[0].$message }}
            </p>
        </span>
        <span class="input-cover mt-5">
            <input type="password" id="confirm-password" class="my-input" required v-model="state.confirmPassword" :class="{ 'border-error': $v.confirmPassword.$error }" />
            <label for="confirm-password" :class="$v.confirmPassword.$error ? 'color-error' : 'default-color'">
                Confirm password
            </label>
            <p v-if="$v.confirmPassword.$error" class="error-message color-error">
                {{ $v.confirmPassword.$errors[0].$message }}
            </p>
        </span>
        <div class="mt-5 flex align-items-center gap-2 justify-content-end">
            <Button label="Back" @click="back" class="button-no-shadow small-button my-button-label" severity="danger" text
                :disabled="loading" />
            <Button label="save" class="my-button button-no-shadow small-button" @click="savePassword"
                :loading="loading" />
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted,reactive,ref } from 'vue';
import API from '../service';
import { useRouter  } from 'vue-router';
import { helpers, minLength,required,sameAs } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useStore } from "../store";

const router = useRouter();
const api = new API();
const loading = ref(false)
const store = useStore()
const toast = useToast()
const state = reactive({
    password : "",
    confirmPassword : ""
})

const rule = computed(()=>({
    password : {
        required : helpers.withMessage('passwword are required',required),
        minLength : helpers.withMessage('password must be at least than 6 digits',minLength(6))
    },
    confirmPassword :{
        required : helpers.withMessage('confirm passwword are required',required),
        sameAs : helpers.withMessage("your password does't math yet!",sameAs(state.password))
    }
}))

const $v = useVuelidate(rule,state)

const savePassword = async ()=>{
    const re = await $v.value.$validate()
    if(!re) return
    if(!store.email) {
        addToast("system error",'error')
        return router.push({name:"LOGIN"})
    }
    try{
        loading.value = true;
        const {data,response} = await api.SET_NEW_PASSWORD({email:store.email,password:state.password})
        if(response){
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        data?.data?.message && addToast(data.data.message,'success')
        localStorage.clear("token")
        router.push({name : "LOGIN"})
    }
    catch(error){
        console.log({error});
    }
    finally{
        loading.value = false;
    }
}

const back = ()=>router.back()

const addToast = (ms, severity) => {
  toast.add({
    summary: "KHMER-CHAT",
    detail: ms,
    life: 5000,
    severity
  })
}

</script>