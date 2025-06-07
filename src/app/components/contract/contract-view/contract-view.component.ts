import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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
  ],
  templateUrl: './contract-view.component.html',
  styleUrl: './contract-view.component.scss',
})
export class ContractViewComponent {
  contract: Contract | null = null;
  taxRate: number = 10;
  displayedColumns: string[] = ['name', 'unit', 'price', 'quantity', 'total'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService
  ) {}

  ngOnInit() {
    // Check for token first
    const token = localStorage.getItem('accessToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadContract(id);
    }
  }

  loadContract(id: string) {
    this.contractService.getContractById(id).subscribe({
      next: (contract) => {
        if (contract) {
          this.contract = contract;
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error loading contract:', error);
          this.router.navigate(['/contract']);
        }
      },
    });
  }

  calculateSubTotal(): number {
    return (
      this.contract?.items.reduce(
        (total, item) => total + (item.total || 0),
        0
      ) || 0
    );
  }

  calculateTotal(): number {
    const subTotal = this.calculateSubTotal();
    return subTotal + (subTotal * this.taxRate) / 100;
  }

  onBack() {
    this.router.navigate(['/contract']);
  }

  onEdit() {
    this.router.navigate(['/contract/edit', this.contract?.id]);
  }
}
