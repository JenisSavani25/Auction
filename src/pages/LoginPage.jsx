import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Gavel, Eye, EyeOff, Trophy, Zap } from 'lucide-react';

export default function LoginPage() {
    const { login, loginError, clearLoginError } = useAuction();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        login(username.trim(), password);
        setIsLoading(false);
    };

    const handleChange = () => {
        if (loginError) clearLoginError();
    };



    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <img src="/logo.png" alt="VTPL 2026 Logo" className="w-64 h-auto mx-auto mb-6 drop-shadow-md animate-float" />
                    <h1 className="text-3xl font-bold font-poppins text-slate-800 drop-shadow-sm mb-2">
                        Sponsorship Auction
                    </h1>
                    <p className="text-slate-500 text-sm tracking-widest uppercase font-bold">
                        Premium Bidding Platform 2026
                    </p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8 shadow-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-800 font-poppins">Sign In</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="label" htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); handleChange(); }}
                                placeholder="Enter your username"
                                className="input-field"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="label" htmlFor="password">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); handleChange(); }}
                                    placeholder="Enter your password"
                                    className="input-field pr-12"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 animate-slide-in">
                                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                <p className="text-red-600 font-medium text-sm">{loginError}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <Gavel className="w-4 h-4" />
                                    <span>Enter Auction</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Bottom info */}
                <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="flex items-center gap-2 text-slate-500 font-bold tracking-wide text-xs">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span className="uppercase">Live Auctions</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="text-slate-500 font-bold uppercase tracking-wide text-xs">Secure Bidding Platform</div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="text-slate-500 font-bold uppercase tracking-wide text-xs">2026</div>
                </div>
            </div>
        </div>
    );
}
