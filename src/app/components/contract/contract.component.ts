import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SelectionModel } from '@angular/cdk/collections';
import { Contract } from 'src/app/models/interfaces/Contract';
import { Router } from '@angular/router';
import { ContractService } from 'src/app/services/contracts/contract.service';
import { MatMenuModule } from '@angular/material/menu';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-contract',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContractComponent {
  deleteContract(_t126: any) {
    throw new Error('Method not implemented.');
  }
  viewContract(contract: Contract) {
    this.router.navigate(['/contract/view', contract.id]);
  }
  editContract(contract: Contract) {
    this.router.navigate(['/contract/edit', contract.id]);
  }
  openAddDialog() {
    this.router.navigate(['/contract/add']);
  }

  dataSource: MatTableDataSource<Contract>;
  totalContracts: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private contractService: ContractService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Contract>([]);
  }

  ngOnInit() {
    this.loadContracts();
  }

  // Update the loadContracts method
  loadContracts(page: number = 1, size: number = 10) {
    this.contractService.getAllContracts(page, size).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          // Access the result array from the nested structure
          this.dataSource.data = response.data.result;
          this.totalContracts = response.data.meta.total;

          // Update paginator
          if (this.paginator) {
            this.paginator.length = response.data.meta.total;
            this.paginator.pageSize = response.data.meta.pageSize;
            this.paginator.pageIndex = response.data.meta.page - 1;
          }
        } else {
          console.error('Error:', response.message);
          this.handleError(response.message);
        }
      },
      error: (error) => {
        console.error('Error loading contracts:', error);
        this.handleError(error);
      },
    });
  }

  // Add error handling helper method
  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.message) {
      errorMessage = Array.isArray(error.message)
        ? error.message.join(', ')
        : error.message;
    }
    // TODO: Show error message to user (e.g., using MatSnackBar)
    console.error(errorMessage);
  }

  onPageChange(event: PageEvent) {
    this.loadContracts(event.pageIndex + 1, event.pageSize);
  }
  EXAMPLE_DATA: Contract[] = [];

  selection = new SelectionModel<any>(true, []);

  inProgressContracts: number = 0;
  completedContracts: number = 0;
  pendingContracts: number = 0;

  // Add column definitions with display names
  columnDefinitions = [
    { def: 'select', label: 'Select', show: true },
    { def: 'id', label: 'ID', show: true },
    { def: 'name', label: 'Name', show: true },
    { def: 'signDate', label: 'Sign Date', show: true },
    { def: 'status', label: 'Status', show: true },
    { def: 'actions', label: 'Actions', show: true },
  ];

  // Update displayedColumns to be dynamic
  get displayedColumns(): string[] {
    return this.columnDefinitions.filter((cd) => cd.show).map((cd) => cd.def);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'LIQUIDATED':
        return 'Thanh lý';
      case 'UNILIQUIDATED':
        return 'Chưa thanh lý';
      default:
        return status;
    }
  }
  toggleColumn(column: any) {
    column.show = !column.show;
  }

  // Add method to export to Excel
  exportToExcel(): void {
    // Get data excluding 'select' and 'actions' columns
    const exportData = this.EXAMPLE_DATA.map((item) => ({
      ID: item.id,
      Name: item.name,
      'Sign Date': item.signDate,
      Status: this.getStatusLabel(item.status),
    }));

    // Create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contracts');

    // Save file
    XLSX.writeFile(wb, 'contracts.xlsx');
  }
}
