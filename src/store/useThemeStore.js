import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useThemeStore = create(persist((set)=> ({
        theme: 'dark',
        setTheme: (themeParameter) => set({theme: themeParameter})
    }), 
    {
        name: 'webchat-theme'
    }
))