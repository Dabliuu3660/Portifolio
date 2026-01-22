'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const AUTH_KEY = 'portfolio_admin_auth';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ id?: string; name?: string; email?: string } | null>(null);

    // Check availability of Supabase
    // We check env vars directly to decide mode
    const useSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            if (useSupabase) {
                // Supabase Auth
                const { data: { session } } = await supabase.auth.getSession();

                if (mounted) {
                    if (session?.user) {
                        setIsAuthenticated(true);
                        setUser({
                            id: session.user.id,
                            email: session.user.email,
                            name: session.user.user_metadata?.name || 'Admin'
                        });
                    }
                    setLoading(false);
                }

                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (mounted) {
                        if (session?.user) {
                            setIsAuthenticated(true);
                            setUser({
                                id: session.user.id,
                                email: session.user.email,
                                name: session.user.user_metadata?.name || 'Admin'
                            });
                        } else {
                            setIsAuthenticated(false);
                            setUser(null);
                        }
                        setLoading(false);
                    }
                });

                return () => subscription.unsubscribe();
            } else {
                // Local Auth (Fallback)
                const stored = localStorage.getItem(AUTH_KEY);
                if (stored === 'true') {
                    const envEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@portfolio.com';
                    setIsAuthenticated(true);
                    setUser({ name: 'Admin', email: envEmail });
                }
                setLoading(false);
            }
        };

        initAuth();

        return () => {
            mounted = false;
        };
    }, [useSupabase]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        if (useSupabase) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                console.error('Supabase Login Error:', error.message);
                return false;
            }
            return true;
        } else {
            // Local fallback logic
            await new Promise((resolve) => setTimeout(resolve, 500));
            const envEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@portfolio.com';
            const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '';

            if (email === envEmail && password === envPass && envPass !== '') {
                localStorage.setItem(AUTH_KEY, 'true');
                setIsAuthenticated(true);
                setUser({ name: 'Admin', email });
                return true;
            }
            return false;
        }
    }, [useSupabase]);

    const logout = useCallback(async () => {
        if (useSupabase) {
            await supabase.auth.signOut();
        } else {
            localStorage.removeItem(AUTH_KEY);
        }
        setIsAuthenticated(false);
        setUser(null);
    }, [useSupabase]);

    return {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        isSupabase: useSupabase
    };
};
