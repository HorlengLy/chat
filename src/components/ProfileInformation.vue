<template>
    <div class="mt-3 flex justify-content-center">
        <span class="relative w-10">
            <input type="text" class="input-custom-profile" id="name" required v-model="state.name" 
            @input="enableButton"  autocomplete="off"
                :class="validate.name.$error ? 'border-red placeholder-error ' : ''" :spellcheck="false">
            <label for="name" :class="{ 'color-error': validate.name.$error }">
                Name
            </label>
            <span class="edit-icon">
                <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
            </span>
            <p v-if="validate.name.$error" class="message-error">
                {{ validate.name.$errors[0].$message }}
            </p>
        </span>
    </div>
    <div class="mt-3 flex justify-content-center">
        <span class="relative w-10">
            <input type="text" class="input-custom-profile" id="bio" 
            required v-model="state.bio" @input="enableButton" autocomplete="off"
                :class="validate.bio.$error ? 'border-red placeholder-error ' : ''" :spellcheck="false">
            <label for="bio" :class="{ 'color-error': validate.bio.$error }">
                Bio
            </label>
            <span class="edit-icon">
                <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
            </span>
            <p v-if="validate.bio.$error" class="message-error">
                {{ validate.bio.$errors[0].$message }}
            </p>
        </span>
    </div>
    <div class="mt-3 flex justify-content-center">
        <span class="relative w-10">
            <input type="number" class="input-custom-profile" id="phone" 
            required v-model="state.phone" @input="enableButton"  autocomplete="off"
                :class="validate.phone.$error ? 'border-red placeholder-error ' : ''">
            <label for="phone" :class="{ 'color-error': validate.phone.$error }">
                Phone
            </label>
            <span class="edit-icon">
                <i class="pi pi-pencil" style="font-size: 12px;opacity:.7;"></i>
            </span>
            <p v-if="validate.phone.$error" class="message-error">
                {{ validate.phone.$errors[0].$message }}
            </p>
        </span>
    </div>
    <div class="mt-5 flex justify-content-end w-10 mx-auto">
        <Button label="Save" class="my-btn button-no-shadow" :disabled="validate.$error || disabledButton"
            @click="changeInformation" />
    </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import Button from 'primevue/button';
import { required, helpers, minLength } from "@vuelidate/validators";
import { useStore } from "../store";
import updateAPI from "../service/updateProfile";
import { useToast } from "primevue/usetoast";


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
const disabledButton = ref(true)
const error = ref(null)
const loading = ref(false)
const changeInformation = async () => {
    const re = await validate.value.$validate()
    if (!re) return
    try {
        loading.value = true
        const { data, response } = await api.CHANGE_INFOMATION(state)
        console.log({data,response});
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
const enableButton = () => {
    disabledButton.value = false
}

</script>