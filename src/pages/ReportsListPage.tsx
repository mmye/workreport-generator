import React, { useState } from 'react';
import { useReportsListStore } from '../store/useReportsListStore';
import type { ReportStatus } from '../store/useReportsListStore';
import { useAuthStore } from '../store/useAuthStore';
import { useMasterStore } from '../store/useMasterStore';
import { Link } from 'react-router-dom';
import ResourceSidebar from '../components/navigation/ResourceSidebar';
import MachineInfoCard from '../components/dashboard/MachineInfoCard';
import NewReportModal from '../components/report/NewReportModal';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const ReportsListPage: React.FC = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuthStore();
    // const navigate = useNavigate(); // Unused
    const {
        reports,
        searchQuery,
        statusFilter,
        setSearchQuery,
        setStatusFilter,
        deleteReport,
        duplicateReport,
        // createReport // used implicitly
    } = useReportsListStore();

    const { selectedClientId, selectedMachineId } = useMasterStore();
    const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            deleteReport(id);
        }
    };

    // Filtering Logic
    const filteredReports = reports.filter(report => {
        // 1. Text Search
        const matchesSearch =
            report.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.toLowerCase());

        // 2. Status Filter
        const matchesStatus = statusFilter === 'All' || report.status === statusFilter;

        // 3. Drill-down Filters
        let matchesDrillDown = true;
        if (selectedMachineId) {
            matchesDrillDown = report.machineId === selectedMachineId;
        } else if (selectedClientId) {
            matchesDrillDown = report.clientId === selectedClientId;
        }

        return matchesSearch && matchesStatus && matchesDrillDown;
    });

    const getStatusColor = (status: ReportStatus) => {
        switch (status) {
            case 'Final': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Review': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Draft': return 'bg-slate-100 text-slate-800 border-slate-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Helper for status translation
    const getStatusLabel = (status: ReportStatus | 'All') => {
        if (status === 'All') return t('app.status.all');
        return t(`app.status.${status.toLowerCase()}`);
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shrink-0 z-10 w-full">
                <div className="max-w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-xl font-bold text-slate-800 hover:text-slate-600">{t('app.title')}</Link>
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500 font-mono">{t('app.version')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        <Link to="/settings" className="p-2 text-slate-400 hover:text-slate-600 transition-colors" title={t('app.settings')}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </Link>
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-800">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-slate-500">{user?.role || 'Viewer'}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                            title={t('app.logout')}
                        >
                            <span className="sr-only">{t('app.logout')}</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <ResourceSidebar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                    <div className="max-w-5xl mx-auto">

                        <MachineInfoCard />

                        {/* Actions & Filters */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                            <div className="flex space-x-4 w-full sm:w-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('app.search')}
                                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>

                                <select
                                    className="pl-3 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as any)}
                                >
                                    <option value="All">{t('app.status.all')}</option>
                                    <option value="Draft">{t('app.status.draft')}</option>
                                    <option value="Review">{t('app.status.review')}</option>
                                    <option value="Final">{t('app.status.final')}</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setIsNewReportModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                {t('app.create')}
                            </button>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('app.table.id')}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('app.table.date')}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('app.table.client_desc')}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('app.table.status')}</th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t('app.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                <Link to={`/report/${report.id}`} className="hover:underline">{report.id}</Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {report.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                                                <div className="font-medium">{report.client}</div>
                                                <div className="text-slate-500 text-xs truncate max-w-[200px]">{report.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(report.status)}`}>
                                                    {getStatusLabel(report.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link to={`/report/${report.id}`} className="text-slate-400 hover:text-blue-600" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                    </Link>
                                                    <button onClick={() => duplicateReport(report.id)} className="text-slate-400 hover:text-amber-600" title="Duplicate">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(report.id)} className="text-slate-400 hover:text-red-600" title="Delete">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredReports.length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    {t('app.table.no_reports')}
                                    {(selectedClientId || selectedMachineId) && (
                                        <p className="text-sm mt-2 text-blue-500">{t('app.table.clear_selection')}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* New Report Modal */}
            <NewReportModal isOpen={isNewReportModalOpen} onClose={() => setIsNewReportModalOpen(false)} />
        </div>
    );
};

export default ReportsListPage;
