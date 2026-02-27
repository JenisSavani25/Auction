import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, timeAgo } from '../../utils/helpers';
import { useCountdown } from '../../hooks/useCountdown';
import {
    Play, Ban, ChevronDown, ChevronUp, Timer, Crown, TrendingUp, Plus,
    Clock, CheckCircle, Flame, AlertTriangle
} from 'lucide-react';

function AdminSponsorshipRow({ sponsorship }) {
    const { startAuction, rejectAuction, extendTimer, updateDuration } = useAuction();
    const [expanded, setExpanded] = useState(false);
    const [duration, setDuration] = useState(sponsorship.durationMinutes);
    const { timeLeft, isUrgent } = useCountdown(sponsorship.endTime);

    const handleStart = () => {
        if (duration !== sponsorship.durationMinutes) {
            updateDuration(sponsorship.id, duration);
        }
        startAuction(sponsorship.id);
    };

    const statusMap = {
        OPEN: { label: 'LIVE', icon: <Flame className="w-3 h-3" />, cls: 'status-open' },
        UPCOMING: { label: 'UPCOMING', icon: <Clock className="w-3 h-3" />, cls: 'status-upcoming' },
        ALLOTED: { label: 'ALLOTED', icon: <CheckCircle className="w-3 h-3" />, cls: 'status-alloted' },
        REJECTED: { label: 'REJECTED', icon: <Ban className="w-3 h-3" />, cls: 'status-rejected' },
    };
    const st = statusMap[sponsorship.status] || statusMap.UPCOMING;

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:border-slate-300 transition-all duration-200">
            {/* Header row */}
            <div
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded((v) => !v)}
            >
                <button
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 flex-shrink-0 transition-colors border border-slate-200"
                    onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-bold text-sm truncate">{sponsorship.name}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{sponsorship.bids.length} bids • Base: {formatCurrency(sponsorship.basePrice)}</p>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-sm">
                    {sponsorship.currentHighestBid > 0 && (
                        <div className="text-right">
                            <p className="text-blue-700 font-black font-mono">{formatCurrency(sponsorship.currentHighestBid)}</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate max-w-28 mt-0.5">{sponsorship.currentHighestBidderCompany}</p>
                        </div>
                    )}
                    {sponsorship.status === 'OPEN' && (
                        <div className={`text-right ${isUrgent ? 'text-red-600' : 'text-slate-600'}`}>
                            <p className="font-mono font-black drop-shadow-sm">
                                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">remaining</p>
                        </div>
                    )}
                </div>

                <span className={st.cls.replace('status-', 'status-light-')}>
                    {st.icon}
                    {st.label}
                </span>
            </div>

            {/* Expanded detail */}
            {expanded && (
                <div className="border-t border-slate-100 p-4 space-y-4 animate-fade-in bg-slate-50">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Base Price</p>
                            <p className="text-slate-800 font-black text-sm">{formatCurrency(sponsorship.basePrice)}</p>
                        </div>
                        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Highest Bid</p>
                            <p className="text-blue-700 font-black font-mono text-sm tracking-tighter">
                                {sponsorship.currentHighestBid > 0 ? formatCurrency(sponsorship.currentHighestBid) : '—'}
                            </p>
                        </div>
                        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Bids</p>
                            <p className="text-blue-600 font-black text-sm">{sponsorship.bids.length}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    {sponsorship.status === 'UPCOMING' && (
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-sm">
                                <Timer className="w-4 h-4 text-slate-400" />
                                <label className="text-slate-500 text-xs font-bold uppercase tracking-wide">Duration (min)</label>
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    min={1}
                                    max={60}
                                    className="w-14 bg-slate-50 border border-slate-200 rounded text-slate-800 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-center py-0.5"
                                    id={`duration-${sponsorship.id}`}
                                />
                            </div>
                            <button
                                onClick={handleStart}
                                className="btn-primary flex items-center gap-2 py-2.5 shadow-sm"
                                id={`start-auction-${sponsorship.id}`}
                            >
                                <Play className="w-4 h-4" />
                                Start Auction
                            </button>
                            <button
                                onClick={() => rejectAuction(sponsorship.id)}
                                className="btn-danger flex items-center gap-2 py-2.5"
                                id={`reject-auction-${sponsorship.id}`}
                            >
                                <Ban className="w-4 h-4" />
                                Reject
                            </button>
                        </div>
                    )}

                    {sponsorship.status === 'OPEN' && (
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => extendTimer(sponsorship.id, 2)}
                                    className="btn-secondary flex items-center gap-2 py-2 text-xs bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 shadow-sm font-bold"
                                >
                                    <Plus className="w-3.5 h-3.5" />+2 min
                                </button>
                                <button
                                    onClick={() => extendTimer(sponsorship.id, 5)}
                                    className="btn-secondary flex items-center gap-2 py-2 text-xs bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 shadow-sm font-bold"
                                >
                                    <Plus className="w-3.5 h-3.5" />+5 min
                                </button>
                            </div>
                            <button
                                onClick={() => rejectAuction(sponsorship.id)}
                                className="btn-danger flex items-center gap-2 py-2.5 shadow-sm"
                            >
                                <Ban className="w-4 h-4" />
                                Reject Auction
                            </button>
                        </div>
                    )}

                    {sponsorship.status === 'ALLOTED' && sponsorship.currentHighestBidder && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-50 border border-yellow-200 shadow-sm">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            <div>
                                <p className="text-yellow-700 text-[10px] font-black uppercase tracking-widest">Winner</p>
                                <p className="text-slate-800 font-black tracking-tight">{sponsorship.currentHighestBidderCompany}</p>
                                <p className="text-slate-500 text-xs font-bold mt-0.5">{formatCurrency(sponsorship.currentHighestBid)}</p>
                            </div>
                        </div>
                    )}

                    {/* Bid history */}
                    {sponsorship.bids.length > 0 && (
                        <div>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2 px-1">Bid History</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {sponsorship.bids.map((bid, i) => (
                                    <div key={bid.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm text-xs">
                                        <div className="flex items-center gap-2">
                                            {i === 0 && <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />}
                                            <div>
                                                <span className="text-slate-800 font-bold tracking-tight">{bid.bidderCompany}</span>
                                                <span className="text-slate-400 font-semibold ml-1 text-[10px] uppercase">• {bid.bidder}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-black font-mono ${i === 0 ? 'text-blue-700' : 'text-slate-600'}`}>
                                                {formatCurrency(bid.amount)}
                                            </span>
                                            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-2">{timeAgo(bid.timestamp)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminSponsorshipManager() {
    const { sponsorships, createSponsorship } = useAuction();
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [form, setForm] = useState({
        name: '', basePrice: '', durationMinutes: 5, description: ''
    });
    const [formError, setFormError] = useState('');

    const filtered = sponsorships.filter((s) =>
        filter === 'ALL' ? true : s.status === filter
    );

    const handleCreate = (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setFormError('Sponsorship name is required'); return; }
        if (!form.basePrice || parseFloat(form.basePrice) <= 0) { setFormError('Valid base price required'); return; }
        createSponsorship({
            name: form.name.trim(),
            basePrice: parseFloat(form.basePrice),
            durationMinutes: parseInt(form.durationMinutes) || 5,
            description: form.description.trim(),
        });
        setForm({ name: '', basePrice: '', durationMinutes: 5, description: '' });
        setFormError('');
        setShowCreate(false);
    };

    const counts = {
        ALL: sponsorships.length,
        UPCOMING: sponsorships.filter((s) => s.status === 'UPCOMING').length,
        OPEN: sponsorships.filter((s) => s.status === 'OPEN').length,
        ALLOTED: sponsorships.filter((s) => s.status === 'ALLOTED').length,
        REJECTED: sponsorships.filter((s) => s.status === 'REJECTED').length,
    };

    return (
        <div className="space-y-5">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="section-title text-xl text-slate-800">Manage Sponsorships</h2>
                <button
                    onClick={() => setShowCreate((v) => !v)}
                    className="btn-primary flex items-center gap-2 shadow-md"
                    id="create-sponsorship-btn"
                >
                    <Plus className="w-4 h-4" />
                    New Sponsorship
                </button>
            </div>

            {/* Create form */}
            {showCreate && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md animate-slide-in">
                    <h3 className="text-slate-800 font-black tracking-tight mb-4 flex items-center gap-2 uppercase">
                        <Plus className="w-4 h-4 text-blue-600" />
                        Create New Sponsorship
                    </h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest" htmlFor="sp-name">Sponsorship Name *</label>
                            <input
                                id="sp-name"
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="e.g. Opening Ceremony Title Sponsor"
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest" htmlFor="sp-price">Base Price (₹) *</label>
                            <input
                                id="sp-price"
                                type="number"
                                value={form.basePrice}
                                onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))}
                                placeholder="e.g. 500000"
                                min={1}
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 font-mono font-black focus:bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest" htmlFor="sp-duration">Auction Duration (minutes) *</label>
                            <input
                                id="sp-duration"
                                type="number"
                                value={form.durationMinutes}
                                onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                                min={1}
                                max={60}
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 font-bold focus:bg-white"
                            />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest" htmlFor="sp-desc">Description</label>
                            <textarea
                                id="sp-desc"
                                value={form.description}
                                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                placeholder="Brief description of sponsorship benefits..."
                                rows={2}
                                className="input-field resize-none bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                            />
                        </div>

                        {formError && (
                            <div className="sm:col-span-2 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-sm font-bold">
                                <AlertTriangle className="w-4 h-4" />
                                {formError}
                            </div>
                        )}

                        <div className="sm:col-span-2 flex gap-3 mt-2">
                            <button type="submit" className="btn-primary flex items-center gap-2 shadow-sm">
                                <Plus className="w-4 h-4" />
                                Create Sponsorship
                            </button>
                            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 shadow-sm font-bold">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(counts).map(([status, count]) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-200 shadow-sm ${filter === status
                            ? 'bg-blue-700 text-white border border-blue-800'
                            : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {status} ({count})
                    </button>
                ))}
            </div>

            {/* Sponsorship list */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-10 text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No sponsorships found</p>
                    </div>
                ) : (
                    filtered.map((sp) => <AdminSponsorshipRow key={sp.id} sponsorship={sp} />)
                )}
            </div>
        </div>
    );
}
