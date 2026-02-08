import { create } from 'zustand';

// --- Data Types ---

// Chapter 1 remains flat
export interface WorkOverview {
    date: string;
    equipmentModel: string;
    serialNumber: string;
    purpose: string;
    clientInfo: string;
}

// Structured Data for Chapters 2-4
export interface Part {
    id: string;
    name: string;
    quantity: number;
}

export interface Measurement {
    id: string;
    label: string;
    value: string;
    unit: string;
}

export interface ReportImage {
    id: string;
    url: string;
    caption: string;
}

export interface Subtask {
    id: string;
    title: string;
    description: string;
    parts: Part[];
    measurements: Measurement[]; // Only used in Ch2
    images: ReportImage[];
}

export interface ParentTask {
    id: string;
    title: string;
    description: string;
    subtasks: Subtask[];
}

export interface ReportData {
    // Chapter 1 (Flat)
    overview: WorkOverview;

    // Chapter 2-4 (Structured)
    inspectionTasks: ParentTask[];      // Ch2
    abnormalityTasks: ParentTask[];     // Ch3
    verificationTasks: ParentTask[];    // Ch4
}

export type Severity = 'required' | 'recommended' | 'optional';
export type SuggestionType = 'replace' | 'insert' | 'flag' | 'cross-field';
export type SuggestionStatus = 'unresolved' | 'previewing' | 'applied' | 'resolved' | 'dismissed';

export interface Suggestion {
    id: string;
    fieldId: string; // Updated to string to support nested paths
    severity: Severity;
    type: SuggestionType;
    label: string;
    reason: string;
    proposedText?: string;
    originalText?: string;
    status: SuggestionStatus;
}

export interface PolishState {
    isActive: boolean;
    level: number;
    originalData: Partial<ReportData>;
}

interface ReportStore {
    // Report Content
    data: ReportData;
    updateOverview: (field: keyof WorkOverview, value: string) => void;

    // Structured Task Actions
    addParentTask: (section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>) => void;
    removeParentTask: (section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>, id: string) => void;
    updateParentTask: (section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>, id: string, field: 'title' | 'description', value: string) => void;

    addSubtask: (section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>, parentId: string) => void;
    removeSubtask: (section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>, parentId: string, subtaskId: string) => void;
    updateSubtask: (section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>, parentId: string, subtaskId: string, field: keyof Subtask, value: any) => void;
    duplicateTask: (section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>, parentId: string, subtaskId: string) => void;

    // Review Flow
    isReviewing: boolean;
    suggestions: Suggestion[];
    triggerReview: () => Promise<void>;
    applySuggestion: (id: string) => void;
    dismissSuggestion: (id: string) => void;

    // Polish Flow
    isPolishing: boolean;
    polishState: PolishState;
    triggerPolish: (level: number) => Promise<void>;
    confirmPolish: (id: string) => void;
    revertPolish: (id: string) => void;
}

// --- Mock Data ---

const INITIAL_DATA: ReportData = {
    overview: {
        date: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        equipmentModel: 'XR-4500',
        serialNumber: 'SN-998877',
        purpose: 'Regular maintenance and inspection of Unit A.',
        clientInfo: 'Acme Corp / Tokyo Factory',
    },
    inspectionTasks: [
        {
            id: 'pt1',
            title: 'Main Unit Inspection',
            description: 'Visual and mechanical check of the core unit.',
            subtasks: [
                {
                    id: 'st1',
                    title: 'Cover Removal & Inspection',
                    description: 'Removed outer cover. Found slight dust accumulation.',
                    parts: [],
                    measurements: [],
                    images: []
                },
                {
                    id: 'st2',
                    title: 'Bearing Check',
                    description: 'Checked for play and noise.',
                    parts: [{ id: 'p1', name: 'O-ring', quantity: 2 }, { id: 'p2', name: 'Grease (Lithium)', quantity: 1 }],
                    measurements: [{ id: 'm1', label: 'Temp', value: '85', unit: '°C' }, { id: 'm2', label: 'Pressure', value: '120', unit: 'kPa' }],
                    images: []
                }
            ]
        }
    ],
    abnormalityTasks: [],
    verificationTasks: []
};

const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        id: 's1',
        fieldId: 'verificationTasks',
        severity: 'required',
        type: 'insert',
        label: '[Ch.4] Post-Work Confirmation',
        reason: 'Maintenance reports for industrial machinery must include confirmation of normal operation after corrective action.',
        proposedText: 'Added task: Manual Operation Check',
        status: 'unresolved'
    },
    {
        id: 's2',
        fieldId: 'inspectionTasks[0].subtasks[1].measurements[0].value',
        severity: 'recommended',
        type: 'flag',
        label: '[Ch.2] Measurements',
        reason: '"85°C" seems high. Please confirm if this is within normal operating range (60-80°C).',
        status: 'unresolved'
    }
];

// --- Store Implementation ---

export const useReportStore = create<ReportStore>((set, get) => ({
    data: INITIAL_DATA,

    updateOverview: (field, value) =>
        set((state) => ({ data: { ...state.data, overview: { ...state.data.overview, [field]: value } } })),

    addParentTask: (section) => set((state) => ({
        data: {
            ...state.data,
            [section]: [
                ...state.data[section],
                { id: crypto.randomUUID(), title: 'New Task', description: '', subtasks: [] }
            ]
        }
    })),

    removeParentTask: (section, id) => set((state) => ({
        data: {
            ...state.data,
            [section]: state.data[section].filter(t => t.id !== id)
        }
    })),

    updateParentTask: (section, id, field, value) => set((state) => ({
        data: {
            ...state.data,
            [section]: state.data[section].map(t => t.id === id ? { ...t, [field]: value } : t)
        }
    })),

    addSubtask: (section, parentId) => set((state) => ({
        data: {
            ...state.data,
            [section]: state.data[section].map(t => t.id === parentId ? {
                ...t,
                subtasks: [...t.subtasks, {
                    id: crypto.randomUUID(),
                    title: 'New Subtask',
                    description: '',
                    parts: [],
                    measurements: [],
                    images: []
                }]
            } : t)
        }
    })),

    removeSubtask: (section, parentId, subtaskId) => set((state) => ({
        data: {
            ...state.data,
            [section]: state.data[section].map(t => t.id === parentId ? {
                ...t,
                subtasks: t.subtasks.filter(st => st.id !== subtaskId)
            } : t)
        }
    })),

    updateSubtask: (section, parentId, subtaskId, field, value) => set((state) => ({
        data: {
            ...state.data,
            [section]: state.data[section].map(t => t.id === parentId ? {
                ...t,
                subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, [field]: value } : st)
            } : t)
        }
    })),

    duplicateTask: (section, parentId, subtaskId) => set((state) => {
        const parent = state.data[section].find(t => t.id === parentId);
        if (!parent) return state;
        const subtaskCb = parent.subtasks.find(st => st.id === subtaskId);
        if (!subtaskCb) return state;

        const newSubtask = {
            ...subtaskCb,
            id: crypto.randomUUID(),
            title: `${subtaskCb.title} (Copy)`,
            parts: subtaskCb.parts.map(p => ({ ...p, id: crypto.randomUUID() })),
            measurements: subtaskCb.measurements.map(m => ({ ...m, id: crypto.randomUUID() })),
            images: subtaskCb.images.map(i => ({ ...i, id: crypto.randomUUID() }))
        };

        return {
            data: {
                ...state.data,
                [section]: state.data[section].map(t => t.id === parentId ? {
                    ...t,
                    subtasks: [...t.subtasks, newSubtask]
                } : t)
            }
        };
    }),

    // Review Flow
    isReviewing: false,
    suggestions: [],

    triggerReview: async () => {
        set({ isReviewing: true });
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({
            isReviewing: false,
            suggestions: MOCK_SUGGESTIONS.map(s => ({ ...s, status: 'unresolved' }))
        });
    },

    applySuggestion: (id) => {
        set((state) => ({
            suggestions: state.suggestions.map(s => s.id === id ? { ...s, status: 'applied' } : s)
        }));
    },

    dismissSuggestion: (id) => {
        set((state) => ({
            suggestions: state.suggestions.map(s => s.id === id ? { ...s, status: 'dismissed' } : s)
        }));
    },

    // Polish Flow
    isPolishing: false,
    polishState: { isActive: false, level: 3, originalData: {} },

    triggerPolish: async (level) => {
        set({ isPolishing: true });
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple mock polish for demo
        set((state) => {
            const currentData = state.data;
            const polishedData = {
                ...currentData,
                overview: {
                    ...currentData.overview,
                    purpose: 'Periodic maintenance and comprehensive inspection of Unit A were conducted.',
                }
            };
            return {
                isPolishing: false,
                data: polishedData,
                polishState: { isActive: true, level, originalData: JSON.parse(JSON.stringify(currentData)) }
            };
        });
    },

    confirmPolish: (id) => {
        console.log(`Polishing confirmed for ${id}`);
    },

    revertPolish: (id) => {
        // Revert logic would happen here, restoring specific path from polishState.originalData
        console.log(`Polishing reverted for ${id}`);
    }
}));
