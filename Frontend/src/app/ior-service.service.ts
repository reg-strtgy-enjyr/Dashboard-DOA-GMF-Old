import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class IorService {
  private apiUrl = 'http://localhost:3000/showOccurrenceAll';

  async fetchDataFromServer() {
    try {
      const response = await axios.get(this.apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
