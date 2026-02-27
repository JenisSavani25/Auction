import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import Navbar from '../components/layout/Navbar';
import {
    Trophy, Users, Star, Activity, Clock, Award,
    BarChart3, TrendingUp,
    History, CheckCircle2, MapPin, Search,
    Flame, Gavel, ShieldCheck, Zap
} from 'lucide-react';
import { formatCurrency, formatTime, getInitials, timeAgo } from '../utils/helpers';

const DashboardPage = () => {
    const { sponsorships, teamAuction, leaderboard, recentBids, users } = useAuction();
    const [now, setNow] = useState(Date.now());
    const [viewMode, setViewMode] = useState('sponsorships');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Filter participants based on search
    const filteredParticipants = users.filter(u =>
        (u.role === 'user' || !u.role) && (
            u.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.villageName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const liveSponsorships = sponsorships.filter(s => s.status === 'OPEN');
    const finalizedSponsorships = sponsorships.filter(s => s.status === 'ALLOTED');
    const totalBids = sponsorships.reduce((sum, s) => sum + s.bids.length, 0);
    const totalRevenue = finalizedSponsorships.reduce((sum, s) => sum + (s.currentHighestBid || 0), 0);

    const tabs = [
        { id: 'sponsorships', label: 'Sponsorship Lots', Icon: Gavel },
        { id: 'teams', label: 'Team Allocation', Icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Use the same Navbar as Admin/User but without tab-switching */}
            <Navbar />

            {/* Mobile Tab Bar */}
            <div className="md:hidden sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4">
                <div className="flex gap-2 py-3">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setViewMode(id)}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-1 ${viewMode === id
                                ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            <Icon className="w-4 h-4" />{label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 space-y-6">

                {/* ── Stats Bar ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Live Auctions', value: liveSponsorships.length, Icon: Flame, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                        { label: 'Total Bids', value: totalBids, Icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                        { label: 'Allotted Lots', value: finalizedSponsorships.length, Icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { label: 'Total Revenue', value: formatCurrency(totalRevenue), Icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', isCurrency: true },
                    ].map(({ label, value, Icon, color, bg, border, isCurrency }) => (
                        <div key={label} className={`glass-card p-5 bg-white border border-slate-200 flex items-center gap-4`}>
                            <div className={`w-11 h-11 rounded-2xl ${bg} border ${border} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div>
                                <p className="label text-slate-400">{label}</p>
                                <p className={`text-xl font-black font-mono tracking-tight ${color}`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Desktop Tab Switcher ── */}
                <div className="hidden md:flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setViewMode(id)}
                            className={`flex items-center gap-2 px-7 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === id
                                ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />{label}
                        </button>
                    ))}
                </div>

                {/* ══════════ SPONSORSHIPS VIEW ══════════ */}
                {viewMode === 'sponsorships' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 animate-in fade-in duration-700">

                        {/* LEFT: Live + Upcoming + Finalized */}
                        <div className="lg:col-span-8 space-y-5">

                            {/* Live Auctions */}
                            <section>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                                        <Flame className="w-5 h-5 text-red-500" /> Live Auctions
                                    </h2>
                                    {liveSponsorships.length > 0 && (
                                        <span className="px-3 py-1 bg-red-50 border border-red-100 rounded-full text-red-600 text-[10px] font-black uppercase tracking-widest">
                                            {liveSponsorships.length} Active
                                        </span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {liveSponsorships.map(sp => {
                                        const diff = Math.max(0, new Date(sp.endTime).getTime() - now);
                                        const m = Math.floor(diff / 60000);
                                        const s = Math.floor((diff % 60000) / 1000);
                                        const isUrgent = diff > 0 && diff < 60000;
                                        return (
                                            <div key={sp.id} className="glass-card bg-white border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                                                {/* Live dot */}
                                                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-100 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="text-red-600 text-[9px] font-black uppercase tracking-widest">Live</span>
                                                </div>

                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4 pr-16 truncate">{sp.name}</h3>

                                                {/* Current Bid */}
                                                <div className="mb-5">
                                                    <p className="label text-slate-400 mb-1">Highest Bid</p>
                                                    <p className="text-3xl font-black font-mono text-blue-700 tracking-tighter">
                                                        {formatCurrency(sp.currentHighestBid || sp.basePrice)}
                                                    </p>
                                                    {sp.currentHighestBidderCompany && (
                                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1 truncate">
                                                            ↑ {sp.currentHighestBidderCompany}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Timer */}
                                                <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${isUrgent ? 'bg-red-50 border-red-200 animate-pulse' : diff === 0 ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-600' : diff === 0 ? 'text-slate-400' : 'text-slate-400'}`} />
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isUrgent ? 'text-red-700' : diff === 0 ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {diff === 0 ? 'Timer Ended' : 'Closing In'}
                                                        </span>
                                                    </div>
                                                    <span className={`text-lg font-black font-mono tracking-tighter ${isUrgent ? 'text-red-600' : diff === 0 ? 'text-slate-400' : 'text-white'}`}>
                                                        {diff === 0 ? 'CLOSED' : `${m}:${s.toString().padStart(2, '0')}`}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {liveSponsorships.length === 0 && (
                                        <div className="col-span-full py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-center flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                                                <Clock className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No live auctions at this moment</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Finalized Lots */}
                            {finalizedSponsorships.length > 0 && (
                                <section>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3 mb-5">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Completed Auctions
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {finalizedSponsorships.map(sp => (
                                            <div key={sp.id} className="glass-card bg-white border border-emerald-200 p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-300 relative overflow-hidden">
                                                {/* Allotted badge */}
                                                <div className="absolute top-5 right-5 flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-emerald-600 text-[9px] font-black uppercase tracking-widest">Allotted</span>
                                                </div>

                                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4 pr-20 truncate">{sp.name}</h3>

                                                {/* Final Bid */}
                                                <div className="mb-5">
                                                    <p className="label text-slate-400 mb-1">Final Bid</p>
                                                    <p className="text-3xl font-black font-mono text-blue-700 tracking-tighter">
                                                        {formatCurrency(sp.currentHighestBid)}
                                                    </p>
                                                    {sp.currentHighestBidderCompany && (
                                                        <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-1 truncate">
                                                            🏆 {sp.currentHighestBidderCompany}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Winner row */}
                                                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Winner</span>
                                                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate ml-2">{sp.currentHighestBidder || '—'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* RIGHT: Live Bid Stream */}
                        <div className="lg:col-span-4">
                            <div className="lg:sticky lg:top-28">
                                <div className="glass-card bg-white border border-slate-200 flex flex-col overflow-hidden h-[560px]">
                                    <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                                            <Activity className="w-4 h-4 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="section-title text-slate-800">Live Bid Stream</h3>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Real-time auction activity</p>
                                        </div>
                                        {recentBids.length > 0 && (
                                            <span className="ml-auto px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black tracking-widest uppercase">
                                                {recentBids.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {recentBids.length > 0 ? (
                                            recentBids.map((bid, i) => {
                                                const spName = bid.sponsorshipName
                                                    || sponsorships.find(s => s.id === bid.sponsorshipId)?.name
                                                    || '—';
                                                return (
                                                    <div key={i} className={`p-3 rounded-xl border transition-all duration-200 ${i === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}>
                                                        {/* Top: avatar + company + amount */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                                                                {getInitials(bid.bidder)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-slate-800 text-xs font-black truncate uppercase tracking-tight">{bid.bidderCompany}</p>
                                                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest truncate">{bid.bidder}</p>
                                                            </div>
                                                            <div className="text-right flex-shrink-0">
                                                                <p className="text-blue-700 text-xs font-black font-mono">₹{bid.amount.toLocaleString()}</p>
                                                                <p className="text-slate-400 text-[9px] font-black uppercase">{timeAgo(bid.timestamp)}</p>
                                                            </div>
                                                        </div>
                                                        {/* Bottom: bidding on badge */}
                                                        <div className="mt-2 flex items-center gap-1.5">
                                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex-shrink-0">Bidding on:</span>
                                                            <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[9px] font-black uppercase tracking-widest truncate">
                                                                {spName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                                                    <Activity className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Awaiting first bid...</p>
                                                <p className="text-slate-300 font-bold text-[10px] uppercase tracking-widest mt-1">Bids appear here in real time</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ══════════ TEAMS VIEW ══════════ */
                    <div className="space-y-8 animate-in fade-in duration-700">

                        {/* Round Status Banner */}
                        <div className="rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-900 p-8 shadow-xl shadow-blue-700/20 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.08]" />
                            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                <div>
                                    <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Live Team Discovery</p>
                                    <h2 className="text-3xl font-black uppercase tracking-tight">Team Allocation</h2>
                                </div>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="text-center">
                                        <p className="text-blue-200/60 text-[9px] font-black uppercase tracking-widest mb-1">Benchmark Price</p>
                                        <p className="text-4xl font-black font-mono tracking-tighter">{formatCurrency(teamAuction.currentPrice)}</p>
                                    </div>
                                    <div className="h-12 w-px bg-white/10 hidden sm:block" />
                                    <div className="text-center">
                                        <p className="text-blue-200/60 text-[9px] font-black uppercase tracking-widest mb-1">Total Teams</p>
                                        <p className="text-4xl font-black">12</p>
                                    </div>
                                    <div className="h-12 w-px bg-white/10 hidden sm:block" />
                                    <div className="text-center">
                                        <p className="text-blue-200/60 text-[9px] font-black uppercase tracking-widest mb-1">Interested</p>
                                        <p className="text-4xl font-black text-yellow-300">{teamAuction.interestedBidders.length}</p>
                                    </div>
                                    <div className="h-12 w-px bg-white/10 hidden sm:block" />
                                    <div className="text-center">
                                        <p className="text-blue-200/60 text-[9px] font-black uppercase tracking-widest mb-1">Round</p>
                                        <p className="text-4xl font-black">{teamAuction.roundNumber}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${teamAuction.status === 'ROUND_ACTIVE' ? 'bg-emerald-500 border-white/20 text-white' : 'bg-white/10 border-white/10 text-white/60'}`}>
                                        {teamAuction.status.replace(/_/g, ' ')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Slots Grid — 4 cols × 3 rows = 12 slots */}
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
                                    <Users className="w-5 h-5 text-blue-600" /> Team Slots
                                    <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                        {teamAuction.interestedBidders.length} / 12
                                    </span>
                                </h2>
                                <div className="relative w-full sm:w-[240px]">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search sponsor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="input-field pl-11 text-[11px] uppercase font-black placeholder-slate-400 tracking-widest"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {Array.from({ length: 12 }, (_, idx) => {
                                    const teamNum = idx + 1;
                                    const assignedBidder = teamAuction.interestedBidders[idx] || null;
                                    const matchesSearch = !searchTerm || (
                                        assignedBidder?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        assignedBidder?.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
                                    );
                                    const dimmed = searchTerm && !matchesSearch;

                                    return (
                                        <div
                                            key={teamNum}
                                            className={`glass-card flex flex-col items-center text-center p-5 gap-3 transition-all duration-500 ${assignedBidder
                                                ? 'bg-blue-700 border-blue-600 shadow-lg shadow-blue-700/20'
                                                : 'bg-white border-slate-200 border-dashed'
                                                } ${dimmed ? 'opacity-25' : ''}`}
                                        >
                                            {/* Team Number Badge */}
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${assignedBidder ? 'bg-white/20 text-white border border-white/20' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                                #{teamNum}
                                            </div>

                                            {assignedBidder ? (
                                                <>
                                                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-700 text-xl font-black shadow-md border-4 border-white/20">
                                                        {assignedBidder.companyName?.[0] || 'S'}
                                                    </div>
                                                    <div className="min-w-0 w-full space-y-0.5">
                                                        <p className="text-white font-black text-sm uppercase tracking-tight leading-tight truncate">
                                                            {assignedBidder.companyName}
                                                        </p>
                                                        <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest truncate">
                                                            {assignedBidder.ownerName}
                                                        </p>
                                                        {assignedBidder.villageName && (
                                                            <p className="text-blue-200/70 text-[9px] font-black uppercase flex items-center justify-center gap-1">
                                                                <MapPin className="w-2.5 h-2.5" /> {assignedBidder.villageName}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full border border-white/20">
                                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Interested</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                                                        <Users className="w-6 h-6 text-slate-300" />
                                                    </div>
                                                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">Open Slot</p>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}


                {/* Footer */}
                <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Cricket Sponsorship Auction System • Live Dashboard • v2.0
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Total Valuation: </span>
                        <span className="text-xs font-mono font-black text-blue-600">
                            {formatCurrency(sponsorships.reduce((sum, s) => sum + (s.currentHighestBid || s.basePrice), 0))}
                        </span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default DashboardPage;
