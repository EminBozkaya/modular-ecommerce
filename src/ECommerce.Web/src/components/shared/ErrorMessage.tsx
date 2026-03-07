interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20 text-destructive text-center">
            <p className="text-sm font-medium">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-3 px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
