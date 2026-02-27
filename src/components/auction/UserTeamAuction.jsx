import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, getInitials } from '../../utils/helpers';
import { Hand, Users, Sparkles, CheckCircle, Shield, Gavel, Award, MapPin } from 'lucide-react';

export default function UserTeamAuction() {
    const { teamAuction, toggleTeamInterest, currentUser } = useAuction();

    const isInterested = (teamAuction.interestedBidders || []).some((b) => b.id === currentUser.id);

    if (teamAuction.status === 'NOT_STARTED') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 animate-pulse">
                    <Shield className="w-10 h-10 text-slate-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tight uppercase italic">Auction Gate Closed</h2>
                <p className="text-slate-500 font-bold max-w-sm uppercase text-xs tracking-widest leading-relaxed">
                    The Uniform Price Team Discovery has not been initiated by the ground officials. Please await further instructions.
                </p>
            </div>
        );
    }

    if (teamAuction.status === 'INAUGURATION') {
        return (
            <div className="animate-in zoom-in-95 duration-700 py-12 px-4">
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-yellow-400/20">
                        <Sparkles className="w-10 h-10 text-blue-900" />
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic mb-4">The Teams are Official!</h2>
                    <p className="text-blue-400 font-black text-sm uppercase tracking-[0.3em]">Authorized Assignments for 2026 Season</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {(teamAuction.assignments || []).map((assignment, idx) => (
                        <div key={idx} className="bg-[#111622] overflow-hidden hover:scale-105 transition-all duration-500 border border-white/5 rounded-[2.5rem] shadow-2xl group">
                            <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 border-b border-white/10 relative flex items-center justify-center p-6">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                                <h3 className="text-2xl font-black text-white relative z-10 tracking-tight uppercase italic text-center leading-none">
                                    {assignment.teamName}
                                </h3>
                            </div>
                            <div className="p-8 text-center relative">
                                <div className="w-16 h-16 mx-auto -mt-16 mb-4 rounded-2xl bg-white flex items-center justify-center shadow-2xl relative z-10 text-blue-900 font-black text-xl border-4 border-[#111622]">
                                    {getInitials(assignment.companyName)}
                                </div>
                                <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2">{assignment.ownerName}</p>
                                <p className="text-white font-black text-xl leading-tight uppercase tracking-tight">{assignment.companyName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6 font-black text-[10px] text-blue-400 uppercase tracking-widest">
                    <Gavel className="w-3 h-3" /> Team Discovery Portal
                </div>
                <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic mb-3">Round {teamAuction.roundNumber}</h2>
                <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">Live Price Discovery in Progress</p>
            </div>

            <div className="bg-[#111622] rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="bg-white/[0.02] p-12 lg:p-16 text-center border-b border-white/5 relative z-10">
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Current Reservation Price</p>
                    <div className="relative inline-block">
                        <div className="absolute inset-x-0 bottom-0 h-12 bg-blue-500/20 blur-[60px] rounded-full" />
                        <p className="text-7xl lg:text-8xl font-black font-mono text-white tracking-tighter leading-none relative z-10">
                            ₹{formatCurrency(teamAuction.currentPrice)}
                        </p>
                    </div>
                </div>

                <div className="p-12 lg:p-16 relative z-10">
                    {teamAuction.status === 'ROUND_ACTIVE' && (
                        <div className="space-y-10">
                            <div className="text-center space-y-2">
                                <p className="text-slate-300 font-bold text-lg mb-2">Confirm your interest for this price point</p>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">A total of 12 slots are available</p>
                            </div>

                            <button
                                onClick={() => toggleTeamInterest(currentUser)}
                                className={`w-full py-8 rounded-[2.5rem] font-black text-2xl transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group active:scale-[0.98] ${isInterested
                                    ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                                    : 'bg-white text-slate-900 hover:bg-blue-600 hover:text-white hover:shadow-blue-600/20'
                                    }`}
                            >
                                {isInterested ? (
                                    <>
                                        <CheckCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                        <span>I AM INTERESTED</span>
                                    </>
                                ) : (
                                    <>
                                        <Hand className="w-8 h-8 group-hover:-rotate-12 transition-transform" />
                                        <span>BID INTEREST</span>
                                    </>
                                )}
                            </button>

                            {isInterested && (
                                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center gap-4 animate-in slide-in-from-top-4">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-emerald-400 font-black text-[11px] uppercase tracking-widest">Interest Recorded. Awaiting Next Round.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {teamAuction.status === 'ROUND_STOPPED' && (
                        <div className="text-center py-12 space-y-8 animate-in fade-in duration-700">
                            <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto relative">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-[2rem] animate-ping" />
                                <Users className="w-10 h-10 text-indigo-400" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Evaluating Consensus</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
                                    The ground officials are currently tallying interest signatures. Next price Discovery round will commence shortly.
                                </p>
                            </div>
                            {isInterested && (
                                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    <CheckCircle className="w-4 h-4" /> Participation Signature Active
                                </div>
                            )}
                        </div>
                    )}

                    {teamAuction.status === 'ASSIGNING' && (
                        <div className="text-center py-12 space-y-8 animate-in zoom-in-95 duration-1000">
                            <div className="w-20 h-20 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto relative shadow-2xl shadow-blue-500/20">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-[2rem] animate-pulse" />
                                <Sparkles className="w-10 h-10 text-blue-400" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-white italic">Finalizing Allocations</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
                                    Price Discovery Successful. 12 Primary Partners have been selected. Assigning team rosters now...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Price Trend Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="p-8 bg-[#111622] rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status</h4>
                    </div>
                    <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest leading-relaxed">
                        Each round, the price will fluctuate based on the number of interested sponsors. Once we hit exactly 12 sponsors, the auction closes.
                    </p>
                </div>
                <div className="p-8 bg-[#111622] rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Zone</h4>
                    </div>
                    <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest leading-relaxed">
                        Logged in as <span className="text-white">{currentUser.companyName}</span>. Your interest represents your commitment at the displayed round price.
                    </p>
                </div>
            </div>
        </div>
    );
}
