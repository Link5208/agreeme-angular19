import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'signDate',
    'status',
    'actions',
  ];

  EXAMPLE_DATA: Contract[] = [];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  totalContracts: number = 0;
  inProgressContracts: number = 0;
  completedContracts: number = 0;
  pendingContracts: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private contractService: ContractService
  ) {
    this.dataSource = new MatTableDataSource<Contract>([]);
  }

  ngOnInit() {
    // Update summary cards
    this.contractService.getAllContracts().subscribe((contracts) => {
      this.EXAMPLE_DATA = contracts;
      this.dataSource.data = this.EXAMPLE_DATA;

      // Update summary cards
      this.totalContracts = this.EXAMPLE_DATA.length;
      this.inProgressContracts = this.EXAMPLE_DATA.filter(
        (c) => c.status === 'UNILIQUIDATED'
      ).length;
      this.completedContracts = this.EXAMPLE_DATA.filter(
        (c) => c.status === 'LIQUIDATED'
      ).length;
    });
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
}
