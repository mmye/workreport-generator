import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'engineer';
}

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email) => {
        // Mock login delay
        await new Promise(resolve => setTimeout(resolve, 800));
        set({
            user: {
                id: 'u1',
                name: 'Demo Engineer',
                email: email,
                role: 'engineer',
            },
            isAuthenticated: true,
        });
    },
    logout: () => set({ user: null, isAuthenticated: false }),
}));
