export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}
