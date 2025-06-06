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
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.contractService.getContractById(id).subscribe(
        (contract) => {
          if (contract) {
            this.contract = contract;
          } else {
            console.error('Contract not found');
            this.router.navigate(['/contract']);
          }
        },
        (error) => {
          console.error('Error loading contract:', error);
          this.router.navigate(['/contract']);
        }
      );
    }
  }

  loadContract(id: string) {
    this.contractService.getContractById(id).subscribe(
      (contract) => {
        if (contract) {
          this.contract = contract;
        }
      },
      (error) => {
        console.error('Error loading contract:', error);
        // Handle error - maybe navigate back or show error message
        this.router.navigate(['/contract']);
      }
    );
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
