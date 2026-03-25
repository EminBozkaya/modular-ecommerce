import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUpdateProfile } from '../hooks/useProfile';
import { useChangePassword } from '../hooks/useProfile';
import type { UpdateProfileRequest, ChangePasswordRequest } from '../types/auth';

type Tab = 'profile' | 'security';

interface ChangePasswordForm extends ChangePasswordRequest {
    confirmNewPassword: string;
}

export default function ProfilePage() {
    const { user } = useAuthStore();
    const { t } = useTranslation('auth');
    const { t: tv } = useTranslation('validation');

    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();

    // ─── Profile form ──────────────────────────────────────────────────────────
    const {
        register: rp,
        handleSubmit: hsp,
        formState: { errors: ep },
    } = useForm<UpdateProfileRequest>({
        defaultValues: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            phoneNumber: user?.phoneNumber ?? '',
        },
    });

    function onProfileSubmit(data: UpdateProfileRequest) {
        setProfileSuccess(false);
        updateProfile.mutate(
            { ...data, phoneNumber: data.phoneNumber || undefined },
            {
                onSuccess: () => setProfileSuccess(true),
            }
        );
    }

    // ─── Password form ─────────────────────────────────────────────────────────
    const {
        register: rpass,
        handleSubmit: hspass,
        watch,
        reset: resetPass,
        setError: setPassError,
        formState: { errors: epass },
    } = useForm<ChangePasswordForm>();

    const newPasswordValue = watch('newPassword');

    function onPasswordSubmit(data: ChangePasswordForm) {
        setPasswordSuccess(false);
        changePassword.mutate(
            { currentPassword: data.currentPassword, newPassword: data.newPassword },
            {
                onSuccess: () => {
                    setPasswordSuccess(true);
                    resetPass();
                },
                onError: (err: unknown) => {
                    const apiErr = err as { response?: { data?: { error?: string } } };
                    const msg = apiErr?.response?.data?.error ?? t('security.changeError');
                    setPassError('currentPassword', { message: msg });
                },
            }
        );
    }

    const inputClass =
        'block w-full rounded-xl border border-border bg-gray-50/50 dark:bg-white/10 pl-11 py-3 text-sm text-foreground focus:ring-2 focus:ring-[var(--brand-primary)]/10 focus:border-[var(--brand-primary)] focus:bg-card transition-all outline-none';
    const inputErrorClass =
        'block w-full rounded-xl border border-red-400 bg-red-50/30 dark:bg-red-900/10 pl-11 py-3 text-sm text-foreground focus:ring-2 focus:ring-red-400/20 focus:border-red-400 focus:bg-card transition-all outline-none';
    const tabClass = (tab: Tab) =>
        `px-6 py-3 text-sm font-bold rounded-2xl transition-all ${
            activeTab === tab
                ? 'bg-[var(--brand-primary)] text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-[var(--brand-primary)] flex items-center justify-center text-white shadow-lg">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-foreground font-serif">
                            {t('profile.title')}{' '}
                            <span className="text-[var(--brand-primary)]">{t('profile.titleHighlight')}</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">{t('profile.subtitle')}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 p-1 bg-muted rounded-2xl w-fit">
                    <button type="button" className={tabClass('profile')} onClick={() => setActiveTab('profile')}>
                        <span className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {t('profile.tabInfo')}
                        </span>
                    </button>
                    <button type="button" className={tabClass('security')} onClick={() => setActiveTab('security')}>
                        <span className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            {t('security.tab')}
                        </span>
                    </button>
                </div>

                <div className="bg-card rounded-3xl shadow-xl shadow-black/5 border border-border overflow-hidden">
                    <div className="p-8">

                        {/* ── PROFILE TAB ─────────────────────────────────────────── */}
                        {activeTab === 'profile' && (
                            <form className="space-y-6" onSubmit={hsp(onProfileSubmit)} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                            {t('profile.firstName')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <input
                                                type="text"
                                                className={ep.firstName ? inputErrorClass : inputClass}
                                                {...rp('firstName', {
                                                    required: tv('required'),
                                                    maxLength: { value: 100, message: tv('maxLength', { max: 100 }) },
                                                })}
                                            />
                                        </div>
                                        {ep.firstName && (
                                            <p className="text-xs text-red-500 ml-1">{ep.firstName.message}</p>
                                        )}
                                    </div>

                                    {/* Last Name */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                            {t('profile.lastName')}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <input
                                                type="text"
                                                className={ep.lastName ? inputErrorClass : inputClass}
                                                {...rp('lastName', {
                                                    required: tv('required'),
                                                    maxLength: { value: 100, message: tv('maxLength', { max: 100 }) },
                                                })}
                                            />
                                        </div>
                                        {ep.lastName && (
                                            <p className="text-xs text-red-500 ml-1">{ep.lastName.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email (read-only) */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                        {t('profile.email')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="email"
                                            value={user?.email ?? ''}
                                            disabled
                                            readOnly
                                            className="block w-full rounded-xl border border-border bg-gray-50 dark:bg-white/10 pl-11 py-3 text-sm text-muted-foreground cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground ml-1">{t('profile.emailNote')}</p>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                        {t('profile.phone')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="tel"
                                            placeholder={t('profile.phonePlaceholder')}
                                            className={ep.phoneNumber ? inputErrorClass : inputClass}
                                            {...rp('phoneNumber', {
                                                maxLength: { value: 30, message: tv('maxLength', { max: 30 }) },
                                            })}
                                        />
                                    </div>
                                    {ep.phoneNumber && (
                                        <p className="text-xs text-red-500 ml-1">{ep.phoneNumber.message}</p>
                                    )}
                                </div>

                                {profileSuccess && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        {t('profile.updateSuccess')}
                                    </div>
                                )}

                                {updateProfile.isError && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        {t('profile.updateError')}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={updateProfile.isPending}
                                        className="w-full bg-[var(--brand-primary)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-black/5 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <ShieldCheck className="h-5 w-5" />
                                        {updateProfile.isPending ? t('profile.updating') : t('profile.updateButton')}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ── SECURITY TAB ─────────────────────────────────────────── */}
                        {activeTab === 'security' && (
                            <form className="space-y-6" onSubmit={hspass(onPasswordSubmit)} noValidate>
                                {/* Current Password */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                        {t('security.currentPassword')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type={showCurrent ? 'text' : 'password'}
                                            className={`${epass.currentPassword ? inputErrorClass : inputClass} pr-11`}
                                            autoComplete="current-password"
                                            {...rpass('currentPassword', { required: tv('required') })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent((v) => !v)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {epass.currentPassword && (
                                        <p className="text-xs text-red-500 ml-1">{epass.currentPassword.message}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                        {t('security.newPassword')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type={showNew ? 'text' : 'password'}
                                            className={`${epass.newPassword ? inputErrorClass : inputClass} pr-11`}
                                            autoComplete="new-password"
                                            {...rpass('newPassword', {
                                                required: tv('required'),
                                                minLength: { value: 4, message: tv('minLength', { min: 4 }) },
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNew((v) => !v)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {epass.newPassword && (
                                        <p className="text-xs text-red-500 ml-1">{epass.newPassword.message}</p>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                                        {t('security.confirmNewPassword')}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            className={`${epass.confirmNewPassword ? inputErrorClass : inputClass} pr-11`}
                                            autoComplete="new-password"
                                            {...rpass('confirmNewPassword', {
                                                required: tv('required'),
                                                validate: (v) => v === newPasswordValue || tv('passwordMismatch'),
                                            })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm((v) => !v)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    {epass.confirmNewPassword && (
                                        <p className="text-xs text-red-500 ml-1">{epass.confirmNewPassword.message}</p>
                                    )}
                                </div>

                                {passwordSuccess && (
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
                                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                                        {t('security.changeSuccess')}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={changePassword.isPending}
                                        className="w-full bg-[var(--brand-primary)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-black/5 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        <Lock className="h-5 w-5" />
                                        {changePassword.isPending ? t('security.changing') : t('security.changeButton')}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
