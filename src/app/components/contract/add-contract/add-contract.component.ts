import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-add-contract',
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
  templateUrl: './add-contract.component.html',
  styleUrl: './add-contract.component.scss',
})
export class AddContractComponent {
  contractForm: FormGroup;
  contractId: string = (Math.floor(Math.random() * 900) + 100).toString();
  taxRate: number = 10;

  constructor(private fb: FormBuilder, private router: Router) {
    this.createForm();
  }

  ngOnInit() {
    this.addItem(); // Add first item row by default
  }

  createForm() {
    this.contractForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', Validators.required],
      signDate: [new Date(), Validators.required],
      status: ['Pending', Validators.required],
      items: this.fb.array([]),
    });
  }

  get items() {
    return this.contractForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      id: [{ value: null, disabled: true }],
      name: ['', Validators.required],
      unit: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      total: [{ value: 0, disabled: true }],
    });
  }

  calculateItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }

  updateItemTotal(index: number) {
    const item = this.items.at(index);
    const price = item.get('price')?.value || 0;
    const quantity = item.get('quantity')?.value || 0;
    const total = this.calculateItemTotal(price, quantity);
    item.patchValue({ total: total }, { emitEvent: false });
  }

  calculateSubTotal(): number {
    return this.items.controls.reduce((total, item) => {
      const itemValue = item.getRawValue();
      return (
        total + this.calculateItemTotal(itemValue.price, itemValue.quantity)
      );
    }, 0);
  }

  onSubmit() {
    if (this.contractForm.valid) {
      const formValue = {
        ...this.contractForm.getRawValue(),
        items: this.items.getRawValue().map((item) => ({
          ...item,
          total: this.calculateItemTotal(item.price, item.quantity),
        })),
      };
      console.log('New contract:', formValue);
      // TODO: Add API call to save contract
      this.router.navigate(['/contract']);
    }
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateTax(): number {
    return this.calculateSubTotal() * (this.taxRate / 100);
  }

  calculateTotal(): number {
    return this.calculateSubTotal() + this.calculateTax();
  }

  onCancel() {
    this.router.navigate(['/contract']); // Adjust the route as needed
  }
}
