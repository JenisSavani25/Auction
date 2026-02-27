import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, getInitials } from '../../utils/helpers';
import { Play, Square, Users, ArrowUp, ArrowDown, CheckCircle, Sparkles, RotateCcw } from 'lucide-react';

export default function AdminTeamAuction() {
    const { teamAuction, setTeamPrice, startTeamRound, stopTeamRound, finalizeTeamWinners, saveTeamAssignments, announceTeams, resetTeamAuction } = useAuction();
    const [newPrice, setNewPrice] = useState(teamAuction.currentPrice.toString());
    const [assignments, setAssignments] = useState({});

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="section-title text-xl text-slate-800">Teams Bidding Process</h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">Distribute {MAX_TEAMS} teams equally among sponsors through elimination rounds</p>
                </div>
                {teamAuction.status !== 'NOT_STARTED' && (
                    <button onClick={resetTeamAuction} className="btn-secondary py-2 flex items-center gap-2 bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 shadow-sm rounded-xl">
                        <RotateCcw className="w-4 h-4" /> Reset Process
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Control Panel */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-card p-6 bg-white shadow-sm border border-slate-200">
                        <h3 className="text-lg font-black tracking-tight mb-4 text-slate-800 uppercase">Current Status: <span className="text-blue-700">{teamAuction.status.replace('_', ' ')}</span></h3>

                        {/* NOT_STARTED or ROUND_STOPPED: Price Configuration */}
                        {(teamAuction.status === 'NOT_STARTED' || teamAuction.status === 'ROUND_STOPPED') && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <p className="label mb-2">Set Round Price (₹)</p>
                                    <input
                                        type="number"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        className="input-field text-xl font-black max-w-xs font-mono"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {teamAuction.status === 'NOT_STARTED' && (
                                        <button onClick={() => handleStartRound(true)} className="btn-primary flexitems-center gap-2 shadow-md">
                                            <Play className="w-4 h-4 inline mr-2" /> Start First Round
                                        </button>
                                    )}

                                    {teamAuction.status === 'ROUND_STOPPED' && (
                                        <>
                                            {/* Scenario 1: Too many interested -> Increase Price */}
                                            <button onClick={() => handleStartRound(true)} className="btn-primary flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm hover:scale-105">
                                                <ArrowUp className="w-4 h-4" /> Increase Price & Next Round
                                            </button>

                                            {/* Scenario 2: Too few interested -> Decrease Price & Retry */}
                                            <button onClick={() => handleStartRound(false)} className="btn-danger flex items-center gap-2 text-red-600 bg-red-100 border border-red-200 hover:bg-red-200 hover:scale-105 shadow-sm">
                                                <ArrowDown className="w-4 h-4" /> Decrease Price & Retry Round
                                            </button>

                                            {/* Scenario 3: Perfect number of interested -> Finalize */}
                                            <div className="w-full mt-4">
                                                <button
                                                    onClick={finalizeTeamWinners}
                                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black uppercase tracking-wide text-lg hover:scale-[1.02] transition-transform shadow-md flex items-center justify-center gap-2 shadow-green-200"
                                                >
                                                    <CheckCircle className="w-6 h-6" /> Finalize {teamAuction.interestedBidders.length} Sponsors for Teams
                                                </button>
                                                {teamAuction.interestedBidders.length !== MAX_TEAMS && (
                                                    <p className="text-amber-600 text-xs font-bold text-center mt-2 bg-amber-50 p-2 rounded border border-amber-200">
                                                        Note: You have {teamAuction.interestedBidders.length} interested sponsors, but {MAX_TEAMS} teams.
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ROUND_ACTIVE */}
                        {teamAuction.status === 'ROUND_ACTIVE' && (
                            <div className="space-y-6 animate-fade-in text-center py-6">
                                <div className="inline-block p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent animate-pulse-slow pointer-events-none" />
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-2">Round {teamAuction.roundNumber} Price</p>
                                    <p className="text-4xl font-black font-mono tracking-tighter text-blue-800">{formatCurrency(teamAuction.currentPrice)}</p>
                                </div>

                                <div>
                                    <button onClick={stopTeamRound} className="btn-danger flex items-center gap-2 mx-auto py-3 px-8 text-white bg-red-600 border border-red-700 shadow-md hover:scale-105 transition-transform">
                                        <Square className="w-5 h-5 fill-current" /> Stop Bidding for Round {teamAuction.roundNumber}
                                    </button>
                                    <p className="text-slate-500 font-medium text-xs mt-3">Stop the round to evaluate if you have exactly {MAX_TEAMS} sponsors, or if you need to adjust price.</p>
                                </div>
                            </div>
                        )}

                        {/* TEAM ASSIGNMENT STAGE */}
                        {teamAuction.status === 'ASSIGNING' && (
                            <div className="space-y-5 animate-fade-in">
                                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                    <h3 className="text-green-700 font-black flex items-center gap-2 mb-1 uppercase tracking-tight">
                                        <CheckCircle className="w-5 h-5" /> Sponsors Finalized!
                                    </h3>
                                    <p className="text-slate-600 font-medium text-sm">Now, please assign a Team Name to each winning sponsor. Once done, announce the teams to trigger the public inauguration on user screens.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {teamAuction.winners.map((winner, idx) => (
                                        <div key={winner.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                                            <p className="text-blue-700 text-[10px] font-black uppercase tracking-widest mb-1">Winner {idx + 1}</p>
                                            <p className="text-slate-800 font-black tracking-tight">{winner.companyName}</p>
                                            <p className="text-slate-500 font-medium text-xs mb-3">{winner.ownerName}</p>
                                            <input
                                                type="text"
                                                placeholder="Assign Team Name..."
                                                value={assignments[winner.id] || ''}
                                                onChange={(e) => handleAssignmentChange(winner.id, e.target.value)}
                                                className="input-field text-sm font-bold py-2 bg-white"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleSaveAndAnnounce}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 text-white uppercase font-black tracking-widest text-lg hover:scale-[1.02] transition-transform shadow-md flex items-center justify-center gap-2 mt-6"
                                >
                                    <Sparkles className="w-6 h-6 text-yellow-400" /> Complete & Announce Teams!
                                </button>
                            </div>
                        )}

                        {/* INAUGURATION ACTIVE */}
                        {teamAuction.status === 'INAUGURATION' && (
                            <div className="p-8 text-center animate-fade-in">
                                <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce-subtle drop-shadow-sm" />
                                <h3 className="text-3xl font-black uppercase tracking-tight font-poppins text-blue-800 mb-2">Teams Inaugurated!</h3>
                                <p className="text-slate-600 font-medium">All users are now seeing the grand reveal on their screens.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Interested Bidders List */}
                <div className="glass-card flex flex-col h-[500px] bg-white border border-slate-200 shadow-sm">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-xl">
                        <h3 className="font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase">
                            <Users className="w-4 h-4 text-blue-600" />
                            Interested Sponsors
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black tracking-widest ${teamAuction.interestedBidders.length === MAX_TEAMS ? 'bg-green-100 text-green-700 border border-green-200' :
                            teamAuction.interestedBidders.length > MAX_TEAMS ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                            {teamAuction.interestedBidders.length} / {MAX_TEAMS}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50">
                        {teamAuction.interestedBidders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold text-sm p-6 text-center border-2 border-dashed border-slate-200 m-2 rounded-xl">
                                No sponsors have shown interest at this price yet.
                            </div>
                        ) : (
                            teamAuction.interestedBidders.map((bidder, i) => (
                                <div key={bidder.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-black border border-slate-300 flex-shrink-0 shadow-sm">
                                        {getInitials(bidder.companyName)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-slate-800 text-sm font-black truncate tracking-tight">{bidder.companyName}</p>
                                        <p className="text-slate-500 font-medium text-[10px] uppercase tracking-widest truncate">{bidder.ownerName}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
