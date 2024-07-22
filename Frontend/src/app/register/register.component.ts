import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import axios, { AxiosError } from 'axios';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FooterComponent, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit {
  registerData = { name: '', unit: '', role: '', email: '', password: '' };
  registerMessage = '';
  email: string | null = null;
  showEmailDisplay = false;

  ngOnInit() {
    this.showEmailDisplay = false;
  }

  async registerAccount() {
    console.log("Sending data:", this.registerData);
    try {
      const response = await axios.post("http://localhost:3000/addAccount", this.registerData);
      console.log("Server response:", response.data);
      if (response.data.status === 200) {
        this.registerMessage += ' - Registration success...';
        window.location.href = '/login';
      } else {
        this.registerMessage = response.data.message;
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        console.error("Error during registration:", axiosError);
        this.registerMessage = axiosError.response?.data?.message || "An error occurred during registration";
      } else {
        console.error("Error during registration:", error);
        this.registerMessage = "An error occurred during registration";
      }
      this.showEmailDisplay = true;
    }
  }
}
