'use client';

// create me a nextjs component that is a login form with email and password fields for Auth0 authentication
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Card } from 'flowbite-react';


const Login = () => {
    const { loginWithRedirect } = useAuth0();
    
    const handleLogin = () => {
        loginWithRedirect({
            appState: { targetUrl: '/' },
        });
    };
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Welcome back! Please sign in to continue.
                        </p>
                    </div>
                    
                    <Button 
                        onClick={handleLogin} 
                        type="button"
                        className="w-full"
                        size="lg"
                    >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z"/>
                            <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
                        </svg>
                        Continue with Auth0
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Login;