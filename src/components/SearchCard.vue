<template>
    <div class="search-user-card mt-1">
        <span class="flex align-items-center gap-5">
            <span class="card-image">
                <template v-if="user?.profileImage">
                    <img :src="user.profileImage" alt="" class="w-full h-full">
                </template>
            </span>
            <span class="info-cover">
                <span class="text-base font-semibold text-gray-800" style="letter-spacing: .5px;">
                    {{ user?.name }}
                </span>
                <span class="text-xs">
                    Last seen 2 hours ago
                </span>
            </span>
        </span>
    </div>
</template>
<script setup>

defineProps({
    user : Object
})



</script>

<style>

.search-user-card {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 25px;
    border-radius: 50px;
    justify-content: space-between;
    transition: all .2s linear;
}
.search-user-card:hover {
    background-color: #E3E4E7;
}
.card-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #E3E4E7;
    border: 1px solid #6666;
}
.card-image img {
    /* transform: scale(.9); */
    border-radius: 50%;
}
.info-cover {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.add-button {
    background-color: #f6f8ff !important;
}
.add-button:hover {
    background-color: #f6f6f6 !important;
}
.add-button .p-button-icon {
    font-size: .8rem !important;
}

</style>