import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/models/interfaces/ApiResponse';
import { Contract } from 'src/app/models/interfaces/Contract';
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
  ): Observable<ApiResponse<Contract[]>> {
    return this.http.get<ApiResponse<Contract[]>>(`${this.apiUrl}`, {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
    });
  }

  getContractById(id: string): Observable<Contract> {
    return this.http
      .get<ApiResponse<Contract>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
}
