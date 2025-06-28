import api from "@/lib/axios";
import { create } from "zustand";
import { io } from "socket.io-client";
import { Message, User } from "@/types";

interface Chatstore {
  user: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;
}

const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<Chatstore>((set, get) => ({}));
