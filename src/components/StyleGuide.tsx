import React from 'react';

const StyleGuide: React.FC = () => {
    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-800">
            <header className="mb-12 border-b border-slate-200 pb-4">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                    Design System: Modern Industrial
                </h1>
                <p className="text-slate-500">
                    Base Theme: Slate Primary • Inter + Noto Sans JP • Radius 6px
                </p>
            </header>

            {/* Typography Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-700 mb-6 border-l-4 border-slate-500 pl-3">
                    Typography
                </h2>
                <div className="space-y-6 bg-white p-6 rounded-md shadow-sm border border-slate-200">
                    <div>
                        <h1 className="text-4xl font-bold">Heading 1 (4xl) - 日本語タイトル</h1>
                        <p className="text-slate-400 text-sm mt-1">Inter / Noto Sans JP Bold</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">Heading 2 (3xl) - セクション見出し</h2>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold">Heading 3 (2xl) - サブセクション</h3>
                    </div>
                    <div>
                        <p className="text-base leading-relaxed max-w-2xl">
                            Body Text (Base): Service engineers return from field work fatigued.
                            The UI must feel assistive, not supervisory.
                            作業員は現場作業で疲労しているため、UIは管理的ではなく支援的であるべきです。
                            Regular text should be readable and have good contrast.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 max-w-2xl">
                            Small Text (Sm): Secondary information, captions, or metadata.
                            注釈やメタデータに使用するテキストサイズです。
                        </p>
                    </div>
                </div>
            </section>

            {/* Colors Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-700 mb-6 border-l-4 border-slate-500 pl-3">
                    Color Palette
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Brand / Primary */}
                    <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200">
                        <h3 className="font-medium mb-4 text-slate-900">Primary (Slate)</h3>
                        <div className="space-y-2">
                            <div className="h-10 rounded bg-slate-50 flex items-center px-3 text-xs text-slate-500 border border-slate-200">Slate 50 (App Background)</div>
                            <div className="h-10 rounded bg-slate-100 flex items-center px-3 text-xs text-slate-600">Slate 100 (Panel Background)</div>
                            <div className="h-10 rounded bg-slate-200 flex items-center px-3 text-xs text-slate-700">Slate 200 (Borders)</div>
                            <div className="h-10 rounded bg-slate-700 flex items-center px-3 text-xs text-white">Slate 700 (Primary Action / Brand)</div>
                            <div className="h-10 rounded bg-slate-900 flex items-center px-3 text-xs text-white">Slate 900 (Text High Contrast)</div>
                        </div>
                    </div>

                    {/* Semantic */}
                    <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200">
                        <h3 className="font-medium mb-4 text-slate-900">Semantic Colors</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded bg-red-600 shadow-sm"></div>
                                <div>
                                    <div className="font-bold text-red-600">Error / Required</div>
                                    <div className="text-xs text-slate-500">Red 600 (🔴 Required)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded bg-amber-500 shadow-sm"></div>
                                <div>
                                    <div className="font-bold text-amber-600">Warning / Recommended</div>
                                    <div className="text-xs text-slate-500">Amber 500 (🟡 Recommended)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded bg-blue-600 shadow-sm"></div>
                                <div>
                                    <div className="font-bold text-blue-600">Info / Optional</div>
                                    <div className="text-xs text-slate-500">Blue 600 (🔵 Optional)</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded bg-emerald-600 shadow-sm"></div>
                                <div>
                                    <div className="font-bold text-emerald-600">Success</div>
                                    <div className="text-xs text-slate-500">Emerald 600 (✅ Success)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Components Preview */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold text-slate-700 mb-6 border-l-4 border-slate-500 pl-3">
                    Component Examples
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card */}
                    <div className="bg-white p-5 rounded-md shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-slate-800">Review Card</h3>
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium border border-red-200">
                                Required
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                            Maintenance reports must include confirmation of normal operation.
                        </p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded shadow-sm hover:bg-slate-800 transition-colors">
                                Apply Change
                            </button>
                            <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 text-sm rounded hover:bg-slate-50 transition-colors">
                                Dismiss
                            </button>
                        </div>
                    </div>

                    {/* Form Elements */}
                    <div className="bg-white p-5 rounded-md shadow-sm border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Work Overview <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent placeholder:text-slate-400"
                            placeholder="Enter summary..."
                            defaultValue="Routine inspection of Unit A"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            Structured field example with focus state.
                        </p>
                    </div>

                    {/* Status Badges */}
                    <div className="bg-white p-5 rounded-md shadow-sm border border-slate-200 flex flex-col justify-center gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Draft Status</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                Draft v1
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Review Status</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                                Complete
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Issues</span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                <span className="text-xs text-slate-700">2 unresolved</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default StyleGuide;
