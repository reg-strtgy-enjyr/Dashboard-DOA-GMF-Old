import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { debounceTime, Subject } from 'rxjs';
import axios from 'axios';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-search-ior',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './search-ior.component.html',
  styleUrl: './search-ior.component.css'
})
export class SearchIORComponent implements OnInit {
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
          const response = await axios.get("http://localhost:3000/showIORInit");
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
      const response = await axios.post("http://localhost:3000/searchIOR", this.searchData);
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
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    const fileName = `IOR_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }
  

  navigatePreview(iorNo: string): void {
    sessionStorage.setItem('ior_init_id', iorNo);
    window.location.href = '/preview';
  }

  navigateEdit(iorNo: string): void {
    sessionStorage.setItem('ior_init_id', iorNo);
    window.location.href = '/editIOR';
  }
}