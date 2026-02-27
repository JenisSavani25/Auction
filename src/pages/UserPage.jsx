import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import Navbar from '../components/layout/Navbar';
import SponsorshipCard from '../components/auction/SponsorshipCard';
import RecentBidsPanel from '../components/auction/RecentBidsPanel';
import Leaderboard from '../components/auction/Leaderboard';
import RevenueSummary from '../components/auction/RevenueSummary';
import UserTeamAuction from '../components/auction/UserTeamAuction';
import { Search, SlidersHorizontal, Gavel, ShieldCheck } from 'lucide-react';

const FILTERS = ['ALL', 'OPEN', 'UPCOMING', 'ALLOTED'];

export default function UserPage() {
    const [activeTab, setActiveTab] = useState('sponsorships');
    const { sponsorships } = useAuction();
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');

    const filtered = sponsorships.filter((s) => {
        if (s.status === 'REJECTED') return false;
        if (filter !== 'ALL' && s.status !== filter) return false;
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const liveCount = sponsorships.filter((s) => s.status === 'OPEN').length;

    const tabs = [
        { id: 'sponsorships', label: 'Sponsorship Auctions', Icon: Gavel },
        { id: 'teams', label: 'Team Bidding', Icon: ShieldCheck },
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
                {activeTab === 'teams' ? (
                    <UserTeamAuction />
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* LEFT: Sponsorship cards */}
                        <div className="xl:col-span-2 space-y-5">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-black font-poppins text-slate-800 uppercase tracking-tight">Live Auctions</h1>
                                    <p className="text-slate-500 text-sm mt-0.5 font-medium">
                                        {liveCount > 0 ? (
                                            <span className="text-blue-600 font-bold">{liveCount} auction{liveCount !== 1 ? 's' : ''} live now</span>
                                        ) : (
                                            'No live auctions at the moment'
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Search + Filter bar */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search sponsorships..."
                                        className="input-field pl-10"
                                        id="search-sponsorships"
                                    />
                                </div>
                                <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm flex-shrink-0">
                                    {FILTERS.map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${filter === f
                                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cards grid */}
                            {filtered.length === 0 ? (
                                <div className="glass-card p-16 text-center border-dashed border-2">
                                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Gavel className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-bold text-lg">No sponsorships found</p>
                                    <p className="text-slate-400 text-sm mt-1">Try adjusting your filter or search</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Show OPEN cards first */}
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

                        {/* RIGHT: Sidebar panels */}
                        <div className="space-y-4">
                            <RecentBidsPanel />
                            <Leaderboard />
                            <RevenueSummary />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
