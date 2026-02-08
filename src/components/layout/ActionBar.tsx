import React, { useState } from 'react';
import { useReportStore } from '../../store/useReportStore';
import PreviewModal from '../export/PreviewModal';

const ActionBar: React.FC = () => {
    const { triggerReview, triggerPolish, isReviewing, isPolishing } = useReportStore();
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <>
            <div className="h-16 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] z-10">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => triggerReview()}
                        disabled={isReviewing || isPolishing}
                        className={`flex items-center justify-center space-x-2 px-5 py-2.5 font-medium rounded-md transition-all shadow-sm
                ${isReviewing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-800 text-white'}`}
                    >
                        <span>{isReviewing ? '⏳' : '📋'}</span>
                        <span>{isReviewing ? 'Reviewing...' : 'Request Review'}</span>
                    </button>

                    <button
                        onClick={() => triggerPolish(3)}
                        disabled={isReviewing || isPolishing}
                        className={`flex items-center justify-center space-x-2 px-5 py-2.5 border font-medium rounded-md transition-all shadow-sm
                ${isPolishing ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                    >
                        <span>{isPolishing ? '✨' : '✏️'}</span>
                        <span>{isPolishing ? 'Polishing...' : 'Polish Text'}</span>
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
        </>
    );
};

export default ActionBar;
