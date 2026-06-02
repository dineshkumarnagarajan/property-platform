export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
}

export function getPagination(query: any): PaginationParams {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(50, parseInt(query.limit || '10', 10));
    return { page, limit, offset: (page - 1) * limit };
}

export function paginatedResponse<T>(
    data: T[],
    total: number,
    params: PaginationParams
) {
    return {
        data,
        meta: {
            total,
            page: params.page,
            limit: params.limit,
            totalPages: Math.ceil(total / params.limit),
        },
    };
}