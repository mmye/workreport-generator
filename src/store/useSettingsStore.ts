import { create } from 'zustand';

interface SettingsStore {
    wordTemplate: File | null;
    setWordTemplate: (file: File) => void;
    resetWordTemplate: () => void;
    templateName: string | null;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    wordTemplate: null,
    templateName: null,
    setWordTemplate: (file) => set({ wordTemplate: file, templateName: file.name }),
    resetWordTemplate: () => set({ wordTemplate: null, templateName: null }),
}));
