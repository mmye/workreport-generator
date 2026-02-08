import React, { useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
    const { wordTemplate, templateName, setWordTemplate, resetWordTemplate } = useSettingsStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setWordTemplate(e.target.files[0]);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
                    </div>
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-2">Report Template</h2>
                        <p className="text-slate-500 text-sm">
                            Upload a Microsoft Word (.docx) template. This template will be used for all report exports.
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>

                        {wordTemplate ? (
                            <div className="space-y-4">
                                <p className="text-slate-700 font-medium">{templateName}</p>
                                <p className="text-xs text-slate-400">{(wordTemplate.size / 1024).toFixed(1)} KB</p>

                                <div className="flex justify-center space-x-3">
                                    <button
                                        onClick={handleClickUpload}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Replace
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                        onClick={resetWordTemplate}
                                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-slate-700 font-medium">No template uploaded</p>
                                <p className="text-xs text-slate-400">Using default system template</p>
                                <button
                                    onClick={handleClickUpload}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Upload Template
                                </button>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".docx"
                            className="hidden"
                        />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
                        <strong>Note:</strong> The template must contain specific placeholders (e.g., <code>{'{{report_id}}'}</code>) to be populated correctly.
                        <a href="#" className="underline ml-2">Download sample template</a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
