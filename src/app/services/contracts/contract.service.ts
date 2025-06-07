import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { ApiResponse } from 'src/app/models/interfaces/ApiResponse';
import { Contract } from 'src/app/models/interfaces/Contract';
import { PaginatedResponse } from 'src/app/models/interfaces/PaginationResponse';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = `${environment.apiUrl}/contracts`;

  constructor(private http: HttpClient) {}

  getAllContracts(
    page: number = 1,
    size: number = 10
  ): Observable<ApiResponse<PaginatedResponse<Contract>>> {
    return this.http.get<ApiResponse<PaginatedResponse<Contract>>>(
      `${this.apiUrl}`,
      {
        params: {
          page: page.toString(),
          size: size.toString(),
        },
      }
    );
  }

  getContractById(id: string): Observable<ApiResponse<Contract>> {
    return this.http.get<ApiResponse<Contract>>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching contract:', error);
        throw error;
      })
    );
  }

  createContract(request: Contract): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}`, request).pipe(
      tap((response) => console.log('Create contract response:', response)),
      catchError((error) => {
        console.error('Create contract error:', error);
        return throwError(() => error);
      })
    );
  }
  updateContractStatus(request: {
    id: number;
    status: string;
  }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}`, request);
  }
}
