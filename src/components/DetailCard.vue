<template>
    <div class="info-cover">
        <Textarea :id="title" :value="data" :rows="1" class="detail-card" required auto-resize :readonly="readOnly"/>
        <label :for="title">
            {{ title }}
        </label>
    </div>
</template>

<script>
import Textarea from "primevue/textarea"
export default{
    props:{
        title : {
            type : String,
            required : true,
        },
        data : {
            type : String,
            required : true,
        },
        readOnly : {
            type : Boolean,
            default : true
        }
    },
    data(){
        return {

        }
    },
    components:{Textarea}
}
</script>