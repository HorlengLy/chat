<template>
    <div class="h-screen verflow-hidden relative">
        <div class="flex">
            <div ref="messageLayout" class="transition-layout left-layout full-view-left-layout">
                <MessageHeader :last-message="getLastMessage" :toggleViewProfile="toggleViewProfile"/>
                <div class="flex flex-column justify-content-between" style="height: 90vh;">
                    <div class="overflow-y-auto">
                        <!-- message contain -->
                        <div class="message-layout flex flex-column gap-3 ms-padding">
                            <template v-if="loading">
                                <MessageLoading />
                            </template>
                            <template v-else>
                                <template v-if="messages.length !== 0">
                                    <div v-for="(message, index) in messages" :key="index" class="flex flex-column">
                                        <MessageCard :message="message" :selfId="store.user?.information?._id" />
                                    </div>
                                </template>
                            </template>
                            <span ref="viewLates"></span>
                        </div>
                    </div>
                    <div class="input-box" :class="{'android-input-box':isAdroid}">
                        <!-- send box -->
                        <MessageSendBox :addMessage="addMessage" :scrollToLatesMessage="scrollToLatesMessage" />
                    </div>
                </div>
            </div>
            <div ref="friendViewLayout" class="transition-layout right-layout hidden-right-layout shadow-2">
                <ProfileViews :toggleViewProfile="toggleViewProfile" />
            </div>
        </div>
    </div>
</template>
<script>
import MessageHeader from './MessageHeader.vue';
import MessageSendBox from "./MessageSendBox.vue"
import MessageCard from './MessageCard.vue';
import MessageLoading from "./loading/MessageLoading.vue"
import ProfileViews from "../views/ProfileViews.vue"
import API from '../service';
import { useStore } from '../store';
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        const api = new API();
        const toast = useToast()
        const store = useStore()
        return {
            messages: [],
            store,
            preDate: "",
            toast,
            api,
            loading: false
        }
    },
    components: { MessageHeader, MessageSendBox, MessageCard, MessageLoading, ProfileViews },
    computed: {
        getLastMessage() {
            return this.messages.length ? this.messages[this.messages.length - 1] : null
        },
        isAdroid(){
            return window.navigator.userAgent?.includes('Android')
        }
    },
    async mounted() {
        this.getMessages()
        this.store.setAddMessage(this.addMessage)
    },
    watch:{
        $route(){
            this.getMessages()
        }
    },
    methods: {
        async getMessages() {
            try {
                this.loading = true
                const { response, data } = await this.api.GET_MESSAGES(this.$route.params.id)
                if (response) {
                    response.data?.data?.message && this.addToast(response.data.data.message, 'error')
                    return
                }
                if (data?.data?.statusCode == 200) {
                    this.messages = []
                    this.messages = data.data.messages
                    setTimeout(() => {
                        this.scrollToLatesMessage()
                    }, 200)
                }

            } catch (error) {
                console.log({ error });
            }
            finally {
                this.loading = false
            }
        },
        scrollToLatesMessage() {
            if (this.messages.length)
                this.$refs.viewLates?.scrollIntoView({ behavior: "smooth" })
        },
        addMessage(message) {
            this.messages.push(message)
            setTimeout(() => {
                this.scrollToLatesMessage()
            }, 200)
        },
        addToast(message, severity) {
            this.toast.add({
                summary: "KHMER CHAT",
                detail: message,
                life: 5000,
                severity
            })
        },
        toggleViewProfile() {
            this.$refs.messageLayout?.classList.toggle('full-view-left-layout');
            this.$refs.friendViewLayout?.classList.toggle('hidden-right-layout');
        },
        checkDate(date) {
            let dateString = new Date(date).toDateString()
            if (!this.preDate) {
                this.preDate = dateString
                return true
            }
            if (this.preDate == dateString) return false
            this.preDate = dateString
            return true
        },
    },
}

</script>

<style scoped>

.input-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 5;
    background-color: #fff;
}
.android-input-box {
    bottom: 48px !important;
}

</style>