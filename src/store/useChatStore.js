import { create } from "zustand";
import api from "../lib/axios";

export const useChatStore = create((set, get)=>({
    users: [],
    selectedUserMessages: [],
    selectedUser: null,
    message: {
        text: '',
        image: null
    },
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,


    setMessage: (message) => set({message}),
    
    sendMessage: async(message, receiver_id) => {
        try {
            set({isSendingMessage: true});
            const res = await api.post(`/messages/${receiver_id}`, message);
            const prevMessages = get().selectedUserMessages;
            set({selectedUserMessages: [...prevMessages, res.data.data]});
            console.log('Sent message successfully!',  res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            set({isSendingMessage: false});
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
            console.log('Selected user:', receiverInfo);
            
            set({isMessagesLoading: true});
            const res = await api.get(`/messages/get/${receiverInfo.id}`);
            set({selectedUserMessages: res.data.data});
            console.log(res.data.data);
            
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