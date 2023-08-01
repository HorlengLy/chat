<template>
    <div class="shadow-2 p-5 border-round-lg">
        <DataTable :value="[data.information]">
            <Column field="name" header="Name" />
            <Column field="phone" header="Phone" />
            <Column header="Status">
                <template #body="{ data }">
                    <Button :icon="data.isDeleted ? 'pi pi-times' : 'pi pi-check'"
                        :severity="!data.isDeleted ? 'success' : 'danger'" class="button-status" rounded
                        @click="() => changeStatus(data._id, !data.isDeleted)" :disabled="loading || isSelf(data._id)" />
                </template>
            </Column>
            <Column field="role" header="Role" />
            <Column header="Verified">
                <template #body="{ data }">
                    <Button :icon="data.verified ? 'pi pi-check':'pi pi-times'"
                        :severity="data.verified ? 'success' : 'danger'" class="button-status" rounded
                        @click="()=>setVerifyAccount(data._id,!data.verified)"
                        :disabled="loading || isSelf(data._id)"
                        />
                </template>
            </Column>
            <Column header="Profile">
                <template #body="{ data }">
                    <Image :src="data.profileImage" alt="" width="60" class="image-preview" preview />
                </template>
            </Column>
            <Column header="Cover">
                <template #body="{ data }">
                    <Image :src="data.profileCover" alt="" width="100" preview />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
<script>
import DataTable from 'primevue/datatable';
import Image from "primevue/image"
import Column from 'primevue/column';
import Button from 'primevue/button';
import { useStore } from '../store';
import API from '../service';
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
        addToast: {
            type: Function,
            required: true
        },
        users: {
            type: Array,
            required: true
        }
    },
    data() {
        const store = useStore()
        const api = new API()
        return { store, api, loading: false }
    },
    components: { DataTable, Column, Image, Button },
    methods: {
        async changeStatus(id, isDeleted) {
            if (!id || id == "") return
            try {
                this.loading = true
                const { data, response } = await this.api.CHNAGE_STATUS(id, isDeleted)
                if (response) {
                    response.data?.data?.message && this.addToast(response.data.data.message, 'error')
                }
                if (data.data?.statusCode == 200) {
                    data.data.user && this.updateStatus(id, data.data.user)
                    data.data.message && this.addToast(data.data.message, 'success')
                }

            } catch (error) {
                throw new Error(error)
            }
            finally {
                this.loading = false
            }
        },
        async setVerifyAccount(id, status) {
            if (!id || id == "") return
            try {
                this.loading = true
                const { data, response } = await this.api.CHNAGE_VERIFIED(id,status)
                if (response) {
                    response.data?.data?.message && this.addToast(response.data.data.message, 'error')
                }
                if (data.data?.statusCode == 200) {
                    data.data.user && this.updateUser(id, data.data.user)
                    data.data.message && this.addToast(data.data.message, 'success')
                }

            } catch (error) {
                throw new Error(error)
            }
            finally {
                this.loading = false
            }
        },
        updateUser(id, info) {
            this.users.forEach((user, index) => {
                if (user.information?._id == id) {
                    Object.assign(this.users[index].information, info)
                }
            })
        },
        isSelf(_id) {
            return this.store.user?.information?._id == _id
        }
    }
}
</script>