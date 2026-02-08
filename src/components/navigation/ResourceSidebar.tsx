import React, { useState } from 'react';
import { useMasterStore } from '../../store/useMasterStore';
import { useTranslation } from 'react-i18next';

const ResourceSidebar: React.FC = () => {
    const { t } = useTranslation();
    const { clients, machines, selectedClientId, selectedMachineId, selectClient, selectMachine, clearSelection } = useMasterStore();
    const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());

    const toggleClient = (clientId: string) => {
        const newExpanded = new Set(expandedClients);
        if (newExpanded.has(clientId)) {
            newExpanded.delete(clientId);
        } else {
            newExpanded.add(clientId);
        }
        setExpandedClients(newExpanded);
    };

    const handleClientClick = (clientId: string) => {
        selectClient(clientId);
        toggleClient(clientId);
    };

    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <h2 className="font-semibold text-slate-700">{t('nav.assets')}</h2>
                {(selectedClientId || selectedMachineId) && (
                    <button
                        onClick={clearSelection}
                        className="text-xs text-blue-600 hover:text-blue-800"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <div
                    className={`p-2 rounded mb-1 cursor-pointer flex items-center text-sm font-medium transition-colors ${!selectedClientId && !selectedMachineId ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}
                    onClick={clearSelection}
                >
                    <span className="mr-2">🏢</span>
                    {t('nav.all_clients')}
                </div>

                {clients.map(client => {
                    const clientMachines = machines.filter(m => m.clientId === client.id);
                    const isExpanded = expandedClients.has(client.id);
                    const isSelected = selectedClientId === client.id && !selectedMachineId;

                    return (
                        <div key={client.id} className="mb-1">
                            <div
                                className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm font-medium transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}
                                onClick={() => handleClientClick(client.id)}
                            >
                                <div className="flex items-center">
                                    <span className="mr-2 text-slate-400">
                                        {isExpanded ? '📂' : '📁'}
                                    </span>
                                    {client.name}
                                </div>
                                <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                                    {clientMachines.length}
                                </span>
                            </div>

                            {isExpanded && (
                                <div className="ml-6 space-y-1 mt-1 border-l-2 border-slate-200 pl-2">
                                    {clientMachines.map(machine => (
                                        <div
                                            key={machine.id}
                                            onClick={(e) => { e.stopPropagation(); selectMachine(machine.id); }}
                                            className={`p-2 rounded cursor-pointer text-sm transition-colors ${selectedMachineId === machine.id ? 'bg-blue-100 text-blue-800 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                                        >
                                            <div className="flex items-center">
                                                <span className="mr-2">⚙️</span>
                                                <span className="truncate">{machine.name}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {clientMachines.length === 0 && (
                                        <div className="p-2 text-xs text-slate-400 italic">No machines registered</div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResourceSidebar;
