import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navbar/navbar.component";
import { FooterComponent } from "../../footer/footer.component";
import { HttpClient } from '@angular/common/http';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-ior',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './search-ior.component.html',
  styleUrl: './search-ior.component.css'
})
export class SearchIORComponent {
  /*
  title = 'Searching NCR';
  items: any[] = [];
  searchData = {
    input: ''
  };
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchDataFromServer();
    setInterval(() => {
      this.fetchDataFromServer();
    }, 5000);

    this.searchSubject.pipe(debounceTime(300)).subscribe(searchTerm => {
      this.fetchDataBySearchTerm(searchTerm);
    });
  }

  fetchDataFromServer(): void {
    if (!this.searchData.input) {
      this.http.get<any>('http://localhost:3000/showNCRInit').subscribe(
        response => {
          if (response.status === 200) {
            this.items = response.showProduct;
          } else {
            console.error('Error Message:', response.message);
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
  }

  fetchDataBySearchTerm(searchTerm: string): void {
    this.http.post<any>('http://localhost:3000/searchNCR', { input: searchTerm }).subscribe(
      response => {
        if (response.status === 200) {
          this.items = response.showProduct;
        } else {
          console.error('Error Message:', response.message);
          this.items = [];
        }
      },
      error => {
        console.error('Error:', error);
        this.items = [];
      }
    );
  }

  onSearchTermChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }
/*
  exportToExcel(): void {
    const table = document.getElementById('data-table');
    const ws = XLSX.utils.table_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'NCR_Data.xlsx');
  }
  navigatePreview(ncrNo: string): void {
    sessionStorage.setItem('ncr_init_id', ncrNo);
    window.location.href = 'previewPage.html';
  }

  navigateEdit(ncrNo: string): void {
    sessionStorage.setItem('ncr_init_id', ncrNo);
    window.location.href = 'Edit_NCR_2.html';
  }
*/
}