# Sponsorship Auction 2026 — Setup Guide

## Quick Start

Open a terminal/PowerShell in the project folder and run:

```bash
npm install
npm run dev
```

Then open: **http://localhost:5173**

---

## Demo Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User 1 | `krishna_motors` | `pass123` |
| User 2 | `shivaji_traders` | `pass123` |
| User 3 | `mauli_enterprises` | `pass123` |
| User 4 | `samarth_group` | `pass123` |
| User 5 | `jai_hind` | `pass123` |

---

## Features

### Admin Panel
- **Dashboard** – Overview of all sponsorships + right panel
- **Sponsorships** – Create, start, extend timer, reject auctions
- **Users** – Create/delete users with credentials
- **Analytics** – Full revenue breakdown table + leaderboard

### User Panel
- View all live and upcoming sponsorships
- Place bids with quick-bid buttons (+10K, +25K, +50K)
- See live countdown timer (turns red under 30 seconds)
- Real-time recent bids feed + leaderboard

### Auction Flow
1. Admin creates a sponsorship with base price and duration
2. Admin sets duration (minutes) and clicks **Start Auction**
3. Users place bids – each bid must exceed the current highest
4. Timer expires → auto-marked as **ALLOTED**, winner modal appears
5. Admin can manually **Reject** any auction

---

## Project Structure

```
src/
├── App.jsx                    # Root router
├── main.jsx                   # Entry point
├── index.css                  # Global styles + Tailwind
├── context/
│   └── AuctionContext.jsx      # Central state (useReducer)
├── data/
│   └── initialData.js          # Seed data
├── hooks/
│   └── useCountdown.js         # Countdown timer hook
├── utils/
│   └── helpers.js              # Currency, time, UI helpers
├── pages/
│   ├── LoginPage.jsx
│   ├── AdminPage.jsx
│   └── UserPage.jsx
└── components/
    ├── layout/
    │   └── Navbar.jsx
    ├── auction/
    │   ├── SponsorshipCard.jsx
    │   ├── RecentBidsPanel.jsx
    │   ├── Leaderboard.jsx
    │   └── RevenueSummary.jsx
    ├── admin/
    │   ├── AdminSponsorshipManager.jsx
    │   ├── UserManager.jsx
    │   └── AdminAnalytics.jsx
    └── modals/
        └── WinnerModal.jsx
```
