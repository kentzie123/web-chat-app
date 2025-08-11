import { create } from "zustand";

// Stores
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

const incomingCallMP3 = new Audio("/incomingCall.mp3");

export const useVideoCallStore = create((set, get) => ({
  isCalling: false,
  callerInfo: null,

  playIncomingCallerMP3: () => {
    incomingCallMP3.loop = true;
    incomingCallMP3.play();
  },

  stopIncomingCallerMP3: () => {
    incomingCallMP3.pause();
    incomingCallMP3.currentTime = 0;
  },

  setIsCalling: (bol) => {
    set({ isCalling: bol });
  },

  handleCallUser: () => {
    const { socket } = useAuthStore.getState();
    const { selectedUser } = useChatStore.getState();

    if (!selectedUser) return;

    set({ isCalling: true });

    socket.emit("call-user", { targetId: selectedUser.id, callerInfo: useAuthStore.getState().authUser });
  },

  handleListenIncomingCall: (socket) => {
    socket.on("incoming-call", ({ fromSocketId, callerInfo }) => {
      set({ callerInfo });
      get().playIncomingCallerMP3();
    });

    socket.on("call-rejected", ()=>{
        set({isCalling: true, callerInfo: null});
        get().stopIncomingCallerMP3();
    })
  },

  handleRejectCall: () => {
    const { socket } = useAuthStore.getState();
    const { callerInfo } = get();

    console.log("Caller Info:", callerInfo);
    
    if (!callerInfo) return;
    console.log("Rejected call");
    
    socket.emit("reject-call", { callerUserId: callerInfo.id });

    // Stop ringing locally
    set({ isCalling: false, callerInfo: null });
    get().stopIncomingCallerMP3();
  },
}));
