import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, timeAgo } from '../../utils/helpers';
import { CheckCircle, XCircle, Clock, ShieldCheck, Flame, Ban } from 'lucide-react';

export default function AdminPendingBids() {
    const { pendingBids, sponsorships, approveBid, rejectBid } = useAuction();

    if (!pendingBids || pendingBids.length === 0) {
        return (
            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <ShieldCheck className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Zero Pending Approvals</h3>
                <p className="text-slate-400 font-medium text-sm mt-2 max-w-xs mx-auto">All submitted Propels have been moderated.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                        Bid Approvals
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-amber-700 text-[10px] sm:text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            {pendingBids.length} Pending
                        </span>
                    </h2>
                    <p className="text-slate-500 font-black text-xs uppercase tracking-[0.2em] mt-2">Review and authorize incoming live bids</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {pendingBids.map(bid => {
                    const sp = sponsorships.find(s => s.id === bid.sponsorshipId);
                    const isWinning = sp && bid.amount > (sp.currentHighestBid || sp.basePrice);

                    return (
                        <div key={bid.id} className="glass-card bg-white p-5 border border-slate-200 rounded-3xl hover:border-blue-300 transition-all duration-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden group">
                            {/* Left Side: Bid Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 border-l-2 border-amber-500">Bidding On</span>
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight truncate border border-slate-200 px-2 py-0.5 rounded-md bg-slate-50">
                                        {bid.sponsorshipName}
                                    </span>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mt-4">
                                    <p className="text-3xl font-black font-mono text-blue-700 tracking-tighter">
                                        {formatCurrency(bid.amount)}
                                    </p>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 uppercase truncate">{bid.bidderCompany}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{bid.bidder} • {timeAgo(bid.timestamp)}</span>
                                    </div>
                                </div>

                                {!isWinning && (
                                    <div className="mt-4 flex items-center gap-2 text-xs font-black text-red-600 bg-red-50 w-fit px-3 py-1.5 rounded-xl border border-red-100 uppercase tracking-widest">
                                        <Ban className="w-3.5 h-3.5" /> Outbid (Current High: {formatCurrency(sp?.currentHighestBid || sp?.basePrice)})
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Actions */}
                            <div className="flex flex-row sm:flex-col gap-3 sm:w-48 shrink-0">
                                <button
                                    onClick={() => approveBid(bid.id)}
                                    disabled={!isWinning}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                >
                                    <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button
                                    onClick={() => rejectBid(bid.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-red-600 hover:text-red-600 hover:bg-red-50 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
                                >
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
