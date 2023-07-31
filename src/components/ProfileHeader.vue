<template>
    <div class="flex align-items-center w-full">
        <span class="col-6 px-4">
            <span class="left-icon">
                <Button class="animation-arrow arrow-button button-no-shadow" @click="toggleProfile" icon="pi pi-arrow-left" rounded size="small" />
            </span>
        </span>
        <span class="col-6 flex justify-content-center align-items-center gap-3 px-3">
            <span class="profile-header-title default-color">
                Settings
            </span>
            <span class="icons">
                <i class="pi pi-pencil"></i>
            </span>
        </span>
    </div>
</template>

<script setup>
import Button from 'primevue/button';


defineProps({
    toggleProfile:undefined
})




</script>

<style scoped>

.left-icon {
    display: inline-block;
    width: 2rem;
    height: 2rem;

}
.profile-header-title {
    font-size: 20px;
    letter-spacing: .5px;
    font-weight: 600;
}
.icons > i {
    color: gray;
}

</style>