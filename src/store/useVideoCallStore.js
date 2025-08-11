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

  setIsCalling: (bol) => {
    set({ isCalling: bol });
  },

  handleCallUser: () => {
    const { socket } = useAuthStore.getState();
    const { selectedUser } = useChatStore.getState();

    if (!selectedUser) return;

    set({ isCalling: true });

    socket.emit("call-user", { targetId: selectedUser.id });
  },

  handleListenIncomingCall: (socket) => {
    socket.on("incoming-call", ({ fromSocketId, fromUserId }) => {
      const callerInfo = useChatStore
        .getState()
        .users.find((user) => user.id === fromUserId);
      set({ callerInfo });
      get().playIncomingCallerMP3();
    });
  },
}));
