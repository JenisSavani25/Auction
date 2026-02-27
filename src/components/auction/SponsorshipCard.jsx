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
    const isOpen = sponsorship.status === 'OPEN' && !isExpired;
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
        if (sponsorship.currentHighestBid > 0 && amount <= sponsorship.currentHighestBid) {
            setBidError(`Bid must exceed current highest: ${formatCurrency(sponsorship.currentHighestBid)}`);
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
            className={`relative glass-card overflow-hidden transition-all duration-300
        hover:shadow-lg hover:-translate-y-1 hover:border-blue-200
        ${isFlashing ? 'animate-bid-flash' : ''}
        ${isOpen && isWinner ? 'border-yellow-400 shadow-md ring-1 ring-yellow-400/50' : ''}
        ${isOpen && !isWinner ? 'border-green-200 shadow-sm' : ''}
      `}
        >
            {/* Top gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${isOpen ? 'bg-gradient-to-r from-green-400 via-blue-500 to-green-400' :
                sponsorship.status === 'ALLOTED' ? 'bg-gradient-to-r from-blue-700 to-blue-900' :
                    sponsorship.status === 'REJECTED' ? 'bg-red-500' : 'bg-slate-300'
                }`} />

            {/* Glow for live auctions */}
            {isOpen && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            )}

            <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-slate-800 font-black font-poppins text-lg leading-tight line-clamp-2 uppercase tracking-tight">
                            {sponsorship.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-1 font-medium line-clamp-1">{sponsorship.description}</p>
                    </div>
                    <span className={statusCfg.className}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                    </span>
                </div>

                {/* Bid amounts */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="label mb-1">Base Price</p>
                        <p className="text-slate-700 font-bold text-sm tracking-wide">{formatCurrency(sponsorship.basePrice)}</p>
                    </div>
                    <div className={`rounded-xl p-3 ${isFlashing ? 'bg-blue-50 border border-blue-200 shadow-inner' : 'bg-slate-50 border border-slate-100'
                        } transition-all duration-500`}>
                        <p className="label mb-1">Highest Bid</p>
                        <p className={`font-black text-sm tracking-wide ${sponsorship.currentHighestBid > 0 ? 'text-blue-700 drop-shadow-sm' : 'text-slate-400'
                            }`}>
                            {sponsorship.currentHighestBid > 0
                                ? formatCurrency(sponsorship.currentHighestBid)
                                : 'No bids yet'}
                        </p>
                    </div>
                </div>

                {/* Highest bidder */}
                {sponsorship.currentHighestBidder && (
                    <div className={`flex items-center gap-2.5 p-3 rounded-xl ${isWinner && !isAdmin
                        ? 'bg-yellow-50 border border-yellow-200 shadow-sm'
                        : 'bg-white border border-slate-200 shadow-sm'
                        }`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-blue-500/20 flex-shrink-0 border border-blue-600">
                            {getInitials(sponsorship.currentHighestBidder)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-slate-800 text-xs font-bold truncate">
                                    {sponsorship.currentHighestBidderCompany}
                                </p>
                                {isWinner && !isAdmin && (
                                    <Crown className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-slate-500 font-medium text-[10px] truncate uppercase tracking-wider">{sponsorship.currentHighestBidder}</p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
                    </div>
                )}

                {/* Timer */}
                {(sponsorship.status === 'OPEN') && (
                    <div className={`flex items-center justify-between p-3 rounded-xl border shadow-sm ${isUrgent
                        ? 'bg-red-50 border-red-200'
                        : isWarning
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}>
                        <div className="flex items-center gap-2">
                            <Timer className={`w-4 h-4 ${isUrgent ? 'text-red-500 animate-pulse' :
                                isWarning ? 'text-amber-500' : 'text-slate-400'
                                }`} />
                            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Time Left</span>
                        </div>
                        <span className={`text-xl font-black font-mono tracking-wider ${isUrgent ? 'text-red-600 animate-pulse' :
                            isWarning ? 'text-amber-600' :
                                'text-slate-800'
                            }`}>
                            {isExpired ? '00:00' : formatTime(timeLeft)}
                        </span>
                    </div>
                )}

                {/* Bid input (only for OPEN auctions, non-admin users) */}
                {isOpen && !isAdmin && (
                    <form onSubmit={handleBid} className="space-y-2.5">
                        <div>
                            <p className="label mb-1.5">
                                Min. Next Bid: <span className="text-blue-700 normal-case font-black">{formatCurrency(minBid)}</span>
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                                    <input
                                        type="number"
                                        value={bidInput}
                                        onChange={(e) => { setBidInput(e.target.value); setBidError(''); }}
                                        placeholder={minBid.toString()}
                                        min={minBid}
                                        step={1000}
                                        className="input-field pl-8 text-sm font-mono font-bold"
                                        id={`bid-input-${sponsorship.id}`}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn-primary px-4 py-2.5 text-sm flex-shrink-0 tracking-wide uppercase shadow-md"
                                >
                                    Paddel Up
                                </button>
                            </div>

                            {/* Quick bid buttons */}
                            <div className="flex gap-1.5 mt-2">
                                {[0, 10000, 25000, 50000].map((add) => (
                                    <button
                                        key={add}
                                        type="button"
                                        onClick={() => setBidInput(minBid + add)}
                                        className="flex-1 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-500 hover:text-blue-700 text-xs font-bold transition-all duration-150 border border-slate-200 shadow-sm"
                                    >
                                        {add === 0 ? 'Min' : `+${(add / 1000).toFixed(0)}K`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {bidError && (
                            <div className="flex items-start gap-2 text-red-600 text-[11px] font-bold bg-red-50 p-2 rounded border border-red-100">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{bidError}</span>
                            </div>
                        )}

                        {bidSuccess && (
                            <div className="flex items-center gap-2 text-green-700 text-[11px] font-bold bg-green-50 p-2 rounded border border-green-100 animate-slide-in">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Bid placed successfully!</span>
                            </div>
                        )}
                    </form>
                )}

                {/* Alloted winner display */}
                {sponsorship.status === 'ALLOTED' && sponsorship.currentHighestBidder && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 shadow-inner">
                        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm border border-yellow-200">
                            <Crown className="w-4 h-4 text-blue-900" />
                        </div>
                        <div>
                            <p className="text-blue-800 text-[10px] font-bold uppercase tracking-widest">Winning Bidder</p>
                            <p className="text-slate-800 text-sm font-black tracking-tight">{sponsorship.currentHighestBidderCompany}</p>
                            <p className="text-blue-700 text-xs font-mono font-bold mt-0.5">{formatCurrency(sponsorship.currentHighestBid)}</p>
                        </div>
                    </div>
                )}

                {/* Bid count */}
                <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-widest pt-3 border-t border-slate-100">
                    <span>{sponsorship.bids.length} BIDS TOTAL</span>
                    <span>BASE {formatCurrency(sponsorship.basePrice)}</span>
                </div>
            </div>
        </div>
    );
}
