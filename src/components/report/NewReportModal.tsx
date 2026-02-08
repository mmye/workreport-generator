import React, { useState, useEffect } from 'react';
import { useMasterStore } from '../../store/useMasterStore';
import { useReportsListStore } from '../../store/useReportsListStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NewReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewReportModal: React.FC<NewReportModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { clients, factories, machines } = useMasterStore();
    const { createReport } = useReportsListStore();

    const [step, setStep] = useState<1 | 2 | 3>(1);

    // Selection State
    const [selectedClientId, setSelectedClientId] = useState('');
    const [selectedFactoryId, setSelectedFactoryId] = useState('');
    const [selectedMachineId, setSelectedMachineId] = useState('');

    // "New Entry" State (Strings)
    const [newClientName, setNewClientName] = useState('');
    const [newFactoryName, setNewFactoryName] = useState('');
    const [newMachineName, setNewMachineName] = useState('');

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedClientId(''); setSelectedFactoryId(''); setSelectedMachineId('');
            setNewClientName(''); setNewFactoryName(''); setNewMachineName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter Logic
    const availableFactories = factories.filter(f => f.clientId === selectedClientId);
    const availableMachines = machines.filter(m => m.factoryId === selectedFactoryId);

    const handleNext = () => {
        if (step === 1) {
            if (!selectedClientId && !newClientName) return;
            setStep(2);
        } else if (step === 2) {
            if (selectedClientId === 'NEW' && !newClientName) return;
            if (selectedClientId !== 'NEW' && !selectedFactoryId && !newFactoryName) return;
            setStep(3);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        // Prepare Data
        let finalClientName = '';
        let finalClientId = '';
        let finalFactoryId = '';
        let finalMachineName = '';
        let finalMachineId = '';

        // Resolve Client
        if (selectedClientId === 'NEW') {
            finalClientName = newClientName;
            finalClientId = 'NEW';
        } else {
            const c = clients.find(c => c.id === selectedClientId);
            finalClientName = c?.name || '';
            finalClientId = selectedClientId;
        }

        // Resolve Factory
        if (selectedFactoryId === 'NEW') {
            finalFactoryId = 'NEW';
        } else {
            finalFactoryId = selectedFactoryId;
        }

        // Resolve Machine
        if (selectedMachineId === 'NEW') {
            finalMachineName = newMachineName;
            finalMachineId = 'NEW';
        } else {
            const m = machines.find(m => m.id === selectedMachineId);
            finalMachineName = m?.name || '';
            finalMachineId = selectedMachineId;
        }

        const newId = createReport({
            clientId: finalClientId,
            factoryId: finalFactoryId,
            machineId: finalMachineId,
            client: finalClientName,
            machine: finalMachineName,
            description: `Report for ${finalMachineName} at ${finalClientName}`,
            status: 'Draft'
        });

        onClose();
        navigate(`/report/${newId}`);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">{t('modal.title')}</h2>
                    <div className="text-xs text-slate-500">{t('modal.step', { current: step, total: 3 })}</div>
                </div>

                <div className="p-6">
                    {/* Step 1: Client */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">{t('modal.step1_label')}</label>
                            <select
                                className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={selectedClientId}
                                onChange={(e) => { setSelectedClientId(e.target.value); setNewClientName(''); }}
                            >
                                <option value="">{t('modal.choose_client')}</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                <option value="NEW">{t('modal.create_new_client')}</option>
                            </select>

                            {selectedClientId === 'NEW' && (
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={t('modal.enter_client_name')}
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                    autoFocus
                                />
                            )}
                        </div>
                    )}

                    {/* Step 2: Factory */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="text-sm text-slate-500 mb-2">
                                {t('modal.client')} <span className="font-semibold text-slate-800">{selectedClientId === 'NEW' ? newClientName : clients.find(c => c.id === selectedClientId)?.name}</span>
                            </div>
                            <label className="block text-sm font-medium text-slate-700">{t('modal.step2_label')}</label>

                            {selectedClientId === 'NEW' ? (
                                <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded">
                                    {t('modal.new_client_hint')}
                                </div>
                            ) : (
                                <select
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedFactoryId}
                                    onChange={(e) => { setSelectedFactoryId(e.target.value); setNewFactoryName(''); }}
                                >
                                    <option value="">{t('modal.choose_factory')}</option>
                                    {availableFactories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                    <option value="NEW">{t('modal.create_new_factory')}</option>
                                </select>
                            )}

                            {(selectedFactoryId === 'NEW' || selectedClientId === 'NEW') && (
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={t('modal.enter_factory_name')}
                                    value={newFactoryName}
                                    onChange={(e) => setNewFactoryName(e.target.value)}
                                    autoFocus
                                />
                            )}
                        </div>
                    )}

                    {/* Step 3: Machine */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="text-sm text-slate-500 mb-2">
                                {t('modal.location')} <span className="font-semibold text-slate-800">
                                    {selectedFactoryId === 'NEW' || selectedClientId === 'NEW' ? newFactoryName : factories.find(f => f.id === selectedFactoryId)?.name}
                                </span>
                            </div>
                            <label className="block text-sm font-medium text-slate-700">{t('modal.step3_label')}</label>

                            {selectedFactoryId === 'NEW' || selectedClientId === 'NEW' ? (
                                <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded">
                                    {t('modal.new_factory_hint')}
                                </div>
                            ) : (
                                <select
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={selectedMachineId}
                                    onChange={(e) => { setSelectedMachineId(e.target.value); setNewMachineName(''); }}
                                >
                                    <option value="">{t('modal.choose_machine')}</option>
                                    {availableMachines.map(m => <option key={m.id} value={m.id}>{m.name} ({m.serial})</option>)}
                                    <option value="NEW">{t('modal.create_new_machine')}</option>
                                </select>
                            )}

                            {(selectedMachineId === 'NEW' || selectedFactoryId === 'NEW' || selectedClientId === 'NEW') && (
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={t('modal.enter_machine_name')}
                                    value={newMachineName}
                                    onChange={(e) => setNewMachineName(e.target.value)}
                                    autoFocus
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(prev => prev - 1 as any)}
                            className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                        >
                            {t('modal.back')}
                        </button>
                    ) : (
                        <button onClick={onClose} className="text-slate-600 hover:text-slate-800 text-sm font-medium">{t('modal.cancel')}</button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !selectedClientId && !newClientName) ||
                            (step === 2 && selectedClientId !== 'NEW' && !selectedFactoryId && !newFactoryName) ||
                            (step === 3 && selectedClientId !== 'NEW' && selectedFactoryId !== 'NEW' && !selectedMachineId && !newMachineName)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {step === 3 ? t('modal.create') : t('modal.next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewReportModal;
