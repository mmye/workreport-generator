import React from 'react';
import { useReportStore } from '../../store/useReportStore';
import type { ReportData, Subtask } from '../../store/useReportStore';

interface SubtaskEditorProps {
    section: keyof Pick<ReportData, 'inspectionTasks' | 'abnormalityTasks' | 'verificationTasks'>;
    parentId: string;
    subtasks: Subtask[];
}

const SubtaskEditor: React.FC<SubtaskEditorProps> = ({ section, parentId, subtasks }) => {
    const { addSubtask, removeSubtask, updateSubtask, duplicateTask } = useReportStore();

    return (
        <div className="space-y-6 pl-4 border-l-2 border-slate-200">
            {subtasks.map((subtask, index) => (
                <div key={subtask.id} id={`subtask-${subtask.id}`} className="bg-white p-4 rounded-md border border-slate-200 shadow-sm relative group">

                    {/* Subtask Header & Actions */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded">#{index + 1}</span>
                            <input
                                type="text"
                                value={subtask.title}
                                onChange={(e) => updateSubtask(section, parentId, subtask.id, 'title', e.target.value)}
                                className="font-bold text-slate-700 bg-transparent focus:outline-none focus:border-b focus:border-blue-400"
                                placeholder="Subtask Title..."
                            />
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => duplicateTask(section, parentId, subtask.id)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                title="Duplicate"
                            >
                                ❐
                            </button>
                            <button
                                onClick={() => removeSubtask(section, parentId, subtask.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <textarea
                            value={subtask.description}
                            onChange={(e) => updateSubtask(section, parentId, subtask.id, 'description', e.target.value)}
                            className="w-full text-sm text-slate-600 border border-slate-200 rounded p-2 focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-slate-50"
                            rows={2}
                            placeholder="What was done?"
                        />
                    </div>

                    {/* Measurements (Ch2 Specific) */}
                    {section === 'inspectionTasks' && (
                        <div className="mb-4">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Measurements</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {subtask.measurements.map(m => (
                                    <div key={m.id} className="flex gap-2 items-center bg-slate-50 p-1.5 rounded border border-slate-100">
                                        <span className="font-medium text-slate-700">{m.label}:</span>
                                        <span>{m.value}{m.unit}</span>
                                    </div>
                                ))}
                                <button className="text-xs text-blue-600 hover:underline text-left">+ Add Measurement</button>
                            </div>
                        </div>
                    )}

                    {/* Parts Used */}
                    <div className="mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parts Used</h4>
                        {subtask.parts.length > 0 ? (
                            <ul className="text-sm space-y-1 mb-2">
                                {subtask.parts.map(p => (
                                    <li key={p.id} className="flex justify-between border-b border-slate-100 pb-1">
                                        <span>{p.name}</span>
                                        <span className="text-slate-500">x{p.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <div className="text-xs text-slate-400 italic mb-2">No parts recorded</div>}
                        <div className="flex gap-2">
                            <input type="text" placeholder="Search parts..." className="flex-1 text-xs border border-slate-200 rounded px-2 py-1" />
                            <button className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded text-slate-600">Add</button>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Images</h4>
                        <div className="flex flex-wrap gap-2">
                            {subtask.images.map(img => (
                                <div key={img.id} className="w-20 h-20 bg-slate-100 rounded border border-slate-200 flex items-center justify-center relative group/img">
                                    <span className="text-xs text-slate-400">img</span>
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-end justify-center p-1">
                                        <span className="text-[10px] text-white truncate w-full text-center">{img.caption}</span>
                                    </div>
                                </div>
                            ))}
                            <button className="w-20 h-20 border-2 border-dashed border-slate-200 rounded flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-colors">
                                <span className="text-lg">+</span>
                                <span className="text-[10px]">Photo</span>
                            </button>
                        </div>
                    </div>

                </div>
            ))}

            <button
                onClick={() => addSubtask(section, parentId)}
                className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
            >
                <span>+</span> Add Subtask
            </button>
        </div>
    );
};

export default SubtaskEditor;
