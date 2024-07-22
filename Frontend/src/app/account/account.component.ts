import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import axios from 'axios';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})


export class AccountComponent implements OnInit {
  selectedTab: string = 'account-info';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  accountid: string | null = null;
  role: string | null = null;
  account: any = {};

  ngOnInit() {
    this.accountid = sessionStorage.getItem('accountid');
    this.role = sessionStorage.getItem('role');
    console.log('Retrieved accountid:', this.accountid);
    console.log('Retrieved role:', this.role);
    if (this.accountid) {
      this.getAccountInfo();
    }
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:3000/showAccount', { accountid: this.accountid });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }
}