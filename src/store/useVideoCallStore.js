import { create } from "zustand";

// Stores
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

const incomingCallMP3 = new Audio("/incoming-call.mp3"); 

export const useVideoCallStore = create( (set) => ({
    isCalling: false,
    callerInfo: null,

    setIsCalling: (bol) => {
        set({isCalling: bol});
    },

    handleCallUser: () => {
        const { socket } = useAuthStore.getState();
        const { selectedUser } = useChatStore.getState();

        if(!selectedUser) return;

        set({isCalling: true});

        socket.emit("call-user", {targetId: selectedUser.id});

    },

    handleListenIncomingCall: (socket) => {
        socket.on("incoming-call", ({fromSocketId, fromUserId}) => {
            const callerInfo = useChatStore.getState().users.find( user => user.id === fromUserId);
            set({callerInfo});
            incomingCallMP3.play();
        })
    }
}))