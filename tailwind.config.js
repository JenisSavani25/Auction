/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    950: '#0f172a',
                    900: '#0f1f3d',
                    800: '#1e293b',
                    700: '#263347',
                    600: '#334155',
                },
                gold: {
                    300: '#fde68a',
                    400: '#fbbf24',
                    500: '#facc15',
                    600: '#eab308',
                },
                auction: {
                    green: '#22c55e',
                    red: '#ef4444',
                    blue: '#3b82f6',
                    purple: '#a855f7',
                    orange: '#f97316',
                },
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                poppins: ['Poppins', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 1.5s ease-in-out infinite alternate',
                'slide-in': 'slideIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.4s ease-out',
                'bid-flash': 'bidFlash 1s ease-out',
                'bounce-subtle': 'bounceSubtle 0.6s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'confetti': 'confetti 1s ease-out',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #facc15, 0 0 10px #facc15' },
                    '100%': { boxShadow: '0 0 20px #facc15, 0 0 40px #facc15, 0 0 60px #facc15' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                bidFlash: {
                    '0%': { backgroundColor: 'rgba(250, 204, 21, 0.4)' },
                    '50%': { backgroundColor: 'rgba(250, 204, 21, 0.2)' },
                    '100%': { backgroundColor: 'transparent' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
                confetti: {
                    '0%': { transform: 'scale(0.5) rotate(-10deg)', opacity: '0' },
                    '60%': { transform: 'scale(1.1) rotate(3deg)', opacity: '1' },
                    '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'gold': '0 0 20px rgba(250, 204, 21, 0.3)',
                'gold-lg': '0 0 40px rgba(250, 204, 21, 0.4)',
                'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
                'card-hover': '0 8px 40px rgba(0, 0, 0, 0.6)',
                'glass': '0 4px 30px rgba(0, 0, 0, 0.3)',
                'inner-gold': 'inset 0 1px 0 rgba(250, 204, 21, 0.2)',
            },
        },
    },
    plugins: [],
}
