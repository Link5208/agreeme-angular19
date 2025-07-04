import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    size: number = 10,
    filter?: string,
    sort?: string,
    direction?: 'asc' | 'desc'
  ): Observable<ApiResponse<PaginatedResponse<Contract>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter) {
      params = params.set('filter', filter);
    }
    if (sort && direction) {
      params = params.set('sort', `${sort},${direction}`);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Contract>>>(
      `${this.apiUrl}`,
      { params }
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

  createContract(
    contractData: any,
    files: File[]
  ): Observable<ApiResponse<any>> {
    const formData = new FormData();

    // Add contract data
    formData.append(
      'contract',
      new Blob([JSON.stringify(contractData)], {
        type: 'application/json',
      })
    );

    // Add files with encoded filenames
    files.forEach((file) => {
      const encodedFileName = file.name.replace(/\s/g, '%20');
      formData.append('files', file, encodedFileName);
    });

    // Let the browser set the Content-Type header with the correct boundary
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}`, formData);
  }

  updateContractStatus(request: {
    id: number;
    status: string;
  }): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}`, request);
  }

  deleteContract(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
