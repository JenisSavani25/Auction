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
        { label: 'Confirmed Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Potential Revenue', value: formatCurrency(potentialRevenue), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Bids', value: totalBids, icon: Gavel, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { label: 'Active Bidders', value: regularUsers.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Completed Auctions', value: allotedSponsors.length, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
        {
            label: 'Avg. Bid Size',
            value: totalBids > 0 ? formatCurrency(Math.round(
                sponsorships.flatMap((s) => s.bids).reduce((sum, b) => sum + b.amount, 0) / totalBids
            )) : '—',
            icon: BarChart3,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
    ];

    return (
        <div className="space-y-6">
            <h2 className="section-title text-xl text-slate-800">Analytics & Revenue</h2>

            {/* Overview stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {overviewStats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3 shadow-inner`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className={`text-2xl font-black font-mono tracking-tight ${stat.color}`}>{stat.value}</p>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Sponsorship breakdown table */}
            <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                <h3 className="text-slate-800 font-black tracking-tight mb-4 uppercase text-sm">Sponsorship Revenue Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-3 pr-4">Sponsorship</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-3 px-4">Base Price</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-3 px-4">Final Bid</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-3 px-4">Uplift</th>
                                <th className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-400 pb-3 pl-4">Winner</th>
                            </tr>
                        </thead>
                        <tbody className="space-y-2">
                            {sponsorships.map((sp) => {
                                const uplift = sp.currentHighestBid > sp.basePrice
                                    ? (((sp.currentHighestBid - sp.basePrice) / sp.basePrice) * 100).toFixed(0)
                                    : null;
                                return (
                                    <tr key={sp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 pr-4">
                                            <p className="text-slate-800 text-sm font-bold">{sp.name}</p>
                                            <span className={`text-[10px] uppercase font-black tracking-widest ${sp.status === 'OPEN' ? 'text-green-600' :
                                                sp.status === 'ALLOTED' ? 'text-blue-600' :
                                                    sp.status === 'REJECTED' ? 'text-red-500' : 'text-slate-500'
                                                }`}>{sp.status}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-slate-600 font-mono text-sm">{formatCurrency(sp.basePrice)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`text-sm font-black font-mono ${sp.currentHighestBid > 0 ? 'text-blue-700' : 'text-slate-400'}`}>
                                                {sp.currentHighestBid > 0 ? formatCurrency(sp.currentHighestBid) : '—'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {uplift ? (
                                                <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold border border-green-200">+{uplift}%</span>
                                            ) : (
                                                <span className="text-slate-300 text-xs font-bold">—</span>
                                            )}
                                        </td>
                                        <td className="py-3 pl-4 text-right">
                                            {sp.currentHighestBidderCompany ? (
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {sp.status === 'ALLOTED' && <Crown className="w-3.5 h-3.5 text-yellow-500 drop-shadow-sm" />}
                                                    <span className="text-slate-700 font-bold text-xs truncate max-w-24">{sp.currentHighestBidderCompany}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-widest">No bids</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-slate-200">
                                <td className="pt-4 pr-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">TOTAL</td>
                                <td className="pt-4 px-4 text-right text-slate-600 text-sm font-bold font-mono">
                                    {formatCurrency(sponsorships.reduce((s, sp) => s + sp.basePrice, 0))}
                                </td>
                                <td className="pt-4 px-4 text-right text-blue-700 text-sm font-black font-mono">
                                    {formatCurrency(sponsorships.reduce((s, sp) => s + sp.currentHighestBid, 0))}
                                </td>
                                <td colSpan={2} />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
                <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-5">
                    <h3 className="text-slate-800 font-black tracking-tight mb-4 uppercase text-sm">Company Leaderboard</h3>
                    <div className="space-y-3">
                        {leaderboard.map((entry, index) => {
                            const rank = index + 1;
                            const RANK_ICONS = { 1: '🥇', 2: '🥈', 3: '🥉' };
                            return (
                                <div key={entry.company} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-colors">
                                    <span className="text-2xl w-8 text-center flex-shrink-0 drop-shadow-sm">{RANK_ICONS[rank] || <span className="text-slate-400 font-black text-lg">#{rank}</span>}</span>
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-700 text-sm font-black border border-slate-200 shadow-sm flex-shrink-0">
                                        {getInitials(entry.company)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-slate-800 text-sm font-bold truncate">{entry.company}</p>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-0.5">{entry.bidCount} bids placed</p>
                                    </div>
                                    <p className={`text-base font-black font-mono flex-shrink-0 ${rank === 1 ? 'text-blue-700' : 'text-slate-600'}`}>
                                        {formatCurrency(entry.total)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
