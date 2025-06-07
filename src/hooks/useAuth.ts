import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        };

        checkAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state change event:', event);
            const newLoggedInState = !!session?.user;
            setIsLoggedIn(newLoggedInState);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
    }, [supabase]);

    return { isLoggedIn, signOut };
};
