import { defineStore } from "pinia";
import { ref } from "vue"
export const useStore = defineStore("mystore",()=>{
    const user = ref(null)
    const friends = ref([])
    const messages = ref([])
    const currentRoom = ref(null)
    const searchText = ref("")
    const isSearch = ref(false)
    const loading = ref(false)
    const setLoading = status => loading.value = status
    const setUser = (information) => user.value = information
    const setFriends = (listRoom) => friends.value = listRoom
    const scrollToLatesMessage = ref(null)
    const setScrollToLatesMessage = (method)=> scrollToLatesMessage.value = method
    const setCurrentRoom = (friend) => currentRoom.value = friend
    const toggleLayout = ref(null)
    const settoggleLayout = (method) => toggleLayout.value = method
    const setSearch = ()=> isSearch.value = true
    const unSetSearch = ()=>isSearch.value = false
    const addFriends = (info,room)=> {
        room.members = [info,user]
        friends.value.push(room)
    }
    const setMessages = (data)=> messages.value = data
    const addMessage = (ms) => messages.value.push(ms)
    return {
        user,
        setUser,
        friends,
        setFriends,
        setScrollToLatesMessage,
        scrollToLatesMessage,
        setCurrentRoom,
        currentRoom,
        settoggleLayout,
        toggleLayout,
        isSearch,
        unSetSearch,
        setSearch,
        addFriends,
        searchText,
        loading,
        setLoading,
        messages,
        setMessages,
        addMessage
    }
    
})