<template>
    <div v-if="user" class="hover:bg-gray-300 border-round flex w-full align-items-center gap-4 py-2 px-3 cursor-pointer transition-colors transition-duration-300">
        <div>
            <span class="relative">
                <div class="w-3rem h-3rem border-circle overflow-hidden border-1 border-gray-300">
                    <img :src="user.profileImage" alt="" class="w-full h-full ">
                </div>
                <span :class="{ 'active': isActive(user._id) }"></span>
            </span>
        </div>
        <div>
            <span class="flex gap-3 align-items-center">
                <span class="font-hanuman font-semibold" :class="(user.role == 'SUPER_ADMIN')?'admin-name':'text-gray-800'">
                    {{ user.name }}
                </span>
                <template v-if="user.role == 'ADMIN' || user.role =='SUPER_ADMIN'">
                    <Button icon="pi pi-check" class="verify-button button-no-shadow" rounded> </Button>
                </template>
            </span>
            <p class="text-xs mt-2 text-gray-700" v-if="!(user.role == 'SUPER_ADMIN')">
                {{ new Date(room.createdAt)?.toDateString() }}
            </p>
            <p v-else class="text-xs mt-2 text-gray-700">
                Wellcome, What can I help you guy?
            </p>
        </div>
    </div>
</template>

<script>
import { useStore } from "../store";
import Button from "primevue/button"
export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
        room:{
            type : Object,
            required: true,
        }
    },
    data() {
        const store = useStore();
        return { store };
    },
    methods: {
        isActive(_id) {
            return this.store.usersActive?.some(el => el._id == _id);
        }
    },
    components: { Button }
}
</script>
