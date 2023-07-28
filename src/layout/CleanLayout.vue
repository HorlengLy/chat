<template>
    <div class="flex justify-content-center align-items-center overflow-hidden h-screen w-screen">
        <div class="lg:col-5 lg:flex lg:justify-content-center hidden">
            <img src="https://cdn.pixabay.com/photo/2016/08/29/11/55/emoticon-1628080_1280.png" alt="" class="w-30rem">
        </div>
        <div class="lg:col-7 col-12 md:flex md:justify-content-center md:align-items-center p-0">
            <router-view></router-view>
        </div>
    </div>
</template>

