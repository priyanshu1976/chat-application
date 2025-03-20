import { create }  from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set , get) => ({
  message: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true })
    try {
      const res = await axiosInstance.get("/message/user");
      set({users : res.data})
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({isUserLoading : false})
    }
  },

  getMessages: async (userId) => {
    set({isMessagesLoading : true})
    try {
      const res = await axiosInstance.get(`/message/${userId}`)
      set({message : res.data})
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({isMessagesLoading : false})
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, message } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data);
      set({message : [...message , res.data]})
    } catch (error) {
      toast.error("error.response.data.message")
    }
  },

  subscribeToMessage: (userId) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      set({message : [...get().message , newMessage],})
    })
  },

  unsubscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  } ,

  // optimize this one later
  setSelectedUser : (selectedUser) => set({selectedUser})

}))