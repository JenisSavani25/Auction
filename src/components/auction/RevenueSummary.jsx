import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency } from '../../utils/helpers';
import { DollarSign, Flame, CheckCircle, BarChart3 } from 'lucide-react';

export default function RevenueSummary() {
    const { sponsorships } = useAuction();

    const totalRevenue = sponsorships
        .filter((s) => s.status === 'ALLOTED')
        .reduce((sum, s) => sum + s.currentHighestBid, 0);

    const pendingRevenue = sponsorships
        .filter((s) => s.status === 'OPEN' && s.currentHighestBid > 0)
        .reduce((sum, s) => sum + s.currentHighestBid, 0);

    const activeCount = sponsorships.filter((s) => s.status === 'OPEN').length;
    const completedCount = sponsorships.filter((s) => s.status === 'ALLOTED').length;
    const upcomingCount = sponsorships.filter((s) => s.status === 'UPCOMING').length;
    const totalBids = sponsorships.reduce((sum, s) => sum + s.bids.length, 0);

    const stats = [
        {
            label: 'Total Revenue',
            value: formatCurrency(totalRevenue),
            sub: 'From alloted',
            Icon: DollarSign,
            color: 'text-green-600',
            bg: 'bg-green-100 border border-green-200',
            highlight: true,
        },
        {
            label: 'Live Auctions',
            value: activeCount,
            sub: `${pendingRevenue > 0 ? formatCurrency(pendingRevenue) + ' pending' : 'No live bids'}`,
            Icon: Flame,
            color: 'text-red-600',
            bg: 'bg-red-100 border border-red-200',
        },
        {
            label: 'Completed',
            value: completedCount,
            sub: `${upcomingCount} upcoming`,
            Icon: CheckCircle,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100 border border-yellow-200',
        },
        {
            label: 'Total Bids',
            value: totalBids,
            sub: 'Across all auctions',
            Icon: BarChart3,
            color: 'text-blue-600',
            bg: 'bg-blue-100 border border-blue-200',
        },
    ];

    return (
        <div className="glass-card p-5 bg-white shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="section-title text-slate-800">Revenue Summary</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`p-3 rounded-xl border ${stat.highlight
                            ? 'border-green-300 bg-green-50 shadow-sm'
                            : 'border-slate-100 bg-slate-50'
                            } hover:bg-white hover:border-slate-200 transition-colors duration-200`}
                    >
                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                            <stat.Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <p className={`text-base font-black tracking-tight ${stat.highlight ? 'text-green-700 font-mono' : 'text-slate-800'}`}>
                            {stat.value}
                        </p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">{stat.label}</p>
                        <p className="text-slate-400 text-[10px] mt-1 line-clamp-1">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
