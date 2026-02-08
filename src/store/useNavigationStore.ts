import { create } from 'zustand';

export type ViewMode = 'tree' | 'breadcrumbs';
export type FilterMode = 'all' | 'incomplete' | 'flagged';

interface NavigationStore {
    isSidebarOpen: boolean;
    viewMode: ViewMode;
    expandedSections: Set<string>;
    activeSectionId: string | null;
    filterMode: FilterMode;
    focusMode: boolean; // Dims inactive sections

    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;

    setViewMode: (mode: ViewMode) => void;

    toggleSection: (id: string) => void;
    setExpanded: (id: string, expanded: boolean) => void;
    expandAll: (ids: string[]) => void;
    collapseAll: () => void;

    setActiveSection: (id: string | null) => void;

    setFilterMode: (mode: FilterMode) => void;
    toggleFocusMode: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
    isSidebarOpen: true,
    viewMode: 'tree',
    expandedSections: new Set(),
    activeSectionId: null,
    filterMode: 'all',
    focusMode: false,

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    setViewMode: (mode) => set({ viewMode: mode }),

    toggleSection: (id) => set((state) => {
        const newExpanded = new Set(state.expandedSections);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        return { expandedSections: newExpanded };
    }),

    setExpanded: (id, expanded) => set((state) => {
        const newExpanded = new Set(state.expandedSections);
        if (expanded) {
            newExpanded.add(id);
        } else {
            newExpanded.delete(id);
        }
        return { expandedSections: newExpanded };
    }),

    expandAll: (ids) => set({ expandedSections: new Set(ids) }),
    collapseAll: () => set({ expandedSections: new Set() }),

    setActiveSection: (id) => set({ activeSectionId: id }),

    setFilterMode: (mode) => set({ filterMode: mode }),
    toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
}));
