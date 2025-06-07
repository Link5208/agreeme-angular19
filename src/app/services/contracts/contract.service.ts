import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
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

  getContractById(id: string): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching contract:', error);
        throw error;
      })
    );
  }
}
