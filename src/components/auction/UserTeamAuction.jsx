import React from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency, getInitials } from '../../utils/helpers';
import { Hand, Users, Sparkles, CheckCircle, Shield } from 'lucide-react';

export default function UserTeamAuction() {
    const { teamAuction, toggleTeamInterest, currentUser } = useAuction();

    const isInterested = teamAuction.interestedBidders.some((b) => b.id === currentUser.id);

    if (teamAuction.status === 'NOT_STARTED') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <Shield className="w-16 h-16 text-slate-200 mb-4" />
                <h2 className="text-2xl font-black font-poppins text-slate-800 mb-2 tracking-tight uppercase">Team Allocation</h2>
                <p className="text-slate-500 font-medium max-w-sm">The team allocation rounds have not started yet. Please wait for the admin to initiate the process.</p>
            </div>
        );
    }

    if (teamAuction.status === 'INAUGURATION') {
        return (
            <div className="animate-fade-in py-10">
                <div className="text-center mb-12">
                    <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce-subtle drop-shadow-sm" />
                    <h2 className="text-4xl font-black font-poppins text-blue-800 tracking-tight uppercase mb-2">The Teams Are Set!</h2>
                    <p className="text-slate-500 font-bold text-lg">Congratulations to our 12 team sponsors for 2026</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {teamAuction.assignments.map((assignment, idx) => (
                        <div key={idx} className="bg-white overflow-hidden hover:scale-105 transition-transform duration-300 border border-slate-200 rounded-3xl shadow-md group">
                            <div className="h-24 bg-gradient-to-br from-blue-100 to-green-100 border-b border-slate-200 relative flex items-center justify-center">
                                <h3 className="text-2xl font-black font-poppins text-blue-900 relative z-10 tracking-wide px-4 text-center drop-shadow-sm">
                                    {assignment.teamName}
                                </h3>
                            </div>
                            <div className="p-5 text-center relative bg-white">
                                <div className="w-14 h-14 mx-auto -mt-12 mb-3 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center shadow-md relative z-10 text-blue-900 font-black text-xl">
                                    {getInitials(assignment.companyName)}
                                </div>
                                <p className="text-blue-700 text-[10px] uppercase tracking-widest font-bold mb-1">Official Owner</p>
                                <p className="text-slate-800 font-black text-lg leading-tight tracking-tight">{assignment.companyName}</p>
                                <p className="text-slate-500 font-bold text-sm mt-1">{assignment.ownerName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-black font-poppins text-slate-800 uppercase tracking-tight mb-2">Team Sponsorship Allocation</h2>
                <p className="text-slate-500 font-bold tracking-widest uppercase">Round {teamAuction.roundNumber}</p>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                <div className="bg-slate-50 p-8 text-center border-b border-slate-200">
                    <p className="text-slate-500 text-sm uppercase tracking-widest font-black mb-2">Current Asking Price</p>
                    <p className="text-5xl font-black font-mono text-blue-700 drop-shadow-sm tracking-tighter">{formatCurrency(teamAuction.currentPrice)}</p>
                </div>

                <div className="p-8">
                    {teamAuction.status === 'ROUND_ACTIVE' && (
                        <div className="space-y-6">
                            <p className="text-center text-slate-600 font-bold text-lg">Are you interested in owning a team at this price?</p>
                            <button
                                onClick={() => toggleTeamInterest(currentUser)}
                                className={`w-full py-6 rounded-2xl font-black text-2xl transition-all duration-300 shadow-md ${isInterested
                                    ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-inner'
                                    : 'bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                                    }`}
                            >
                                {isInterested ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <CheckCircle className="w-8 h-8 text-green-600" /> YES, I AM INTERESTED
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        <Hand className="w-8 h-8 text-blue-500" /> BID INTEREST AT {formatCurrency(teamAuction.currentPrice)}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    {teamAuction.status === 'ROUND_STOPPED' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center mx-auto mb-2">
                                <Users className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Round Evaluating</h3>
                            <p className="text-slate-500 font-medium">The admin is currently evaluating the number of interested sponsors. Please wait for the next price adjustment or the final assignment.</p>
                            {isInterested && (
                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-bold shadow-sm">
                                    <CheckCircle className="w-4 h-4" /> You are marked as interested.
                                </div>
                            )}
                        </div>
                    )}

                    {teamAuction.status === 'ASSIGNING' && (
                        <div className="text-center py-6 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-2 animate-pulse">
                                <Sparkles className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Assigning Teams</h3>
                            <p className="text-slate-500 font-medium">The required number of sponsors has been finalized! The admin is currently assigning names to the teams. Get ready for the grand reveal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
