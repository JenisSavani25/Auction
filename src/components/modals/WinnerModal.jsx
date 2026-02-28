import React, { useEffect } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { formatCurrency } from '../../utils/helpers';
import { Crown, X, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function WinnerModal() {
    const { winnerModal, closeWinnerModal } = useAuction();

    useEffect(() => {
        if (!winnerModal) return;

        const duration = 15 * 1000; // Will run fireworks for up to 15 seconds or until closed
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }; // Ensure zIndex is high enough

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);

        // Cleanup function runs when the modal closes or component unmounts
        return () => clearInterval(interval);
    }, [winnerModal]);

    if (!winnerModal) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Auction Winner Announcement"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
                onClick={closeWinnerModal}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md animate-confetti z-10">
                {/* Confetti (handled by canvas-confetti externally now) */}

                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                    {/* Top gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500" />

                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-blue-50 pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={closeWinnerModal}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors border border-slate-200 shadow-sm"
                        id="close-winner-modal"
                    >
                        <X className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                    </button>

                    <div className="p-8 text-center">
                        {/* Trophy icon */}
                        <div className="relative inline-flex mb-6">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-lg animate-bounce-subtle border-4 border-white">
                                <Crown className="w-12 h-12 text-yellow-900" strokeWidth={2} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-green-200 shadow-sm">
                                <Sparkles className="w-4 h-4 text-green-500" />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="mb-6">
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black mb-1">
                                🎉 Auction Closed
                            </p>
                            <h2 className="text-2xl font-black font-poppins text-slate-800 mb-1 tracking-tight">
                                We Have a Winner!
                            </h2>
                        </div>

                        {/* Sponsorship name */}
                        <div className="mb-6 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Sponsorship</p>
                            <p className="text-slate-800 font-bold text-sm">{winnerModal.sponsorshipName}</p>
                        </div>

                        {/* Winner info */}
                        <div className="mb-6">
                            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-yellow-50 border border-yellow-200 shadow-sm">
                                <Trophy className="w-6 h-6 text-yellow-600" />
                                <div className="text-left">
                                    <p className="text-yellow-700 text-[10px] uppercase tracking-widest font-black">Winner</p>
                                    <p className="text-slate-800 text-xl font-black tracking-tight">{winnerModal.winnerCompany}</p>
                                    <p className="text-slate-500 text-sm font-bold">{winnerModal.winner}</p>
                                </div>
                            </div>
                        </div>

                        {/* Winning bid */}
                        <div className="mb-8">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Winning Bid</p>
                            <p className="text-4xl font-black text-blue-700 font-mono tracking-tighter drop-shadow-sm">
                                {formatCurrency(winnerModal.amount)}
                            </p>
                        </div>

                        <button
                            onClick={closeWinnerModal}
                            className="btn-primary w-full py-4 text-base shadow-md font-black tracking-wide"
                            id="acknowledge-winner-btn"
                        >
                            Congratulations! 🎊
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
