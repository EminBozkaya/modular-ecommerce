import axios from 'axios';

export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

export function parseApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        return {
            status: error.response.status,
            message: data?.message || data?.error || error.message,
            errors: data?.errors,
        };
    }

    return {
        status: 500,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
}
