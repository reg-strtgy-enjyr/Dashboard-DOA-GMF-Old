import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import axios, { AxiosError } from 'axios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FooterComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginData = { email: '', Password: '' };
  loginMessage = '';
  email: string | null = null;
  showEmailDisplay = false;

  ngOnInit() {
    this.showEmailDisplay = false;
  }

  async login() {
    console.log("Sending data:", this.loginData);
    try {
      const response = await axios.post("http://localhost:3000/login", this.loginData);
      console.log("Server response:", response.data);
  
      if (response.data.status === 200 && response.data.message === 'Login successful') {
        const userRole = response.data.user.role;
        this.email = response.data.user.email;
        this.loginMessage = 'Account ID: ' + this.email;
        sessionStorage.setItem('email', this.email || '');
        this.showEmailDisplay = true;
  
        if (userRole === 'Admin') {
          this.loginMessage += ' - Redirecting...';
          window.location.href = '/home';
        } else if (userRole === 'DO' || userRole === 'AO' || userRole === 'IM') {
          this.loginMessage += ' - Redirecting...';
          window.location.href = '/home';
        }
      } else {
        this.loginMessage = response.data.message;
        this.showEmailDisplay = true;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        console.error("Error during login:", axiosError);
        this.loginMessage = axiosError.response?.data?.message || "An error occurred during login";
      } else {
        console.error("Error during login:", error);
        this.loginMessage = "An error occurred during login";
      }
      this.showEmailDisplay = true;
    }
  }
}