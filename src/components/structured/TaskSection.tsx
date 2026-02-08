import React, { useState } from 'react';
import { useReportStore } from '../../store/useReportStore';
import type { ReportData, ParentTask } from '../../store/useReportStore';
import SubtaskEditor from './SubtaskEditor';

interface TaskSectionProps {
    title: string;
    section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>;
    description?: string;
}

const TaskSection: React.FC<TaskSectionProps> = ({ title, section, description }) => {
    const { data, addParentTask, removeParentTask, updateParentTask } = useReportStore();
    const tasks = data[section] as ParentTask[];
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 mb-4">
                <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            </div>

            <div className="space-y-3">
                {tasks.map((task) => (
                    <div key={task.id} id={`task-${task.id}`} className="border border-slate-200 rounded-lg bg-white shadow-sm overflow-hidden transition-all duration-200">
                        {/* Parent Task Header (Accordion Trigger) */}
                        <div
                            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors ${expandedId === task.id ? 'bg-slate-50 border-b border-slate-100' : ''}`}
                        >
                            <div className="flex-1 flex items-center gap-3" onClick={() => toggleExpand(task.id)}>
                                <span className={`transform transition-transform duration-200 text-slate-400 ${expandedId === task.id ? 'rotate-90' : ''}`}>
                                    ▶
                                </span>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={task.title}
                                        onChange={(e) => updateParentTask(section, task.id, 'title', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-transparent font-medium text-slate-700 focus:outline-none focus:border-b focus:border-slate-400"
                                        placeholder="Task Title (e.g., Main Unit Inspection)"
                                    />
                                    <input
                                        type="text"
                                        value={task.description}
                                        onChange={(e) => updateParentTask(section, task.id, 'description', e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-transparent text-sm text-slate-500 mt-1 focus:outline-none focus:border-b focus:border-slate-400"
                                        placeholder="Brief description..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); removeParentTask(section, task.id); }}
                                className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
                                title="Remove Task"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Expanded Subtask Content */}
                        {expandedId === task.id && (
                            <div className="p-4 bg-slate-50/50">
                                <SubtaskEditor section={section} parentId={task.id} subtasks={task.subtasks} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={() => addParentTask(section)}
                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-medium hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-2"
            >
                <span>+</span> Add New {title.split(' ')[0]} Task
            </button>
        </div>
    );
};

export default TaskSection;
