import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Account } from 'src/app/models/interfaces/Account';
import { ApiResponse } from 'src/app/models/interfaces/ApiResponse';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
} from 'src/app/models/interfaces/Auth';
import { Contract } from 'src/app/models/interfaces/Contract';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for stored user on init
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        // If parsing fails, clear the invalid data
        localStorage.removeItem('currentUser');
        console.error('Invalid user data in localStorage:', error);
      }
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.statusCode === 200 && response.data) {
            // Store access token (note the different key name)
            localStorage.setItem('accessToken', response.data.access_token);

            // Store user info
            if (response.data.user) {
              localStorage.setItem(
                'currentUser',
                JSON.stringify(response.data.user)
              );
              this.currentUserSubject.next(response.data.user);
            }
          }
        }),
        catchError((error) => {
          console.error('Auth service error:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/refresh`).pipe(
      tap((response) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
      }),
      catchError((error) => {
        console.error('Token refresh failed:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  isTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    return true;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }

  getAccount(): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(`${this.apiUrl}/account`);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  register(request: RegisterRequest): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/register`, request)
      .pipe(
        catchError((error) => {
          console.error('Registration error:', error);
          throw error.error?.message || 'Registration failed';
        })
      );
  }
}
