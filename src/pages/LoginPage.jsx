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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* High-quality Stadium Background */}
            <div
                className="absolute inset-0 z-0 scale-105"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2600&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(2px)'
                }}
            />

            {/* Mesh Gradient / Glow effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md animate-fade-in relative z-10">
                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <div className="inline-block relative">
                        <img
                            src="/Shree%20Vallabhipur%20Taluka%20Cricket%20Logo.png"
                            alt="VTPL 2026 Logo"
                            className="w-48 h-auto mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-float"
                        />
                    </div>
                    <h1 className="text-4xl font-black font-poppins text-white drop-shadow-xl mb-1 tracking-tight">
                        VTPL <span className="text-blue-500">AUCTION</span>
                    </h1>
                    <p className="text-blue-200/60 text-xs tracking-[0.3em] uppercase font-bold">
                        Bidding Platform 2026
                    </p>
                </div>

                {/* Login Card with enhanced Glassmorphism */}
                <div className="backdrop-blur-xl bg-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 rounded-3xl relative overflow-hidden group">
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-3 mb-8 relative">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Trophy className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white font-poppins">Secure Sign In</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest ml-1" htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); handleChange(); }}
                                placeholder="Enter username"
                                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 backdrop-blur-md"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-300 uppercase tracking-widest ml-1" htmlFor="password">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); handleChange(); }}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 backdrop-blur-md"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 animate-shake">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <p className="text-red-400 font-semibold text-sm">{loginError}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>AUTHENTICATING...</span>
                                    </>
                                ) : (
                                    <>
                                        <Gavel className="w-4 h-4" />
                                        <span>ENTER AUCTION</span>
                                    </>
                                )}
                            </div>
                            {/* Hover shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                        </button>
                    </form>
                </div>

                {/* Bottom info */}
                <div className="flex items-center justify-center gap-8 mt-10">
                    <div className="flex items-center gap-2 text-white/40 font-bold tracking-[0.2em] text-[10px] uppercase">
                        <Zap className="w-3 h-3 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
                        <span>Live Sync</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="text-white/40 font-bold tracking-[0.2em] text-[10px] uppercase">Official 2026 Admin</div>
                </div>
            </div>
        </div>
    );

}
