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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-in fade-in duration-700">
                        {/* Left: Sponsorship Overview */}
                        <div className="lg:col-span-8 space-y-5">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Control Center</h2>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Global Overview & Quick Actions</p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('sponsorships')}
                                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95"
                                >
                                    Manage Matrix
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {sponsorships
                                    .filter((s) => s.status !== 'REJECTED')
                                    .slice(0, 4)
                                    .map((sp) => (
                                        <SponsorshipCard key={sp.id} sponsorship={sp} />
                                    ))}
                                {sponsorships.filter(s => s.status !== 'REJECTED').length === 0 && (
                                    <div className="sm:col-span-2 bg-white/50 p-16 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200 shadow-inner">
                                        <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-sm">
                                            <LayoutGrid className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Active Protocols</h3>
                                        <p className="text-slate-400 font-medium text-sm mt-2 max-w-xs mx-auto">Initialize new sponsorship lots to begin the auction matrix.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right sidebar */}
                        <div className="lg:col-span-4 space-y-5">
                            <div className="lg:sticky lg:top-24 space-y-4">
                                <RevenueSummary />
                                <RecentBidsPanel />
                                <Leaderboard />
                            </div>
                        </div>
                    </div>
                );
            case 'sponsorships':
                return <div className="animate-in fade-in slide-in-from-bottom-6 duration-700"><AdminSponsorshipManager /></div>;
            case 'users':
                return <div className="animate-in fade-in slide-in-from-bottom-6 duration-700"><UserManager /></div>;
            case 'teams':
                return <div className="animate-in fade-in slide-in-from-bottom-6 duration-700"><AdminTeamAuction /></div>;
            case 'analytics':
                return <div className="animate-in fade-in slide-in-from-bottom-6 duration-700"><AdminAnalytics /></div>;
            default:
                return null;
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Monitor', Icon: LayoutGrid },
        { id: 'sponsorships', label: 'Auctions', Icon: Gavel },
        { id: 'teams', label: 'Teams', Icon: ShieldCheck },
        { id: 'users', label: 'Participants', Icon: Users },
        { id: 'analytics', label: 'Matrix', Icon: BarChart3 },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

            {/* Premium Mobile Tab Bar */}
            <div className="md:hidden sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4">
                <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex-1 whitespace-nowrap ${activeTab === id
                                ? 'bg-slate-900 text-white shadow-lg scale-[1.02]'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
                {renderContent()}
            </main>
        </div>
    );
}

