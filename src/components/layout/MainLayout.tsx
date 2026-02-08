import React from 'react';
import VersionBar from './VersionBar';
import ActionBar from './ActionBar';
import InputPane from './InputPane';
import FeedbackPanel from './FeedbackPanel';
import NavigationSidebar from '../navigation/NavigationSidebar';
import BreadcrumbsBar from '../navigation/BreadcrumbsBar';
import { useNavigationStore } from '../../store/useNavigationStore';

const MainLayout: React.FC = () => {
    const { viewMode } = useNavigationStore();

    return (
        <div className="flex flex-col h-screen bg-slate-50 w-full overflow-hidden">
            {/* Top Bar */}
            <VersionBar />

            {/* Middle Workspace */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Navigation Sidebar (Left) */}
                {viewMode === 'tree' && <NavigationSidebar />}

                {/* Content Area (Center + Right) */}
                <div className="flex-1 flex flex-col min-w-0 relative">
                    {/* Breadcrumbs Bar (Top of Content) - Only when sidebar is hidden/collapsed logic implies view mode */}
                    <BreadcrumbsBar />

                    <div className="flex flex-1 overflow-hidden relative">
                        <InputPane />
                        <FeedbackPanel />
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <ActionBar />
        </div>
    );
};

export default MainLayout;
