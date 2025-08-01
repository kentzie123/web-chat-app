import { create } from "zustand";
import api from "../lib/axios";

// Toast
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn: false,
    isSigningUp: false,
    isCheckingAuth: true,

    login: async(data) => {
        try {
            set({isLoggingIn: true});
            const res = await api.post('/auth/login', data);
            set({authUser: res.data});
            toast.success("Logged in successfully");
        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            set({isLoggingIn: false});
        }
    },

    checkAuth: async() => {
        try {
            set({isCheckingAuth: true});
            const res = await api.get('/auth/check');
            set({authUser: res.data});
        } catch (err) {
            console.log("Error in checkAuth:", err);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async(data) => {
        try {
            set({isSigningUp: true});
            const res = await api.post('/auth/signup', data);
            set({authUser: res.data});
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false});
        }
    },

    logout: async() => {
        try {
            await api.post('/auth/logout');
            set({authUser: null});
            toast.success('Logout successfully');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

}));