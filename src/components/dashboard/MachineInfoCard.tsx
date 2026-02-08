import React from 'react';
import { useMasterStore } from '../../store/useMasterStore';
import { useTranslation } from 'react-i18next';

const MachineInfoCard: React.FC = () => {
    const { t } = useTranslation();
    const { machines, manufacturers, clients, selectedMachineId } = useMasterStore();

    if (!selectedMachineId) return null;

    const machine = machines.find(m => m.id === selectedMachineId);
    if (!machine) return null;

    const manufacturer = manufacturers.find(mf => mf.id === machine.manufacturerId);
    const client = clients.find(c => c.id === machine.clientId);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6 flex items-start space-x-6">
            {/* Machine Image Placeholder */}
            <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center shrink-0">
                <span className="text-4xl">⚙️</span>
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-slate-800">{machine.name}</h2>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">{t('machine_card.active')}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">{t('machine_card.manufacturer')}</p>
                        <p className="font-medium text-slate-700">{manufacturer?.name || 'Unknown'}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">{t('machine_card.serial')}</p>
                        <p className="font-medium text-slate-700">{machine.serial}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">{t('machine_card.client')}</p>
                        <p className="font-medium text-slate-700">{client?.name}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">{t('machine_card.location')}</p>
                        <p className="font-medium text-slate-700">{machine.location}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2">
                <button className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors">
                    {t('machine_card.view_specs')}
                </button>
                <button className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition-colors">
                    {t('machine_card.history')}
                </button>
            </div>
        </div>
    );
};

export default MachineInfoCard;
