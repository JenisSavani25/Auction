import React from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import DashboardPage from './pages/DashboardPage';
import SupporterPage from './pages/SupporterPage';
import WinnerModal from './components/modals/WinnerModal';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppRouter() {
    const { currentUser } = useAuction();

    if (!currentUser) return <LoginPage />;

    return (
        <>
            {currentUser.role === 'admin' ? (
                <AdminPage />
            ) : currentUser.role === 'dashboard' ? (
                <DashboardPage />
            ) : currentUser.role === 'supporter' ? (
                <SupporterPage />
            ) : (
                <UserPage />
            )}
            <WinnerModal />
        </>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <AuctionProvider>
                <AppRouter />
            </AuctionProvider>
        </ErrorBoundary>
    );
}
