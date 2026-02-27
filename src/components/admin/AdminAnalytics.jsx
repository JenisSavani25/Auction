import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, getRankColor, getRankBg, getInitials } from '../../utils/helpers';
import { BarChart3, TrendingUp, Crown, DollarSign, Users, Gavel, CheckCircle } from 'lucide-react';

export default function AdminAnalytics() {
    const { sponsorships, users, leaderboard } = useAuction();

    const totalRevenue = sponsorships
        .filter((s) => s.status === 'ALLOTED')
        .reduce((sum, s) => sum + s.currentHighestBid, 0);

    const potentialRevenue = sponsorships
        .filter((s) => s.status !== 'REJECTED')
        .reduce((sum, s) => sum + (s.currentHighestBid || s.basePrice), 0);

    const allotedSponsors = sponsorships.filter((s) => s.status === 'ALLOTED');
    const totalBids = sponsorships.reduce((sum, s) => sum + s.bids.length, 0);
    const regularUsers = users.filter((u) => u.role !== 'admin');

    const overviewStats = [
        { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Potential Revenue', value: formatCurrency(potentialRevenue), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Bids Placed', value: totalBids, icon: Gavel, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Sponsors', value: regularUsers.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Completed Lots', value: allotedSponsors.length, icon: CheckCircle, color: 'text-sky-600', bg: 'bg-sky-50' },
        {
            label: 'Avg. Bid Per Lot',
            value: totalBids > 0 ? formatCurrency(Math.round(
                sponsorships.flatMap((s) => s.bids).reduce((sum, b) => sum + b.amount, 0) / totalBids
            )) : '—',
            icon: BarChart3,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Intel Tier */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Auction Analytics</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Detailed breakdown of revenue & sponsor engagement</p>
                </div>
            </div>

            {/* Metric Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {overviewStats.map((stat, i) => (
                    <div key={stat.label} className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-500 group animate-in zoom-in-95" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className={`text-4xl font-black font-mono tracking-tighter ${stat.color}`}>{stat.value}</p>
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Revenue Breakdown */}
                <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight">Revenue Breakdown</h3>
                            <div className="px-4 py-1.5 bg-white rounded-full border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Total: {sponsorships.length} Lots
                            </div>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50 bg-white">
                                        <th className="text-left text-[9px] font-black uppercase tracking-widest text-slate-400 p-8">Sponsorship Lot</th>
                                        <th className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400 p-8">Reserve Price</th>
                                        <th className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400 p-8">Highest Bid</th>
                                        <th className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400 p-8">Growth</th>
                                        <th className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400 p-8">Current Owner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sponsorships.map((sp) => {
                                        const uplift = sp.currentHighestBid > sp.basePrice
                                            ? (((sp.currentHighestBid - sp.basePrice) / sp.basePrice) * 100).toFixed(0)
                                            : null;
                                        return (
                                            <tr key={sp.id} className="group hover:bg-slate-50 transition-colors">
                                                <td className="p-8">
                                                    <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{sp.name}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className={`w-2 h-2 rounded-full ${sp.status === 'ALLOTED' ? 'bg-blue-500' : sp.status === 'OPEN' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                        <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">{sp.status}</span>
                                                    </div>
                                                </td>
                                                <td className="p-8 text-right text-slate-500 font-mono font-bold text-sm">{formatCurrency(sp.basePrice)}</td>
                                                <td className="p-8 text-right">
                                                    <span className={`text-base font-black font-mono tracking-tighter ${sp.currentHighestBid > 0 ? 'text-blue-700' : 'text-slate-300'}`}>
                                                        {sp.currentHighestBid > 0 ? formatCurrency(sp.currentHighestBid) : '—'}
                                                    </span>
                                                </td>
                                                <td className="p-8 text-right">
                                                    {uplift ? (
                                                        <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl text-[10px] font-black border border-emerald-100 uppercase tracking-widest">+{uplift}% Gain</span>
                                                    ) : (
                                                        <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">—</span>
                                                    )}
                                                </td>
                                                <td className="p-8 text-right">
                                                    {sp.currentHighestBidderCompany ? (
                                                        <div className="flex items-center justify-end gap-3">
                                                            <div className="text-right">
                                                                <p className="text-slate-900 font-black text-xs uppercase truncate max-w-[120px]">{sp.currentHighestBidderCompany}</p>
                                                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">AUTHORIZED</p>
                                                            </div>
                                                            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-lg">
                                                                {getInitials(sp.currentHighestBidderCompany)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-200 font-black text-[9px] uppercase tracking-widest">Vacant Node</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Performance Rankings */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10 flex flex-col h-full overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors duration-500" />

                        <div className="relative z-10 mb-10 pb-6 border-b border-slate-100">
                            <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight">Top Investors</h3>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Capital Investment Leaders</p>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 relative z-10">
                            {leaderboard.map((entry, index) => {
                                const rank = index + 1;
                                return (
                                    <div key={entry.company} className="group flex items-center gap-5 p-5 rounded-[2rem] border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all duration-500">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner border-2 ${rank === 1 ? 'bg-yellow-50 text-yellow-600 border-yellow-100 shadow-yellow-100/50' : 'bg-white text-slate-300 border-slate-100'}`}>
                                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-900 font-black text-[13px] uppercase tracking-tight truncate">{entry.company}</p>
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[9px] mt-1">{entry.bidCount} Engagement signals</p>
                                        </div>
                                        <p className={`text-sm font-black font-mono tracking-tighter ${rank === 1 ? 'text-blue-700' : 'text-slate-600'}`}>
                                            {formatCurrency(entry.total)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

