import React from 'react';
import { useReportStore } from '../../store/useReportStore';
import { generateWordReport, generatePdfReport } from '../../utils/reportGenerator';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
    const { data } = useReportStore();
    const [isGenerating, setIsGenerating] = React.useState(false);

    if (!isOpen) return null;

    const handleDownload = async (type: 'word' | 'pdf') => {
        setIsGenerating(true);
        try {
            if (type === 'word') {
                await generateWordReport();
            } else {
                await generatePdfReport();
            }
        } finally {
            setIsGenerating(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">Export Preview</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Preview Content (Web Style) */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
                    <div className="max-w-a4 mx-auto bg-white shadow-sm p-[10mm] min-h-[297mm] text-sm text-slate-800">
                        <style>{`
                            .max-w-a4 { max-width: 210mm; }
                        `}</style>

                        <div className="text-center mb-8 pb-4 border-b border-gray-300">
                            <h1 className="text-2xl font-bold mb-2">Work Report</h1>
                            <p className="text-gray-500">Acme Corp - {new Date().toLocaleDateString()}</p>
                        </div>

                        {/* Overview (Mock Data mapping) */}
                        <section className="mb-6">
                            <h2 className="text-base font-bold bg-gray-100 p-2 mb-2 border-l-4 border-blue-500">1. Overview</h2>
                            <p className="whitespace-pre-wrap">{data.chapter1_overview || "No overview provided."}</p>
                        </section>

                        {/* Inspection */}
                        <section className="mb-6">
                            <h2 className="text-base font-bold bg-gray-100 p-2 mb-2 border-l-4 border-blue-500">2. Inspection</h2>
                            {data.inspectionTasks.length === 0 && <p className="text-gray-400 italic">No tasks.</p>}
                            <ul className="list-disc pl-5 space-y-1">
                                {data.inspectionTasks.map(task => (
                                    <li key={task.id}>
                                        <span className="font-semibold">{task.title}</span>
                                        {task.subtasks.length > 0 && (
                                            <ul className="list-circle pl-5 mt-1 text-xs text-gray-600">
                                                {task.subtasks.map(st => (
                                                    <li key={st.id}>{st.title}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Abnormalities */}
                        <section className="mb-6">
                            <h2 className="text-base font-bold bg-gray-100 p-2 mb-2 border-l-4 border-blue-500">3. Abnormalities</h2>
                            {data.abnormalityTasks.length === 0 && <p className="text-gray-400 italic">No abnormalities reported.</p>}
                            <div className="grid grid-cols-2 gap-4">
                                {data.abnormalityTasks.map(task => (
                                    <div key={task.id} className="border border-gray-200 rounded p-2">
                                        <p className="font-semibold mb-1">{task.title}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-md transition-colors"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => handleDownload('word')}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span>{isGenerating ? 'Generating...' : 'Download Word'}</span>
                    </button>

                    <button
                        onClick={() => handleDownload('pdf')}
                        disabled={isGenerating}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
