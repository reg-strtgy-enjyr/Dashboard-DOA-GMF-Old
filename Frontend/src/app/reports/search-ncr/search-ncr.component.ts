import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { debounceTime, Subject } from 'rxjs';
import { NCRService } from '../../ncrservice.service';
import axios from 'axios';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-search-ncr',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './search-ncr.component.html',
  styleUrl: './search-ncr.component.css'
})
export class SearchNCRComponent implements OnInit {
  items: any[] = [];
  searchData = { input: '' };
  searchSubject = new Subject<string>();

  constructor() {}

  ngOnInit() {
    this.fetchDataFromServer();
  }

  async fetchDataFromServer() {
    try {
      if (!this.searchData.input) {
          const response = await axios.get("http://localhost:3000/showNCRInit");
          if (response.data.status === 200) {
              this.items = response.data.showProduct;
          } else {
              console.error('Error Message:', response.data.message);
          }
      }
    } catch (error) {
        console.error('Error:', error);
    }
  }

  async fetchDataBySearchTerm() {
    try {
      const response = await axios.post("http://localhost:3000/searchNCR", this.searchData);
      if (response.data.status === 200) {
          this.items = response.data.showProduct;
      } else {
          console.error('Error Message:', response.data.message);
          this.items = []; // Set items to an empty array on error
      }
    } catch (error) {
        console.error('Error:', error);
        this.items = []; // Set items to an empty array on error
    }
  }

  onSearchChange(searchValue: string): void {
    this.searchSubject.next(searchValue);
  }

  exportToExcel(): void {
    const table = document.getElementById('data-table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'NCR_Data.xlsx');
  }

  navigatePreview(ncrNo: string): void {
    sessionStorage.setItem('ncr_init_id', ncrNo);
    window.location.href = '/preview';
  }

  navigateEdit(ncrNo: string): void {
    sessionStorage.setItem('ncr_init_id', ncrNo);
    window.location.href = '/editNCR';
  }
}