import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import axios from 'axios';
import _ from 'lodash';
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
  private debounceFetchDataBySearchTerm = _.debounce(this.fetchDataBySearchTerm.bind(this), 300);
  private fetchDataInterval: any;

  ngOnInit() {
    this.fetchDataFromServer();
    //this.fetchDataInterval = setInterval(() => {
    //  this.fetchDataFromServer();
    //}, 5000);
  }
/*
  ngOnDestroy() {
    if (this.fetchDataInterval) {
      clearInterval(this.fetchDataInterval);
    }
  }
*/
  async fetchDataFromServer() {
    try {
      if (!this.searchData.input) {
        const response = await axios.get('http://localhost:3000/showNCRInit');
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
      const response = await axios.post('http://localhost:3000/searchNCR', this.searchData);
      if (response.data.status === 200) {
        this.items = response.data.showProduct;
      } else {
        console.error('Error Message:', response.data.message);
        this.items = [];
      }
    } catch (error) {
      console.error('Error:', error);
      this.items = [];
    }
  }

  exportToExcel(): void {
    const table = document.getElementById('data-table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    const fileName = `NCR_${formattedDate}.xlsx`;
  
    XLSX.writeFile(wb, fileName);
  }

  navigatePreview(ncrNo: string) {
    sessionStorage.setItem('ncr_init_id', ncrNo);
    window.location.href = 'previewPage.html';
  }

  navigateEdit(ncrNo: string) {
    sessionStorage.setItem('ncr_init_id', ncrNo);
    window.location.href = 'Edit_NCR_2.html';
  }
/*
  onSearchInputChange() {
    this.debounceFetchDataBySearchTerm();
  }
*/
}