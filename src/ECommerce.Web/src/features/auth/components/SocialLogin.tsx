import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { getSocialAuthUrl } from '../api/authApi';

export const SocialLogin = () => {
  const { t } = useTranslation('auth');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = async (providerId: string) => {
    try {
      setLoadingProvider(providerId);
      const result = await getSocialAuthUrl(providerId);
      if (result.isSuccess && result.authorizationUrl) {
        // Store the provider in sessionStorage so the callback page knows which provider to use
        sessionStorage.setItem('social_auth_provider', providerId);
        window.location.href = result.authorizationUrl;
      } else {
        console.error(`Failed to get auth URL for ${providerId}`);
      }
    } catch (err) {
      console.error(`Social login error for ${providerId}:`, err);
    } finally {
      setLoadingProvider(null);
    }
  };

  const socialButtons = [
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      ),
      className: "bg-card ring-1 ring-border hover:ring-blue-500/30",
      textColor: "text-muted-foreground"
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      className: "bg-[#1877F2] hover:bg-[#166fe5] shadow-[#1877F2]/20",
      textColor: "text-[#1877F2]"
    },
    // Apple — henüz aktif değil (Apple Developer hesabı gerektirir, $99/yıl)
    // { id: 'apple', name: 'Apple', className: "bg-black hover:bg-gray-900", textColor: "text-black" },
    // Instagram — henüz aktif değil
    // { id: 'instagram', name: 'Instagram', className: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]", textColor: "text-[#ee2a7b]" },
    {
      id: 'x',
      name: 'X',
      icon: (
        <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zm-1.291 19.489h2.039L6.486 3.24H4.298l13.312 17.402z" />
        </svg>
      ),
      className: "bg-black hover:bg-gray-900 shadow-black/20",
      textColor: "text-black"
    }
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">
          <span className="bg-background px-4">{t('login.orWithSocial') || 'Sosyal Medya İle'}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {socialButtons.map((social) => (
          <button 
            key={social.id}
            title={social.name}
            disabled={loadingProvider !== null}
            onClick={() => handleSocialLogin(social.id)}
            className={`group relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-wait disabled:transform-none ${social.className}`}
          >
            {loadingProvider === social.id ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <>
                <div className="transition-transform duration-300 group-hover:scale-110">
                  {social.icon}
                </div>
                <span className={`absolute -bottom-8 scale-0 font-bold text-[10px] ${social.textColor} transition-all duration-300 group-hover:scale-100 whitespace-nowrap opacity-0 group-hover:opacity-100`}>
                  {social.name}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
