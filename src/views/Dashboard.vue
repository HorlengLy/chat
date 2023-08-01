<template>
    <div class="dashboard-layout shadow-1">
        <div class="flex justify-content-between">
            <Button 
                label="Back"
                icon="pi pi-arrow-left" 
                severity="danger" 
                class="back-button small-button my-button-label button-no-shadow mb-4"
                @click="back" />
            <h1 class="text-blue-600 text-lg">
                Dashboard
            </h1>
        </div>
        <Datatable :value="users" v-model:expandedRows="expandedRows" lazy :loading="loading" style="min-width: 1000px;">
            <Column expander style="width: 5rem" />
            <Column header="No">
                <template #body="{ index }">
                    {{ index + 1 }}
                </template>
            </Column>
            <Column field="username" header="Username" />
            <Column field="email" header="Email" />
            <Column header="Created At">
                <template #body="{ data }">
                    {{ data.createdAt && new Date(data.createdAt).toLocaleString() }}
                </template>
            </Column>
            <template #expansion="{ data }">
                <UserInformation :data="data" :addToast="addToast" :users="users"/>
            </template>
        </Datatable>
    </div>
</template>

<script setup>
import Datatable from "primevue/datatable"
import UserInformation from "../components/UserInformation.vue";
import Button from "primevue/button"
import Column from "primevue/column"
import API from "../service";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

const toast = useToast()
const users = ref([])
const api = new API();
const loading = ref(false)
const expandedRows = ref([]);
const router = useRouter()

onMounted(() => {
    getUser()
})

const back = () => {
    router.push({ name: "HOME" })
}



const getUser = async () => {
    try {
        loading.value = true
        const { data, response } = await api.GET_ALL_USER()
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message, 'error')
            return
        }
        if (data) {
            users.value = data.data?.users
        }

    } catch (error) {
        throw new Error(error)
    }
    finally {
        loading.value = false
    }
}
const addToast = (ms, severity) => {
    toast.add({
        summary: "KHMER CHAT",
        detail: ms,
        life: 5000,
        severity
    })
}

</script>