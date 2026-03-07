import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-dashed rounded-lg">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">{title}</h3>
            {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
        </div>
    );
}
