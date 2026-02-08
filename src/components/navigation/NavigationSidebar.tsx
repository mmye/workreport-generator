import React, { useMemo } from 'react';
import { useReportStore } from '../../store/useReportStore';
import type { ReportData } from '../../store/useReportStore';
import { useNavigationStore } from '../../store/useNavigationStore';

// Helper to check completion status
const getTaskStatus = (task: any, type: 'parent' | 'subtask') => {
    if (!task.title) return 'incomplete';
    if (type === 'parent') {
        if (!task.subtasks || task.subtasks.length === 0) return 'incomplete';
        return task.subtasks.every((st: any) => getTaskStatus(st, 'subtask') === 'complete') ? 'complete' : 'incomplete'; // Simplified logic
    }
    return 'complete'; // Simplified: If title exists, assume complete for prototype
};

const NavigationSidebar: React.FC = () => {
    const { data } = useReportStore();
    const {
        isSidebarOpen,
        // viewMode,
        expandedSections,
        activeSectionId,
        filterMode,
        // toggleSidebar, // Unused
        setViewMode,
        toggleSection,
        expandAll,
        collapseAll,
        setActiveSection,
        setFilterMode,
        focusMode,
        toggleFocusMode
    } = useNavigationStore();

    // if (viewMode === 'breadcrumbs') return null; // Moved visibility logic to parent to avoid hook violation

    // Flatten IDs for Expand All
    const allIds = useMemo(() => {
        const ids: string[] = [];
        ['inspectionTasks', 'abnormalityTasks', 'verificationTasks'].forEach(key => {
            ids.push(key);
            (data[key as keyof ReportData] as any[]).forEach(task => {
                ids.push(task.id);
                // Subtasks are leaf nodes in this nav tree, maybe don't need to expand them further unless they have children?
                // Actually, subtasks are shown UNDER parent tasks.
            });
        });
        return ids;
    }, [data]);

    const handleExpandAll = () => expandAll(allIds);

    const renderTaskItem = (task: any) => {
        const status = getTaskStatus(task, 'parent');
        if (filterMode === 'incomplete' && status === 'complete') return null;

        const isExpanded = expandedSections.has(task.id);
        const isActive = activeSectionId === task.id;

        return (
            <div key={task.id} className="ml-2">
                <div
                    className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-colors text-sm
            ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}
          `}
                    onClick={() => {
                        toggleSection(task.id);
                        setActiveSection(task.id);
                        // Scroll logic would go here (using element ID)
                        document.getElementById(`task-${task.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                >
                    <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''} text-xs text-slate-400`}>
                        ▶
                    </span>
                    <span className="truncate flex-1">{task.title || 'Untitled Task'}</span>
                    <span className="text-xs">
                        {status === 'complete' ? '✅' : '⚠️'}
                    </span>
                </div>

                {isExpanded && task.subtasks && (
                    <div className="ml-4 border-l border-slate-100 pl-2 mt-1 space-y-1">
                        {task.subtasks.map((st: any) => (
                            <div
                                key={st.id}
                                className={`text-xs py-1 px-2 rounded cursor-pointer truncate hover:bg-slate-50 ${activeSectionId === st.id ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveSection(st.id);
                                    document.getElementById(`subtask-${st.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                            >
                                {st.title || 'Untitled Subtask'}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderSection = (title: string, dataKey: keyof ReportData) => {
        const tasks = data[dataKey] as any[];
        const isExpanded = expandedSections.has(dataKey);

        return (
            <div className="mb-2">
                <div
                    className="flex items-center justify-between py-2 px-3 hover:bg-slate-100 rounded cursor-pointer font-semibold text-slate-700 text-sm"
                    onClick={() => toggleSection(dataKey)}
                >
                    <span>{title}</span>
                    <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </div>

                {isExpanded && (
                    <div className="mt-1 space-y-1">
                        {tasks.length === 0 && <div className="text-xs text-slate-400 pl-4 py-1">No tasks</div>}
                        {tasks.map(task => renderTaskItem(task))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-slate-800">Navigation</h2>
                <button onClick={() => setViewMode('breadcrumbs')} className="text-slate-400 hover:text-slate-600" title="Switch to Breadcrumbs Mode">
                    ↔
                </button>
            </div>

            {/* Controls */}
            <div className="p-2 flex gap-2 border-b border-slate-100 bg-slate-50">
                <button onClick={handleExpandAll} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">+ All</button>
                <button onClick={collapseAll} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">- All</button>
                <button
                    onClick={() => setFilterMode(filterMode === 'all' ? 'incomplete' : 'all')}
                    className={`text-xs px-2 py-1 border rounded ${filterMode === 'incomplete' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200'}`}
                    title="Filter Incomplete"
                >
                    {filterMode === 'all' ? 'All' : '⚠️'}
                </button>
                <button
                    onClick={toggleFocusMode}
                    className={`text-xs px-2 py-1 border rounded ${focusMode ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-200'}`}
                    title="Toggle Focus Mode"
                >
                    🎯
                </button>
            </div>

            {/* Tree Content */}
            <div className="flex-1 overflow-y-auto p-2">
                {/* Chapter 1 Overview (Hardcoded for now) */}
                <div
                    className={`py-2 px-3 rounded cursor-pointer font-semibold text-sm mb-2 ${activeSectionId === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}
                    onClick={() => { setActiveSection('overview'); document.getElementById('chapter-1')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                    1. Overview
                </div>

                {renderSection('2. Inspection', 'inspectionTasks')}
                {renderSection('3. Abnormalities', 'abnormalityTasks')}
                {renderSection('4. Verification', 'verificationTasks')}
            </div>
        </div>
    );
};

export default NavigationSidebar;
