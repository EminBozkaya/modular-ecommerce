interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
    actionText?: string;
}

export function ErrorMessage({ message, onRetry, actionText = 'Tekrar Dene' }: ErrorMessageProps) {
    return (
        <div className="rounded-xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-center">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors cursor-pointer active:scale-95"
                >
                    {actionText}
                </button>
            )}
        </div>
    );
}
