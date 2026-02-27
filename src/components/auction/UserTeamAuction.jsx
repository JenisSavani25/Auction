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
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 border border-slate-200">
                    <Shield className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight uppercase">Auction Gate Closed</h2>
                <p className="text-slate-500 font-bold max-w-sm text-xs tracking-widest uppercase leading-relaxed">
                    The Team Auction has not been started yet. Please wait for the admin to begin.
                </p>
            </div>
        );
    }

    if (teamAuction.status === 'INAUGURATION') {
        return (
            <div className="animate-in zoom-in-95 duration-700 py-8 px-4">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-yellow-400/20">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-2">Teams Announced!</h2>
                    <p className="text-blue-600 font-black text-xs uppercase tracking-widest">Authorised assignments for 2026 season</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {(teamAuction.assignments || []).map((assignment, idx) => (
                        <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            <div className="h-24 bg-gradient-to-br from-blue-600 to-blue-800 relative flex items-center justify-center p-4">
                                <h3 className="text-xl font-black text-white tracking-tight uppercase text-center leading-none relative z-10">
                                    {assignment.teamName}
                                </h3>
                            </div>
                            <div className="p-5 text-center">
                                <div className="w-12 h-12 mx-auto -mt-11 mb-3 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-md text-blue-700 font-black text-base relative z-10">
                                    {getInitials(assignment.companyName)}
                                </div>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{assignment.ownerName}</p>
                                <p className="text-slate-900 font-black text-sm uppercase tracking-tight">{assignment.companyName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 mb-4 font-black text-[10px] text-blue-600 uppercase tracking-widest">
                    <Gavel className="w-3 h-3" /> Team Discovery Portal
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-1">Round {teamAuction.roundNumber}</h2>
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Live Price Discovery in Progress</p>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 text-center border-b border-slate-100 bg-gradient-to-br from-blue-50 to-slate-50">
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3">Current Reservation Price</p>
                    <p className="text-5xl font-black font-mono text-slate-900 tracking-tighter">
                        {formatCurrency(teamAuction.currentPrice)}
                    </p>
                </div>

                <div className="p-6">
                    {teamAuction.status === 'ROUND_ACTIVE' && (
                        <div className="space-y-5">
                            <div className="text-center">
                                <p className="text-slate-600 font-bold text-sm">Confirm your interest at this price point</p>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">12 slots available in total</p>
                            </div>

                            <button
                                onClick={() => toggleTeamInterest(currentUser)}
                                className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-md flex items-center justify-center gap-3 active:scale-[0.98] border ${isInterested
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-600/20'
                                    : 'bg-blue-700 text-white border-blue-700 hover:bg-blue-800 shadow-blue-700/20'
                                    }`}
                            >
                                {isInterested ? (
                                    <>
                                        <CheckCircle className="w-6 h-6" />
                                        <span>I AM INTERESTED</span>
                                    </>
                                ) : (
                                    <>
                                        <Hand className="w-6 h-6" />
                                        <span>BID MY INTEREST</span>
                                    </>
                                )}
                            </button>

                            {isInterested && (
                                <div className="px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-3 animate-in slide-in-from-top-4">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    <p className="text-emerald-700 font-black text-[11px] uppercase tracking-widest">Interest Recorded — Awaiting Next Round</p>
                                </div>
                            )}
                        </div>
                    )}

                    {teamAuction.status === 'ROUND_STOPPED' && (
                        <div className="text-center py-8 space-y-5 animate-in fade-in duration-700">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Evaluating Consensus</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 max-w-md mx-auto leading-relaxed">
                                    Officials are tallying interest. The next round will begin shortly.
                                </p>
                            </div>
                            {isInterested && (
                                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                                    <CheckCircle className="w-4 h-4" /> Your interest is recorded
                                </div>
                            )}
                        </div>
                    )}

                    {teamAuction.status === 'ASSIGNING' && (
                        <div className="text-center py-8 space-y-5 animate-in zoom-in-95 duration-700">
                            <div className="w-16 h-16 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-center justify-center mx-auto">
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Finalizing Allocations</h3>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 max-w-md mx-auto leading-relaxed">
                                    12 partners selected. Team rosters being assigned now…
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status</h4>
                    </div>
                    <p className="text-slate-600 font-bold text-xs uppercase tracking-widest leading-relaxed">
                        Price adjusts each round based on interest. Auction closes when exactly 12 sponsors commit.
                    </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Identity</h4>
                    </div>
                    <p className="text-slate-600 font-bold text-xs uppercase tracking-widest leading-relaxed">
                        Logged in as <span className="text-blue-700">{currentUser.companyName}</span>. Your interest represents your commitment at the displayed price.
                    </p>
                </div>
            </div>
        </div>
    );
}
