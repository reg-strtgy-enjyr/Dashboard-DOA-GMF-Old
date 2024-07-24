import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) { }

  accountid: string | null = null;
  role: string | null = null;

  ngOnInit() {
    /*
    if (isSessionExpired()) {
      sessionStorage.clear();
      console.log('Session expired. Redirecting to login page.');
      this.router.navigate(['/login']);
    }
      */
    this.accountid = sessionStorage.getItem('accountid');
    this.role = sessionStorage.getItem('role');
    console.log('Retrieved accountid:', this.accountid);
    console.log('Retrieved role:', this.role);
  }

  private apiUrl = 'http://localhost:3000';

  logout() {
    axios.post(`${this.apiUrl}/logout`)
      .then(response => {
        sessionStorage.removeItem('accountid');
        this.router.navigate(['/login']);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }
}
/*
function isSessionExpired(): boolean {
  const loginTime = sessionStorage.getItem('loginTime');
  if (!loginTime) {
    return true;
  }

  const currentTime = Date.now();
  const sessionDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  return currentTime - parseInt(loginTime) > sessionDuration;
}
*/