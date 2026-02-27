import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { getInitials } from '../../utils/helpers';
import {
    Users, Plus, Trash2, AlertTriangle, Building, MapPin, User, Phone, Shield, Eye, EyeOff
} from 'lucide-react';

export default function UserManager() {
    const { users, createUser, deleteUser, currentUser } = useAuction();
    const [showCreate, setShowCreate] = useState(false);
    const [showPasswords, setShowPasswords] = useState({});
    const [form, setForm] = useState({
        username: '', password: '', companyName: '', villageName: '', ownerName: '', mobileNumber: ''
    });
    const [formError, setFormError] = useState('');

    const regularUsers = users.filter((u) => u.role !== 'admin');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!form.username.trim()) { setFormError('Username is required'); return; }
        if (!form.password.trim()) { setFormError('Password is required'); return; }
        if (!form.companyName.trim()) { setFormError('Company name is required'); return; }
        if (!form.ownerName.trim()) { setFormError('Owner name is required'); return; }
        if (users.find((u) => u.username === form.username.trim())) {
            setFormError('Username already exists');
            return;
        }
        createUser({ ...form, username: form.username.trim() });
        setForm({ username: '', password: '', companyName: '', villageName: '', ownerName: '', mobileNumber: '' });
        setFormError('');
        setShowCreate(false);
    };

    const togglePassword = (id) => {
        setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-5 bg-transparent">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <h2 className="section-title text-xl text-slate-800">User Management</h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black tracking-widest uppercase shadow-sm">
                        {regularUsers.length} users
                    </span>
                </div>
                <button
                    onClick={() => setShowCreate((v) => !v)}
                    className="btn-primary flex items-center gap-2 shadow-md"
                    id="create-user-btn"
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Create form */}
            {showCreate && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md animate-slide-in">
                    <h3 className="text-slate-800 font-black tracking-tight mb-4 flex items-center gap-2 uppercase">
                        <Plus className="w-4 h-4 text-blue-600" />
                        Create New User
                    </h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest" htmlFor="u-username">Username *</label>
                            <input
                                id="u-username"
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                                placeholder="e.g. krishna_motors"
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest" htmlFor="u-password">Password *</label>
                            <input
                                id="u-password"
                                type="text"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                placeholder="Set login password"
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest" htmlFor="u-company">Company Name *</label>
                            <input
                                id="u-company"
                                type="text"
                                value={form.companyName}
                                onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                                placeholder="e.g. Krishna Motors Pvt Ltd"
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest" htmlFor="u-village">Village Name</label>
                            <input
                                id="u-village"
                                type="text"
                                value={form.villageName}
                                onChange={(e) => setForm((f) => ({ ...f, villageName: e.target.value }))}
                                placeholder="e.g. Shirpur"
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest" htmlFor="u-owner">Owner Name *</label>
                            <input
                                id="u-owner"
                                type="text"
                                value={form.ownerName}
                                onChange={(e) => setForm((f) => ({ ...f, ownerName: e.target.value }))}
                                placeholder="e.g. Ramesh Patil"
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest" htmlFor="u-mobile">Mobile Number</label>
                            <input
                                id="u-mobile"
                                type="tel"
                                value={form.mobileNumber}
                                onChange={(e) => setForm((f) => ({ ...f, mobileNumber: e.target.value }))}
                                placeholder="e.g. 9876543210"
                                className="input-field bg-slate-50 border-slate-200 text-slate-800 focus:bg-white"
                            />
                        </div>

                        {formError && (
                            <div className="sm:col-span-2 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-sm font-bold mt-2">
                                <AlertTriangle className="w-4 h-4" />
                                {formError}
                            </div>
                        )}

                        <div className="sm:col-span-2 flex gap-3 mt-2">
                            <button type="submit" className="btn-primary flex items-center gap-2 shadow-sm">
                                <Plus className="w-4 h-4" />
                                Create User
                            </button>
                            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 shadow-sm font-bold">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* User list */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {regularUsers.map((user) => (
                    <div key={user.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5">
                        {/* User header */}
                        <div className="flex items-start justify-between gap-3 mb-4 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm border border-slate-300 shadow-sm">
                                    {getInitials(user.ownerName || user.username)}
                                </div>
                                <div>
                                    <p className="text-slate-800 font-black tracking-tight">{user.ownerName}</p>
                                    <p className="text-slate-500 font-medium text-xs">@{user.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteUser(user.id)}
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center text-red-500 hover:text-red-700 transition-all flex-shrink-0 shadow-sm"
                                id={`delete-user-${user.id}`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* User details */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="text-slate-700 font-bold">{user.companyName}</span>
                            </div>
                            {user.villageName && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">{user.villageName}</span>
                                </div>
                            )}
                            {user.mobileNumber && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <span className="text-slate-700 font-medium">{user.mobileNumber}</span>
                                </div>
                            )}

                            {/* Password row */}
                            <div className="flex items-center gap-2 text-sm mt-4 pt-4 border-t border-slate-100 bg-slate-50 -mx-5 px-5 -mb-5 pb-5 rounded-b-2xl">
                                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                <span className="text-slate-600 font-mono font-bold">
                                    {showPasswords[user.id] ? user.password : '••••••••'}
                                </span>
                                <button
                                    onClick={() => togglePassword(user.id)}
                                    className="ml-auto text-slate-400 hover:text-slate-600 transition-colors bg-white p-1.5 rounded-md border border-slate-200 shadow-sm"
                                    title={showPasswords[user.id] ? "Hide Password" : "Show Password"}
                                >
                                    {showPasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {regularUsers.length === 0 && (
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-10 text-center">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold text-lg">No users created yet</p>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Create users to allow bidding</p>
                </div>
            )}
        </div>
    );
}
