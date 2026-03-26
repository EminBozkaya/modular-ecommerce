import i18n from '@/i18n';

export function SiteUnavailablePage() {
    // Respect saved language preference; default to English if none saved.
    // Intentionally avoids useTranslation() to be independent of React context.
    const lang = localStorage.getItem('language') ?? 'en';
    const t = i18n.getFixedT(lang);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    <svg
                        className="h-10 w-10 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                        />
                    </svg>
                </div>
                <h1 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {t('siteUnavailable.title')}
                </h1>
                <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                    {t('siteUnavailable.message')}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 active:scale-95 dark:bg-gray-600 dark:hover:bg-gray-500"
                >
                    {t('siteUnavailable.retry')}
                </button>
            </div>
        </div>
    );
}
