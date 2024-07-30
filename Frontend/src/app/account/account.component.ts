import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import axios from 'axios';

interface AccountData {
  name: string;
  email: string;
  unit: string;
  role: string;
}

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

  currentAccountID = '';
  changePasswordMessage = '';
  deletePasswordMessage = '';
  addMessage = '';
  loginMessage = '';
  Account_data: AccountData = {
    name: '',
    email: '',
    unit: '',
    role: ''
  };
  allAccounts: AccountData[] = [];
  ChangePass = {
    email: '',
    currentPass: '',
    newPass: ''
  };
  DeleteAccount = {
    email: '',
    password: ''
  };

  ngOnInit() {
    this.accountid = sessionStorage.getItem('accountid');
    this.role = sessionStorage.getItem('role');
    console.log('Retrieved accountid:', this.accountid);
    console.log('Retrieved role:', this.role);
    if (this.accountid) {
      this.getAccountInfo();
      this.fetchAllAccounts();
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

  async fetchAllAccounts() {
    try {
        const response = await axios.get('http://localhost:3000/showAllAccount');
        console.log("Fetched accounts:", response.data.account);
        this.allAccounts = response.data.account;
        console.log(this.allAccounts);
    } catch (error) {
        console.error("Error fetching all accounts:", error);
        console.error("Entire error object:", error);
    }
  }

  async changePassword() {
    try {
        const response = await axios.post('http://localhost:3000/updatePassword', {
            accountid: this.ChangePass.email,
            currentPass: this.ChangePass.currentPass,
            newPass: this.ChangePass.newPass
        });

        console.log("Update Password :", response.data.account);

        if (response.data.status === 200) {
            this.changePasswordMessage = 'Password successfully updated';
        } else {
            this.changePasswordMessage = 'Failed to update password';
        }

        this.fetchAllAccounts();

    } catch (error) {
        console.error("Error updating password:", error);
        this.changePasswordMessage = 'Failed to update password';
    }
  }

  async DeleteAcc() {
    try {
        const response = await axios.delete('http://localhost:3000/deleteAccount', {
            data: { 
              email: this.DeleteAccount.email,
              password: this.DeleteAccount.password
            }
        });

        console.log("Delete Password :", response.data.account);

        if (response.data.status === 200) {
            this.deletePasswordMessage = 'Account successfully Deleted';
        } else {
            this.deletePasswordMessage = 'Failed to Delete password';
        }

        this.fetchAllAccounts();
    } catch (error) {
        console.error("Error deleting account:", error);
        this.deletePasswordMessage = 'Failed to delete account';
    }
  }
}