'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card, DarkThemeToggle, Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyNav() {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true);

    const handleLogout = () => {
        logout({
        logoutParams: {
            returnTo: window.location.origin
        }
        });
    };
    return ( 
        <div>
            <header className="bg-white shadow dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">

                    {/*  home icon */}
                    <svg className="h-8 w-8 mr-3 cursor-pointer text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 20 20" onClick={ () => router.push('/dashboard')}>
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7A1 1 0 003 13h1v6a1 1 0 001 1h3a1 1 0 001-1v-3h2v3a1 1 0 001 1h3a1 1 0 001-1v-6h1a1 1 0 00.707-1.707l-7-7z" />
                    </svg>
                    
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        FHIR Dashboard
                    </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        {user?.picture && (
                        <img
                            className="h-8 w-8 rounded-full"
                            src={user.picture}
                            alt={user.name || 'User'}
                            onClick={ () => router.push('/profile')}
                        />
                        )}
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.name || user?.email}
                        </span>
                    </div>
                    <Button 
                        onClick={handleLogout}
                        color="red"
                        size="sm"
                    >
                        Logout
                    </Button>
                    <DarkThemeToggle />
                    </div>
                </div>
                </div>
                </header>
          </div> 
    );
}