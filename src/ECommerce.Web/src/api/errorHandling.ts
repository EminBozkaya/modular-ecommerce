import axios from 'axios';

export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

export function parseApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error) && error.response) {
        return {
            status: error.response.status,
            message: error.response.data?.message || error.message,
            errors: error.response.data?.errors,
        };
    }

    return {
        status: 500,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
}
