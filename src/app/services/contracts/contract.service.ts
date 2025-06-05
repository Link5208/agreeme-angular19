import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contract } from 'src/app/models/interfaces/Contract';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(private http: HttpClient) {}
  getContracts() {
    return this.http.get<Contract[]>('/api/contracts');
  }

  exportContracts() {
    return this.http.get('/api/contracts/export', { responseType: 'blob' });
  }
}
