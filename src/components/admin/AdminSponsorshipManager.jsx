import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency } from '../../utils/helpers';
import { useCountdown } from '../../hooks/useCountdown';
import {
    Clock, Plus, Filter, CheckCircle, Ban,
    MoreVertical, ChevronDown, ChevronUp, Activity,
    TrendingUp, Shield, BarChart2, AlertCircle, PlusCircle,
    User, ArrowRight, Award, Flame, RotateCcw
} from 'lucide-react';

function AdminSponsorshipRow({ sponsorship, expanded, setExpanded, confirmReopen, setConfirmReopen }) {
    const { startAuction, allotAuction, rejectAuction, reopenAuction, extendTimer, updateDuration } = useAuction();
    const [duration, setDuration] = useState(sponsorship.durationMinutes);
    const { timeLeft, isUrgent } = useCountdown(sponsorship.endTime);

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]';
            case 'ALLOTED': return 'bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.4)]';
            case 'REJECTED': return 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]';
            default: return 'bg-slate-400';
        }
    };

    const displayStatus = (status) => {
        switch (status) {
            case 'OPEN': return 'Live Auction';
            case 'ALLOTED': return 'Allotted';
            case 'REJECTED': return 'Halted';
            default: return 'Pending';
        }
    };

    return (
        <div className={`bg-white rounded-[2rem] overflow-hidden border transition-all duration-300 ${expanded ? 'border-blue-200 shadow-2xl ring-8 ring-blue-500/5' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200'}`}>
            <div
                className={`p-6 flex items-center gap-4 cursor-pointer transition-colors group ${expanded ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors uppercase italic tracking-tight">{sponsorship.name}</h3>
                        <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest text-white ${getStatusColor(sponsorship.status)}`}>
                            {displayStatus(sponsorship.status)}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> {sponsorship.bids.length} Bids
                        </p>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Res: {sponsorship.basePrice.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {sponsorship.status === 'OPEN' && (
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 font-mono text-sm font-black ${isUrgent ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                            <Clock className="w-4 h-4" />
                            {timeLeft > 0 ? (
                                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                            ) : (
                                <span className="text-red-500">TIMER DONE</span>
                            )}
                        </div>
                    )}

                    <div className="text-right">
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none mb-1">Current Bid</p>
                        <p className="text-2xl font-black font-mono text-blue-700 tracking-tighter">
                            {sponsorship.currentHighestBid?.toLocaleString() || sponsorship.basePrice.toLocaleString()}
                        </p>
                    </div>

                    {expanded ? <ChevronUp className="w-5 h-5 text-slate-300" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                </div>
            </div>

            {expanded && (
                <div className="px-8 pb-8 pt-4 border-t border-slate-50 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Status Sections */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5" /> Auction Controls
                            </h4>

                            <div className="flex flex-wrap gap-3">
                                {sponsorship.status === 'UPCOMING' && (
                                    <button onClick={() => startAuction(sponsorship.id)} className="px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3">
                                        <Flame className="w-4 h-4 fill-current" /> Start Auction
                                    </button>
                                )}

                                {sponsorship.status === 'OPEN' && (
                                    <>
                                        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                                            <button onClick={() => extendTimer(sponsorship.id, 2)} className="px-4 py-2 bg-white text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-700 transition-all border border-slate-200">+2m</button>
                                            <button onClick={() => extendTimer(sponsorship.id, 5)} className="px-4 py-2 bg-white text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-700 transition-all border border-slate-200">+5m</button>
                                        </div>
                                        <button onClick={() => allotAuction(sponsorship.id)} className="px-8 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-3">
                                            <CheckCircle className="w-4 h-4" /> Bidding Done
                                        </button>
                                        <button onClick={() => rejectAuction(sponsorship.id)} className="px-8 py-4 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-3">
                                            <Ban className="w-4 h-4" /> Halt Auction
                                        </button>
                                    </>
                                )}

                                {sponsorship.status === 'REJECTED' && (
                                    <>
                                        <button onClick={() => startAuction(sponsorship.id)} className="px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-3">
                                            <RotateCcw className="w-4 h-4" /> Resume Auction
                                        </button>
                                        {!confirmReopen ? (
                                            <button onClick={() => setConfirmReopen(true)} className="px-8 py-4 bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-3">
                                                <RotateCcw className="w-4 h-4" /> Reopen Fresh
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-2xl">
                                                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest px-2">Confirm Reopen?</span>
                                                <button onClick={() => { reopenAuction(sponsorship.id); setConfirmReopen(false); }} className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 transition-all">
                                                    Yes, Reopen
                                                </button>
                                                <button onClick={() => setConfirmReopen(false)} className="px-4 py-2 bg-white text-slate-600 text-[10px] font-black uppercase rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {sponsorship.status === 'ALLOTED' && (
                                    !confirmReopen ? (
                                        <button onClick={() => setConfirmReopen(true)} className="px-8 py-4 bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-3">
                                            <RotateCcw className="w-4 h-4" /> Reopen Sponsorship
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-2xl">
                                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest px-2">Confirm? Bids kept.</span>
                                            <button onClick={() => { reopenAuction(sponsorship.id); setConfirmReopen(false); }} className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-600 transition-all">
                                                Yes, Reopen
                                            </button>
                                            <button onClick={() => setConfirmReopen(false)} className="px-4 py-2 bg-white text-slate-600 text-[10px] font-black uppercase rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Duration</span>
                                    <span className="text-xs font-bold text-slate-900">{duration} Minutes</span>
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-black text-sm"
                                    />
                                    <button onClick={() => updateDuration(sponsorship.id, duration)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50">Apply</button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Bids */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Bidding History
                            </h4>
                            <div className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden">
                                <div className="max-h-[220px] overflow-y-auto no-scrollbar">
                                    {sponsorship.bids.length > 0 ? (
                                        sponsorship.bids.slice().reverse().map((bid, i) => (
                                            <div key={i} className="px-6 py-4 flex items-center justify-between border-b border-slate-100 last:border-0 hover:bg-white transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100">
                                                        {bid.bidderCompany?.[0] || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-900 uppercase">{bid.bidderCompany}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                </div>
                                                <p className="font-mono font-black text-blue-600 text-sm">{bid.amount.toLocaleString()}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-10 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">No Bids Yet</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminSponsorshipManager() {
    const { sponsorships, createSponsorship } = useAuction();
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({ name: '', basePrice: '', durationMinutes: 5 });
    const [formError, setFormError] = useState('');
    // Lift expanded + confirmReopen per sponsorship ID so state survives status changes
    const [expandedMap, setExpandedMap] = useState({});
    const [confirmReopenMap, setConfirmReopenMap] = useState({});

    const getExpanded = (id) => expandedMap[id] ?? false;
    const setExpanded = (id, val) => setExpandedMap(m => ({ ...m, [id]: val }));
    const getConfirmReopen = (id) => confirmReopenMap[id] ?? false;
    const setConfirmReopen = (id, val) => setConfirmReopenMap(m => ({ ...m, [id]: val }));

    const handleCreate = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.basePrice) {
            setFormError('Name and Price are required');
            return;
        }
        createSponsorship({
            ...form,
            basePrice: parseFloat(form.basePrice),
            durationMinutes: parseInt(form.durationMinutes)
        });
        setForm({ name: '', basePrice: '', durationMinutes: 5 });
        setShowAddModal(false);
        setFormError('');
    };

    const pendingOrOpen = sponsorships.filter(s => s.status === 'UPCOMING' || s.status === 'OPEN');
    const pastLots = sponsorships.filter(s => s.status === 'ALLOTED' || s.status === 'REJECTED');

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sponsorship Lots</h2>
                    <p className="text-slate-500 font-black text-xs uppercase tracking-[0.2em] mt-1">Manage and track live bidding for all cricket sponsorships</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="group px-8 py-4 bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 flex items-center gap-3 active:scale-95"
                >
                    <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Add New Lot
                </button>
            </div>

            {/* Main Content */}
            <div className="space-y-12">
                {/* Active Section */}
                <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                        <span className="h-px flex-1 bg-slate-100" />
                        Live & Upcoming Bidding
                        <span className="h-px flex-1 bg-slate-100" />
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                        {pendingOrOpen.length > 0 ? (
                            pendingOrOpen.map(sp => (
                                <AdminSponsorshipRow
                                    key={sp.id}
                                    sponsorship={sp}
                                    expanded={getExpanded(sp.id)}
                                    setExpanded={(val) => setExpanded(sp.id, val)}
                                    confirmReopen={getConfirmReopen(sp.id)}
                                    setConfirmReopen={(val) => setConfirmReopen(sp.id, val)}
                                />
                            ))
                        ) : (
                            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <Award className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active auctions in progress</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Past Section */}
                {pastLots.length > 0 && (
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-4 text-center">
                            <span className="h-px flex-1 bg-slate-100" />
                            Finalized Lots
                            <span className="h-px flex-1 bg-slate-100" />
                        </h4>
                        <div className="grid grid-cols-1 gap-4 opacity-75">
                            {pastLots.map(sp => (
                                <AdminSponsorshipRow
                                    key={sp.id}
                                    sponsorship={sp}
                                    expanded={getExpanded(sp.id)}
                                    setExpanded={(val) => setExpanded(sp.id, val)}
                                    confirmReopen={getConfirmReopen(sp.id)}
                                    setConfirmReopen={(val) => setConfirmReopen(sp.id, val)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-7">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-700/20">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Add Sponsorship Lot</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Create a new bidding unit</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-2">Lot Name (e.g. Title Sponsor)</label>
                                    <input
                                        autoFocus
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm focus:border-blue-700 transition-all outline-none uppercase"
                                        placeholder="Enter Lot Name..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-2">Reserve Price</label>
                                        <input
                                            type="number"
                                            value={form.basePrice}
                                            onChange={e => setForm({ ...form, basePrice: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm focus:border-blue-700 transition-all outline-none font-mono"
                                            placeholder="5,00,000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-slate-400 text-[10px] font-black uppercase tracking-widest px-2">Duration (Minutes)</label>
                                        <input
                                            type="number"
                                            value={form.durationMinutes}
                                            onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm focus:border-blue-700 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {formError && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-black uppercase">
                                        <AlertCircle className="w-4 h-4" /> {formError}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="flex-1 py-3 bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20 active:scale-95">
                                        Initialize Lot
                                    </button>
                                    <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 bg-slate-100 text-slate-500 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
