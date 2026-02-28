import React, { useState, useEffect } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, getInitials } from '../../utils/helpers';
import { Play, Square, Users, ArrowUp, ArrowDown, CheckCircle, Sparkles, RotateCcw, TrendingUp } from 'lucide-react';

export default function AdminTeamAuction() {
    const { teamAuction, startTeamRound, stopTeamRound, finalizeTeamWinners, saveTeamAssignments, announceTeams, resetTeamAuction } = useAuction();
    const [newPrice, setNewPrice] = useState(teamAuction.currentPrice);
    const [assignments, setAssignments] = useState({});

    // Sync price when round changes
    useEffect(() => {
        if (teamAuction.status === 'NOT_STARTED' || teamAuction.status === 'ROUND_STOPPED') {
            setNewPrice(teamAuction.currentPrice);
        }
    }, [teamAuction.currentPrice, teamAuction.status]);

    const MAX_TEAMS = 12;

    const handleStartRound = (isNewRound) => {
        startTeamRound(parseFloat(newPrice), isNewRound);
    };

    const handleAssignmentChange = (userId, teamName) => {
        setAssignments((prev) => ({ ...prev, [userId]: teamName }));
    };

    const handleSaveAndAnnounce = () => {
        const finalAssignments = teamAuction.winners.map((w) => ({
            userId: w.id,
            companyName: w.companyName,
            ownerName: w.ownerName,
            teamName: assignments[w.id] || 'TBD',
        }));
        saveTeamAssignments(finalAssignments);
        announceTeams();
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Control Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Team Auction House</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Conducting uniform price discovery for all {MAX_TEAMS} teams</p>
                </div>
                {teamAuction.status !== 'NOT_STARTED' && (
                    <button onClick={resetTeamAuction} className="px-6 py-3 bg-white text-slate-400 border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-3">
                        <RotateCcw className="w-4 h-4" /> Reset Auction
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Protocol Interface */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-slate-200 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 group-hover:bg-blue-50 transition-colors duration-700" />

                        <div className="relative z-10 flex items-center gap-4 mb-8">
                            <div className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                                Status: {teamAuction.status.replace('_', ' ')}
                            </div>
                            <span className="h-px flex-1 bg-slate-100" />
                        </div>

                        {/* Price Management Tier */}
                        {(teamAuction.status === 'NOT_STARTED' || teamAuction.status === 'ROUND_STOPPED') && (
                            <div className="space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="space-y-3">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Next Round Price</label>
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl lg:text-6xl font-black text-slate-300"></span>
                                        <input
                                            type="number"
                                            value={newPrice}
                                            onChange={(e) => setNewPrice(e.target.value)}
                                            className="w-full bg-transparent text-5xl lg:text-7xl font-black font-mono tracking-tighter text-slate-900 outline-none placeholder-slate-100"
                                            placeholder="00,000"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-6">
                                    {teamAuction.status === 'NOT_STARTED' && (
                                        <button onClick={() => handleStartRound(true)} className="px-10 py-5 bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 active:scale-95 flex items-center gap-4">
                                            <Play className="w-5 h-5 fill-current" /> Start Auction Round {teamAuction.roundNumber + 1}
                                        </button>
                                    )}

                                    {teamAuction.status === 'ROUND_STOPPED' && (
                                        <>
                                            <button onClick={() => handleStartRound(true)} className="px-8 py-5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center gap-4">
                                                <ArrowUp className="w-5 h-5" /> Increase & Next Round ({teamAuction.roundNumber + 1})
                                            </button>
                                            <button onClick={() => handleStartRound(false)} className="px-8 py-5 bg-white text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-50 transition-all flex items-center gap-4">
                                                <ArrowDown className="w-5 h-5" /> Adjust & Retake
                                            </button>

                                            <div className="w-full mt-8 pt-8 border-t border-slate-100">
                                                <button
                                                    onClick={finalizeTeamWinners}
                                                    className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black uppercase tracking-[0.2em] text-lg hover:shadow-2xl hover:scale-[1.01] transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-4"
                                                >
                                                    <CheckCircle className="w-8 h-8" /> Allot {teamAuction.interestedBidders.length} Winners
                                                </button>
                                                {teamAuction.interestedBidders.length !== MAX_TEAMS && (
                                                    <div className="mt-4 flex items-center justify-center gap-3 text-amber-600 bg-amber-50 py-4 px-6 rounded-2xl border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                                                        Note: Target is {MAX_TEAMS} Teams. Current interest: {teamAuction.interestedBidders.length}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Operational Round Active */}
                        {teamAuction.status === 'ROUND_ACTIVE' && (
                            <div className="py-12 text-center space-y-10 animate-in fade-in duration-700">
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] font-poppins">Round {teamAuction.roundNumber} In Progress</p>
                                    <div className="relative inline-block">
                                        <div className="absolute inset-x-0 bottom-0 h-8 bg-blue-500/20 blur-3xl rounded-full" />
                                        <p className="text-6xl lg:text-8xl font-black font-mono tracking-tighter text-blue-800 relative z-10">{formatCurrency(teamAuction.currentPrice)}</p>
                                    </div>
                                </div>

                                <button onClick={stopTeamRound} className="px-12 py-6 bg-red-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 active:scale-95 flex items-center gap-4 mx-auto group">
                                    <Square className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" /> Stop Bidding for Round {teamAuction.roundNumber}
                                </button>
                            </div>
                        )}

                        {/* Finalization Assignment */}
                        {teamAuction.status === 'ASSIGNING' && (
                            <div className="space-y-8 animate-in zoom-in-95 duration-500">
                                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-emerald-900 font-black text-sm uppercase tracking-tight">Auction Finalized</h3>
                                        <p className="text-emerald-700/70 text-xs font-bold uppercase tracking-widest mt-0.5">Assign team names to the winners below</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {teamAuction.winners.map((winner, idx) => (
                                        <div key={winner.id} className="p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 group-hover:bg-white transition-all space-y-4">
                                            <div>
                                                <label className="text-slate-400 text-[9px] font-black uppercase tracking-widest block mb-2">Winner {idx + 1}</label>
                                                <p className="text-slate-900 font-extrabold text-sm uppercase tracking-tight truncate">{winner.companyName}</p>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Nomenclature..."
                                                value={assignments[winner.id] || ''}
                                                onChange={(e) => handleAssignmentChange(winner.id, e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-black text-xs outline-none focus:border-blue-500 transition-all uppercase"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSaveAndAnnounce}
                                    className="w-full py-6 rounded-[2rem] bg-slate-900 text-white uppercase font-black tracking-[0.2em] text-lg hover:bg-blue-700 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 mt-8"
                                >
                                    <Sparkles className="w-6 h-6 text-yellow-400" /> Announce Allotted Teams
                                </button>
                            </div>
                        )}

                        {/* Inauguration State */}
                        {teamAuction.status === 'INAUGURATION' && (
                            <div className="py-20 text-center animate-in zoom-in-95 duration-1000">
                                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-yellow-400/20 relative">
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20" />
                                    <Sparkles className="w-16 h-16 text-white" />
                                </div>
                                <h3 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">Teams Officialized!</h3>
                                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">The auction results are now live for all participants.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Engagement Monitor */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-slate-900 font-black text-sm uppercase tracking-tight">Interested Sponsors</h3>
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Live Interest Tracker</p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner border-2 ${teamAuction.interestedBidders.length === MAX_TEAMS ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                'bg-slate-50 text-slate-900 border-slate-100'
                                }`}>
                                {teamAuction.interestedBidders.length}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                            {teamAuction.interestedBidders.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 text-slate-200">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Awaiting signal detection at current price level</p>
                                </div>
                            ) : (
                                teamAuction.interestedBidders.map((bidder, i) => (
                                    <div key={bidder.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 50}ms` }}>
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black uppercase shadow-sm">
                                            {getInitials(bidder.companyName)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-slate-900 font-black text-[11px] uppercase tracking-tight truncate">{bidder.companyName}</p>
                                            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest truncate">AUTHENTICATED @{bidder.ownerName}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

