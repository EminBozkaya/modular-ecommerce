import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { socialLogin } from '../api/authApi';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

/**
 * OAuth callback page.
 * Social provider redirects here with ?code=xxx&state=yyy
 * This page exchanges the code for a JWT session via backend.
 */
export default function SocialCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = React.useRef(false); // StrictMode koruması

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const provider = sessionStorage.getItem('social_auth_provider');

        if (errorParam) {
            setError(`Authentication cancelled or denied: ${errorParam}`);
            return;
        }

        if (!code || !provider) {
            setError('Missing authorization code or provider. Please try again.');
            return;
        }

        // Clear provider from session storage
        sessionStorage.removeItem('social_auth_provider');

        socialLogin(provider, code)
            .then((response) => {
                setUser(response.user);
                navigate('/', { replace: true });
            })
            .catch((err) => {
                console.error('Social login failed:', err);
                const message = err?.response?.data?.error ?? 'Authentication failed. Please try again.';
                setError(message);
            });
    }, [searchParams, navigate, setUser]);

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
                <div className="rounded-2xl bg-card p-8 shadow-lg max-w-sm w-full border border-border">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                        <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">Giriş Başarısız</h2>
                    <p className="text-sm text-muted-foreground mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/login', { replace: true })}
                        className="w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background hover:opacity-80 transition-colors"
                    >
                        Giriş Sayfasına Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
            <div className="rounded-2xl bg-card p-8 shadow-lg flex flex-col items-center gap-4 border border-border">
                <LoadingSpinner size="lg" />
                <p className="text-sm font-medium text-muted-foreground">Kimlik doğrulanıyor...</p>
            </div>
        </div>
    );
}
