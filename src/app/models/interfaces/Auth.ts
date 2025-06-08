export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface User {
  id: number;
  email: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
