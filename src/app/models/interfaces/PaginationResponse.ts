export interface PaginatedResponse<T> {
  meta: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
  result: T[];
}
