<template>
    <div class="message-container" :class="{ 'own-message': message.sender == selfId }">
        <div class="message-image" :class="{ 'own': message.sender == selfId }" v-if="message.file">
            <img :src="message.file" alt="" class="w-full h-full cursor-pointer" @click="fullScreen">
        </div>
        <span class="text inline-block mt-2" :class="{'font-hanuman':!isEnglish(message.text)}">
            {{ message.text }}
        </span>
        <!--   send time   -->
        <span class="send-date">
            {{ moment(message.createdAt).startOf().fromNow() }}
        </span>
        <!--  style message's text    -->
        <span class="spam"></span>
    </div>
</template>
<script>
import moment from "moment";
export default {
    data(){
        return {moment,regExp : /[a-zA-Z]/}
    },
    props: {
        message: {
            type: Object,
            require: true
        },
        selfId: {
            type: String,
            require: true
        }
    },
    methods: {
        isEnglish(text){
            return this.regExp.test(text)
        },
        fullScreen(el) {
            el.srcElement?.requestFullscreen()
        }
    }
}

</script>