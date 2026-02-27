import React from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import DashboardPage from './pages/DashboardPage';
import WinnerModal from './components/modals/WinnerModal';

function AppRouter() {
    const { currentUser } = useAuction();

    if (!currentUser) return <LoginPage />;

    return (
        <>
            {currentUser.role === 'admin' ? (
                <AdminPage />
            ) : currentUser.role === 'dashboard' ? (
                <DashboardPage />
            ) : (
                <UserPage />
            )}
            <WinnerModal />
        </>
    );
}

export default function App() {
    return (
        <AuctionProvider>
            <AppRouter />
        </AuctionProvider>
    );
}
