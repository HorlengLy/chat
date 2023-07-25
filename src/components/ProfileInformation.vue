<template>
    <span class="w-11 mx-auto mt-5 text-gray-800 text-base font-semibold flex align-items-center gap-2">
        <i class="pi pi-user-edit text-xl"></i>
        Informations
    </span>
    <hr class="mt-1 w-11 mx-auto border-gray-300">
    <div class="mt-4 px-3">
        <span class="input-cover">
            <input type="text" class="my-input font-hanuman" id="name" required v-model="state.name" @input="enableButton"
                autocomplete="off" :class="validate.name.$error ? 'border-error' : ''" :spellcheck="false">
            <label for="name" :class="{ 'color-error': validate.name.$error }">
                Name
            </label>
            <p v-if="validate.name.$error" class="message-error">
                {{ validate.name.$errors[0].$message }}
            </p>
        </span>
    </div>
    <div class=" mt-4 px-3">
        <span class="input-cover">
            <input type="number" class="my-input" id="phone" required v-model="state.phone"
                @input="enableButton" autocomplete="off"
                :class="validate.phone.$error ? 'border-error':''">
            <label for="phone" :class="{ 'color-error': validate.phone.$error }">
                Phone
            </label>
            <p v-if="validate.phone.$error" class="message-error">
                {{ validate.phone.$errors[0].$message }}
            </p>
        </span>
    </div>
    <div class="mt-3 flex justify-content-center">
        <span class="info-cover w-11">
            <Textarea id="descriptions" v-model="state.bio" :rows="1" class="detail-card" :spellcheck="false" style="border-radius: 10px;"
            required auto-resize :class="validate.bio.$error ? 'border-error' : ''"/>
            <label for="descriptions" :class="{ 'color-error': validate.bio.$error }">
                Descriptions
            </label>
            <p v-if="validate.bio.$error" class="message-error">
                {{ validate.bio.$errors[0].$message }}
            </p>
        </span>
    </div>
    <div class="mt-5 flex justify-content-end w-10 mx-auto">
        <Button label="Save" class="my-btn button-no-shadow bg-base" :disabled="!disabledButton || validate.$error"
            @click="changeInformation" :loading="loading" />
    </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import Button from 'primevue/button';
import { required, helpers } from "@vuelidate/validators";
import { useStore } from "../store";
import updateAPI from "../service/updateProfile";
import { useToast } from "primevue/usetoast";
import Textarea from "primevue/textarea";

const state = reactive({
    name: "",
    phone: "",
    bio: "",
})
const store = useStore()
const api = new updateAPI()
const toast = useToast()
onMounted(() => {
    if (!store.user) return
    if (!store.user.information) return
    state.bio = store.user.information.bio ? store.user.information.bio : "";
    state.name = store.user.information.name ? store.user.information.name : "";
    state.phone = store.user.information.phone ? store.user.information?.phone : "";
})
const rule = computed(() => (
    {
        name: {
            required: helpers.withMessage("name is required", required)
        },
        bio: {
            required: helpers.withMessage("bio is required", required)
        },
        phone: {
            required: helpers.withMessage("phone is required", required)
        }
    }
))
const validate = useVuelidate(rule, state)
const error = ref(null)
const loading = ref(false)
const changeInformation = async () => {
    const re = await validate.value.$validate()
    if (!re) return
    try {
        loading.value = true
        const { data, response } = await api.CHANGE_INFOMATION(state)
        if (response) {
            error.value = response.data?.data
            return
        }
        if (data.data) {
            const { token, user } = data.data
            token && localStorage.setItem('token', token)
            user && store.setUser(user)
            toast.add({
                life: 3000,
                detail: 'imformation was changed',
                summary: "Account Information",
                severity: 'success'
            })
        }
    } catch (e) {
        throw new Error(e)
    }
    finally {
        loading.value = false
    }
}
const disabledButton = computed(()=>{
    return (store.user?.information?.name != state.name || store.user?.information?.phone!= state.phone || store.user?.information?.bio != state.bio)
})

</script>