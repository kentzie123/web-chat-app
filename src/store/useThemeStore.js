import { create } from "zustand";
import { persist } from 'zustand/middleware';

export const useThemeStore = create(persist((set)=> ({
        theme: 'dracula',
        setTheme: (themeParameter) => set({theme: themeParameter})
    }), 
    {
        name: 'webchat-theme'
    }
))