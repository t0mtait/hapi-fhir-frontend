import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef } from 'react';

interface SyncUserData {
  auth0_id: string;
  email: string;
  username?: string;
  name?: string;
  picture?: string;
}

export const useUserSync = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const syncedRef = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated || !user || isLoading || syncedRef.current) {
        return;
      }

      try {
        const userData: SyncUserData = {
          auth0_id: user.sub || '',
          email: user.email || '',
          username: user.nickname || user.preferred_username,
          name: user.name,
          picture: user.picture,
        };

        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (result.success) {
          console.log('User synced successfully:', result.message);
          if (result.isNewUser) {
            console.log('Welcome new user!', result.user);
          }
          syncedRef.current = true;
        } else {
          console.error('Failed to sync user:', result.error);
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };

    syncUser();
  }, [isAuthenticated, user, isLoading]);

  return { user, isAuthenticated, isLoading };
};