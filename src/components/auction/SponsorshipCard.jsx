import React, { useState, useEffect, useRef } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { useCountdown } from '../../hooks/useCountdown';
import { formatCurrency, formatTime, getInitials, getMinimumBid } from '../../utils/helpers';
import { Timer, TrendingUp, Crown, Flame, AlertCircle, CheckCircle, Clock, Ban } from 'lucide-react';

const STATUS_CONFIG = {
    OPEN: { label: 'LIVE', className: 'status-open', Icon: Flame },
    UPCOMING: { label: 'UPCOMING', className: 'status-upcoming', Icon: Clock },
    ALLOTED: { label: 'ALLOTED', className: 'status-alloted', Icon: CheckCircle },
    REJECTED: { label: 'REJECTED', className: 'status-rejected', Icon: Ban },
};

export default function SponsorshipCard({ sponsorship }) {
    const { currentUser, placeBid } = useAuction();
    const { timeLeft, isUrgent, isWarning, isExpired } = useCountdown(sponsorship.endTime);

    const [bidInput, setBidInput] = useState('');
    const [bidError, setBidError] = useState('');
    const [bidSuccess, setBidSuccess] = useState(false);
    const [isFlashing, setIsFlashing] = useState(false);
    const prevHighestBid = useRef(sponsorship.currentHighestBid);

    const minBid = getMinimumBid(sponsorship);
    const isOpen = sponsorship.status === 'OPEN';
    const canBid = isOpen && !isExpired;
    const isWinner = sponsorship.currentHighestBidder === currentUser?.ownerName;
    const isAdmin = currentUser?.role === 'admin';

    const statusCfg = STATUS_CONFIG[sponsorship.status] || STATUS_CONFIG.UPCOMING;
    const StatusIcon = statusCfg.Icon;

    // Flash on new highest bid
    useEffect(() => {
        if (sponsorship.currentHighestBid !== prevHighestBid.current) {
            setIsFlashing(true);
            prevHighestBid.current = sponsorship.currentHighestBid;
            const t = setTimeout(() => setIsFlashing(false), 1200);
            return () => clearTimeout(t);
        }
    }, [sponsorship.currentHighestBid]);

    const handleBid = (e) => {
        e.preventDefault();
        setBidError('');

        const amount = parseFloat(bidInput);
        if (isNaN(amount) || amount <= 0) {
            setBidError('Please enter a valid bid amount');
            return;
        }
        if (amount < sponsorship.basePrice) {
            setBidError(`Minimum bid is ${formatCurrency(sponsorship.basePrice)} (base price)`);
            return;
        }
        if (sponsorship.currentHighestBid > 0 && amount < sponsorship.currentHighestBid) {
            setBidError(`Bid must be at least ${formatCurrency(sponsorship.currentHighestBid)}`);
            return;
        }

        placeBid(
            sponsorship.id,
            amount,
            currentUser.ownerName,
            currentUser.companyName
        );

        setBidSuccess(true);
        setBidInput('');
        setTimeout(() => setBidSuccess(false), 2000);
    };

    return (
        <div
            className={`group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 border border-slate-200/60
        ${isFlashing ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isOpen && isWinner ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
      `}
        >
            {/* Status Bar */}
            <div className={`h-1.5 w-full ${isOpen ? 'bg-gradient-to-r from-green-400 via-blue-500 to-green-400 bg-[length:200%_auto] animate-gradient-x' :
                sponsorship.status === 'ALLOTED' ? 'bg-slate-900' :
                    sponsorship.status === 'REJECTED' ? 'bg-red-500' : 'bg-slate-200'
                }`} />

            <div className="p-6 lg:p-8 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${sponsorship.status === 'OPEN' ? 'bg-green-50 text-green-600 border-green-100' :
                                sponsorship.status === 'UPCOMING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-slate-50 text-slate-500 border-slate-200'
                                }`}>
                                {statusCfg.label}
                            </span>
                            {isOpen && <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
                        </div>
                        <h3 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase group-hover:text-blue-700 transition-colors">
                            {sponsorship.name}
                        </h3>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50 transition-colors">
                        <StatusIcon className={`w-5 h-5 ${isOpen ? 'text-green-500 animate-bounce-subtle' : 'text-slate-400'}`} />
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Value</p>
                        <p className="text-base lg:text-lg font-bold text-slate-700">{formatCurrency(sponsorship.basePrice)}</p>
                    </div>
                    <div className="space-y-1.5 text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Bid</p>
                        <p className={`text-xl lg:text-2xl font-black tracking-tight ${sponsorship.currentHighestBid > 0 ? 'text-blue-700' : 'text-slate-300'}`}>
                            {sponsorship.currentHighestBid > 0
                                ? formatCurrency(sponsorship.currentHighestBid)
                                : 'PRE-BID'}
                        </p>
                    </div>
                </div>

                {/* Leader Insight */}
                {sponsorship.currentHighestBidder ? (
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${isWinner && !isAdmin
                        ? 'bg-yellow-50/50 border-yellow-200'
                        : 'bg-slate-50/50 border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50/30'
                        }`}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-sm font-black shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
                            {getInitials(sponsorship.currentHighestBidder)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-slate-900 text-sm font-black truncate uppercase tracking-tight">
                                    {sponsorship.currentHighestBidderCompany}
                                </p>
                                {isWinner && !isAdmin && <Crown className="w-4 h-4 text-yellow-500 drop-shadow-sm" />}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{sponsorship.currentHighestBidder}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-[8px] font-black text-green-600 uppercase mt-1">Leading</span>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/30 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Awaiting First Participant</p>
                    </div>
                )}

                {/* Action / Timer Area */}
                {isOpen ? (
                    <div className="space-y-4">
                        {/* Timer Wrap */}
                        <div className={`flex items-center justify-between p-4 rounded-2xl border ${isExpired ? 'bg-slate-100 border-slate-300' : isUrgent ? 'bg-red-50 border-red-200 animate-pulse' :
                            isWarning ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-900 border-slate-800'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isExpired ? 'bg-slate-300' : isUrgent ? 'bg-red-500' : 'bg-white/10'}`}>
                                    <Clock className={`w-4 h-4 ${isUrgent || isExpired ? 'text-white' : 'text-slate-400'}`} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isUrgent || isWarning ? 'text-slate-900' : isExpired ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {isExpired ? 'Timer Ended' : 'Closing In'}
                                </span>
                            </div>
                            <span className={`text-2xl font-black font-mono tracking-tighter ${isUrgent ? 'text-red-600' :
                                isWarning ? 'text-yellow-700' : 'text-white'
                                }`}>
                                {isExpired ? 'CLOSED' : formatTime(timeLeft)}
                            </span>
                        </div>

                        {/* Bid Interaction */}
                        {!isAdmin && (
                            canBid ? (
                                <form onSubmit={handleBid} className="space-y-4 pt-2">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Custom Propel</label>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">Min: {formatCurrency(minBid)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</div>
                                                <input
                                                    type="number"
                                                    value={bidInput}
                                                    onChange={(e) => { setBidInput(e.target.value); setBidError(''); }}
                                                    placeholder={`Enter > ${minBid / 1000}k`}
                                                    className="w-full pl-10 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm"
                                                />
                                            </div>
                                            <button type="submit" className="px-8 bg-blue-700 hover:bg-blue-800 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-700/20 active:scale-95 text-xs uppercase tracking-widest">
                                                Bid
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Increments */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {[0, 2000, 5000, 10000].map((add) => (
                                            <button
                                                key={add}
                                                type="button"
                                                onClick={() => setBidInput(minBid + add)}
                                                className="py-2.5 rounded-xl border border-slate-200 text-[10px] font-black text-slate-600 hover:bg-slate-900 hover:text-white transition-all hover:border-slate-900"
                                            >
                                                {add === 0 ? 'MIN' : `+${add / 1000}K`}
                                            </button>
                                        ))}
                                    </div>

                                    {bidError && <p className="text-[10px] font-bold text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">{bidError}</p>}
                                    {bidSuccess && <p className="text-[10px] font-bold text-green-600 bg-green-50 p-2 rounded-lg border border-green-100">Bid Executed Successfully!</p>}
                                </form>
                            ) : (
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center animate-in fade-in">
                                    <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Timer Expired. Awaiting Admin Approval.</p>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    sponsorship.status === 'ALLOTED' && (
                        <div className="p-5 rounded-[2rem] bg-slate-900 border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Hammer</span>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-white font-black text-lg truncate uppercase">{sponsorship.currentHighestBidderCompany}</p>
                                <p className="text-blue-400 font-bold text-base">{formatCurrency(sponsorship.currentHighestBid)}</p>
                            </div>
                        </div>
                    )
                )}

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-orange-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{sponsorship.bids.length} ENGAGEMENTS</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LOCKED LOT: #{sponsorship.id.slice(-4)}</span>
                </div>
            </div>
        </div>
    );
}

