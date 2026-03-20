import { useStoreSettings } from '@/context/StoreSettingsContext';
import defaultLogo from '@/assets/LOGO.png';
import { cn } from '@/lib/utils';

interface StoreLogoProps {
    className?: string; // Container classes (width, height, etc)
    imgClassName?: string; // Image specific overrides
}

/**
 * Standardized Store Logo component.
 * Uses object-contain and fills the container to ensure the logo is as large as possible
 * within its allocated "safe zone" without distortion.
 */
export function StoreLogo({ className, imgClassName }: StoreLogoProps) {
    const settings = useStoreSettings();
    const resolvedLogo = settings.imageBase64 ?? defaultLogo;

    return (
        <div className={cn("flex items-center justify-center overflow-hidden", className)}>
            <img
                src={resolvedLogo}
                alt={settings.storeName || "Store"}
                className={cn("h-full w-full object-contain transition-transform duration-300", imgClassName)}
            />
        </div>
    );
}
