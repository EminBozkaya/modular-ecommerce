import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
};

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    return (
        <div role="status" aria-label="Loading" className={cn('flex justify-center items-center', className)}>
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}
