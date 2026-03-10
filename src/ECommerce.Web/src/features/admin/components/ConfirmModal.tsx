import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
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
    confirmText = 'Onayla',
    cancelText = 'İptal',
    onConfirm,
    onClose,
    loading = false,
    variant = 'danger',
    showConfirm = true
}: ConfirmModalProps) {
    if (!open) return null;

    const variantStyles = {
        danger: {
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            buttonBg: 'bg-red-600',
            buttonHover: 'hover:bg-red-700',
        },
        warning: {
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600',
            buttonBg: 'bg-yellow-600',
            buttonHover: 'hover:bg-yellow-700',
        },
        info: {
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            buttonBg: 'bg-blue-600',
            buttonHover: 'hover:bg-blue-700',
        }
    }[variant];

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto pt-24 pb-10 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variantStyles.iconBg}`}>
                            <AlertTriangle className={`h-6 w-6 ${variantStyles.iconColor}`} />
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600">{message}</p>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    {showConfirm && (
                        <button
                            disabled={loading}
                            onClick={onConfirm}
                            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variantStyles.buttonBg} ${variantStyles.buttonHover}`}
                        >
                            {loading ? 'İşleniyor...' : confirmText}
                        </button>
                    )}
                    <button
                        disabled={loading}
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
                    >
                        {showConfirm ? cancelText : 'Tamam'}
                    </button>
                </div>
            </div>
        </div>
    );
}
