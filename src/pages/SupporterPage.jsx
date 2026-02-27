import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import Navbar from '../components/layout/Navbar';
import { formatCurrency, getInitials } from '../utils/helpers';
import {
    Gavel, ShieldCheck, Users, CheckCircle2, Clock,
    ChevronDown, Zap, AlertCircle, Activity, MapPin
} from 'lucide-react';

// ── Sponsorship Bid Panel for one lot ─────────────────────────────────────────
function SponsorshipBidPanel({ sponsorship, sponsors, now }) {
    const { placeBidAs } = useAuction();
    const [selectedSponsor, setSelectedSponsor] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [bidError, setBidError] = useState('');
    const [bidSuccess, setBidSuccess] = useState(false);
    const [open, setOpen] = useState(false);

    const isOpen = sponsorship.status === 'OPEN';
    const diff = Math.max(0, new Date(sponsorship.endTime).getTime() - now);
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const isUrgent = diff > 0 && diff < 60000;
    const isExpired = diff === 0;
    const canBid = isOpen && !isExpired;

    const minBid = sponsorship.currentHighestBid > 0
        ? sponsorship.currentHighestBid + 1
        : sponsorship.basePrice;

    const handleBid = (e) => {
        e.preventDefault();
        setBidError('');
        if (!selectedSponsor) { setBidError('Select a sponsor first'); return; }
        const amount = parseFloat(bidAmount);
        if (isNaN(amount) || amount <= 0) { setBidError('Enter a valid bid amount'); return; }
        if (amount < sponsorship.basePrice) { setBidError(`Min bid is ${formatCurrency(sponsorship.basePrice)}`); return; }
        if (sponsorship.currentHighestBid > 0 && amount <= sponsorship.currentHighestBid) {
            setBidError(`Must exceed current highest: ${formatCurrency(sponsorship.currentHighestBid)}`);
            return;
        }
        const sponsor = sponsors.find(u => u.id === selectedSponsor);
        placeBidAs(sponsorship.id, amount, { ownerName: sponsor.ownerName, companyName: sponsor.companyName });
        setBidSuccess(true);
        setBidAmount('');
        setTimeout(() => setBidSuccess(false), 2500);
    };

    return (
        <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${open ? 'border-blue-300 shadow-lg' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
            {/* Header row — click to expand */}
            <div
                className={`px-5 py-4 flex items-center gap-4 cursor-pointer ${open ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
                onClick={() => setOpen(v => !v)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{sponsorship.name}</h3>
                        {isOpen && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-100 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-red-600 text-[9px] font-black uppercase tracking-widest">Live</span>
                            </span>
                        )}
                        {!isOpen && (
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-slate-500 text-[9px] font-black uppercase tracking-widest">
                                {sponsorship.status}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                        Highest: <span className="text-blue-700">{formatCurrency(sponsorship.currentHighestBid || sponsorship.basePrice)}</span>
                        {sponsorship.currentHighestBidderCompany && (
                            <> · {sponsorship.currentHighestBidderCompany}</>
                        )}
                    </p>
                </div>

                {/* Timer */}
                {isOpen && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-black flex-shrink-0 ${isUrgent ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : isExpired ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-white'}`}>
                        <Clock className="w-3.5 h-3.5" />
                        {isExpired ? 'DONE' : `${m}:${s.toString().padStart(2, '0')}`}
                    </div>
                )}

                <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </div>

            {/* Expanded Bid Form */}
            {open && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                    {!canBid ? (
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest py-2">
                            {sponsorship.status === 'ALLOTED' ? '✅ This lot has been allotted.' : 'Auction is not currently live.'}
                        </p>
                    ) : (
                        <form onSubmit={handleBid} className="flex flex-col sm:flex-row gap-3 items-end">
                            {/* Sponsor selector */}
                            <div className="flex-1 min-w-0">
                                <label className="text-slate-400 text-[9px] font-black uppercase tracking-widest block mb-1">Bidding On Behalf Of</label>
                                <select
                                    value={selectedSponsor}
                                    onChange={e => setSelectedSponsor(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm focus:outline-none focus:border-blue-500 transition-all"
                                >
                                    <option value="">— Select Sponsor —</option>
                                    {sponsors.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.companyName} · {u.ownerName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bid amount */}
                            <div className="flex-1 min-w-0">
                                <label className="text-slate-400 text-[9px] font-black uppercase tracking-widest block mb-1">Bid Amount (Min: {formatCurrency(minBid)})</label>
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={e => setBidAmount(e.target.value)}
                                    placeholder={`₹ ${minBid.toLocaleString()}`}
                                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm font-mono focus:outline-none focus:border-blue-500 transition-all"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-800 transition-all shadow-md active:scale-95 flex items-center gap-2 flex-shrink-0"
                            >
                                <Zap className="w-3.5 h-3.5" /> Place Bid
                            </button>
                        </form>
                    )}

                    {bidError && (
                        <div className="mt-3 flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-widest">
                            <AlertCircle className="w-3.5 h-3.5" /> {bidError}
                        </div>
                    )}
                    {bidSuccess && (
                        <div className="mt-3 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Bid Placed Successfully!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── Main SupporterPage ─────────────────────────────────────────────────────────
export default function SupporterPage() {
    const { sponsorships, users, teamAuction, toggleTeamInterestAs } = useAuction();
    const [activeTab, setActiveTab] = useState('sponsorships');
    const [now, setNow] = useState(Date.now());

    // Refresh clock every second for timers
    React.useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    // Only real sponsors — exclude admin, dashboard, and supporter accounts
    const sponsors = users.filter(u =>
        u.role !== 'admin' && u.role !== 'dashboard' && u.role !== 'supporter'
    );

    const liveCount = sponsorships.filter(s => s.status === 'OPEN').length;

    const tabs = [
        { id: 'sponsorships', label: 'Sponsorships', Icon: Gavel },
        { id: 'teams', label: 'Team Bid', Icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar onTabChange={setActiveTab} activeTab={activeTab} />

            {/* Mobile tab bar */}
            <div className="md:hidden sticky top-16 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4">
                <div className="flex gap-2 py-3">
                    {tabs.map(({ id, label, Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex-1 ${activeTab === id
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            <Icon className="w-4 h-4" />{label}
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 space-y-6">

                {/* ── Header Banner ── */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-amber-100 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Supporter Console</p>
                            <h1 className="text-2xl font-black uppercase tracking-tight">Bid on Behalf</h1>
                            <p className="text-amber-100/70 text-[10px] font-black uppercase tracking-widest mt-1">
                                Helping {sponsors.length} registered sponsor{sponsors.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex items-center gap-5 flex-shrink-0">
                            <div className="text-center">
                                <p className="text-amber-200/60 text-[9px] font-black uppercase tracking-widest mb-0.5">Live Lots</p>
                                <p className="text-3xl font-black text-red-200">{liveCount}</p>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div className="text-center">
                                <p className="text-amber-200/60 text-[9px] font-black uppercase tracking-widest mb-0.5">Sponsors</p>
                                <p className="text-3xl font-black">{sponsors.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════ SPONSORSHIPS TAB ══════════ */}
                {activeTab === 'sponsorships' && (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                <Gavel className="w-5 h-5 text-amber-500" /> Auction Lots
                            </h2>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {sponsorships.filter(s => s.status !== 'REJECTED').length} lots
                            </span>
                        </div>

                        {sponsorships.filter(s => s.status !== 'REJECTED').length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
                                <Gavel className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">No lots created yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {[...sponsorships]
                                    .filter(s => s.status !== 'REJECTED')
                                    .sort((a, b) => {
                                        const order = { OPEN: 0, UPCOMING: 1, ALLOTED: 2 };
                                        return (order[a.status] ?? 3) - (order[b.status] ?? 3);
                                    })
                                    .map(sp => (
                                        <SponsorshipBidPanel key={sp.id} sponsorship={sp} sponsors={sponsors} now={now} />
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ══════════ TEAM BID TAB ══════════ */}
                {activeTab === 'teams' && (
                    <div className="space-y-5 animate-in fade-in duration-500">
                        {/* Team status bar */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center gap-6">
                            <div>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Current Price</p>
                                <p className="text-2xl font-black font-mono text-blue-700">{formatCurrency(teamAuction.currentPrice)}</p>
                            </div>
                            <div className="h-10 w-px bg-slate-100" />
                            <div>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Status</p>
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${teamAuction.status === 'ROUND_ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                    {teamAuction.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="h-10 w-px bg-slate-100" />
                            <div>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Interested</p>
                                <p className="text-2xl font-black text-yellow-600">{teamAuction.interestedBidders.length} / 12</p>
                            </div>
                            <div className="h-10 w-px bg-slate-100" />
                            <div>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Round</p>
                                <p className="text-2xl font-black text-slate-800">{teamAuction.roundNumber}</p>
                            </div>
                        </div>

                        {/* Sponsor list with interest toggle */}
                        <div>
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-amber-500" /> Mark Interest on Behalf of Sponsors
                            </h2>

                            {sponsors.length === 0 ? (
                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                                    <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">No sponsors registered yet</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {sponsors.map(sponsor => {
                                        const isInterested = teamAuction.interestedBidders.some(b => b.id === sponsor.id);
                                        const canToggle = teamAuction.status === 'ROUND_ACTIVE';
                                        return (
                                            <div
                                                key={sponsor.id}
                                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${isInterested
                                                    ? 'bg-blue-700 border-blue-600 shadow-md shadow-blue-700/20'
                                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                {/* Avatar */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${isInterested ? 'bg-white text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {sponsor.companyName?.[0] || 'S'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-black text-sm uppercase tracking-tight truncate ${isInterested ? 'text-white' : 'text-slate-900'}`}>
                                                        {sponsor.companyName}
                                                    </p>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest truncate mt-0.5 ${isInterested ? 'text-blue-100' : 'text-slate-400'}`}>
                                                        {sponsor.ownerName}
                                                        {sponsor.villageName && ` · ${sponsor.villageName}`}
                                                    </p>
                                                </div>
                                                {/* Toggle button */}
                                                <button
                                                    onClick={() => canToggle && toggleTeamInterestAs(sponsor)}
                                                    disabled={!canToggle}
                                                    title={!canToggle ? 'Round must be active to toggle interest' : ''}
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all active:scale-90 border ${isInterested
                                                        ? 'bg-white/20 border-white/20 text-white hover:bg-white/30'
                                                        : canToggle
                                                            ? 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600'
                                                            : 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
