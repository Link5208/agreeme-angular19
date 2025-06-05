import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Contract } from 'src/app/models/interfaces/Contract';
import { ContractService } from 'src/app/services/contracts/contract.service';

@Component({
  selector: 'app-contract',
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})
export class ContractComponent {
  displayedColumns: string[] = ['id', 'name', 'signDate', 'status', 'actions'];
  contracts: Contract[] = [
    {
      id: 'VT001',
      name: 'Long',
      signDate: '23423',
      status: 'Active',
    },
  ];

  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    this.contractService.getContracts().subscribe((data) => {
      this.contracts = data;
    });
  }

  openAdd() {
    // Mở dialog hoặc chuyển sang form thêm mới
  }

  editContract(contract: Contract) {
    // Mở dialog sửa
  }

  deleteContract(contract: Contract) {
    if (confirm('Bạn có chắc muốn xoá hợp đồng này?')) {
      // Gọi API xóa và reload danh sách
    }
  }

  viewDetail(contract: Contract) {
    // Mở dialog xem chi tiết + history log
  }

  exportToExcel() {
    this.contractService.exportContracts().subscribe((blob) => {
      const file = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contracts.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
