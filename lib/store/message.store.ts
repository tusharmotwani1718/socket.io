import { create } from 'zustand';
import type { messageObject } from "../../types/msg.types"

interface MessageState {
    messages: messageObject[];
    addMessage: (msgObject: messageObject) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    addMessage: (msgObject: messageObject) => set((state) => ({ messages: [...state.messages, msgObject] })),
}))
