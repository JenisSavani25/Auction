import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Trophy, Users, Star, Activity, Clock, Award, Building2 } from 'lucide-react';

const DashboardPage = () => {
    const { sponsorships, teamAuction, leaderboard, recentBids } = useAuction();
    const [now, setNow] = useState(Date.now());

    // Local timer for countdowns
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const openSponsorships = sponsorships.filter(sp => sp.status === 'OPEN');
    const completedAssignments = teamAuction.assignments || [];

    const formatTime = (ms) => {
        if (ms <= 0) return "00:00";
        const totalSeconds = Math.floor(ms / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 p-6 font-sans selection:bg-blue-500/30 font-poppins relative overflow-hidden">
            {/* Background pattern for cricket vibe */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 100%, #1e3a8a 0%, transparent 50%), radial-gradient(circle at 0% 0%, #1e3a8a 0%, transparent 50%)' }}></div>

            {/* Header Section */}
            <header className="flex justify-between items-center mb-10 border-b border-slate-300 pb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <img src="/Shree%20Vallabhipur%20Taluka%20Cricket%20Logo.png" alt="VTPL 2026 Logo" className="h-20 w-auto object-contain drop-shadow-md" />
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase drop-shadow-sm">
                            VTPL 2026 <span className="text-blue-700">Auction</span>
                        </h1>
                        <p className="text-slate-500 font-bold tracking-widest text-xs mt-1 uppercase flex items-center gap-2">
                            <Activity size={14} className="text-blue-600" /> Live Price Discovery
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200">
                    <div className="text-right flex items-center gap-4">
                        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest leading-tight">System<br />Status</div>
                        <div className="flex items-center gap-2 text-green-600 font-mono text-lg font-bold">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                            </span>
                            LIVE STREAM
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8 relative z-10">
                {/* Left Column: Live Sponsorship Bids */}
                <div className="col-span-8 space-y-8">
                    <section>
                        <div className="flex items-center gap-3 mb-6 bg-blue-900 text-white px-5 py-3 rounded-xl inline-flex shadow-md">
                            <Star className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                            <h2 className="text-lg font-bold uppercase tracking-wide">Live Sponsorship Auctions</h2>
                        </div>

                        {openSponsorships.length > 0 ? (
                            <div className="grid grid-cols-1 gap-5">
                                {openSponsorships.map(sp => {
                                    const timeLeft = sp.endTime - now;
                                    const isEnding = timeLeft < 30000; // Less than 30s

                                    return (
                                        <div key={sp.id} className="relative overflow-hidden bg-white border border-slate-200 shadow-xl rounded-2xl p-6 transition-all hover:shadow-2xl hover:border-blue-200 flex flex-col justify-between group">
                                            {/* Decorative side accent */}
                                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-600 to-blue-800"></div>

                                            <div className="flex justify-between items-start">
                                                <div className="pl-4">
                                                    <div className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Lot #{sp.id.replace('sp', '')}</div>
                                                    <h3 className="text-3xl font-black text-slate-800 mb-4">{sp.name}</h3>

                                                    <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                                                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                            <Building2 size={18} className="text-blue-600" />
                                                            {sp.currentHighestBidderCompany || <span className="text-slate-400 italic">No bids yet</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right flex flex-col items-end">
                                                    <div className="bg-slate-100 px-4 py-2 rounded-xl mb-3 flex items-center gap-3 border border-slate-200">
                                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Time Left</div>
                                                        <div className={`font-mono text-2xl font-black ${isEnding ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                                                            <Clock size={16} className="inline mr-1 -mt-1" />
                                                            {formatTime(timeLeft)}
                                                        </div>
                                                    </div>

                                                    <div className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1 mt-2">Current Bid</div>
                                                    <div className="text-5xl font-black text-blue-700 font-mono tracking-tighter drop-shadow-sm">
                                                        ₹{sp.currentHighestBid?.toLocaleString() || sp.basePrice.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar for Timer */}
                                            <div className="mt-8 h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner pl-2">
                                                <div
                                                    className={`h-full transition-all duration-1000 -ml-2 rounded-full ${isEnding ? 'bg-red-500' : 'bg-blue-600'}`}
                                                    style={{ width: `${Math.max(0, Math.min(100, (timeLeft / (sp.durationMinutes * 60 * 1000)) * 100))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-48 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Activity className="text-slate-400 w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-600">Waiting for Next Lot</h3>
                                    <p className="text-slate-400 font-medium mt-1">Auctioneer will start the bidding shortly...</p>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Team Owners Display (The 12 Teams) */}
                    <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <Trophy className="text-blue-700 w-8 h-8" strokeWidth={2.5} />
                            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Team Inauguration Board</h2>
                        </div>
                        <div className="grid grid-cols-4 gap-4 relative z-10">
                            {[...Array(12)].map((_, idx) => {
                                const teamNumber = idx + 1;
                                const assignment = completedAssignments.find(a => a.teamName === `Team ${teamNumber}`);
                                return (
                                    <div key={idx} className={`relative overflow-hidden rounded-xl border-2 transition-all p-5 flex flex-col justify-center items-center text-center ${assignment ? 'bg-gradient-to-b from-blue-50 to-white border-blue-200 shadow-md transform hover:-translate-y-1' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Team {teamNumber}</span>
                                        {assignment ? (
                                            <>
                                                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-white">
                                                    <Award className="text-blue-900 w-5 h-5" />
                                                </div>
                                                <div className="text-sm font-bold text-blue-900 leading-tight">
                                                    {assignment.companyName}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-10 h-10 border-2 border-slate-300 border-dotted rounded-full mb-2"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right Column: Leaderboard & Activity */}
                <div className="col-span-4 space-y-8">
                    <section className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 sticky top-6">
                        <div className="flex items-center justify-center gap-3 mb-8 pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-black uppercase tracking-widest text-slate-800">Top Bidders Table</h2>
                        </div>

                        <div className="space-y-4">
                            {leaderboard.length > 0 ? (
                                leaderboard.map((entry, idx) => (
                                    <div key={entry.company} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${idx === 0 ? 'bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 shadow-sm' : 'hover:bg-slate-50'}`}>
                                        <div className="flex items-center gap-4">
                                            <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${idx === 0 ? 'bg-yellow-400 text-blue-900 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <div className={`font-bold text-sm leading-tight ${idx === 0 ? 'text-blue-900' : 'text-slate-700'}`}>{entry.company}</div>
                                                <div className="text-xs text-slate-400">{entry.owner}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-sm text-slate-800">₹{(entry.total / 100000).toFixed(1)}L</div>
                                            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{entry.bidCount} Bids</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 text-center py-10 font-medium">Rankings will appear after first bid</div>
                            )}
                        </div>

                        {/* Recent Activity Feed */}
                        <div className="mt-10 pt-8 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 p-8 rounded-b-3xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Live Bid Log</h3>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white shadow-sm border border-slate-200">
                                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-hidden relative">
                                {/* Fade out effect at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>

                                {recentBids.slice(0, 6).map((bid, i) => (
                                    <div key={i} className="text-sm bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-1 transition-all">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-blue-800 text-xs truncate max-w-[150px]">{bid.bidderCompany}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">{new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-slate-500 text-xs">bid</span>
                                            <span className="font-black text-slate-800 font-mono text-sm">₹{bid.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
