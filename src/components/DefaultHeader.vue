<template>
    <div class="shadow-1 m-0 p-0 absolute w-full left-0 top-0 z-5 flex align-items-center">
        <div class="col-2 relative">
            <span v-if="!store.isSearch">
                <SpeedDial :model="items" direction="down" :transitionDelay="80" showIcon="pi pi-bars" hideIcon="pi pi-times" class="dropdown-menu"
                    buttonClass="p-button-outlined" />
            </span>
            <span v-else>
                <Button class="animation-arrow arrow-button button-no-shadow" @click="store.unSetSearch" icon="pi pi-arrow-left" rounded size="small" />
            </span>
        </div>
        <div class="col-10">
            <span class="relative w-full">
                <input type="search" placeholder="Search..." @focus="store.setSearch" v-model="store.searchText"
                class="search-input w-full"
                :spellcheck="false" style="padding: .7rem;">
                <span class="icons-search">
                    <i class="pi pi-search"></i>
                </span>
            </span>
        </div>
    </div>
</template>

<script setup>
import SpeedDial from "primevue/speeddial"
import Button from "primevue/button";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "../store";


const store = useStore()
const router = useRouter()

const props = defineProps({
    toggleProfile: {
        type : Function,
        required : true,
    },
    toggleClick: {
        type : Function,
        required : true,
    }
})
const items = ref([
    {
        label: 'Add',
        icon: 'pi pi-user',
        command: () => {
            props.toggleProfile()
        }
    },
    {
        label : 'Add Contact',
        icon : 'pi pi-user-plus',
        command : ()=>props.toggleClick()

    },
    {
        label: 'Add',
        icon: 'pi pi-sign-out',
        command: () => {
            localStorage.clear("token");
            router.push({name : "LOGIN"})
        }
    },
])
</script>



<style >

.dropdown-menu button {
    width: 2.5rem !important;
    height: 2.5rem !important;
    border: 1px solid #6A83A6 !important;
    border: none !important;
}
.dropdown-menu button .pi {
    font-size: 1.3rem !important;
}
.dropdown-menu button:focus {
    box-shadow: none !important;
}
.dropdown-menu button span:nth-child(1) {
    color: #6A83A6;
} 
.dropdown-menu {
    top: -10px !important;
}
.dropdown-menu .p-speeddial-action {
    width: 2.8rem !important;
    height: 2.8rem !important;
}
.profile-image {
    display: inline-block;
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    overflow: hidden;
    /* border: 1px solid; */
    cursor: pointer;
    box-shadow: 0 0 1px 1px gray;
}
.icons-search {
    position: absolute;
    top: 1px;
    left: 15px;
    color: #9a9a9a;
}
.search-input {
    padding: 10px 0px 10px 40px !important;
    outline: none;
    border: 1px solid #D8D3DD;
    width: 100%;
    border-radius: 20px;
    color: #7B7B7B;
    transition: all .3s linear;
}
.search-input:focus {
    box-shadow: 0 0 0 1px #537BCC;
}
.search-input::placeholder {
    font-size: 14px;
}
.search-input:focus + .icons-search {
    color: #537BCC;
}
.search-input:focus::placeholder {
    color: #537BCC;
}

::-webkit-search-cancel-button {
    display: none;
}

</style>