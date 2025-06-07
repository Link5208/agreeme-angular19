import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Contract } from 'src/app/models/interfaces/Contract';

@Component({
  selector: 'app-edit-contract',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './edit-contract.component.html',
  styleUrl: './edit-contract.component.scss',
})
export class EditContractComponent {
  contractForm: FormGroup;
  contractId: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.contractId = this.route.snapshot.params['id'];
    // TODO: Replace with actual API call
    this.loadContractData(this.contractId);
  }

  createForm() {
    this.contractForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }],
      signDate: [{ value: '', disabled: true }],
      status: ['', Validators.required],
      items: this.fb.array([]),
    });
  }

  get items() {
    return this.contractForm.get('items') as FormArray;
  }

  loadContractData(id: string) {
    // Example: Load data from your contract service
    // this.contractService.getContractById(id).subscribe(contract => {
    //   this.patchFormData(contract);
    // });

    // For now using mock data
    const mockData: Contract = {
      contractId: id,
      name: 'Software Development Contract',
      signDate: '2024-01-01',
      status: 'UNLIQUIDATED',
      items: [
        {
          itemId: '1',
          name: 'Development',
          unit: 'hour',
          price: 1000,
          quantity: 1,
          total: 1000,
        },
        {
          itemId: '2',
          name: 'Testing',
          unit: 'hour',
          price: 500,
          quantity: 2,
          total: 1000,
        },
      ],
    };

    this.patchFormData(mockData);
  }

  private patchFormData(contract: Contract) {
    // Clear existing items first
    while (this.items.length) {
      this.items.removeAt(0);
    }

    // Patch main form values
    this.contractForm.patchValue({
      id: contract.id,
      name: contract.name,
      signDate: new Date(contract.signDate),
      status: contract.status,
    });

    // Add items if they exist
    if (contract.items && contract.items.length > 0) {
      contract.items.forEach((item) => {
        this.items.push(
          this.fb.group({
            id: [{ value: item.id, disabled: true }], // Add ID field for items
            name: [item.name, Validators.required],
            unit: [item.unit, Validators.required],
            price: [item.price, [Validators.required, Validators.min(0)]],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            total: [{ value: item.total, disabled: true }], // Auto-calculated field
          })
        );
      });
    }

    // Disable ID field since it shouldn't be editable
    this.contractForm.get('id')?.disable();
  }

  addItem() {
    this.items.push(
      this.fb.group({
        id: [{ value: null, disabled: true }],
        name: ['', Validators.required],
        unit: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        total: [{ value: 0, disabled: true }],
      })
    );
  }

  // Add method to calculate total
  calculateItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  // Add method to update item total
  updateItemTotal(index: number) {
    const item = this.items.at(index);
    const price = item.get('price')?.value || 0;
    const quantity = item.get('quantity')?.value || 0;
    const total = this.calculateItemTotal(price, quantity);
    item.patchValue({ total: total }, { emitEvent: false });
  }

  // Update the onSubmit method
  onSubmit() {
    if (this.contractForm.valid) {
      const formValue = {
        ...this.contractForm.getRawValue(),
        items: this.items.getRawValue().map((item) => ({
          ...item,
          total: this.calculateItemTotal(item.price, item.quantity),
        })),
      };

      console.log('Updated contract:', formValue);
      // TODO: Add API call to update contract
      this.router.navigate(['/contract']);
    }
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onCancel() {
    this.router.navigate(['/contract']);
  }
}
