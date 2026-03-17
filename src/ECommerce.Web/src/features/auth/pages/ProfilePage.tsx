import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
    const { user } = useAuthStore();
    const { t } = useTranslation('auth');

    // Split full name for the form if possible
    const nameParts = user?.fullName?.split(' ') || ['', ''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-[var(--brand-primary)] flex items-center justify-center text-white shadow-lg">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-foreground font-serif">
                            {t('profile.title')} <span className="text-[var(--brand-primary)]">{t('profile.titleHighlight')}</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">{t('profile.subtitle')}</p>
                    </div>
                </div>

                <div className="bg-card rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden">
                    <div className="p-8">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('profile.firstName')}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue={firstName}
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 dark:bg-white/10 pl-11 py-3 text-sm text-foreground focus:ring-2 focus:ring-[var(--brand-primary)]/10 focus:border-[var(--brand-primary)] focus:bg-card transition-all outline-none border border-border"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('profile.lastName')}</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue={lastName}
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 dark:bg-white/10 pl-11 py-3 text-sm text-foreground focus:ring-2 focus:ring-[var(--brand-primary)]/10 focus:border-[var(--brand-primary)] focus:bg-card transition-all outline-none border border-border"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('profile.email')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="email"
                                        defaultValue={user?.email}
                                        disabled
                                        className="block w-full rounded-xl border border-border bg-gray-50 dark:bg-white/10 pl-11 py-3 text-sm text-muted-foreground cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground ml-1">{t('profile.emailNote')}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">{t('profile.phone')}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="05XX XXX XX XX"
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 dark:bg-white/10 pl-11 py-3 text-sm text-foreground focus:ring-2 focus:ring-[var(--brand-primary)]/10 focus:border-[var(--brand-primary)] focus:bg-card transition-all outline-none border border-border"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    className="w-full bg-[var(--brand-primary)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-black/5 hover:bg-[var(--brand-primary-dark)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                    {t('profile.updateButton')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
