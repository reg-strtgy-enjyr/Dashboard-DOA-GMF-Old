import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseURL = 'http://localhost:3000';

  async fetchAccountData(accountid: string) {
    try {
      const response = await axios.post(`${this.baseURL}/showAccount`, { accountid });
      return response.data.account;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error('Failed to fetch account data: ' + axiosError.message);
    }
  }

  async fetchAllAccounts() {
    try {
      const response = await axios.get(`${this.baseURL}/showAllAccount`);
      return response.data.account;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error('Failed to fetch all account: ' + axiosError.message);
    }
  }

  async addAccount(newAccount: any) {
    try {
      const response = await axios.post(`${this.baseURL}/addAccount`, newAccount);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error('Failed to add account: ' + axiosError.message);
    }
  }

  async changePassword(accountid: string, password: string) {
    try {
      const response = await axios.post(`${this.baseURL}/updatePassword`, { accountid, password });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error('Failed to change password: ' + axiosError.message);
    }
  }

  async deleteAccount(accountid: string) {
    try {
      const response = await axios.delete(`${this.baseURL}/deleteAccount`, { data: { accountid } });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      throw new Error('Failed to delete account: ' + axiosError.message);
    }
  }
}
