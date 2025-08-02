import { create } from "zustand";
import api from "../lib/axios";

import io from "socket.io-client";

// Toast
import toast from "react-hot-toast";

// Store
import { useChatStore } from "./useChatStore";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      },
    });
    socket.connect();

    set({ socket: socket });

    const getOnlineUsers = (userIds) => {
      console.log(userIds);
      
      set({ onlineUsers: userIds });
    }
    
    socket.on("getOnlineUsers", getOnlineUsers);

    // socket.off('getOnlineUsers', getOnlineUsers);
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await api.post("/auth/login", data);
      get().connectSocket();
      set({ authUser: res.data.data });
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
      get().connectSocket();
      set({ authUser: res.data.data });
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
      get().connectSocket();
      set({ authUser: res.data.data });
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
