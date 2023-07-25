import { defineStore } from "pinia";
import { ref } from "vue"
import { io } from "socket.io-client"
import { Peer } from "peerjs"


export const useStore = defineStore("mystore", () => {
    const user = ref(null)
    const rooms = ref([])
    const messages = ref([])
    const searchText = ref("")
    const isSearch = ref(false)
    const loading = ref(false)
    const usersActive = ref([])
    // perrjs
    const peer = ref(null);
    // socket
    const socket = ref(io(import.meta.env.VITE_API_URL))

    socket.value.on("message-response", message => {
        messages.value.push(message)
    })
    socket.value.on("user-online", users => {
        usersActive.value = users
    })
    socket.value.on("user_out", _id => {
        console.log(_id + " out chat");
        usersActive.value = usersActive.value.filter(user => user._id != _id)
    })
    peer.value?.on("call",stream=>{
        alert('someOneCall')
    })
    const socketConected = (_id) => {
        socket.value.on("connect", () => {
            console.log("web socket connected");
        })
        socket.value.emit("online", _id)
    }
    const socketSendMesage = message => {
        socket.value.emit("message", message)
    }
    const socketLogout = () => {
        socket.value.emit("user-logout", user.value?.information?._id)
    }

    const createPeerJs = (_id) => {
        peer.value = new Peer(_id);
        peer.value.on("open", (id) => {
            console.log("peer js id : " + id);
        })
    }
    const setLoading = status => loading.value = status
    const setUser = (information) => user.value = information
    const setRooms = (data) => rooms.value = data
    const scrollToLatesMessage = ref(null)
    const toggleLayout = ref(null)
    const toggleViewFriend = ref(null)
    const setToggleViewFriend = method => toggleViewFriend.value = method
    const settoggleLayout = (method) => toggleLayout.value = method
    const setSearch = () => isSearch.value = true
    const unSetSearch = () => {
        searchText.value = ""
        isSearch.value = false
    }
    const addFriends = (info, room) => {
        room.members = [info, user]
        rooms.value.push(room)
    }
    const setMessages = (data) => messages.value = data
    const addMessage = (ms) => messages.value.push(ms)
    return {
        user,
        setUser,
        rooms,
        setRooms,
        scrollToLatesMessage,
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
        addMessage,
        socket,
        socketSendMesage,
        socketConected,
        socketLogout,
        usersActive,
        createPeerJs,
        peer,
        setToggleViewFriend,
        toggleViewFriend
    }

})