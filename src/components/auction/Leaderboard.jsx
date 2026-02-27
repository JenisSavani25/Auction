import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, getRankColor, getRankBg, getInitials } from '../../utils/helpers';
import { Trophy, Medal, TrendingUp } from 'lucide-react';

const RANK_ICONS = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
};

export default function Leaderboard() {
    const { leaderboard } = useAuction();

    return (
        <div className="glass-card p-5 bg-white shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                </div>
                <h2 className="section-title text-slate-800">Leaderboard</h2>
                <span className="ml-auto text-slate-400 text-[10px] font-bold tracking-widest uppercase">Top companies</span>
            </div>

            {leaderboard.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-200">
                        <Trophy className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm">No bids placed yet</p>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Companies appear after first bid</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {leaderboard.map((entry, index) => {
                        const rank = index + 1;
                        return (
                            <div
                                key={entry.company}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.01] bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white shadow-sm`}
                            >
                                {/* Rank */}
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold ${rank <= 3 ? 'text-xl drop-shadow-sm' : 'text-slate-400'
                                    }`}>
                                    {rank <= 3 ? RANK_ICONS[rank] : `#${rank}`}
                                </div>

                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 text-xs font-black flex-shrink-0 border border-slate-200 shadow-sm">
                                    {getInitials(entry.company)}
                                </div>

                                {/* Company info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-800 text-xs font-black truncate tracking-tight">{entry.company}</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{entry.lotsCount} LOT{entry.lotsCount !== 1 ? 'S' : ''}</p>
                                </div>

                                {/* Total */}
                                <div className="text-right flex-shrink-0">
                                    <p className={`text-sm font-black font-mono tracking-tighter ${rank === 1 ? 'text-blue-700' : 'text-slate-700'}`}>
                                        {formatCurrency(entry.total)}
                                    </p>
                                    {rank === 1 && (
                                        <div className="flex items-center justify-end gap-0.5 mt-0.5">
                                            <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                                            <span className="text-green-600 text-[10px] font-bold uppercase tracking-widest">Leading</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
