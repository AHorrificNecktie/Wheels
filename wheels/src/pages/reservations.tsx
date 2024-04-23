// pages/dashboard.tsx

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
        }
    }, [router]);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-grow p-10 pl-64">
                <h1>RESERVATIONS!</h1>
                <p>Welcome to your dashboard!</p>
            </div>
        </div>
    );
};

export default DashboardPage;
