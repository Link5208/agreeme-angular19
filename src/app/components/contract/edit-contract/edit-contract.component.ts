import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { VndCurrencyPipe } from 'src/app/config/pipe/vnd-currency.pipe';
import { Contract } from 'src/app/models/interfaces/Contract';
import { ContractService } from 'src/app/services/contracts/contract.service';

@Component({
  selector: 'app-edit-contract',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    VndCurrencyPipe,
    MatTableModule,
  ],
  templateUrl: './edit-contract.component.html',
  styleUrl: './edit-contract.component.scss',
})
export class EditContractComponent {
  displayedColumns: string[] = ['name', 'unit', 'price', 'quantity', 'total'];
  dataSource = new MatTableDataSource<any>();
  contract: Contract | null = null;
  contractForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) {
    this.contractForm = this.fb.group({
      status: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadContract(id);
    }
  }

  loadContract(id: string) {
    this.loading = true;
    this.contractService.getContractById(id).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.contract = response.data;
          this.contractForm.patchValue({
            status: this.contract.status,
          });
        }
      },
      error: (error) => {
        console.error('Error loading contract:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
  calculateItemTotal(item: any): number {
    return item.quantity * item.price;
  }
  calculateSubTotal(): number {
    if (!this.contract?.items) return 0;
    return this.contract.items.reduce(
      (sum, item) => sum + this.calculateItemTotal(item),
      0
    );
  }
  onUpdate() {
    if (this.contractForm.valid && this.contract?.id) {
      this.loading = true;

      // Match API request format exactly
      const request = {
        id: this.contract.id,
        status: this.contractForm.value.status,
      };

      this.contractService.updateContractStatus(request).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            this.router.navigate(['/contract']);
          }
        },
        error: (error) => {
          console.error('Error updating contract:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  onBack() {
    this.router.navigate(['/contract']);
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
