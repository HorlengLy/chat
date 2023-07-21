<script setup>
import Badge from "primevue/badge"
import { onMounted, ref } from "vue";
const props = defineProps({
    room : {
        type : Object,
        require : true,
    },
    authId : {
        type : String,
        require : true
    }
})

const friend = ref(null)
onMounted(()=>{
    friend.value = props.room.filter(friend => friend._id !== props.authId)[0]
})

</script>
<template>
    <div v-if="friend" class="hover:bg-gray-200 border-round flex w-full align-items-center gap-4 py-2 px-2 cursor-pointer transition-colors transition-duration-300">
        <div>
            <span  class="relative">
                <div class="w-3rem h-3rem border-circle overflow-hidden border-1 border-gray-300">
                    <img :src="friend.profileImage" alt="" class="w-full h-full ">
                </div>
                <span class="p-1 border-circle absolute bg-green-500" style="right:5px;bottom: 2px;"></span>
            </span>
        </div>

        <div class="flex justify-content-between align-items-center w-full">
            <div>
                <h5 class="text-gray-700 font-semibold" >
                    {{ friend.name }}
                </h5>
                <p class="text-xs mt-2 text-gray-700">Last sent a message</p>
            </div>
            <Badge severity="success" :value="8" />
        </div>
    </div>
</template>