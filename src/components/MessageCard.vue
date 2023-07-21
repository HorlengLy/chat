<template>
    <div class="message-container" :class="{'own-message':message.sender==selfId}">
        <div class="message-image" :class="{'own':message.sender==selfId}" v-if="message.file">
            <img :src="message.file" alt="" class="w-full h-full">
        </div>
        <span class="text inline-block mt-2">
            {{ message.text }}
        </span>
        <!--   send time   -->
        <span class="send-date">
            {{ new Date(message.createdAt).toLocaleTimeString() }}
        </span>
        <!--  style message's text    -->
        <span class="spam"></span>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type : Object,
        require : true
    },
    selfId : {
        type : String,
        require : true
    }
})

</script>