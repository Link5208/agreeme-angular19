import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { VndCurrencyPipe } from 'src/app/config/pipe/vnd-currency.pipe';
import { ActionLog } from 'src/app/models/interfaces/ActionLog';

import { Contract } from 'src/app/models/interfaces/Contract';
import { ContractService } from 'src/app/services/contracts/contract.service';

@Component({
  selector: 'app-contract-view',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    VndCurrencyPipe,
  ],
  templateUrl: './contract-view.component.html',
  styleUrl: './contract-view.component.scss',
})
export class ContractViewComponent {
  contract: Contract | null = null;
  displayedColumns: string[] = ['name', 'unit', 'price', 'quantity', 'total'];
  taxRate: number = 10;
  loading = false;
  error: string | null = null;
  actionLogsDataSource = new MatTableDataSource<ActionLog>([]);
  actionLogColumns: string[] = ['id', 'type', 'createdAt', 'createdBy'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) {}

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadContract(id);
    }
  }

  loadContract(id: string) {
    this.contractService.getContractById(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.contract = response.data;
          // No need to map items since API response matches our interface
          if (response.data.actionLogs) {
            this.actionLogsDataSource.data = response.data.actionLogs;
          }
        }
      },
      error: (error) => {
        console.error('Error loading contract:', error);
        this.error = error.message || 'Error loading contract';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  calculateSubTotal(): number {
    if (!this.contract?.items?.length) return 0;
    return this.contract.items.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
  }

  calculateTotal(): number {
    const subtotal = this.calculateSubTotal();
    return subtotal * (1 + this.taxRate / 100);
  }

  onBack() {
    this.router.navigate(['/contract']);
  }

  onEdit() {
    if (this.contract?.id) {
      this.router.navigate(['/contract/edit', this.contract.id]);
    }
  }
  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'LIQUIDATED':
        return 'Đã thanh lý';
      case 'UNLIQUIDATED':
        return 'Chưa thanh lý';
      default:
        return status || '';
    }
  }
}
