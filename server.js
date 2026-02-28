import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// INITIAL DATA
const INITIAL_USERS = [
    { id: 'admin', username: 'admin', password: 'admin123', role: 'admin', companyName: 'Admin Panel', villageName: '', ownerName: 'Super Admin', mobileNumber: '9999999999' },
    { id: 'dashboard', username: 'dashboard', password: 'dashboard123', role: 'dashboard', companyName: 'Main Dashboard', villageName: '', ownerName: 'Live Display', mobileNumber: '0000000000' },
];

const INITIAL_SPONSORSHIPS = [];

// IN-MEMORY STATE
let state = {
    users: [...INITIAL_USERS],
    sponsorships: [...INITIAL_SPONSORSHIPS],
    recentBids: [],
    pendingBids: [],
    winnerModal: null,
    teamAuction: {
        status: 'NOT_STARTED', // NOT_STARTED, ROUND_ACTIVE, ROUND_STOPPED, ASSIGNING, INAUGURATION
        currentPrice: 50000,
        roundNumber: 0,
        interestedBidders: [],
        winners: [],
        assignments: [],
        history: [],
    }
};

let globalStateCollection = null;

// HELPER: Broadcast state to all connected clients and persist to DB
async function broadcastState() {
    io.emit('stateUpdate', state);
    if (globalStateCollection) {
        try {
            await globalStateCollection.updateOne(
                { _id: 'global_state' },
                { $set: { state } },
                { upsert: true }
            );
        } catch (err) {
            console.error("Error saving to MongoDB:", err);
        }
    }
}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send initial state to the connected client
    socket.emit('stateUpdate', state);

    // ACTION HANDLERS (Same logic as AuctionContext reducer)
    socket.on('action', (action) => {
        let stateChanged = true;

        switch (action.type) {
            case 'LOGIN':
                // Do login securely on backend if needed, but for now just validation
                break;
            case 'CREATE_USER':
                state.users.push({
                    ...action.user,
                    id: `user_${Date.now()}`,
                    role: action.user.role || 'user'
                });
                break;
            case 'DELETE_USER':
                state.users = state.users.filter(u => u.id !== action.userId);
                break;
            case 'UPDATE_USER_ROLE':
                state.users = state.users.map(u =>
                    u.id === action.userId ? { ...u, role: action.role } : u
                );
                break;
            case 'CREATE_SPONSORSHIP':
                state.sponsorships.push({
                    ...action.sponsorship,
                    id: `sp_${Date.now()}`,
                    currentHighestBid: 0,
                    currentHighestBidder: null,
                    currentHighestBidderCompany: null,
                    startTime: null,
                    endTime: null,
                    status: 'UPCOMING',
                    bids: [],
                });
                break;
            case 'START_AUCTION': {
                const now = Date.now();
                state.sponsorships = state.sponsorships.map(sp => {
                    if (sp.id !== action.sponsorshipId) return sp;
                    return { ...sp, status: 'OPEN', startTime: now, endTime: now + sp.durationMinutes * 60 * 1000 };
                });
                break;
            }
            case 'REJECT_AUCTION':
                state.sponsorships = state.sponsorships.map(sp =>
                    sp.id === action.sponsorshipId ? { ...sp, status: 'REJECTED' } : sp
                );
                break;
            case 'REOPEN_AUCTION':
                state.sponsorships = state.sponsorships.map(sp => {
                    if (sp.id !== action.sponsorshipId) return sp;
                    return {
                        ...sp,
                        status: 'UPCOMING',  // reset status only
                        startTime: null,
                        endTime: null,
                        // bids, currentHighestBid, currentHighestBidder preserved
                    };
                });
                break;
            case 'PLACE_BID': {
                const { sponsorshipId, bidAmount, bidder, bidderCompany, actingAs, bypassApproval } = action;
                const effectiveBidder = actingAs ? actingAs.ownerName : bidder;
                const effectiveBidderCompany = actingAs ? actingAs.companyName : bidderCompany;
                const now = Date.now();
                const bid = {
                    id: `bid_${now}_${Math.random().toString(36).substr(2, 5)}`,
                    sponsorshipId,
                    amount: bidAmount,
                    bidder: effectiveBidder,
                    bidderCompany: effectiveBidderCompany,
                    sponsorshipName: state.sponsorships.find(s => s.id === sponsorshipId)?.name || '',
                    timestamp: now,
                };

                // If bypassApproval is true (e.g., admin placed it), approve it immediately
                if (bypassApproval) {
                    state.sponsorships = state.sponsorships.map(sp => {
                        if (sp.id !== sponsorshipId) return sp;
                        const newEndTime = now + (sp.durationMinutes * 60 * 1000);
                        return {
                            ...sp,
                            currentHighestBid: bidAmount,
                            currentHighestBidder: effectiveBidder,
                            currentHighestBidderCompany: effectiveBidderCompany,
                            endTime: newEndTime,
                            bids: [bid, ...sp.bids],
                        };
                    });
                    state.recentBids = [bid, ...state.recentBids].slice(0, 50);
                } else {
                    // Otherwise, queue it for admin approval
                    state.pendingBids.push(bid);
                }
                break;
            }
            case 'APPROVE_BID': {
                const bidToApprove = state.pendingBids.find(b => b.id === action.bidId);
                if (bidToApprove) {
                    // Remove from pending
                    state.pendingBids = state.pendingBids.filter(b => b.id !== action.bidId);

                    // Add to live
                    state.sponsorships = state.sponsorships.map(sp => {
                        if (sp.id !== bidToApprove.sponsorshipId) return sp;
                        // Only approve if the bid is still strictly valid (higher than current)
                        // It's possible multiple pending bids existed and a higher one was already approved
                        if (bidToApprove.amount >= (sp.currentHighestBid || sp.basePrice)) {
                            const now = Date.now();
                            const newEndTime = now + (sp.durationMinutes * 60 * 1000);
                            return {
                                ...sp,
                                currentHighestBid: bidToApprove.amount,
                                currentHighestBidder: bidToApprove.bidder,
                                currentHighestBidderCompany: bidToApprove.bidderCompany,
                                endTime: newEndTime,
                                bids: [bidToApprove, ...sp.bids],
                            };
                        }
                        return sp;
                    });

                    // Add to recent if it was successfully applied (we don't strictly check here, just add to stream)
                    state.recentBids = [bidToApprove, ...state.recentBids].slice(0, 50);
                }
                break;
            }
            case 'REJECT_BID': {
                state.pendingBids = state.pendingBids.filter(b => b.id !== action.bidId);
                break;
            }
            case 'ALLOT_AUCTION': {
                const sp = state.sponsorships.find(s => s.id === action.sponsorshipId);
                if (sp) {
                    sp.status = 'ALLOTED';
                    if (sp.currentHighestBidder) {
                        state.winnerModal = {
                            sponsorshipName: sp.name,
                            winner: sp.currentHighestBidder,
                            winnerCompany: sp.currentHighestBidderCompany,
                            amount: sp.currentHighestBid,
                        };
                    }
                }
                break;
            }
            case 'SHOW_WINNER_MODAL':
                state.winnerModal = action.data;
                break;
            case 'CLOSE_WINNER_MODAL':
                state.winnerModal = null;
                break;
            case 'EXTEND_TIMER':
                state.sponsorships = state.sponsorships.map(sp => {
                    if (sp.id !== action.sponsorshipId) return sp;
                    return { ...sp, endTime: sp.endTime + action.minutes * 60 * 1000 };
                });
                break;
            case 'UPDATE_DURATION':
                state.sponsorships = state.sponsorships.map(sp =>
                    sp.id === action.sponsorshipId ? { ...sp, durationMinutes: action.minutes } : sp
                );
                break;
            case 'TEAM_SET_PRICE':
                state.teamAuction.currentPrice = action.price;
                break;
            case 'TEAM_START_ROUND':
                state.teamAuction.status = 'ROUND_ACTIVE';
                state.teamAuction.interestedBidders = [];
                if (action.newRound) {
                    state.teamAuction.roundNumber += 1;
                }
                if (action.price) {
                    state.teamAuction.currentPrice = action.price;
                }
                break;
            case 'TEAM_STOP_ROUND':
                state.teamAuction.status = 'ROUND_STOPPED';
                state.teamAuction.history.push({
                    round: state.teamAuction.roundNumber,
                    price: state.teamAuction.currentPrice,
                    interestedBidders: state.teamAuction.interestedBidders.length
                });
                break;
            case 'TEAM_TOGGLE_INTEREST': {
                // targetUser: the actual sponsor (used when supporter acts on behalf)
                const targetUser = action.targetUser || action.user;
                const isInterested = state.teamAuction.interestedBidders.some(b => b.id === targetUser.id);
                if (isInterested) {
                    state.teamAuction.interestedBidders = state.teamAuction.interestedBidders.filter(b => b.id !== targetUser.id);
                } else {
                    state.teamAuction.interestedBidders.push(targetUser);
                }
                break;
            }
            case 'TEAM_FINALIZE_WINNERS':
                state.teamAuction.status = 'ASSIGNING';
                state.teamAuction.winners = [...state.teamAuction.interestedBidders];
                break;
            case 'TEAM_SAVE_ASSIGNMENTS':
                state.teamAuction.assignments = action.assignments;
                break;
            case 'TEAM_ANNOUNCE':
                state.teamAuction.status = 'INAUGURATION';
                break;
            case 'TEAM_RESET':
                state.teamAuction = {
                    status: 'NOT_STARTED',
                    currentPrice: 50000,
                    roundNumber: 0,
                    interestedBidders: [],
                    winners: [],
                    assignments: [],
                    history: []
                };
                break;
            default:
                stateChanged = false;
        }

        if (stateChanged) {
            broadcastState();
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Auto-allot check removed as per user request (Manual completion required)
setInterval(() => {
    // We only keep the interval to broadcast a heartbeat if needed or handle other periodic tasks
    // Auto-allotment is now handled manually via 'ALLOT_AUCTION' action
}, 5000);

const PORT = process.env.PORT || 3001;

async function startServer() {
    if (process.env.MONGO_URI) {
        try {
            const client = new MongoClient(process.env.MONGO_URI);
            await client.connect();
            console.log("Connected to MongoDB Atlas!");

            const db = client.db('auction_db');
            globalStateCollection = db.collection('auction_state');

            // Clean up old prod_state document if exists
            await globalStateCollection.deleteOne({ _id: 'prod_state' });
            console.log("Old prod_state document removed (if existed).");

            // Try to load from global_state
            const savedDoc = await globalStateCollection.findOne({ _id: 'global_state' });
            if (savedDoc && savedDoc.state) {
                state = savedDoc.state;
                if (!state.pendingBids) state.pendingBids = []; // Ensure backwards compatibility with old DB docs
                // Ensure admin and dashboard users always exist
                const hasAdmin = state.users.some(u => u.id === 'admin');
                const hasDashboard = state.users.some(u => u.id === 'dashboard');
                if (!hasAdmin) state.users.unshift(INITIAL_USERS[0]);
                if (!hasDashboard) state.users.push(INITIAL_USERS[1]);
                console.log("Loaded state from MongoDB (global_state).");
            } else {
                console.log("No global_state found. Starting fresh.");
                await globalStateCollection.insertOne({ _id: 'global_state', state });
            }
        } catch (err) {
            console.error("Failed to connect to MongoDB. Running in memory mode.", err);
        }
    } else {
        console.log("No MONGO_URI found. Running with in-memory state only.");
    }

    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

startServer();
