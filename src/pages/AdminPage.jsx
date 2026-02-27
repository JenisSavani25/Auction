import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import Navbar from '../components/layout/Navbar';
import AdminSponsorshipManager from '../components/admin/AdminSponsorshipManager';
import UserManager from '../components/admin/UserManager';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import AdminTeamAuction from '../components/admin/AdminTeamAuction';
import RevenueSummary from '../components/auction/RevenueSummary';
import Leaderboard from '../components/auction/Leaderboard';
import SponsorshipCard from '../components/auction/SponsorshipCard';
import RecentBidsPanel from '../components/auction/RecentBidsPanel';
import { LayoutGrid, Users, Gavel, BarChart3, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { sponsorships } = useAuction();

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Left: Sponsorship Overview */}
                        <div className="xl:col-span-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="section-title text-xl">Auction Overview</h2>
                                <button
                                    onClick={() => setActiveTab('sponsorships')}
                                    className="text-blue-600 hover:text-blue-500 text-sm font-bold flex items-center gap-1 transition-colors"
                                >
                                    Manage →
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {sponsorships
                                    .filter((s) => s.status !== 'REJECTED')
                                    .slice(0, 4)
                                    .map((sp) => (
                                        <SponsorshipCard key={sp.id} sponsorship={sp} />
                                    ))}
                            </div>
                        </div>

                        {/* Right sidebar */}
                        <div className="space-y-4">
                            <RevenueSummary />
                            <RecentBidsPanel />
                            <Leaderboard />
                        </div>
                    </div>
                );
            case 'sponsorships':
                return <AdminSponsorshipManager />;
            case 'users':
                return <UserManager />;
            case 'teams':
                return <AdminTeamAuction />;
            case 'analytics':
                return <AdminAnalytics />;
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', Icon: LayoutGrid },
        { id: 'sponsorships', label: 'Sponsorships', Icon: Gavel },
        { id: 'teams', label: 'Teams Bidding', Icon: ShieldCheck },
        { id: 'users', label: 'Users', Icon: Users },
        { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen">
            <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

            {/* Mobile tabs */}
            <div className="md:hidden sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
                <div className="flex overflow-x-auto">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap flex-shrink-0 border-b-2 transition-all ${activeTab === id
                                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
                {renderContent()}
            </main>
        </div>
    );
}
