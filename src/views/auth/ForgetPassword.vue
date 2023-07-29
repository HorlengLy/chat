<template>
    <!-- email -->
    <div v-if="!isSentOtp" @keyup.enter="getOtpCode"
        class="form-container py-5 px-4 sm:px-6 lg:h-auto h-screen lg:mt-auto mt-0 lg:shadow-2 shadow-none flipright animation-duration-300">
        <div class="flex gap-3 align-items-center">
            <span>
                <i class="pi pi pi-check-circle" style="font-size: 1.5rem;color: green;"></i>
            </span>
            <span class="default-color text-2xl">
                Recover password
            </span>
        </div>
        <span class="input-cover mt-5 flex ">
            <input type="text" id="confirm-password" autocomplete="OFF" required v-model="emailVerify" class="my-input"
                :class="{ 'border-error': email$.emailVerify.$error }" />
            <label for="confirm-password" :class="email$.emailVerify.$error ? 'color-error' : 'default-color'">
                Your email address
            </label>
            <p v-if="email$.emailVerify.$error" class="error-message color-error">
                {{ email$.emailVerify.$errors[0].$message }}
            </p>
            
        </span>
        <div class="mt-5 flex align-items-center justify-content-end gap-2 w-full">
            <Button label="Back" @click="backToLogin" class="button-no-shadow small-button my-button-label" severity="danger" text
                :disabled="loading" />
            <Button label="Continue" class="my-button button-no-shadow small-button" @click="getOtpCode"
                :loading="loading" />
        </div>
    </div>

    <!-- opt -->

    <div v-else
        class="form-container py-5 px-4 sm:px-6 lg:h-auto h-screen lg:mt-auto mt-0 lg:shadow-2 shadow-none flipright animation-duration-300">
        <div class="flex gap-3 align-items-center">
            <span>
                <i class="pi pi pi-check-circle" style="font-size: 1.5rem;color: green;"></i>
            </span>
            <span class="default-color text-2xl">
                Verify email
            </span>
        </div>
        <span class="input-cover mt-5 flex ">
            <input type="text" id="otp" autocomplete="OFF" required v-model="otp" class="my-input" @keyup.enter="verifyOtp"
                :class="{ 'border-error': otp$.otp.$error }" />
            <label for="otp" :class="otp$.otp.$error ? 'color-error' : 'default-color'">
                OTP Code
            </label>
            <p v-if="otp$.otp.$error" class="error-message color-error">
                {{ otp$.otp.$errors[0].$message }}
            </p>
        </span>
        <span class="inline-block w-full flex justify-content-end">
            <button class="text-button" @click="getOtpCode" :disabled="loading">
                send again
            </button>
        </span>
        <div class="mt-5 flex align-items-center gap-2" :class="!error?'justify-content-end':'justify-content-between'">
            <span class="flex gap-2 align-items-center">
                <Button label="Back" @click="back" class="button-no-shadow small-button my-button-label" severity="danger" text
                    :disabled="loading" />
                <Button label="Confirm" class="my-button button-no-shadow small-button" @click="verifyOtp"
                    :loading="loading" />
            </span>
        </div>
    </div>
</template>

<script setup>
import { email, minLength, maxLength, required, helpers } from "@vuelidate/validators"
import vueLidate from "@vuelidate/core"
import API from "../../service";
import Button from "primevue/button"
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useStore } from "../../store";

const toast = useToast()
const isSentOtp = ref(false)
const emailVerify = ref("")
const otp = ref("")
const error = ref(null)
const loading = ref(false)
const api = new API()
const router = useRouter()
const store = useStore()
const ruleEmail = computed(() => {
    return {
        emailVerify: {
            required: helpers.withMessage("email is required", required),
            emailVerify: helpers.withMessage("wrong email address", email)
        }
    }
})
const ruleOtp = computed(() => {
    return {
        otp: {
            required: helpers.withMessage("otp is required", required),
            minLength: helpers.withMessage("Opt must be at least 4 digits", minLength(4)),
            maxLength: helpers.withMessage("Opt must be less than 6 digits", maxLength(6))
        }
    }
})

const email$ = vueLidate(ruleEmail, { emailVerify })
const otp$ = vueLidate(ruleOtp, { otp })

const verifyOtp = async () => {
    const re = await otp$.value.$validate()
    if (!re)
        return
    try {
        loading.value = true
        const { data, response } = await api.CHECK_OTP({
            email: emailVerify.value,
            otp: otp.value
        })
        if (response){
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        if (data?.data?.statusCode == 200){
            store.email = emailVerify.value
            router.push({name : "CHANGE_PASSWORD"})
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        loading.value = false
    }
}
const getOtpCode = async () => {
    const re = await email$.value.$validate()
    if (!re)
        return
    try {
        loading.value = true
        const { data, response } = await api.CHECK_EMAIL(emailVerify.value )
        if(data){
            data.data?.message && addToast(data.data.message,'error')
            return
        }
        if(response){
            const getOTP = await api.GET_OTP(emailVerify.value)
            if(getOTP?.response){
                getOTP.response.data?.data?.message && addToast(getOTP.response.data.data.message,'error')
                return
            }
            if(getOTP.data?.data?.statusCode == 201){
                isSentOtp.value = true
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    finally {
        loading.value = false
    }
}

const backToLogin = ()=> router.push({name : "LOGIN"})
const back = ()=>isSentOtp.value = false


const addToast = (ms, severity) => {
  toast.add({
    summary: "KHMER-CHAT",
    detail: ms,
    life: 5000,
    severity
  })
}


</script>