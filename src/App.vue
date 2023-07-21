<template>
  <Toast class="custom-toast" />
  <div :class="store.loading ? '' : 'hidden'">
    <Loading />
  </div>
  <div v-if="route.meta.cleanLayout" :class="store.loading ? 'hidden' : ''">
    <CleanLayout />
  </div>
  <div v-else>
    <DefaultLayout />
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import CleanLayout from "./layout/CleanLayout.vue"
import DefaultLayout from "./layout/DefaultLayout.vue"
import { useStore } from "./store/index"
import Toast from "primevue/toast"
import Loading from "./components/loading/Loading.vue"

const route = useRoute()
const store = useStore()

</script>