/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Backend API base URL — e.g. https://localhost:5001 */
    readonly VITE_API_BASE_URL: string;
    /** 'true' → use mock data; 'false' → real API calls */
    readonly VITE_USE_MOCK_API: string;
    /**
     * When 'true', store settings loading failure falls back to default values
     * instead of showing the SiteUnavailablePage. Useful for local dev without a DB.
     * Set in .env.local — never commit.
     */
    readonly VITE_FALLBACK_DEFAULTS?: string;
    /**
     * Background color for the splash screen shown while store settings load.
     * Hex or any valid CSS color — e.g. #2d6a4f
     * Set in .env.local — never commit.
     */
    readonly VITE_SPLASH_BG_COLOR?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
