<template>
    <span class="w-10 mx-auto mt-5 text-base text-gray-800 font-semibold flex align-items-center gap-2">
        <i class="pi pi-lock"></i>
        Account Setting
    </span>
    <hr class="mt-1 w-10 mx-auto border-gray-300">
    <template v-if="!isChangeEmail">
        <div class="flex justify-content-center mt-4">
            <span class="input-cover w-11">
                <input type="text" class="my-input" required v-model="userEmail" autocomplete="off"
                    :class="$email.userEmail.$error ? 'border-error' : ''" :spellcheck="false">
                <label for="text" :class="{ 'color-error': $email.userEmail.$error }">
                    Email
                </label>
                <span class="action-button" v-if="disabledButtonEmail">
                    <Button icon="pi pi-times" severity="danger"  @click="resetEmail"  :disabled="loading"/>
                    <Button icon="pi pi-check"  severity="success" @click="verifyEmail" :loading="loading"/>
                </span>
                <span class="edit-icon" v-else>
                    <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
                </span>
                <p v-if="$email.userEmail.$error" class="message-error">
                    {{ $email.userEmail.$errors[0].$message }}
                </p>
            </span>
        </div>
        <div class="mt-4 flex justify-content-center">
            <span class="input-cover w-11">
                <input type="text" class="my-input" id="username" required v-model="username" autocomplete="off"
                    @input="enableButton" :class="$username.username.$error ? 'border-error' : ''"
                    :spellcheck="false">
                <label for="username" :class="{ 'color-error': $username.username.$error }">
                    Username
                </label>
                <span class="action-button" v-if="disabledButtonUsername">
                    <Button icon="pi pi-times" severity="danger" @click="resetUsername" :disabled="loading"/>
                    <Button icon="pi pi-check"  severity="success" @click="changeUsername" :loading="loading"/>
                </span>
                <span class="edit-icon" v-else>
                    <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
                </span>
                <p v-if="$username.username.$error" class="message-error">
                    {{ $username.username.$errors[0].$message }}
                </p>
            </span>
        </div>
        <div class="flex justify-content-center mt-4">
            <span class="input-cover w-11">
                <input type="password" class="my-input" required v-model="state.password" id="password"
                    :class="$password.password.$error ? 'border-error' : ''" :spellcheck="false">
                <label for="password" :class="{ 'color-error': $password.password.$error }">
                    Password
                </label>
                <span class="edit-icon">
                    <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
                </span>
                <p v-if="$password.password.$error" class="message-error">
                    {{ $password.password.$errors[0].$message }}
                </p>
            </span>
        </div>
        <template v-if="state.password">
            <div class="flex justify-content-center mt-4">
                <span class="input-cover w-11">
                    <input type="password" class="my-input" id="confirm-password" required
                        v-model="state.confirmPassword"
                        :class="$password.confirmPassword.$error ? 'border-error' : ''" :spellcheck="false">
                    <label for="confirm-password" :class="{ 'color-error': $password.confirmPassword.$error }">
                        Confirm Password
                    </label>
                    <span class="edit-icon">
                        <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
                    </span>
                    <p v-if="$password.confirmPassword.$error" class="message-error">
                        {{ $password.confirmPassword.$errors[0].$message }}
                    </p>
                </span>
            </div>
            <span class="flex justify-content-end w-10 pt-4 mx-auto">
                <Button label="change password" class="button-no-shadow btn-chnage bg-base" @click="changePassword" :disabled="$password.$error" :loading="loading"/>
            </span>
        </template>
    </template>
    <div class="otp-verify flex flex-column align-items-center justify-content-center mt-4" v-else>
        <span class="input-cover w-10">
            <input type="text" class="my-input" v-model="otp" required id="otp"
                :class="$otp.$error ? 'border-error' : ''" :spellcheck="false">
            <label for="otp" :class="{ 'color-error': $otp.otp.$error }">
                OTP
            </label>
            <span class="edit-icon">
                <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
            </span>
            <p v-if="$otp.otp.$error" class="message-error">
                {{ $otp.otp.$errors[0].$message }}
            </p>
        </span>
        <p class="text-xs mt-4 text-gray-700 w-10 mx-auto" style="text-indent: 20px;">
            Please check your email for get otp code to sign and make sure this email is your email right.
        </p>
    </div>

    <div class="mt-5 flex justify-content-end gap-2 w-10 mx-auto">
        <template v-if="isChangeEmail">
            <Button label="Cancel" class="my-btn button-no-shadow" severity="danger" outlined @click="() => isChangeEmail = false" />
            <Button label="Save" class="my-btn button-no-shadow bg-base" :disabled="$otp.$error || loading" :loading="loading" @click="changeEmail" />
        </template>
    </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers, minLength, maxLength, sameAs } from "@vuelidate/validators";
import Button from 'primevue/button';
import { useStore } from "../store";
import API from "../service";
import UPDATE_API from "../service/updateProfile";
import { useToast } from "primevue/usetoast"

const api = new API();
const updateAPI = new UPDATE_API()
const store = useStore()
const toast = useToast()
const state = reactive({
    password: "",
    confirmPassword: ""
})
const userEmail = ref("")
const username = ref("")
const otp = ref("")
const loading = ref(false)
const isChangeEmail = ref(false)
onMounted(() => {
    if (!store.user) return
    userEmail.value = store.user.email ? store.user.email : "";
    username.value = store.user.username ? store.user.username : "";
})

const rule = computed(() => ({
    password: {
        required: helpers.withMessage("password is required", required),
        minLength: helpers.withMessage("password must be at lease 6 digits", minLength(6))
    },
    confirmPassword: {
        sameAs: helpers.withMessage("your password not match  match", sameAs(state.password))
    }
}))
const emailRule = computed(() => ({
    userEmail: {
        required: helpers.withMessage("email is required", required),
        email: helpers.withMessage("email is not correct", email)
    },
}))
const otpRule = computed(() => ({
    otp: {
        required: helpers.withMessage("otp is required", required),
        minLength: helpers.withMessage("otp must be at least than 4 digits", minLength(4)),
        maxLength: helpers.withMessage("otp must be at less than 6 digits", maxLength(6)),
    }
}))
const usernameRule = computed(() => (
    {
        username: {
            required: helpers.withMessage("username is required", required),
            minLength: helpers.withMessage("username must be at least 6 digits", minLength(6))
        }
    }
))

const $password = useVuelidate(rule, state)
const $email = useVuelidate(emailRule, { userEmail })
const $username = useVuelidate(usernameRule, {username})
const $otp = useVuelidate(otpRule, { otp })

const changePassword = async() => {
    const re = await $password.value.$validate()
    if(!re) return
    try{
        loading.value = true
        const {data,response} = await updateAPI.CHNAGE_PASSWORD(state.password,state.confirmPassword)
        if(response){
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        if(data){
            data.data?.message && addToast(data.data.message,'success')	
            state.password = ""
            state.confirmPassword = ""
            $password.value.$reset()
        }
    }catch(error){
        throw new Error(error)
    }
    finally{
        loading.value = false
    }
}
const changeUsername = async() => {
    const re = await $username.value.$validate()
    if(!re) return
    try{
        loading.value = true
        const checkUsername = await api.CHECK_USERNAME(username.value);
        if(checkUsername?.response){
            const {message} = checkUsername.response.data?.data
            message && addToast(message,'error')
            return
        }
        const {data,response} = await updateAPI.CHNAGE_USERNAME(username.value)
        if(response){
            const {message} = response.data?.data
            message && addToast(message,'error')
            return
        }
        const {message,token} = data?.data
        store.user.username = username.value
        token && localStorage.setItem('token',token)
        message && addToast(message,'success')
    }catch(error){
        console.log({error});
        throw new Error(error)
    }
    finally{
        loading.value = false
    }
}
const verifyEmail = async() => {
    const re = await $email.value.$validate()
    if(!re) return
    try{
        loading.value = true
        const checkEmail = await api.CHECK_EMAIL(userEmail.value)
        if(checkEmail.response){
            const {message} = checkEmail.response?.data?.data
            message && addToast(message,'error')
            return
        }
        const {data,response} = await api.GET_OTP(userEmail.value)
        if(response){
            const {message} = response.data?.data
            message && addToast(message,'error')
            return
        }
        const {message} = data?.data
        message && addToast(message,'success')
        isChangeEmail.value = true
    }catch(error){
        throw new Error(error)
    }
    finally{
        loading.value = false
    }
}
const changeEmail = async()=>{
    const re = await $otp.value.$validate()
    if(!re) return
    try{
        loading.value = true
        const verifyOtp = await api.VERIFY_OTP({otp:otp.value , email : userEmail.value})
        if(verifyOtp?.response){
            verifyOtp.response.data?.data?.message && addToast(verifyOtp.response.data.data.message,'error')
            return
        }
        const {data,response} = await updateAPI.CHNAGE_EMAIL(userEmail.value)
        if(response){
            response.data?.data?.message && addToast(response.data.data.message,'success')
            return
        }
        if(data?.data){
            const {message,token,user} = data.data
            token && localStorage.setItem('token',token)
            if(user){
                user.information = store.user.information
                store.setUser(user)
            }
            message && addToast(message, 'success')
            otp.value = ""
            isChangeEmail.value = false
        }

    }
    catch(error){
        throw new Error(error)
    }
    finally{
        loading.value = false
    }
}



const disabledButtonEmail = computed(()=> store.user?.email != userEmail.value)
const disabledButtonUsername = computed(()=> store.user?.username != username.value)
const resetUsername = ()=> username.value = store.user?.username
const resetEmail = ()=> userEmail.value = store.user?.email


const addToast = (message, severity) => {
    toast.add({
        summary: "KHMER CHAT",
        detail: message,
        life: 5000,
        severity
    })
}

</script>
