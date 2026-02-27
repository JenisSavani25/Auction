import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust depending on where your Vite app is hosted (e.g., http://localhost:5173)
        methods: ["GET", "POST"]
    }
});

// INITIAL DATA
const INITIAL_USERS = [
    { id: 'admin', username: 'admin', password: 'admin123', role: 'admin', companyName: 'Admin Panel', villageName: '', ownerName: 'Super Admin', mobileNumber: '9999999999' },
    { id: 'user1', username: 'krishna_motors', password: 'pass123', role: 'user', companyName: 'Krishna Motors Pvt Ltd', villageName: 'Shirpur', ownerName: 'Ramesh Patil', mobileNumber: '9876543210' },
    { id: 'user2', username: 'shivaji_traders', password: 'pass123', role: 'user', companyName: 'Shivaji Traders & Co', villageName: 'Dhule', ownerName: 'Vijay Nikam', mobileNumber: '9765432109' },
    { id: 'user3', username: 'mauli_enterprises', password: 'pass123', role: 'user', companyName: 'Mauli Enterprises', villageName: 'Nandurbar', ownerName: 'Santosh More', mobileNumber: '9654321098' },
    { id: 'user4', username: 'samarth_group', password: 'pass123', role: 'user', companyName: 'Samarth Group of Companies', villageName: 'Sakri', ownerName: 'Dinesh Chaudhari', mobileNumber: '9543210987' },
    { id: 'user5', username: 'jai_hind', password: 'pass123', role: 'user', companyName: 'Jai Hind Industries', villageName: 'Shahada', ownerName: 'Pravin Sonawane', mobileNumber: '9432109876' },
    { id: 'dashboard', username: 'dashboard', password: 'dashboard123', role: 'dashboard', companyName: 'Main Dashboard', villageName: '', ownerName: 'Live Display', mobileNumber: '0000000000' },
];

const INITIAL_SPONSORSHIPS = [
    { id: 'sp1', name: 'Opening Ceremony Title Sponsor', basePrice: 500000, currentHighestBid: 0, currentHighestBidder: null, currentHighestBidderCompany: null, startTime: null, endTime: null, durationMinutes: 10, status: 'UPCOMING', bids: [], description: 'Premium branding at the grand opening ceremony with full stage coverage' },
    { id: 'sp2', name: 'Main Event Platinum Sponsor', basePrice: 1000000, currentHighestBid: 0, currentHighestBidder: null, currentHighestBidderCompany: null, startTime: null, endTime: null, durationMinutes: 8, status: 'UPCOMING', bids: [], description: 'Exclusive platinum rights with logo on all event materials and media' },
    { id: 'sp3', name: 'Cultural Night Gold Sponsor', basePrice: 250000, currentHighestBid: 0, currentHighestBidder: null, currentHighestBidderCompany: null, startTime: null, endTime: null, durationMinutes: 5, status: 'UPCOMING', bids: [], description: 'Gold sponsorship for cultural evening with dedicated stage time' },
    { id: 'sp4', name: 'Sports Day Official Sponsor', basePrice: 150000, currentHighestBid: 0, currentHighestBidder: null, currentHighestBidderCompany: null, startTime: null, endTime: null, durationMinutes: 6, status: 'UPCOMING', bids: [], description: 'Official sponsorship of the sports competition day events' },
    { id: 'sp5', name: 'Food & Hospitality Partner', basePrice: 200000, currentHighestBid: 0, currentHighestBidder: null, currentHighestBidderCompany: null, startTime: null, endTime: null, durationMinutes: 7, status: 'UPCOMING', bids: [], description: 'Exclusive hospitality and catering rights across all event days' },
    { id: 'sp6', name: 'Media & Digital Rights Sponsor', basePrice: 300000, currentHighestBid: 0, currentHighestBidder: null, currentHighestBidderCompany: null, startTime: null, endTime: null, durationMinutes: 5, status: 'UPCOMING', bids: [], description: 'Digital streaming and social media exclusive partnership rights' },
];

// IN-MEMORY STATE
let state = {
    users: [...INITIAL_USERS],
    sponsorships: [...INITIAL_SPONSORSHIPS],
    recentBids: [],
    winnerModal: null,
    teamAuction: {
        status: 'NOT_STARTED', // NOT_STARTED, ROUND_ACTIVE, ROUND_STOPPED, ASSIGNING, INAUGURATION
        currentPrice: 50000,
        roundNumber: 1,
        interestedBidders: [],
        winners: [],
        assignments: [],
    }
};

// HELPER: Broadcast state to all connected clients
function broadcastState() {
    io.emit('stateUpdate', state);
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
                state.users.push({ ...action.user, id: `user_${Date.now()}`, role: 'user' });
                break;
            case 'DELETE_USER':
                state.users = state.users.filter(u => u.id !== action.userId);
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
            case 'PLACE_BID': {
                const { sponsorshipId, bidAmount, bidder, bidderCompany } = action;
                const now = Date.now();
                const bid = {
                    id: `bid_${now}`,
                    sponsorshipId,
                    amount: bidAmount,
                    bidder,
                    bidderCompany,
                    timestamp: now,
                };

                state.sponsorships = state.sponsorships.map(sp => {
                    if (sp.id !== sponsorshipId) return sp;
                    // RESET TIMER: current_time + bid_timer_duration (in minutes)
                    const newEndTime = now + (sp.durationMinutes * 60 * 1000);
                    return {
                        ...sp,
                        currentHighestBid: bidAmount,
                        currentHighestBidder: bidder,
                        currentHighestBidderCompany: bidderCompany,
                        endTime: newEndTime, // RESET TIMER
                        bids: [bid, ...sp.bids],
                    };
                });
                state.recentBids = [bid, ...state.recentBids].slice(0, 50);
                break;
            }
            case 'ALLOT_AUCTION':
                state.sponsorships = state.sponsorships.map(sp =>
                    sp.id === action.sponsorshipId ? { ...sp, status: 'ALLOTED' } : sp
                );
                break;
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
                break;
            case 'TEAM_TOGGLE_INTEREST': {
                const isInterested = state.teamAuction.interestedBidders.some(b => b.id === action.user.id);
                if (isInterested) {
                    state.teamAuction.interestedBidders = state.teamAuction.interestedBidders.filter(b => b.id !== action.user.id);
                } else {
                    state.teamAuction.interestedBidders.push(action.user);
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
                    roundNumber: 1,
                    interestedBidders: [],
                    winners: [],
                    assignments: []
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

// Auto-allot expired auctions loop on backend
setInterval(() => {
    let changed = false;
    const now = Date.now();
    state.sponsorships.forEach(sp => {
        if (sp.status === 'OPEN' && sp.endTime && now >= sp.endTime) {
            sp.status = 'ALLOTED'; // Auto switch to allotted

            // Show winner modal globally if there was a bidder
            if (sp.currentHighestBidder) {
                state.winnerModal = {
                    sponsorshipName: sp.name,
                    winner: sp.currentHighestBidder,
                    winnerCompany: sp.currentHighestBidderCompany,
                    amount: sp.currentHighestBid,
                };
            }
            changed = true;
            console.log(`Auction ${sp.name} auto-allotted!`);
        }
    });

    if (changed) {
        broadcastState();
    }
}, 1000); // Check every second

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
