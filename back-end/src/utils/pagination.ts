export interface PaginationResult<T> {
    content: T[];
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export function paginate<T>(data: T[], page = 1, limit = 10): PaginationResult<T> {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const content = data.slice(startIndex, endIndex);
    return {
        content,
        page,
        limit,
        totalItems,
        totalPages,
    };
}
