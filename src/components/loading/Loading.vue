<template>
    <div class="loading-container">
        <span class="loader"></span>
        <p class="mt-4 text-gray-700 text-sm">
            Please wait a minute ...
        </p>
    </div>
</template>
<style scoped>
.loading-container {
    height: 100vh;
    display: grid;
    place-content: center;
}

.loader {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border-top: 4px solid #8888;
    border-right: 4px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin: auto;
}

.loader::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border-bottom: 4px solid #FF3D00;
    border-left: 4px solid transparent;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>