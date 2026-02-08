import { create } from 'zustand';

export type ReportStatus = 'Draft' | 'Review' | 'Final';

export interface ReportSummary {
    id: string;
    clientId: string;
    factoryId?: string; // Added
    machineId: string;
    client: string; // Display Name
    machine: string; // Display Name (Added for easier display)
    date: string;
    status: ReportStatus;
    author: string;
    description: string;
}

// Mock Data
const MOCK_REPORTS: ReportSummary[] = [
    { id: 'R-2025-001', clientId: 'C-001', factoryId: 'F-001', machineId: 'M-01', client: 'Acme Corp', machine: 'Press Machine A', description: 'Quarterly Maintenance - Press A', date: '2025-10-15', status: 'Draft', author: 'Demo Engineer' },
    { id: 'R-2025-002', clientId: 'C-002', factoryId: 'F-004', machineId: 'M-03', client: 'Wayne Enterprises', machine: 'Robot Arm C', description: 'Emergency Repair - Robot Arm', date: '2025-10-18', status: 'Review', author: 'Demo Engineer' },
    { id: 'R-2025-003', clientId: 'C-001', factoryId: 'F-001', machineId: 'M-02', client: 'Acme Corp', machine: 'Lathe B', description: 'Installation Report - Lathe B', date: '2025-10-20', status: 'Draft', author: 'Demo Engineer' },
    { id: 'R-2025-004', clientId: 'C-003', factoryId: 'F-005', machineId: 'M-05', client: 'Cyberdyne Systems', machine: 'Assembly Bot E', description: 'Routine Inspection - Assembly Bot', date: '2025-10-22', status: 'Final', author: 'Demo Engineer' },
];

interface ReportsListState {
    reports: ReportSummary[];
    searchQuery: string;
    statusFilter: ReportStatus | 'All';

    setSearchQuery: (query: string) => void;
    setStatusFilter: (status: ReportStatus | 'All') => void;
    deleteReport: (id: string) => void;
    duplicateReport: (id: string) => void;
    createReport: (initialData?: Partial<ReportSummary>) => string; // Updated signature
}

export const useReportsListStore = create<ReportsListState>((set) => ({
    reports: MOCK_REPORTS,
    searchQuery: '',
    statusFilter: 'All',

    setSearchQuery: (query) => set({ searchQuery: query }),
    setStatusFilter: (status) => set({ statusFilter: status }),

    deleteReport: (id) => set((state) => ({
        reports: state.reports.filter(r => r.id !== id)
    })),

    duplicateReport: (id) => set((state) => {
        const report = state.reports.find(r => r.id === id);
        if (!report) return {};
        const newReport = {
            ...report,
            id: `R-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            status: 'Draft' as ReportStatus,
            date: new Date().toISOString().split('T')[0],
            description: `${report.description} (Copy)`
        };
        return { reports: [newReport, ...state.reports] };
    }),

    createReport: (initialData = {}) => {
        const newId = `R-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        const defaultReport: ReportSummary = {
            id: newId,
            clientId: '',
            machineId: '',
            client: '',
            machine: '',
            date: new Date().toISOString().split('T')[0],
            status: 'Draft',
            author: 'Demo Engineer',
            description: 'New Report',
            ...initialData // Override with actual selection
        };

        // Auto-generate description if client/machine exists
        if (defaultReport.client && defaultReport.machine) {
            defaultReport.description = `Report for ${defaultReport.machine} (${defaultReport.client})`;
        }

        set((state) => ({ reports: [defaultReport, ...state.reports] }));
        return newId;
    }
}));
