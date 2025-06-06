import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
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
    MatLabel,
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
      itemName: ['', Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateItemTotal(item: any): number {
    return item.unitPrice * item.quantity;
  }

  calculateSubTotal(): number {
    return this.items.controls.reduce(
      (total, item) => total + this.calculateItemTotal(item.value),
      0
    );
  }

  calculateTax(): number {
    return this.calculateSubTotal() * (this.taxRate / 100);
  }

  calculateTotal(): number {
    return this.calculateSubTotal() + this.calculateTax();
  }

  onSubmit() {
    if (this.contractForm.valid) {
      console.log(this.contractForm.value);
      // TODO: Add your save logic here
    }
  }

  onCancel() {
    this.router.navigate(['/contract']); // Adjust the route as needed
  }
}
