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
        <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    <img src="/Shree%20Vallabhipur%20Taluka%20Cricket%20Logo.png" alt="VTPL Logo" className="h-10 w-auto object-contain" />
                    <div className="hidden sm:block">
                        <p className="text-sm font-black font-poppins text-slate-800 tracking-tight leading-none uppercase">VTPL Auction</p>
                        <p className="text-slate-500 font-bold text-[10px] mt-0.5 tracking-widest uppercase">2026 Season</p>
                    </div>
                </div>

                {/* Center Nav Tabs */}
                {onTabChange && (
                    <div className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                        {currentUser?.role === 'admin' ? (
                            ['dashboard', 'sponsorships', 'teams', 'users', 'analytics'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 capitalize ${activeTab === tab
                                        ? 'bg-blue-700 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                                        }`}
                                >
                                    {tab === 'teams' ? 'Teams Bidding' : tab}
                                </button>
                            ))
                        ) : (
                            ['sponsorships', 'teams'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => onTabChange(tab)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 capitalize ${activeTab === tab
                                        ? 'bg-blue-700 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                                        }`}
                                >
                                    {tab === 'sponsorships' ? 'Sponsorship Auctions' : 'Team Bidding'}
                                </button>
                            ))
                        )}
                    </div>
                )}

                {/* Right side */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Live badge */}
                    {liveCount > 0 && (
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 shadow-sm">
                            <Radio className="w-3 h-3 text-red-500 animate-pulse-slow object-contain" />
                            <span className="text-red-600 text-xs font-bold tracking-widest uppercase">LIVE ({liveCount})</span>
                        </div>
                    )}

                    {/* User dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all duration-200 shadow-sm"
                            id="user-menu-btn"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 border border-blue-600 shadow-sm">
                                {currentUser?.role === 'admin'
                                    ? <Shield className="w-4 h-4 text-yellow-400" />
                                    : getInitials(currentUser?.ownerName || currentUser?.username)}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-slate-800 text-xs font-bold leading-none">
                                    {currentUser?.role === 'admin' ? 'Administrator' : currentUser?.ownerName}
                                </p>
                                <p className="text-slate-500 font-medium text-[10px] mt-0.5">
                                    {currentUser?.role === 'admin' ? 'Admin Panel' : currentUser?.companyName}
                                </p>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl py-2 animate-slide-in">
                                {/* User info */}
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-sm font-bold shadow-md border border-blue-600">
                                            {currentUser?.role === 'admin'
                                                ? <Shield className="w-5 h-5 text-yellow-400" />
                                                : getInitials(currentUser?.ownerName || currentUser?.username)}
                                        </div>
                                        <div>
                                            <p className="text-slate-800 text-sm font-bold">
                                                {currentUser?.role === 'admin' ? 'Super Admin' : currentUser?.ownerName}
                                            </p>
                                            {currentUser?.role === 'user' && (
                                                <>
                                                    <p className="text-slate-600 font-medium text-xs">{currentUser?.companyName}</p>
                                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">{currentUser?.villageName}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Profile item */}
                                <div className="px-4 py-2">
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-xs py-1">
                                        <User className="w-3.5 h-3.5" />
                                        <span>@{currentUser?.username}</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 mt-1 pt-1">
                                    <button
                                        onClick={() => { logout(); setDropdownOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold text-sm transition-colors"
                                        id="logout-btn"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
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
