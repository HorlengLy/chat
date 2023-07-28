<template>
    <div class="form-container sm:px-5 px-3 py-5 shadow-2 mt-0 flipleft animation-duration-300" @keyup.enter="login">
        <h1 class="title mt-3">Sign In</h1>
        <div class="input-cover mt-5">
            <input type="text" id="email" autocomplete="OFF" required v-model="state.string" class="my-input"  :class="{'border-error':v$.string.$error}"/>
            <label for="email" :class="v$.string.$error?'color-error':'default-color'">
                Email or username
            </label>
            <p v-if="v$.string.$error" class="err-message color-error">
                {{ v$.string.$errors[0].$message }}
            </p>
        </div>
        <div class="input-cover mt-4">
            <input ref="passInput" type="password" id="password" autocomplete="OFF" required v-model="state.password"  class="my-input" :class="{'border-error':v$.password.$error}"/>
            <label for="password" :class="v$.password.$error?'color-error':'default-color'">
                Password
            </label>
            <p v-if="v$.password.$error" class="err-message color-error">
                {{ v$.password.$errors[0].$message }}
            </p>
        </div>
        <div class="checkbox mt-4">
            <span class="check">
                <Checkbox :value="true" v-model="state.checked" @change="togglePassword" class="show-password"/>
                <span class="remember">
                    show password
                </span>
            </span>
            <router-link :to="{name:'RECOVER_PASSWORD'}" class="underline-hover no-underline color-link">
                forget password
            </router-link>
        </div>
        <div class="button-cover">
            <Button class="my-button button-no-shadow w-full mt-4" label="Login" @click="login" :loading="loading"/>
        </div>
        <div class="border">
            <span>Or</span>
        </div>
        <p class="link-system">
            <span>
                Don't have account yet ? 
            </span>
            <router-link :to="{name:'SIGNUP'}" class="underline-hover color-link">
                Create free
            </router-link>
        </p>
    </div>
</template>
<script setup>

import { reactive, computed } from "vue"
import Checkbox from "primevue/checkbox"
import Button from "primevue/button"
import vueLidate from "@vuelidate/core"
import API from "../../service"
import { minLength, required, helpers } from "@vuelidate/validators"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "../../store"
import { useToast } from "primevue/usetoast"

const passInput = ref(null)
const toast = useToast()
const store = useStore()
const api = new API()
const router = useRouter()
const state = reactive({
    string: "",
    password: "",
    checked : null
})
const loading = ref(false)
const rule = computed(() => {
    return {
        string: {
            required: helpers.withMessage("email or username is required", required),
            minLength : helpers.withMessage("this field must  be a least than 6 digits",minLength(6))
        },
        password: {
            required: helpers.withMessage("password is required", required)
        }
    }
})

const v$ = vueLidate(rule, state)
const login = async () => {
    const re = await v$.value.$validate()
    if (!re) return
    try {
        loading.value = true
        const { response, data } = await api.Login(state)
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        if(data?.data?.statusCode == 200){
            data.data.message && addToast(data.data.message,'success')
            const {user,token} = data.data
            token && localStorage.setItem('token', token)
            user.information?._id && store.socketConected(user.information._id)
            user && store.setUser(user)
            router.push({name : "HOME"})
        }
    } catch (err) {
        throw new Error(err)
    }
    finally {
        // end loading
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

const togglePassword = ()=>{
    passInput.value.type = state.checked[0] ? "text":'password'
}

</script>

<style scoped>
input {
    width: 100%;

}
</style>

