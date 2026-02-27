import React, { useEffect, useRef } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, timeAgo, getInitials } from '../../utils/helpers';
import { Activity } from 'lucide-react';

export default function RecentBidsPanel() {
    const { recentBids, sponsorships } = useAuction();
    const scrollRef = useRef(null);

    // Get sponsorship name from id
    const getSpName = (id) => sponsorships.find((s) => s.id === id)?.name || 'Unknown';

    return (
        <div className="glass-card p-5 flex flex-col h-full bg-white shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center border border-red-100">
                    <Activity className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="section-title text-slate-800">Live Bids</h2>
                {recentBids.length > 0 && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-black tracking-widest uppercase shadow-sm">
                        {recentBids.length}
                    </span>
                )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-80">
                {recentBids.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-200">
                            <Activity className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold text-sm">No bids yet</p>
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">Bids will appear here in real time</p>
                    </div>
                ) : (
                    recentBids.map((bid, i) => (
                        <div
                            key={bid.id}
                            className={`p-3 rounded-xl transition-all duration-200 shadow-sm border ${i === 0 ? 'animate-slide-in border-green-200 bg-green-50 shadow-green-100/50' : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white'}`}
                        >
                            {/* Top row: avatar + company + amount */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm border border-blue-600">
                                    {getInitials(bid.bidder)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-800 text-xs font-black truncate tracking-tight">{bid.bidderCompany}</p>
                                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest truncate">{bid.bidder}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-blue-700 text-xs font-black font-mono">{formatCurrency(bid.amount)}</p>
                                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{timeAgo(bid.timestamp)}</p>
                                </div>
                            </div>
                            {/* Bottom row: lot name badge */}
                            <div className="mt-2 flex items-center gap-1.5">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex-shrink-0">Bidding on:</span>
                                <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-[9px] font-black uppercase tracking-widest truncate">
                                    {bid.sponsorshipName || getSpName(bid.sponsorshipId)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
