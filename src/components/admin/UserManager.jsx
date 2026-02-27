import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { getInitials } from '../../utils/helpers';
import {
    Users, Plus, Trash2, AlertTriangle, Building, MapPin, User, Phone, Shield, Eye, EyeOff
} from 'lucide-react';

export default function UserManager() {
    const { users, createUser, deleteUser, updateUserRole, currentUser } = useAuction();
    const [showCreate, setShowCreate] = useState(false);
    const [showPasswords, setShowPasswords] = useState({});
    const [form, setForm] = useState({
        username: '', password: '', companyName: '', villageName: '', ownerName: '', mobileNumber: '', role: 'user'
    });
    const [formError, setFormError] = useState('');

    const regularUsers = users.filter((u) => u.role !== 'admin');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!form.username.trim()) { setFormError('Username is required'); return; }
        if (!form.password.trim()) { setFormError('Password is required'); return; }
        if (form.role === 'user') {
            if (!form.companyName.trim()) { setFormError('Company name is required'); return; }
            if (!form.ownerName.trim()) { setFormError('Owner name is required'); return; }
        }
        if (users.find((u) => u.username === form.username.trim())) {
            setFormError('Username already taken');
            return;
        }
        createUser({ ...form, username: form.username.trim() });
        setForm({ username: '', password: '', companyName: '', villageName: '', ownerName: '', mobileNumber: '', role: 'user' });
        setFormError('');
        setShowCreate(false);
    };

    const togglePassword = (id) => {
        setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Control Tier */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Sponsor Directory</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-0.5">Registered participants: {regularUsers.length}</p>
                </div>
                <button
                    onClick={() => setShowCreate((v) => !v)}
                    className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center gap-2"
                    id="create-user-btn"
                >
                    <Plus className="w-5 h-5" />
                    Add New Sponsor
                </button>
            </div>

            {/* Entity Onboarding */}
            {showCreate && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md animate-in zoom-in-95 duration-300">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Role Selector — full width */}
                        <div className="md:col-span-2 lg:col-span-3 flex items-center gap-3">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Account Type:</span>
                            {['user', 'supporter'].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, role: r }))}
                                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${form.role === r
                                        ? r === 'supporter' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-blue-700 border-blue-700 text-white'
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                        }`}
                                >
                                    {r === 'supporter' ? '⚡ Supporter' : '🏢 Sponsor'}
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Login Username *</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                                placeholder="Unique ID..."
                                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Login Password *</label>
                            <input
                                type="text"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                placeholder="Secret..."
                                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                                autoComplete="off"
                            />
                        </div>
                        {/* Company / Owner / Village / Mobile — only for sponsors */}
                        {form.role === 'user' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Company Name *</label>
                                    <input
                                        type="text"
                                        value={form.companyName}
                                        onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                                        placeholder="Company Name..."
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Village Name</label>
                                    <input
                                        type="text"
                                        value={form.villageName}
                                        onChange={(e) => setForm((f) => ({ ...f, villageName: e.target.value }))}
                                        placeholder="Locality..."
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Owner Full Name *</label>
                                    <input
                                        type="text"
                                        value={form.ownerName}
                                        onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                                        placeholder="Full Name..."
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={form.mobileNumber}
                                        onChange={(e) => setForm((f) => ({ ...f, mobileNumber: e.target.value }))}
                                        placeholder="Mobile..."
                                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm placeholder-slate-300 focus:outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </>
                        )}

                        {formError && (
                            <div className="md:col-span-2 lg:col-span-3 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black uppercase tracking-widest">
                                <AlertTriangle className="w-4 h-4" /> {formError}
                            </div>
                        )}

                        <div className="md:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                            <button type="submit" className="px-6 py-2.5 bg-blue-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-800 transition-all shadow-md active:scale-95">
                                Add Sponsor
                            </button>
                            <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 bg-white text-slate-400 border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-50 transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Profile Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {regularUsers.map((user) => (
                    <div key={user.id} className={`group bg-white rounded-2xl p-5 border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative overflow-hidden ${user.role === 'supporter' ? 'border-amber-200 hover:border-amber-300' : 'border-slate-200 hover:border-blue-100'
                        }`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors duration-500" />

                        {/* Identity Signature */}
                        <div className="flex items-start justify-between relative z-10 mb-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-base border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                                    {getInitials(user.ownerName || user.username)}
                                </div>
                                <div>
                                    <p className="text-slate-900 font-black text-sm uppercase tracking-tight truncate max-w-[150px]">{user.ownerName}</p>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">@{user.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteUser(user.id)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 flex items-center justify-center transition-all shadow-sm active:scale-90"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Attribute Ledger */}
                        <div className="space-y-3 flex-1 relative z-10">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Company Name</label>
                                <div className="flex items-center gap-3">
                                    <Building className="w-4 h-4 text-blue-600" />
                                    <span className="text-slate-800 font-black text-sm uppercase tracking-tight">{user.companyName}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Village</label>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-slate-600 font-bold text-xs uppercase">{user.villageName || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Contact</label>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-slate-600 font-bold text-xs">{user.mobileNumber || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role badge + toggle */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.role === 'supporter'
                                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                                        : 'bg-blue-50 border-blue-200 text-blue-700'
                                    }`}>
                                    {user.role === 'supporter' ? '⚡ Supporter' : '🏢 Sponsor'}
                                </span>
                            </div>
                            <button
                                onClick={() => updateUserRole(user.id, user.role === 'supporter' ? 'user' : 'supporter')}
                                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                                title="Toggle role between Sponsor and Supporter"
                            >
                                Switch Role
                            </button>
                        </div>

                        {/* Security Protocol Footer */}
                        <div className="mt-3 flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                <Shield className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-slate-800 font-mono font-black text-xs tracking-wider">
                                    {showPasswords[user.id] ? user.password : '••••••••'}
                                </span>
                            </div>
                            <button
                                onClick={() => togglePassword(user.id)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-90 flex items-center justify-center"
                            >
                                {showPasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {regularUsers.length === 0 && (
                <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-16 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-8 text-slate-300">
                        <Users className="w-10 h-10" />
                    </div>
                    <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-lg">Empty Directory</p>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-3">No participants registered in current node</p>
                </div>
            )}
        </div>
    );
}

