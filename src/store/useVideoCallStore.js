import { create } from "zustand";

// Stores
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

const incomingCallMP3 = new Audio("/incomingCall.mp3");
let ringtonePrimed = false; // <— Add this outside store

export const useVideoCallStore = create((set, get) => ({
  isCalling: false,
  callerInfo: null,

  // Async version with play/unlock logic
  primeRingtone: async () => {
    if (ringtonePrimed) return;
    ringtonePrimed = true;

    try {
      await incomingCallMP3.play();
      incomingCallMP3.pause();
      incomingCallMP3.currentTime = 0;
    } catch {
      // Silently ignore if blocked initially
    }
  },

  playIncomingCallerMP3: async () => {
    incomingCallMP3.loop = true;
    try {
      await incomingCallMP3.play();
    } catch (err) {
      console.warn("Ringtone play blocked:", err);
    }
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
