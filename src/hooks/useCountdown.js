import { useState, useEffect } from 'react';

/**
 * Returns { timeLeft, isExpired, isUrgent }
 * timeLeft is seconds remaining (integer)
 */
export function useCountdown(endTime) {
    const [timeLeft, setTimeLeft] = useState(() => {
        if (!endTime) return 0;
        return Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    });

    useEffect(() => {
        if (!endTime) {
            setTimeLeft(0);
            return;
        }

        const tick = () => {
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
        };

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return {
        timeLeft,
        isExpired: timeLeft <= 0,
        isUrgent: timeLeft > 0 && timeLeft <= 30,
        isWarning: timeLeft > 30 && timeLeft <= 60,
    };
}
