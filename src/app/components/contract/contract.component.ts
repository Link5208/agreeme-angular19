import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

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
    ReactiveFormsModule,
    DatePipe,
  ],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContractComponent implements OnInit {
  dataSource = new MatTableDataSource<Contract>([]);
  totalItems = 0;
  currentPage = 1;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25];
  searchControl = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;

  // Track current sort state
  currentSort = {
    active: '',
    direction: '',
  };
  onSearch(): void {
    const searchTerm = this.searchControl.value;
    let filter = '';

    if (searchTerm && searchTerm.trim()) {
      // Build Spring Filter syntax for name or contractId search
      filter = `name ~~ '*${searchTerm}*' or contractId ~~ '*${searchTerm}*'`;
    }

    this.currentPage = 1; // Reset to first page when searching
    this.loadContracts(filter);
  }

  deleteContract(contract: Contract) {
    if (!contract.id) {
      console.error('Contract ID is undefined');
      return;
    }
    if (
      confirm(
        `Are you sure you want to delete contract ${contract.contractId}?`
      )
    ) {
      this.contractService.deleteContract(contract.id).subscribe({
        next: (response) => {
          if (response.statusCode === 200) {
            const index = this.dataSource.data.findIndex(
              (item) => item.id === contract.id
            );
            if (index > -1) {
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription();
            }
          }
        },
        error: (error) => {
          console.error('Error deleting contract:', error);
          // Handle different error cases
          if (error.status === 404) {
            console.error('Contract not found');
          } else if (error.status === 400) {
            console.error('Bad request');
          }
        },
      });
    }
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

  totalContracts: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private contractService: ContractService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Contract>([]);
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.onSearch();
      });

    this.loadContracts();
  }
  ngAfterViewInit() {
    // Listen for sort changes
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0; // Reset to first page when sorting
      this.loadContracts();
    });
  }
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;

    // Get current search term and create filter
    const searchTerm = this.searchControl.value;
    let filter = '';

    if (searchTerm && searchTerm.trim()) {
      filter = `name ~~ '*${searchTerm}*' or contractId ~~ '*${searchTerm}*'`;
    }

    // Load contracts with current search filter
    this.loadContracts(filter);
  }

  // Update the loadContracts method
  loadContracts(filter?: string) {
    this.contractService
      .getAllContracts(
        this.currentPage,
        this.pageSize,
        filter,
        this.sort?.active,
        this.sort?.direction as 'asc' | 'desc'
      )
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            // Access the result array from the nested structure
            this.dataSource.data = response.data.result;
            this.totalContracts = response.data.meta.total;
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

  selection = new SelectionModel<any>(true, []);

  inProgressContracts: number = 0;
  liqidatedContracts: number = 0;
  pendingContracts: number = 0;

  // Add column definitions with display names
  columnDefinitions = [
    { def: 'select', label: 'Select', show: true },
    { def: 'contractId', label: 'ID', show: true },
    { def: 'name', label: 'Name', show: true },
    { def: 'signDate', label: 'Sign Date', show: true },
    {
      def: 'liquidationDate',
      label: 'Liquidation Date',
      show: true,
    },
    { def: 'status', label: 'Status', show: true },
    { def: 'actions', label: 'Actions', show: true },
  ];

  // Update displayedColumns to be dynamic
  get displayedColumns(): string[] {
    return this.columnDefinitions.filter((cd) => cd.show).map((cd) => cd.def);
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

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Unknown'; // Handle undefined case
    switch (status) {
      case 'LIQUIDATED':
        return 'Thanh lý';
      case 'UNLIQUIDATED':
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
    // Define ordered columns - ensure contractId is first
    const orderedColumns = [
      'contractId',
      'name',
      'signDate',
      'liquidationDate',
      'status',
    ];
    // Filter out select and actions columns
    const visibleColumns = orderedColumns.filter(
      (column) =>
        this.displayedColumns.includes(column) &&
        column !== 'select' &&
        column !== 'actions'
    );

    // Create headers first
    const headers = visibleColumns.map((column) => {
      const headerMap: Record<string, string> = {
        contractId: 'Contract ID',
        name: 'Contract Name',
        signDate: 'Sign Date',
        liquidationDate: 'Liquidation Date',
        status: 'Status',
      };
      return (
        headerMap[column] || column.charAt(0).toUpperCase() + column.slice(1)
      );
    });

    // Map data for export
    const data = this.dataSource.data.map((item: Contract) => {
      const exportItem: Record<string, any> = {};
      visibleColumns.forEach((column) => {
        if (column === 'status') {
          exportItem[column] = this.getStatusLabel(item[column] as string);
        } else if (column === 'signDate' || column === 'liquidationDate') {
          // Format both date fields consistently as YYYY-MM-DD
          const date = new Date(item[column] as string);
          exportItem[column] = date
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                '0'
              )}-${String(date.getDate()).padStart(2, '0')}`
            : '';
        } else {
          exportItem[column] = item[column];
        }
      });
      return exportItem;
    });

    // Create worksheet with headers first
    const ws = XLSX.utils.aoa_to_sheet([headers]);

    // Append data starting from second row
    XLSX.utils.sheet_add_json(ws, data, {
      origin: 'A2',
      skipHeader: true,
    });

    // Create workbook and save
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Contracts');

    const fileName = `contracts_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }
}
