import React from 'react';
import { useReportStore } from '../../store/useReportStore';
import { useNavigationStore } from '../../store/useNavigationStore';
// Use implicit types from store or explicit if needed, but avoid importing ReportData type if it causes errors.

const BreadcrumbsBar: React.FC = () => {
    const { data } = useReportStore();
    const { viewMode, activeSectionId, setViewMode } = useNavigationStore();

    if (viewMode === 'tree') return null;

    // Helper to find breadcrumb path from ID
    const getBreadcrumbs = (id: string | null) => {
        if (!id) return ['Work Report'];
        if (id === 'overview') return ['Work Report', '1. Overview'];

        const sections = [
            { key: 'inspectionTasks', label: '2. Inspection' },
            { key: 'abnormalityTasks', label: '3. Abnormalities' },
            { key: 'verificationTasks', label: '4. Verification' }
        ] as const;

        for (const { key, label } of sections) {
            const tasks = data[key] as any[];
            if (!tasks) continue;

            const task = tasks.find((t: any) => t.id === id);
            if (task) {
                return ['Work Report', label, task.title || 'Untitled Task'];
            }

            // Check subtasks
            for (const t of tasks) {
                if (t.subtasks && Array.isArray(t.subtasks)) {
                    const st = t.subtasks.find((s: any) => s.id === id);
                    if (st) {
                        return ['Work Report', label, t.title || 'Untitled Task', st.title || 'Untitled Subtask'];
                    }
                }
            }
        }
        return ['Work Report', 'Unknown Section'];
    };

    try {
        const breadcrumbs = getBreadcrumbs(activeSectionId);

        return (
            <div className="w-full h-10 bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-30 shadow-sm transition-all duration-300">
                <div className="flex items-center text-sm text-slate-600">
                    <button
                        onClick={() => setViewMode('tree')}
                        className="mr-3 p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                        title="Switch to Nav Tree"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="mx-2 text-slate-300">/</span>}
                            <span className={`${index === breadcrumbs.length - 1 ? 'font-semibold text-slate-800' : 'text-slate-500 hover:text-slate-700 cursor-pointer'}`}>
                                {crumb}
                            </span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    } catch (e) {
        console.error("Breadcrumbs Render Error:", e);
        return <div className="p-2 text-red-500 text-xs">Error loading breadcrumbs</div>;
    }
};

export default BreadcrumbsBar;
