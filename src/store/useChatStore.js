import { create } from "zustand";
import api from "../lib/axios";

export const useChatStore = create((set)=>({
    users: [],
    selectedUserMessages: [],
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async() => {
        try {
            set({isUsersLoading: true});
            const res = await api.get('/auth/getUsers');
            set({users: res.data.data});
        } catch (error) {
            console.log(error);
        } finally {
            set({isUsersLoading: false});
        }
    },

    getMessagesFromTo: async(receiver_id) => {
        try {
            set({isMessagesLoading: true});
            const res = await api.get(`/messages/get/${receiver_id}`);
            set({selectedUserMessages: res.data});
            console.log(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            set({isMessagesLoading: false});
        }
    }
}))