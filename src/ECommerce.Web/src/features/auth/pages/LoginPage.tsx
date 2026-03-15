import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { useLoginSchema, type LoginFormData } from '@/lib/validations/auth.schema';
import { applyServerErrors } from '@/utils/formErrors';
import logoImg from '@/assets/ebrar-logo.png';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
    const { mutate: login, isPending } = useLogin();
    const { t } = useTranslation('auth');

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
                    src={logoImg}
                    alt="Ebrar Kuruyemiş"
                    className="h-24 sm:h-32 w-auto object-contain"
                />
            </Link>

            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl shadow-black/5 border border-gray-100 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-[var(--color-ebrar-green)]/10 blur-3xl" />

                <div className="relative z-10 text-center">
                    <h2 className="text-3xl font-black tracking-tight text-gray-900 font-serif lowercase">
                        {t('login.title')} <span className="text-[var(--color-ebrar-green)]">{t('login.titleHighlight')}</span>
                    </h2>
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                        {t('login.noAccount')}{' '}
                        <Link to="/register" className="font-bold text-[var(--color-ebrar-green)] hover:text-[var(--color-ebrar-green-dark)] transition-colors underline decoration-2 underline-offset-4">
                            {t('login.registerLink')}
                        </Link>
                    </p>
                </div>

                <div className="relative z-10 mt-8 space-y-6">
                    {/* Social Login Section */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-black transition-all active:scale-95">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500 font-bold tracking-widest leading-none">{t('login.orWithEmail')}</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* Genel sunucu hatası */}
                        {errors.root && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                                <div className="text-xs font-bold text-red-700">{errors.root.message}</div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 ml-1">
                                    {t('login.email')}
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email')}
                                    className={`block w-full rounded-xl border-0 py-3 text-gray-900 bg-white ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--color-ebrar-green)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.email ? 'ring-red-400 focus:ring-red-500' : 'ring-gray-200'}`}
                                    placeholder="ornek@ebrahim.com"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-xs font-bold text-red-600 ml-1" role="alert">{errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="login-password" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5 ml-1">
                                    {t('login.password')}
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...register('password')}
                                    className={`block w-full rounded-xl border-0 py-3 text-gray-900 bg-white ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--color-ebrar-green)] sm:text-sm sm:leading-6 px-4 shadow-sm transition-all ${errors.password ? 'ring-red-400 focus:ring-red-500' : 'ring-gray-200'}`}
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
                                className="flex w-full justify-center rounded-xl bg-[var(--color-ebrar-green)] px-4 py-3 text-sm font-black text-white shadow-xl shadow-green-900/10 hover:bg-[var(--color-ebrar-green-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ebrar-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                            >
                                {isPending ? t('login.submitting') : t('login.submit')}
                            </button>

                            <Link
                                to="/"
                                className="flex w-full justify-center rounded-xl bg-gray-50 px-4 py-3 text-sm font-bold text-gray-600 border border-gray-100 hover:bg-gray-100 transition-all active:scale-[0.98] text-center"
                            >
                                {t('login.continueAsGuest')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
