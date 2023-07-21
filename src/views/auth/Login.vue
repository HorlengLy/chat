<template>
    <div class="form-container py-5 px-4 sm:px-6 lg:h-auto h-screen lg:mt-auto mt-0 lg:shadow-2 shadow-none flipleft animation-duration-300" @keyup.enter="login">
        <h1 class="title">Sign In</h1>
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
            <input type="password" id="password" autocomplete="OFF" required v-model="state.password"  class="my-input" :class="{'border-error':v$.password.$error}"/>
            <label for="password" :class="v$.password.$error?'color-error':'default-color'">
                Password
            </label>
            <p v-if="v$.password.$error" class="err-message color-error">
                {{ v$.password.$errors[0].$message }}
            </p>
        </div>
        <div class="checkbox mt-4">
            <span class="check">
                <Checkbox  name="checkbox"/>
                <span class="remember">
                    Remember me
                    <!-- {{ state.checked }} -->
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
        <div class="socia-media">
            <span class="facebook">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0     0 512 512">
                    <path
                        d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                </svg>
            </span>
            <span class="google">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                    <path
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>
            </span>
        </div>
        <p class="link-system">
            <span>
                Don't have account yet ? 
            </span>
            <router-link to="/signup" class="underline-hover color-link">
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

const toast = useToast()
const store = useStore()
const api = new API()
const router = useRouter()
const state = reactive({
    string: "",
    password: "",
    checked : true
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
    // validate
    const re = await v$.value.$validate()
    if (!re) return
    try {
        // loading start
        loading.value = true
        const { response, data } = await api.Login(state)
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        data.data?.message && addToast(data.data.message,'success')
        const {token} = data.data
        localStorage.setItem('token', token)
        store.setUser(data.data.user)
        router.push({name : "HOME"})
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


</script>

<style scoped>
input {
    width: 100%;

}
</style>

