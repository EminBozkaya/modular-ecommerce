import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;   // defaults to t('buttons.confirm')
    cancelText?: string;    // defaults to t('buttons.cancel')
    onConfirm: () => void;
    onClose: () => void;
    loading?: boolean;
    variant?: 'danger' | 'warning' | 'info';
    showConfirm?: boolean;
}

export default function ConfirmModal({
    open,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onClose,
    loading = false,
    variant = 'danger',
    showConfirm = true
}: ConfirmModalProps) {
    const { t } = useTranslation('common');
    const resolvedConfirmText = confirmText ?? t('buttons.confirm');
    const resolvedCancelText = cancelText ?? t('buttons.cancel');

    if (!open) return null;

    const variantStyles = {
        danger: {
            iconBg: 'bg-red-100 dark:bg-red-900/20',
            iconColor: 'text-red-600 dark:text-red-400',
            buttonBg: 'bg-red-600',
            buttonHover: 'hover:bg-red-700',
        },
        warning: {
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            buttonBg: 'bg-yellow-600',
            buttonHover: 'hover:bg-yellow-700',
        },
        info: {
            iconBg: 'bg-blue-100 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
            buttonBg: 'bg-blue-600',
            buttonHover: 'hover:bg-blue-700',
        }
    }[variant];

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto pt-24 pb-10 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variantStyles.iconBg}`}>
                            <AlertTriangle className={`h-6 w-6 ${variantStyles.iconColor}`} />
                        </div>
                        <button
                            onClick={onClose}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground">{message}</p>
                </div>

                <div className="bg-accent px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    {showConfirm && (
                        <button
                            disabled={loading}
                            onClick={onConfirm}
                            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variantStyles.buttonBg} ${variantStyles.buttonHover}`}
                        >
                            {loading ? t('buttons.loading') : resolvedConfirmText}
                        </button>
                    )}
                    <button
                        disabled={loading}
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-foreground bg-card border border-border rounded-lg hover:bg-accent transition-all active:scale-95"
                    >
                        {showConfirm ? resolvedCancelText : t('buttons.confirm')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
