import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const socket = io(BACKEND_URL);

const AuctionContext = createContext(null);

export function AuctionProvider({ children }) {
    const [globalState, setGlobalState] = useState(null);
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('auction_user');
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error("Failed to parse saved user:", e);
            return null;
        }
    });
    const [loginError, setLoginError] = useState(null);

    useEffect(() => {
        socket.on('stateUpdate', (newState) => {
            setGlobalState(newState);
        });

        return () => {
            socket.off('stateUpdate');
        };
    }, []);



    const login = useCallback((username, password) => {
        if (!globalState) return;
        const user = globalState.users.find(
            (u) => u.username === username && u.password === password
        );
        if (!user) {
            setLoginError('Invalid username or password');
        } else {
            setCurrentUser(user);
            localStorage.setItem('auction_user', JSON.stringify(user));
            setLoginError(null);
        }
    }, [globalState]);

    const logout = useCallback(() => {
        setCurrentUser(null);
        localStorage.removeItem('auction_user');
    }, []);
    const clearLoginError = useCallback(() => setLoginError(null), []);

    // Sync persisted user with global state
    useEffect(() => {
        if (globalState && currentUser && currentUser.role !== 'admin') {
            const userExists = globalState.users.find(u => u.id === currentUser.id);
            if (!userExists) {
                logout();
            } else if (JSON.stringify(userExists) !== JSON.stringify(currentUser)) {
                // Update local user info if changed (e.g. company name updated)
                setCurrentUser(userExists);
                localStorage.setItem('auction_user', JSON.stringify(userExists));
            }
        }
    }, [globalState, currentUser, logout]);

    // Server action dispatcher
    const dispatchAction = useCallback((action) => {
        socket.emit('action', action);
    }, []);

    const createUser = useCallback((user) => dispatchAction({ type: 'CREATE_USER', user }), [dispatchAction]);
    const deleteUser = useCallback((userId) => dispatchAction({ type: 'DELETE_USER', userId }), [dispatchAction]);
    const createSponsorship = useCallback((sponsorship) => dispatchAction({ type: 'CREATE_SPONSORSHIP', sponsorship }), [dispatchAction]);
    const startAuction = useCallback((sponsorshipId) => dispatchAction({ type: 'START_AUCTION', sponsorshipId }), [dispatchAction]);
    const allotAuction = useCallback((sponsorshipId) => dispatchAction({ type: 'ALLOT_AUCTION', sponsorshipId }), [dispatchAction]);
    const rejectAuction = useCallback((sponsorshipId) => dispatchAction({ type: 'REJECT_AUCTION', sponsorshipId }), [dispatchAction]);
    const placeBid = useCallback((sponsorshipId, bidAmount, bidder, bidderCompany) =>
        dispatchAction({ type: 'PLACE_BID', sponsorshipId, bidAmount, bidder, bidderCompany }), [dispatchAction]);
    // Supporter version: places bid credited to the sponsor (actingAs)
    const placeBidAs = useCallback((sponsorshipId, bidAmount, actingAs) =>
        dispatchAction({ type: 'PLACE_BID', sponsorshipId, bidAmount, bidder: null, bidderCompany: null, actingAs }), [dispatchAction]);
    const closeWinnerModal = useCallback(() => dispatchAction({ type: 'CLOSE_WINNER_MODAL' }), [dispatchAction]);
    const extendTimer = useCallback((sponsorshipId, minutes) => dispatchAction({ type: 'EXTEND_TIMER', sponsorshipId, minutes }), [dispatchAction]);
    const updateDuration = useCallback((sponsorshipId, minutes) => dispatchAction({ type: 'UPDATE_DURATION', sponsorshipId, minutes }), [dispatchAction]);

    const setTeamPrice = useCallback((price) => dispatchAction({ type: 'TEAM_SET_PRICE', price }), [dispatchAction]);
    const startTeamRound = useCallback((price, newRound) => dispatchAction({ type: 'TEAM_START_ROUND', price, newRound }), [dispatchAction]);
    const stopTeamRound = useCallback(() => dispatchAction({ type: 'TEAM_STOP_ROUND' }), [dispatchAction]);
    const toggleTeamInterest = useCallback((user) => dispatchAction({ type: 'TEAM_TOGGLE_INTEREST', user }), [dispatchAction]);
    // Supporter version: toggles a specific sponsor's interest
    const toggleTeamInterestAs = useCallback((targetUser) => dispatchAction({ type: 'TEAM_TOGGLE_INTEREST', targetUser }), [dispatchAction]);
    const finalizeTeamWinners = useCallback(() => dispatchAction({ type: 'TEAM_FINALIZE_WINNERS' }), [dispatchAction]);
    const saveTeamAssignments = useCallback((assignments) => dispatchAction({ type: 'TEAM_SAVE_ASSIGNMENTS', assignments }), [dispatchAction]);
    const announceTeams = useCallback(() => dispatchAction({ type: 'TEAM_ANNOUNCE' }), [dispatchAction]);
    const resetTeamAuction = useCallback(() => dispatchAction({ type: 'TEAM_RESET' }), [dispatchAction]);

    const leaderboard = React.useMemo(() => {
        if (!globalState) return [];
        const totals = {};
        globalState.sponsorships.forEach((sp) => {
            sp.bids.forEach((bid) => {
                if (!totals[bid.bidderCompany]) {
                    totals[bid.bidderCompany] = { company: bid.bidderCompany, owner: bid.bidder, total: 0, bidCount: 0 };
                }
                totals[bid.bidderCompany].total += bid.amount;
                totals[bid.bidderCompany].bidCount += 1;
            });
        });
        return Object.values(totals)
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
    }, [globalState]);

    if (!globalState) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white">Connecting to live server...</div>;
    }

    const value = {
        ...globalState,
        currentUser,
        loginError,
        leaderboard,
        login,
        logout,
        clearLoginError,
        createUser,
        deleteUser,
        createSponsorship,
        startAuction,
        allotAuction,
        rejectAuction,
        placeBid,
        placeBidAs,
        closeWinnerModal,
        extendTimer,
        updateDuration,
        setTeamPrice,
        startTeamRound,
        stopTeamRound,
        toggleTeamInterest,
        toggleTeamInterestAs,
        finalizeTeamWinners,
        saveTeamAssignments,
        announceTeams,
        resetTeamAuction,
    };

    return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>;
}

export function useAuction() {
    const ctx = useContext(AuctionContext);
    if (!ctx) throw new Error('useAuction must be used inside AuctionProvider');
    return ctx;
}
