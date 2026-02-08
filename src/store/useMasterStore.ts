import { create } from 'zustand';

export interface Client {
    id: string;
    name: string;
}

export interface Factory {
    id: string;
    clientId: string;
    name: string;
}

export interface Manufacturer {
    id: string;
    name: string;
}

export interface Machine {
    id: string;
    name: string;
    clientId: string;
    factoryId: string;
    manufacturerId: string;
    serial: string;
    location: string; // Keep for display, but factoryId is stricter
}

interface MasterStore {
    clients: Client[];
    factories: Factory[];
    manufacturers: Manufacturer[];
    machines: Machine[];

    selectedClientId: string | null;
    selectedMachineId: string | null;

    selectClient: (id: string | null) => void;
    selectMachine: (id: string | null) => void;
    clearSelection: () => void;
}

const MOCK_CLIENTS: Client[] = [
    { id: 'C-001', name: 'Acme Corp' },
    { id: 'C-002', name: 'Wayne Enterprises' },
    { id: 'C-003', name: 'Cyberdyne Systems' },
];

const MOCK_FACTORIES: Factory[] = [
    { id: 'F-001', clientId: 'C-001', name: 'Tokyo Plant' },
    { id: 'F-002', clientId: 'C-001', name: 'Osaka Branch' },
    { id: 'F-003', clientId: 'C-002', name: 'Gotham Main' },
    { id: 'F-004', clientId: 'C-002', name: 'Underground Lab' },
    { id: 'F-005', clientId: 'C-003', name: 'Skynet Hub' },
];

const MOCK_MANUFACTURERS: Manufacturer[] = [
    { id: 'MF-001', name: 'Amada' },
    { id: 'MF-002', name: 'Mazak' },
    { id: 'MF-003', name: 'Fanuc' },
];

const MOCK_MACHINES: Machine[] = [
    { id: 'M-01', name: 'Press Machine A', clientId: 'C-001', factoryId: 'F-001', manufacturerId: 'MF-001', serial: 'SN-1001', location: 'Tokyo Plant, Zone A' },
    { id: 'M-02', name: 'Lathe B', clientId: 'C-001', factoryId: 'F-001', manufacturerId: 'MF-002', serial: 'SN-2002', location: 'Tokyo Plant, Zone B' },
    { id: 'M-03', name: 'Robot Arm C', clientId: 'C-002', factoryId: 'F-004', manufacturerId: 'MF-003', serial: 'SN-3003', location: 'Underground Lab' },
];

export const useMasterStore = create<MasterStore>((set) => ({
    clients: MOCK_CLIENTS,
    factories: MOCK_FACTORIES,
    manufacturers: MOCK_MANUFACTURERS,
    machines: MOCK_MACHINES,

    selectedClientId: null,
    selectedMachineId: null,

    selectClient: (id) => set({ selectedClientId: id, selectedMachineId: null }),
    selectMachine: (id) => set((state) => {
        const machine = state.machines.find(m => m.id === id);
        return {
            selectedMachineId: id,
            selectedClientId: machine ? machine.clientId : state.selectedClientId
        };
    }),

    clearSelection: () => set({ selectedClientId: null, selectedMachineId: null }),
}));
