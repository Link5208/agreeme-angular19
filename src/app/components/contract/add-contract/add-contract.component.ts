import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ContractService } from 'src/app/services/contracts/contract.service';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { VndCurrencyPipe } from 'src/app/config/pipe/vnd-currency.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Contract } from 'src/app/models/interfaces/Contract';
import { Item } from 'src/app/models/interfaces/Item';

// Custom date formats
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY HH:mm:ss',
  },
  display: {
    dateInput: 'DD/MM/YYYY HH:mm:ss',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-add-contract',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDatepickerModule,
    VndCurrencyPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-contract.component.html',
  styleUrl: './add-contract.component.scss',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddContractComponent {
  contractForm: FormGroup;
  contractId: string = (Math.floor(Math.random() * 900) + 100).toString();
  taxRate: number = 10;
  contractService = inject(ContractService);
  loading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.createForm();
  }

  // Add valueChanges subscription for price and quantity
  ngOnInit() {
    this.addItem(); // Add first item row by default

    // Subscribe to changes in items array
    this.items.controls.forEach((item, index) => {
      ['price', 'quantity'].forEach((field) => {
        item.get(field)?.valueChanges.subscribe(() => {
          this.calculateItemTotal(index);
        });
      });
    });
  }

  createForm() {
    this.contractForm = this.fb.group({
      contractId: [this.contractId, Validators.required],
      name: ['', Validators.required],
      signDate: [moment(), Validators.required],
      status: ['UNLIQUIDATED', Validators.required],
      items: this.fb.array([]),
    });

    // Debug form validity
    this.contractForm.statusChanges.subscribe((status) => {
      console.log('Form Values:', this.contractForm.value);
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      unit: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }],
    });
  }

  // Add getter for easy form access
  get items() {
    return this.contractForm.get('items') as FormArray;
  }

  // Add method to check individual control validity
  isFieldValid(fieldName: string): boolean {
    const field = this.contractForm.get(fieldName);
    return field ? field.valid && field.touched : false;
  }

  async validateForm() {
    this.loading = true;
    try {
      // Mark all fields as touched to trigger validation
      Object.keys(this.contractForm.controls).forEach((key) => {
        const control = this.contractForm.get(key);
        control?.markAsTouched();
      });

      // Validate items array - with proper type checking
      const itemsArray = this.contractForm.get('items');
      if (itemsArray && itemsArray instanceof FormArray) {
        itemsArray.controls.forEach((control) => {
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach((key) => {
              const field = control.get(key);
              field?.markAsTouched();
            });
          }
        });
      }

      console.log('Form validation triggered');
      console.log('Form valid:', this.contractForm.valid);
      console.log('Form errors:', this.contractForm.errors);
      console.log('Items valid:', this.items.valid);

      return this.contractForm.valid;
    } finally {
      this.loading = false;
    }
  }

  onSubmit() {
    if (this.contractForm.valid) {
      this.loading = true;
      const formValue = this.contractForm.getRawValue();

      const request = {
        contractId: formValue.contractId,
        name: formValue.name,
        signDate: moment(formValue.signDate).format('YYYY-MM-DD HH:mm:ss'),
        status: 'UNLIQUIDATED',
        items: formValue.items.map((item: Item) => ({
          itemId: `VT${Math.floor(Math.random() * 900) + 100}`,
          name: item.name,
          unit: item.unit,
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      } as const;

      this.contractService.createContract(request).subscribe({
        next: (response) => {
          if (response.statusCode === 201) {
            this.router.navigate(['/contract']);
          }
        },
        error: (error) => {
          console.error('Error creating contract:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  getTimeString(): string {
    const date = this.contractForm.get('signDate')?.value;
    if (date) {
      return moment(date).format('HH:mm');
    }
    return '';
  }

  calculateTotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const price = item.get('price')?.value || 0;
      return sum + quantity * price;
    }, 0);
  }
  updateDateTime(event: any) {
    const timeStr = event.target.value;
    const currentDate = this.contractForm.get('signDate')?.value;
    if (currentDate && timeStr) {
      const [hours, minutes] = timeStr.split(':');
      const newDate = moment(currentDate)
        .set('hours', parseInt(hours))
        .set('minutes', parseInt(minutes));
      this.contractForm.get('signDate')?.setValue(newDate);
    }
  }

  calculateItemTotal(index: number): number {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const price = item.get('price')?.value || 0;
    const total = quantity * price;
    // Update the total field
    item.get('total')?.setValue(total, { emitEvent: false });
    return total;
  }

  // Update the subtotal calculation
  calculateSubTotal(): number {
    return this.items.controls.reduce((sum, item) => {
      return sum + (item.get('total')?.value || 0);
    }, 0);
  }

  addItem() {
    const newItem = this.createItem();
    this.items.push(newItem);
    const index = this.items.length - 1;

    ['price', 'quantity'].forEach((field) => {
      newItem.get(field)?.valueChanges.subscribe(() => {
        this.calculateItemTotal(index);
      });
    });
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  calculateTax(): number {
    return this.calculateSubTotal() * (this.taxRate / 100);
  }

  onCancel() {
    this.router.navigate(['/contract']); // Adjust the route as needed
  }
}
