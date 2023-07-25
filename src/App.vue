<template>
  <Toast class="custom-toast" />
  <div v-if="store.loading">
    <Loading />
  </div>
  <template v-else>
    <div v-if="route.meta.cleanLayout">
      <CleanLayout />
    </div>
    <div v-else>
      <DefaultLayout />
    </div>
  </template>
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