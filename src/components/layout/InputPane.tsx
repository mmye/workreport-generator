import React, { useEffect, useRef } from 'react';
import { useReportStore } from '../../store/useReportStore';
import type { WorkOverview } from '../../store/useReportStore';
import TaskSection from '../structured/TaskSection';
import { useNavigationStore } from '../../store/useNavigationStore';

const InputPane: React.FC = () => {
    const { data, updateOverview, isPolishing, polishState } = useReportStore();
    const { activeSectionId, focusMode } = useNavigationStore();
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll Spy Logic
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            // For now, we rely on click-to-nav mainly. 
            // Implementing full intersection observer for prototype might be overkill but nice.
            // We can check which section is at scrollTop.
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const getOpacityClass = (sectionId: string) => {
        if (!focusMode) return 'opacity-100 transition-opacity duration-300';
        // Check if activeSectionId matches this section
        // If activeSectionId is null, show everything? Or keep focused on nothing?
        if (!activeSectionId) return 'opacity-100';

        // Check for direct match
        if (activeSectionId === sectionId) return 'opacity-100 transition-opacity duration-300';

        // Check if activeSectionId is a child of this section
        if (sectionId === 'inspectionTasks' && (data.inspectionTasks.some(t => t.id === activeSectionId || t.subtasks.some(st => st.id === activeSectionId)))) return 'opacity-100';
        if (sectionId === 'abnormalityTasks' && (data.abnormalityTasks.some(t => t.id === activeSectionId || t.subtasks.some(st => st.id === activeSectionId)))) return 'opacity-100';
        if (sectionId === 'verificationTasks' && (data.verificationTasks.some(t => t.id === activeSectionId || t.subtasks.some(st => st.id === activeSectionId)))) return 'opacity-100';
        if (sectionId === 'chapter-1' && activeSectionId === 'overview') return 'opacity-100';

        return 'opacity-20 blur-sm transition-all duration-500 pointer-events-none';
    };

    const renderOverviewField = (label: string, field: keyof WorkOverview, required: boolean = false, rows: number = 3) => {
        const isPolished = polishState.isActive && (field === 'purpose');

        return (
            <div className={`relative transition-all duration-300 ${isPolished ? 'ring-2 ring-emerald-500/20 rounded-md p-1 -m-1 bg-emerald-50/10' : ''}`}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label} {required && <span className="text-red-600">*</span>}
                    {isPolished && <span className="ml-2 text-xs text-emerald-600 font-normal">✨ Polished (Lv{polishState.level})</span>}
                </label>
                <textarea
                    rows={rows}
                    value={data.overview[field]}
                    onChange={(e) => updateOverview(field, e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-shadow 
                        ${isPolished ? 'border-emerald-400 bg-white' : 'border-slate-300'}`}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                ></textarea>
            </div>
        );
    };

    return (
        <div ref={containerRef} id="input-pane-container" className="flex-1 bg-white overflow-y-auto p-8 relative scroll-smooth">
            <div className={`max-w-6xl mx-auto space-y-12 pb-24 transition-all duration-500 ${focusMode ? 'scale-95 origin-top' : ''}`}>

                {/* Chapter 1: Overview (Flat) */}
                <section id="chapter-1" className={`transition-all duration-500 ${getOpacityClass('chapter-1')}`}>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm mr-3">1</span>
                        Work Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date and Time</label>
                            <input
                                type="text"
                                value={data.overview.date}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-500 bg-slate-50"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Client Info</label>
                            <input
                                type="text"
                                value={data.overview.clientInfo}
                                className="w-full border border-slate-300 rounded-md px-3 py-2 text-slate-500 bg-slate-50"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        {renderOverviewField("Purpose of Work", "purpose", true)}
                    </div>
                </section>

                <hr className={`border-slate-100 transition-opacity duration-300 ${focusMode ? 'opacity-10' : ''}`} />

                {/* Chapter 2: Inspection (Structured) */}
                <section id="inspectionTasks" className={`transition-all duration-500 ${getOpacityClass('inspectionTasks')}`}>
                    <TaskSection
                        title="[Chapter 2] Inspection / Work Performed"
                        section="inspectionTasks"
                        description="Record all inspection points and maintenance tasks."
                    />
                </section>

                <hr className={`border-slate-100 transition-opacity duration-300 ${focusMode ? 'opacity-10' : ''}`} />

                {/* Chapter 3: Abnormalities (Structured) */}
                <section id="abnormalityTasks" className={`transition-all duration-500 ${getOpacityClass('abnormalityTasks')}`}>
                    <TaskSection
                        title="[Chapter 3] Abnormalities / Findings"
                        section="abnormalityTasks"
                        description="Log any issues found and corrective actions taken."
                    />
                </section>

                <hr className={`border-slate-100 transition-opacity duration-300 ${focusMode ? 'opacity-10' : ''}`} />

                {/* Chapter 4: Verification (Structured) */}
                <section id="verificationTasks" className={`transition-all duration-500 ${getOpacityClass('verificationTasks')}`}>
                    <TaskSection
                        title="[Chapter 4] Post-Work Confirmation"
                        section="verificationTasks"
                        description="Verify normal operation after work completion."
                    />
                </section>

                {isPolishing && (
                    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center space-x-3 animate-pulse">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Polishing text (mock simulation)...</span>
                    </div>
                )}

            </div>
        </div>
    );
};

export default InputPane;
