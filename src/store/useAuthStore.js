import { create } from "zustand";
import api from "../lib/axios";

// Toast
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn: false,

    login: async(data) => {
        try {
            set({isLoggingIn: true});
            const res = await api.post('/auth/login', data);
            set({authUser: res.data});
            toast.success("Logged in successfully");
        } catch (err) {
            toast.error(err.response.data.message)
            
        } finally {
            set({isLoggingIn: false});
        }
    }

}));