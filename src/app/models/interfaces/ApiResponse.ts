export interface ApiResponse<T> {
  statusCode: number;
  error?: string;
  message: string | string[];
  data: T;
}
