import { create } from "zustand";

export const useVideoCallStore = create( (set) => ({
    isCalling: false,

    setIsCalling: (bol) => {
        set({isCalling: bol});
    }
}))