import { create } from "zustand";
import api from "../lib/axios";

import io from "socket.io-client";

// Store
import { useChatStore } from "./useChatStore";

// Toast
import toast from "react-hot-toast";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://192.168.1.5:5000" : "/"; // Change http://192.168.1.5:5000 to http://localhost:5000 if running the server locally

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  connectSocket: () => {
    console.log("connectSocket() called");
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.connected);
      set({ socket });
    });

    // Get online users listener
    socket.on("getOnlineUsers", (userIds) => {
      console.log("Online users:", userIds);
      set({ onlineUsers: userIds });
    });

    // New message listeners
    useChatStore.getState().handleNewMessageListener(socket);
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data.data });
      get().connectSocket();
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const res = await api.get("/auth/check");
      set({ authUser: res.data.data });
      get().connectSocket();
    } catch (err) {
      console.log("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await api.post("/auth/signup", data);
      set({ authUser: res.data.data });
      get().connectSocket();
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      toast.success("Logout successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  },
}));
