'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';
import { UserSyncProvider } from './UserSyncProvider';

interface Auth0ProviderWrapperProps {
  children: ReactNode;
}

export default function Auth0ProviderWrapper({ children }: Auth0ProviderWrapperProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}` : 'http://localhost:3000';

  // Check if Auth0 environment variables are configured
  if (!domain || !clientId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Auth0 Configuration Missing
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please configure your Auth0 environment variables in <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">.env.local</code>:
          </p>
          <div className="text-left bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm font-mono">
            <div>NEXT_PUBLIC_AUTH0_DOMAIN={domain || 'not-set'}</div>
            <div>NEXT_PUBLIC_AUTH0_CLIENT_ID={clientId || 'not-set'}</div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
            Get these values from your Auth0 Dashboard and restart the development server.
          </p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('Auth0 Config:', { domain, clientId, redirectUri });

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
    >
      <UserSyncProvider>
        {children}
      </UserSyncProvider>
    </Auth0Provider>
  );
}
