import { create } from "zustand";
import api from "../lib/axios";

export const useChatStore = create((set, get) => ({
  users: [],
  selectedUserMessages: [],
  selectedUser: null,
  message: {
    text: "",
    image: null,
  },
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  isLoadingMoreMessage: false,
  latestMessage: null,

  setLatestMessage: (latestMessage) => set({ latestMessage }),

  setMessage: (message) => set({ message }),

  closeChat: () => set({ selectedUser: null, selectedUserMessages: [] }),

  handleScrollEvent: async (container) => {

    if (!container) return;

    if (container.scrollTop === 0) {
        const prevScrollHeight = container.scrollHeight;

        await get().getMoreMessages(); // assume this prepends messages to your list

        const newScrollHeight = container.scrollHeight;
        container.scrollTop = newScrollHeight - prevScrollHeight;
      }
  },

  addMessageToChat: (message) => {
    set({ selectedUserMessages: [...get().selectedUserMessages, message] });
  },


  sendMessage: async (message, receiver_id) => {
    try {
      set({ isSendingMessage: true });
      const res = await api.post(`/messages/${receiver_id}`, message);
      set({ latestMessage: res.data.data });
      const prevMessages = get().selectedUserMessages;
      set({ selectedUserMessages: [...prevMessages, res.data.data] });
      console.log("Sent message successfully!", res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  getUsers: async () => {
    try {
      set({ isUsersLoading: true });
      const res = await api.get("/auth/getUsers");
      set({ users: res.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesFromTo: async (receiverInfo) => {
    try {
      if(get().selectedUser?.id === receiverInfo.id) return;
      set({ isMessagesLoading: true });
      const res = await api.get(`/messages/get/${receiverInfo.id}`);
      set({ selectedUserMessages: res.data.data.reverse() });
      set({ selectedUser: receiverInfo });
      set({ latestMessage: res.data.data[res.data.data.length - 1] });
      console.log('Data added to latest message:', res.data.data[0]);
      console.log("Selected user:", receiverInfo);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getMoreMessages: async () => {
    try {
      if(get().selectedUserMessages.length === 0) return;

      set({ isLoadingMoreMessage: true });
      const res = await api.get(`/messages/loadMore?receiver_id=${get().selectedUser.id}&oldestDate=${get().selectedUserMessages[0]?.created_at}&limit=10`);

      if(res.data.data.length === 0) return;
      set({ selectedUserMessages: [...res.data.data.reverse(), ...get().selectedUserMessages] });

    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoadingMoreMessage: false });
    }
  },

  
}));
