<template>
    <div class="dashboard-layout shadow-1">
        <Datatable :value="users" v-model:expandedRows="expandedRows">
            <Column expander style="width: 5rem" />
            <Column field="_id" header="ID" />
            <Column field="username" header="Username" />
            <Column field="email" header="Email" />
            <template #expansion="{ data }">
                <Datatable :value="[data.information]">
                    <Column field="_id" header="ID" />
                    <Column field="name" header="Name" />
                    <Column field="phone" header="Phone" />
                    <Column field="isDeleted" header="Status" />
                    <Column field="role" header="Role" />
                    <Column header="Profile">
                        <template #body="{data}">
                            <img :src="data.profileImage" alt="" width="60" class="border-circle">
                        </template>
                    </Column>
                </Datatable>
            </template>
        </Datatable>
    </div>
</template>

<script setup>
import Datatable from "primevue/datatable"
import Column from "primevue/column"
import API from "../service";
import { onMounted, ref } from "vue";

const users = ref([])
const api = new API();

const expandedRows = ref([]);

onMounted(() => {
    getUser()
})

const getUser = async () => {
    try {
        const { data, response } = await api.GET_ALL_USER()
        if (response) {
            response.data?.data?.message && addToast(response.data.data.message, 'error')
            return
        }
        if (data) {
            console.log(data.data?.users);
            users.value = data.data?.users
        }

    } catch (error) {
        throw new Error(error)
    }
}


</script>