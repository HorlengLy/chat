<template>
    <div v-if="!optSent" @keyup.enter="verifyEmail"
        class="form-container py-5 px-4 sm:px-6 lg:h-auto h-screen lg:mt-auto mt-0 lg:shadow-2 shadow-none flipright animation-duration-300">
        <h1 class="title">Create Account</h1>
        <div class="input-cover mt-5">
            <input type="text" id="email" autocomplete="OFF" required v-model="state.email" class="my-input"
                :class="{ 'border-error': v$.email.$error }" />
            <label for="email" :class="v$.email.$error ? 'color-error' : 'default-color'">
                Email Addess
            </label>
            <p v-if="v$.email.$error" class="err-message color-error">
                {{ v$.email.$errors[0].$message }}
            </p>
        </div>
        <div class="input-cover mt-4">
            <input type="password" id="password" autocomplete="OFF" required v-model="state.newPassword" class="my-input"
                :class="{ 'border-error': v$.newPassword.$error }" />
            <label for="password" :class="v$.newPassword.$error ? 'color-error' : 'default-color'">
                Password
            </label>
            <p v-if="v$.newPassword.$error" class="err-message color-error">
                {{ v$.newPassword.$errors[0].$message }}
            </p>
        </div>
        <div class="input-cover mt-4">
            <input type="password" id="confirm-password" autocomplete="OFF" required v-model="state.confirmPassword"
                class="my-input" :class="{ 'border-error': v$.confirmPassword.$error }" />
            <label for="confirm-password" :class="v$.confirmPassword.$error ? 'color-error' : 'default-color'">
                Confirm password
            </label>
            <p v-if="v$.confirmPassword.$error" class="err-message color-error">
                {{ v$.confirmPassword.$errors[0].$message }}
            </p>
        </div>
        <div class="mt-3">
            <Button class="my-button button-no-shadow w-full mt-4" label="Let's, Create account" @click="verifyEmail" :loading="sendAgainLoading" />
        </div>
        <div class="border mt-4">
            <span>Or</span>
        </div>
        <p class="link-system">
            <span>
                Already have account ?
            </span>
            <router-link :to="{name:'LOGIN'}" class="underline-hover color-link">
                Login
            </router-link>
        </p>
    </div>
    <!-- otp -->
    <div v-else class="form-container py-5 px-4 sm:px-6 lg:h-auto h-screen lg:mt-auto mt-0 lg:shadow-2 shadow-none flipright animation-duration-300">
        <div class="flex gap-3 align-items-center">
            <span class="icon-verify">
                <i class="pi pi-verified"></i>
            </span>
            <h1 class="default-color text-xl">
                Verify email
            </h1>
        </div>
        <span class="input-cover mt-5 flex ">
            <input type="number" id="confirm-password" @keyup.enter="verifyOtp" autocomplete="OFF" required v-model="otp" class="my-input"
                :class="{ 'border-error': otp$.otp.$error }" />
            <label for="confirm-password" :class="otp$.otp.$error ? 'color-error' : 'default-color'">
                OTP Code
            </label>
            <p v-if="otp$.otp.$error" class="err-message color-error" style="left: 0;">
                {{ otp$.otp.$errors[0].$message }}
            </p>
        </span>
        <div class="flex justify-content-end">
            <Button @click="verifyEmail" label="send again" class="button-send-again button-no-shadow" text :loading="sendAgainLoading" :disabled="loading"/>
        </div>
        <div class="mt-5 flex align-items-center justify-content-end gap-2">
            <Button label="Back" class="button-no-shadow small-button" severity="danger" outlined :disabled="loading || sendAgainLoading"
                @click="back" />
            <Button label="Confirm" class="my-button button-no-shadow small-button" @click="verifyOtp"
                :loading="loading" :disabled="sendAgainLoading"/>
        </div>
    </div>
</template>
<script setup>
import { useToast } from "primevue/usetoast"
import { computed, reactive, ref } from "vue"
import Button from "primevue/button"
import vueLidate from "@vuelidate/core"
import API from "../../service"
import { email, required, minLength, helpers, sameAs, maxLength, numeric } from "@vuelidate/validators"
import { useRouter } from "vue-router"

const toast = useToast()
const api = new API()
const sendAgainLoading = ref(false)
const state = reactive({
    email: "",
    newPassword: "",
    confirmPassword: "",
    policy: true
})
const loading = ref(false)
const otp = ref("")

const rule = computed(() => (
    {
        email: {
            email: helpers.withMessage("Wrong email address", email),
            required: helpers.withMessage("email is required", required)
        },
        newPassword: {
            required: helpers.withMessage("password is required", required),
            minLength: helpers.withMessage("a password must be at least 6 digits", minLength(6))
        },
        confirmPassword: {
            required: helpers.withMessage("confirm password is required", required),
            sameAs: helpers.withMessage("your password does't match", sameAs(state.newPassword))
        },
    }
))

const ruleOtp = computed(() => (
    {
        otp: {
            required: helpers.withMessage("otp is required", required),
            minLength: helpers.withMessage("otp must be at least 4 digits", minLength(4)),
            maxLength: helpers.withMessage("otp must be less than 6 digits", maxLength(6)),
            numeric: helpers.withMessage("otp must be a number", numeric)
        }
    }
))

const v$ = vueLidate(rule, state)
const otp$ = vueLidate(ruleOtp, { otp })
const router = useRouter()
const optSent = ref(false)

const verifyEmail = async () => {
    const re = await v$.value.$validate()
    if (!re || !state.email) return addToast('data required','error')
    try {
        sendAgainLoading.value = true
        const { response, data } = await api.CHECK_EMAIL({ email: state.email })
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        const getOtp = await api.GET_OTP(state.email)
        if (getOtp?.response) {
            getOtp.response?.data?.data?.message && addToast(getOtp.response.data.data.message,'error')
            return 
        }
        if(getOtp?.data){
            getOtp.data.data?.message && addToast(getOtp.data.data.message,'success')
            optSent.value = true
        }
    }
    catch (e) {
        throw new Error(e)
    }
    finally {
        sendAgainLoading.value = false
    }

}
const verifyOtp = async () => {
    const re = await otp$.value.$validate()
    if (!re) return
    // 
    try {
        loading.value = true
        const { response, data } = await api.VERIFY_OTP({ otp: otp.value, email: state.email })
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message,'error')
            return
        }
        if(data.data?.statusCode == 200){
            const createAccount = await api.REGISTER({ email: state.email, password: state.newPassword })
            if (createAccount?.response) {
                createAccount.response?.data?.data?.message && addToast(createAccount.response.data.data.message,'error')
                return
            }
            if (createAccount?.data) {
                router.push({
                    name: "LOGIN",
                })
            }
        }
    }
    catch (e) {
        throw new Error(e)
    }
    finally {
        loading.value = false
    }
}


const addToast = (ms, severity) => {
  toast.add({
    summary: "KHMER-CHAT",
    detail: ms,
    life: 5000,
    severity
  })
}

const back = ()=>{
    optSent.value = false
}

</script>







<style scoped>

/* input {
    width: 100%;
} */
.icon-verify > i {
    font-size: 25px;
    color: #4CAA1D;
}
</style>