/**
 * Format a number as Indian Rupees
 */
export function formatCurrency(amount) {
    if (!amount && amount !== 0) return '—';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format seconds into MM:SS display string
 */
export function formatTime(seconds) {
    if (seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Format a timestamp to a relative "X seconds ago" string
 */
export function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
}

/**
 * Generate initials from a name for avatar display
 */
export function getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Get minimum next bid (current highest + 5% or base price if no bids)
 */
export function getMinimumBid(sponsorship) {
    if (!sponsorship.currentHighestBid || sponsorship.currentHighestBid === 0) {
        return sponsorship.basePrice;
    }
    return sponsorship.currentHighestBid; // equal or higher allowed
}

/**
 * Colors for leaderboard positions
 */
export function getRankColor(rank) {
    const colors = {
        1: 'text-gold-500',
        2: 'text-gray-300',
        3: 'text-amber-600',
    };
    return colors[rank] || 'text-white/40';
}

export function getRankBg(rank) {
    const colors = {
        1: 'bg-gold-500/20 border-gold-500/40',
        2: 'bg-gray-400/10 border-gray-400/30',
        3: 'bg-amber-700/20 border-amber-700/40',
    };
    return colors[rank] || 'bg-white/5 border-white/10';
}
