import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { useRegisterSchema, type RegisterFormData } from '@/lib/validations/auth.schema';
import { applyServerErrors } from '@/utils/formErrors';
import logoImg from '@/assets/LOGO.png';
import { useTranslation } from 'react-i18next';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { SocialLogin } from '../components/SocialLogin';

export default function RegisterPage() {
    const { mutate: register, isPending } = useRegister();
    const { t } = useTranslation('auth');
    const settings = useStoreSettings();
    const resolvedLogo = settings.imageBase64 ?? logoImg;

    const registerSchema = useRegisterSchema();

    const {
        register: rhfRegister,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        // confirmPassword backend'e gönderilmiyor
        const { confirmPassword: _, ...rest } = data;
        register(
            {
                firstName: rest.firstName,
                lastName: rest.lastName,
                email: rest.email,
                password: rest.password,
                confirmPassword: data.confirmPassword,
            },
            {
                onError: (error) => {
                    applyServerErrors(error, setError);
                },
            },
        );
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
                <div className="absolute top-0 left-0 -mt-4 -ml-4 h-24 w-24 rounded-full bg-[var(--brand-primary)]/10 blur-3xl" />

                <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-black tracking-tight text-foreground font-serif lowercase">
                        {t('register.title')} <span className="text-[var(--brand-primary)]">{t('register.titleHighlight')}</span>
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground font-medium">
                        {t('register.hasAccount')}{' '}
                        <Link to="/login" className="font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-dark)] transition-colors underline decoration-2 underline-offset-4">
                            {t('register.loginLink')}
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="reg-firstName" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 ml-1">
                                        {t('register.firstName')}
                                    </label>
                                    <input
                                        id="reg-firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        {...rhfRegister('firstName')}
                                        className={`block w-full rounded-xl border-0 py-2.5 text-foreground bg-background ring-1 ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.firstName ? 'ring-red-400' : 'ring-border'}`}
                                        placeholder="Ali"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.firstName.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="reg-lastName" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 ml-1">
                                        {t('register.lastName')}
                                    </label>
                                    <input
                                        id="reg-lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        {...rhfRegister('lastName')}
                                        className={`block w-full rounded-xl border-0 py-2.5 text-foreground bg-background ring-1 ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.lastName ? 'ring-red-400' : 'ring-border'}`}
                                        placeholder="Yılmaz"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="reg-email" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 ml-1">
                                    {t('register.email')}
                                </label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    autoComplete="email"
                                    {...rhfRegister('email')}
                                    className={`block w-full rounded-xl border-0 py-2.5 text-foreground bg-background ring-1 ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.email ? 'ring-red-400' : 'ring-border'}`}
                                    placeholder="ornek@ebrahim.com"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="reg-password" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 ml-1">
                                        {t('register.password')}
                                    </label>
                                    <input
                                        id="reg-password"
                                        type="password"
                                        autoComplete="new-password"
                                        {...rhfRegister('password')}
                                        className={`block w-full rounded-xl border-0 py-2.5 text-foreground bg-background ring-1 ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.password ? 'ring-red-400' : 'ring-border'}`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="reg-confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 ml-1">
                                        {t('register.confirmPassword')}
                                    </label>
                                    <input
                                        id="reg-confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        {...rhfRegister('confirmPassword')}
                                        className={`block w-full rounded-xl border-0 py-2.5 text-foreground bg-background ring-1 ring-inset placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-[var(--brand-primary)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.confirmPassword ? 'ring-red-400' : 'ring-border'}`}
                                        placeholder="••••••••"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex w-full justify-center rounded-xl bg-[var(--brand-primary)] px-4 py-3 text-sm font-black text-white shadow-xl shadow-green-900/10 hover:bg-[var(--brand-primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isPending ? t('register.submitting') : t('register.submit')}
                            </button>

                            <Link
                                to="/"
                                className="flex w-full justify-center rounded-xl bg-gray-50 dark:bg-white/10 px-4 py-3 text-sm font-bold text-muted-foreground border border-border hover:bg-accent transition-all active:scale-[0.98] text-center"
                            >
                                {t('register.continueAsGuest')}
                            </Link>
                        </div>
                    </form>

                    <SocialLogin />
                </div>
            </div>
        </div>
    );
}
