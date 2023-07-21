<template>
    <div class="h-screen flex justify-content-center align-items-center">
        <div class="w-30rem sm:h-auto h-full mx-auto bg-white border-round px-8 pt-8 shadow-1 zoomin animation-duration-500 animation-iteration-1">
            <div class="flex justify-content-center align-items-center gap-2">
                <span class="text-8xl text-blue-600 font-bold">4</span>
                <span class="text-8xl text-red-500 font-bold">0</span>
                <span class="text-8xl text-blue-600 font-bold">4</span>
            </div>
            <div class="md:flex md:gap-2 md:justify-content-center">
                <h5 class="sm:text-xl font-normal text-base text-center text-gray-800">Sorry, </h5>
                <h5 class="sm:text-xl font-normal text-base text-center text-gray-800"> This page does't exist</h5>
            </div>
            <div class="text-center mt-5">
                <router-link :to="{name:'HOME'}">
                    <Button label="Back" text size="small"/>
                </router-link>
            </div>
            <p class="text-xs text-center mt-5 mb-3 font-italic text-gray-700">@Horlenggg</p>
        </div>
    </div>
</template>

<script setup>
import Button from "primevue/button"
</script>