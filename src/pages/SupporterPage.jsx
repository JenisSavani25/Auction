import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import Navbar from '../components/layout/Navbar';
import SponsorshipCard from '../components/auction/SponsorshipCard';
import RecentBidsPanel from '../components/auction/RecentBidsPanel';
import Leaderboard from '../components/auction/Leaderboard';
import RevenueSummary from '../components/auction/RevenueSummary';
import UserTeamAuction from '../components/auction/UserTeamAuction';
import { Search, Gavel, ShieldCheck, Users } from 'lucide-react';

const FILTERS = ['ALL', 'OPEN', 'UPCOMING', 'ALLOTED'];

export default function SupporterPage() {
    const [activeTab, setActiveTab] = useState('sponsorships');
    const { sponsorships, users } = useAuction();
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    // Guard: wait for server state to load
    if (!users || !sponsorships) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Connecting…</p>
                </div>
            </div>
        );
    }

    const filtered = sponsorships.filter((s) => {
        if (s.status === 'REJECTED') return false;
        if (filter !== 'ALL' && s.status !== filter) return false;
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const liveCount = sponsorships.filter((s) => s.status === 'OPEN').length;

    const tabs = [
        { id: 'sponsorships', label: 'Auctions', Icon: Gavel },
        { id: 'teams', label: 'Teams', Icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

            {/* Premium Mobile Tab Bar */}
            <div className="md:hidden sticky top-16 lg:top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4">
                <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-1 whitespace-nowrap ${activeTab === id
                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]'
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
                {activeTab === 'teams' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <UserTeamAuction />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-in fade-in duration-700">
                        {/* LEFT: Sponsorship Content */}
                        <div className="lg:col-span-8 space-y-4">

                            {/* Header & Stats */}
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                                        Supporter Proxy <Users className="w-6 h-6 text-amber-500" />
                                    </h1>
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 w-fit">
                                        <div className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-pulse" />
                                        <p className="text-amber-700 text-[10px] font-black uppercase tracking-widest">
                                            {liveCount > 0 ? `${liveCount} Live Lots to act on` : 'Awaiting admin start'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Advanced Filters */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-0 bg-blue-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by sponsorship name..."
                                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all shadow-sm text-sm"
                                        id="search-sponsorships"
                                    />
                                </div>
                                <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-[1.25rem] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                                    {FILTERS.map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 whitespace-nowrap ${filter === f
                                                    ? 'bg-slate-900 text-white shadow-md'
                                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cards Grid */}
                            {filtered.length === 0 ? (
                                <div className="bg-white p-20 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200 shadow-inner">
                                    <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-sm">
                                        <Search className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">No Matches Found</h3>
                                    <p className="text-slate-400 font-medium text-sm mt-2 max-w-xs mx-auto text-balance">We couldn't find any sponsorship lots matching your current criteria.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[...filtered]
                                        .sort((a, b) => {
                                            const order = { OPEN: 0, UPCOMING: 1, ALLOTED: 2 };
                                            return (order[a.status] ?? 3) - (order[b.status] ?? 3);
                                        })
                                        .map((sp) => (
                                            <SponsorshipCard key={sp.id} sponsorship={sp} />
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Dynamic Insights */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="lg:sticky lg:top-24 space-y-4">
                                <RecentBidsPanel />
                                <Leaderboard />
                                <RevenueSummary />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
