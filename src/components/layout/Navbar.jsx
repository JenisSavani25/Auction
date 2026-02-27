import React, { useState, useRef, useEffect } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { Gavel, ChevronDown, LogOut, User, Radio, Shield, LayoutGrid, ShieldCheck } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

export default function Navbar({ onTabChange, activeTab, userRoleProp }) {
    const { currentUser, sponsorships, logout } = useAuction();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const liveCount = sponsorships.filter((s) => s.status === 'OPEN').length;

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between gap-4">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-blue-500/10 blur-lg rounded-full scale-0 group-hover:scale-125 transition-transform duration-500" />
                        <img src="/Shree%20Vallabhipur%20Taluka%20Cricket%20Logo.png" alt="VTPL Logo" className="h-10 lg:h-12 w-auto object-contain relative transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm lg:text-base font-black font-poppins text-slate-900 tracking-tight leading-none uppercase">VTPL Auction</p>
                        <p className="text-slate-400 font-bold text-[9px] lg:text-[10px] mt-1 tracking-[0.2em] uppercase">2026 Season</p>
                    </div>
                </div>

                {/* Desktop Tabs */}
                {onTabChange && (
                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 rounded-2xl p-1 border border-slate-200/50">
                        {currentUser?.role === 'admin' ? (
                            ['dashboard', 'sponsorships', 'teams', 'users', 'analytics'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 capitalize tracking-wide ${activeTab === tab
                                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                                        }`}
                                >
                                    {tab === 'teams' ? 'Teams Bid' : tab}
                                </button>
                            ))
                        ) : (
                            ['sponsorships', 'teams'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all duration-300 capitalize tracking-wide ${activeTab === tab
                                        ? 'bg-blue-700 text-white shadow-lg shadow-blue-700/20'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-white'
                                        }`}
                                >
                                    {tab === 'sponsorships' ? 'Sponsorships' : 'Team Bidding'}
                                </button>
                            ))
                        )}
                    </div>
                )}

                {/* Right Actions */}
                <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
                    {/* Live Indicator */}
                    {liveCount > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                            </span>
                            <span className="text-red-600 text-[10px] font-black tracking-widest uppercase hidden lg:block">LIVE</span>
                            <span className="text-red-600 text-[10px] font-black tracking-widest uppercase lg:hidden">{liveCount}</span>
                        </div>
                    )}

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            className="flex items-center gap-2 lg:gap-3 pl-1.5 pr-2 py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-300 shadow-sm group"
                            id="user-menu-btn"
                        >
                            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-xs lg:text-sm font-black flex-shrink-0 border border-blue-600 shadow-md group-hover:shadow-blue-500/20 group-hover:scale-105 transition-all">
                                {currentUser?.role === 'admin'
                                    ? <Shield className="w-4 h-4 text-yellow-400" />
                                    : getInitials(currentUser?.ownerName || currentUser?.username)}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-slate-900 text-[11px] font-black leading-none uppercase tracking-tight">
                                    {currentUser?.role === 'admin' ? 'Administrator' : currentUser?.ownerName}
                                </p>
                                <p className="text-slate-400 font-bold text-[9px] mt-0.5 tracking-tight uppercase">
                                    {currentUser?.role === 'admin' ? currentUser?.username : currentUser?.companyName}
                                </p>
                            </div>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-3 w-72 bg-white border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.12)] rounded-3xl py-2 animate-in fade-in slide-in-from-top-4 duration-300 z-[60]">
                                {/* User Card in Dropdown */}
                                <div className="px-5 py-4 border-b border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-base font-black shadow-lg border border-blue-600">
                                            {currentUser?.role === 'admin'
                                                ? <Shield className="w-6 h-6 text-yellow-400" />
                                                : getInitials(currentUser?.ownerName || currentUser?.username)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-slate-900 text-sm font-black truncate uppercase tracking-tight leading-none mb-1">
                                                {currentUser?.role === 'admin' ? 'Super Admin' : currentUser?.ownerName}
                                            </p>
                                            <p className="text-slate-500 font-bold text-[10px] truncate uppercase tracking-widest">
                                                {currentUser?.companyName || 'VTPL AUTHORITY'}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
                                                <ShieldCheck className="w-3 h-3 text-blue-600" />
                                                <span className="text-blue-700 text-[8px] font-black uppercase tracking-widest">{currentUser?.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-2 py-2">
                                    {/* Action Items */}
                                    <div className="flex items-center gap-3 px-4 py-2 text-slate-500 text-xs font-bold font-mono">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span>ACTIVE: @{currentUser?.username}</span>
                                    </div>

                                    <div className="h-px bg-slate-100 mx-3 my-1" />

                                    <button
                                        onClick={() => { logout(); setDropdownOpen(false); }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl font-black text-xs transition-all tracking-widest"
                                        id="logout-btn"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        LOGOUT SESSION
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

