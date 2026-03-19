import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useLoginSchema, type LoginFormData } from '@/lib/validations/auth.schema';
import { applyServerErrors } from '@/utils/formErrors';
import logoImg from '@/assets/LOGO.png';
import { useTranslation } from 'react-i18next';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { SocialLogin } from '../components/SocialLogin';

export default function LoginPage() {
    const { mutate: login, isPending } = useLogin();
    const { t } = useTranslation('auth');
    const settings = useStoreSettings();
    const resolvedLogo = settings.imageBase64 ?? logoImg;

    const loginSchema = useLoginSchema();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        login(data, {
            onError: (error) => {
                applyServerErrors(error, setError);
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Link to="/" className="mb-8 block transition-transform hover:scale-105 duration-300">
                <img
                    src={resolvedLogo}
                    alt={settings.storeName || "Store"}
                    className="h-24 sm:h-32 w-auto object-contain"
                />
            </Link>

            <div className="w-full max-w-md space-y-8 rounded-2xl bg-card p-8 shadow-2xl shadow-black/5 border border-border relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />

                <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-black tracking-tight text-foreground font-serif lowercase">
                        {t('login.title')} <span className="text-[var(--brand-primary)]">{t('login.titleHighlight')}</span>
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground font-medium">
                        {t('login.noAccount')}{' '}
                        <Link to="/register" className="font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-dark)] transition-colors underline decoration-2 underline-offset-4">
                            {t('login.registerLink')}
                        </Link>
                    </p>
                </div>

                <div className="relative z-10 mt-8 space-y-6">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* Genel sunucu hatası */}
                        {errors.root && (
                            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/30">
                                <div className="text-xs font-bold text-red-700">{errors.root.message}</div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 ml-1">
                                    {t('login.email')}
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email')}
                                    className={`block w-full rounded-xl border-0 py-3 text-foreground bg-background ring-1 ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.email ? 'ring-red-400 focus:ring-red-500' : 'ring-border'}`}
                                    placeholder="ornek@ebrahim.com"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 ml-1">
                                    {t('login.password')}
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...register('password')}
                                    className={`block w-full rounded-xl border-0 py-3 text-foreground bg-background ring-1 ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.password ? 'ring-red-400 focus:ring-red-500' : 'ring-border'}`}
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex w-full justify-center rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-sm font-black text-white shadow-xl shadow-green-900/10 hover:bg-[var(--brand-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isPending ? t('login.submitting') : t('login.submit')}
                            </button>

                            <Link
                                to="/"
                                className="flex w-full justify-center rounded-xl bg-gray-50 dark:bg-white/10 px-4 py-3 text-sm font-bold text-muted-foreground border border-border hover:bg-accent transition-all active:scale-[0.98] text-center"
                            >
                                {t('login.continueAsGuest')}
                            </Link>
                        </div>
                    </form>

                    <SocialLogin />
                </div>
            </div>
        </div>
    );
}
