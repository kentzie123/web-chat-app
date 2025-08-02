import { create } from "zustand";
import api from "../lib/axios";

export const useChatStore = create((set)=>({
    users: [],
    selectedUserMessages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    sendMessage: async(message, receiver_id) => {
        try {
            const res = await api.post(`/messages/${receiver_id}`, message);
            console.log(res.data.data);
            
        } catch (error) {
            console.log(error);
        }
    },

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

    getMessagesFromTo: async(receiverInfo) => {
        try {
            set({isMessagesLoading: true});
            const res = await api.get(`/messages/get/${receiverInfo.id}`);
            set({selectedUserMessages: res.data.data});
            set({selectedUser: receiverInfo});
            // console.log(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            set({isMessagesLoading: false});
        }
    },

    closeChat: () => set({selectedUser: null, selectedUserMessages: []})
}))