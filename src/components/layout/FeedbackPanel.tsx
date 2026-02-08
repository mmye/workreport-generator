import React from 'react';
import { useReportStore } from '../../store/useReportStore';
import type { Suggestion } from '../../store/useReportStore';

const FeedbackPanel: React.FC = () => {
    const { suggestions, isReviewing, applySuggestion, dismissSuggestion } = useReportStore();

    const activeSuggestions = suggestions.filter(s => s.status !== 'dismissed' && s.status !== 'applied');
    const resolvedCount = suggestions.filter(s => s.status === 'applied').length;

    return (
        <div className="w-[400px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 flex items-center">
                    Feedback Panel
                    {activeSuggestions.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                            {activeSuggestions.length}
                        </span>
                    )}
                </h3>
                {resolvedCount > 0 && (
                    <span className="text-xs text-emerald-600 font-medium">✅ {resolvedCount} resolved</span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isReviewing ? (
                    <div className="flex flex-col items-center justify-center h-40 space-y-3 opacity-50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
                        <p className="text-sm text-slate-500">Analyzing report...</p>
                    </div>
                ) : activeSuggestions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <p className="mb-2 text-4xl">👋</p>
                        <p className="text-sm">
                            Press <span className="font-medium text-slate-600">Request Review</span><br />
                            to analyze your report.
                        </p>
                    </div>
                ) : (
                    activeSuggestions.map((suggestion) => (
                        <SuggestionCard
                            key={suggestion.id}
                            suggestion={suggestion}
                            onApply={() => applySuggestion(suggestion.id)}
                            onDismiss={() => dismissSuggestion(suggestion.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const SuggestionCard: React.FC<{
    suggestion: Suggestion;
    onApply: () => void;
    onDismiss: () => void;
}> = ({ suggestion, onApply, onDismiss }) => {
    const severityColors = {
        required: 'border-l-red-500 bg-red-50/50',
        recommended: 'border-l-amber-500 bg-amber-50/50',
        optional: 'border-l-blue-500 bg-blue-50/50',
    };

    const badgeColors = {
        required: 'text-red-700 bg-red-100 border-red-200',
        recommended: 'text-amber-700 bg-amber-100 border-amber-200',
        optional: 'text-blue-700 bg-blue-100 border-blue-200',
    };

    return (
        <div className={`bg-white rounded-md shadow-sm border border-slate-200 border-l-4 p-4 ${severityColors[suggestion.severity]}`}>
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${badgeColors[suggestion.severity]}`}>
                    {suggestion.severity}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                    {suggestion.type}
                </span>
            </div>

            <div className="mb-3">
                <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                    📍 {suggestion.label}
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                    {suggestion.reason}
                </p>
            </div>

            {(suggestion.proposedText) && (
                <div className="mb-4 bg-slate-50 p-2 rounded border border-slate-200 text-sm">
                    {suggestion.originalText && (
                        <div className="text-red-500 line-through text-xs mb-1 opacity-60">
                            {suggestion.originalText}
                        </div>
                    )}
                    <div className="text-emerald-700 font-medium">
                        {suggestion.proposedText}
                    </div>
                </div>
            )}

            <div className="flex gap-2 mt-2">
                {suggestion.proposedText && (
                    <button
                        onClick={onApply}
                        className="flex-1 py-1.5 bg-slate-800 text-white text-xs rounded hover:bg-slate-900 transition-colors shadow-sm"
                    >
                        Apply
                    </button>
                )}
                <button
                    onClick={onDismiss}
                    className="px-3 py-1.5 bg-white text-slate-500 border border-slate-200 text-xs rounded hover:bg-slate-50 transition-colors"
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default FeedbackPanel;
