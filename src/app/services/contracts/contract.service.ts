import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  private contracts: Contract[] = [
    // Copy your EXAMPLE_DATA here
    {
      id: '1',
      name: 'Software Development Contract',
      signDate: '2024-01-01',
      status: 'LIQUIDATED',
      items: [
        {
          id: '1',
          name: 'Item 1',
          unit: 'pieces',
          price: 100,
          quantity: 2,
          total: 200,
        },
      ],
    },
    {
      id: '2',
      name: 'IT Consulting Services',
      signDate: '2023-06-01',
      status: 'LIQUIDATED',
      items: [],
    },
    {
      id: '3',
      name: 'Hardware Supply Agreement',
      signDate: '2024-03-01',
      status: 'LIQUIDATED',
      items: [],
    },
    {
      id: '4',
      name: 'Cloud Services Agreement',
      signDate: '2024-02-01',
      status: 'UNILIQUIDATED',
      items: [],
    },
    {
      id: '5',
      name: 'Maintenance Contract',
      signDate: '2023-01-01',
      status: 'UNILIQUIDATED',
      items: [],
    },
  ];

  getContractById(id: string): Observable<Contract | undefined> {
    const contract = this.contracts.find((c) => c.id === id);
    return of(contract);
  }

  getAllContracts(): Observable<Contract[]> {
    return of(this.contracts);
  }
}
