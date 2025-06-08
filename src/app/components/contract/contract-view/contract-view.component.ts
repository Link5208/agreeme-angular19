import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { VndCurrencyPipe } from 'src/app/config/pipe/vnd-currency.pipe';
import { ActionLog } from 'src/app/models/interfaces/ActionLog';
import * as XLSX from 'xlsx';
import { Contract } from 'src/app/models/interfaces/Contract';
import { FileInfo } from 'src/app/models/interfaces/FileInfo';
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
    MatIconModule,
    MatTooltipModule,
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

  filesDataSource = new MatTableDataSource<FileInfo>();
  fileColumns: string[] = ['name', 'type', 'size', 'createdAt', 'createdBy'];

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
          if (response.data.files) {
            this.filesDataSource.data = response.data.files;
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

  exportItemsToExcel(): void {
    if (!this.contract?.items?.length) {
      return;
    }

    // Prepare data for export
    const data = this.contract.items.map((item) => ({
      'Item Name': item.name,
      Unit: item.unit,
      'Unit Price': item.price,
      Quantity: item.quantity,
      Total: item.total,
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Items');

    // Generate & download Excel file
    const fileName = `contract_${this.contract.contractId}_items_${
      new Date().toISOString().split('T')[0]
    }.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  // Add helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
