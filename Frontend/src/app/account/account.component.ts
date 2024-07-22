import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import axios, { AxiosError } from 'axios';

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

  title = "Account";
  currentAccountID = '';
  changePasswordMessage = '';
  deletePasswordMassage = '';
  addMassage = '';
  Account_data = {
    accountid: '',
    name: '',
    unit: '',
    Password: '',
    Role: ''
  };
  loginMessage = '';
  activeTab = 'general';
  allAccounts = [];
  newAccount = {
    accountid: '',
    name: '',
    unit: '',
    password: '',
    role: ''
  };
  ChangePass = {
    accountid: '',
    password: ''
  };
  DeleteAccount = {
    accountid: ''
  };

  ngOnInit() {
    const accountid = sessionStorage.getItem('accountid');
    if (accountid) {
      this.fetchAccountData(accountid);
      this.fetchAllAccounts();
      this.currentAccountID = accountid;
    } else {
      window.location.href = '/login';
    }
  }

  redirectToMainMenu() {
    window.location.href = '/home';
  }

  async fetchAccountData(accountid: string) {
    try {
      const response = await axios.post('http://localhost:3000/showAccount', { accountid });
      this.Account_data = response.data.account;
      this.loginMessage = ''; // Reset loginMessage on successful fetch
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Error fetching account data:", axiosError);
      this.loginMessage = 'Failed to fetch account data: ' + axiosError.response?.data?.message || 'Unknown error';
    }
  }

  async fetchAllAccounts() {
    try {
      const response = await axios.get('http://localhost:3000/showAllAccount');
      console.log("Fetched accounts:", response.data.account);
      this.allAccounts = response.data.account;
    } catch (error) {
      console.error("Error fetching all accounts:", error);
    }
  }

  async addAccount() {
    try {
      const response = await axios.post('http://localhost:3000/addAccount', this.newAccount);
      console.log("Added account:", response.data.account);

      if (response.data.status === 200) {
        this.addMassage = 'Add Account successfully';
      } else {
        this.changePasswordMessage = 'Failed to Add Account';
      }

      this.fetchAllAccounts();
      this.resetNewAccountForm();
    } catch (error) {
      console.error("Error adding account:", error);
    }
  }

  async changePassword() {
    try {
      const response = await axios.post('http://localhost:3000/updatePassword', {
        accountid: this.ChangePass.accountid,
        password: this.ChangePass.password
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
        data: { accountid: this.DeleteAccount.accountid }
      });

      console.log("Delete Password :", response.data.account);

      if (response.data.status === 200) {
        this.deletePasswordMassage = 'Account successfully Deleted';
      } else {
        this.deletePasswordMassage = 'Failed to Delete password';
      }

      this.fetchAllAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      this.deletePasswordMassage = 'Failed to delete account';
    }
  }

  changeTab(tabName: string) {
    this.activeTab = tabName;
    console.log(`Switched to ${tabName} tab`);
    if (tabName === 'info') {
      this.fetchAllAccounts();
    }
  }

  resetNewAccountForm() {
    this.newAccount = {
      accountid: '',
      name: '',
      unit: '',
      password: '',
      role: ''
    };
  }
}
