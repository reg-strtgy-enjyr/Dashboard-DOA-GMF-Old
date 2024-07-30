import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../toast.service';
import axios from 'axios';
import { error } from 'console';

@Component({
  selector: 'app-form-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './form-ncr.component.html',
  styleUrl: './form-ncr.component.css'
})
export class FormNCRComponent implements OnInit {
  constructor(private toastService: ToastService) { }
  currentAccountID = '';
  ncr_data = {
    accountid: '',
    regulationbased: '',
    subject: '',
    audit_no: '',
    ncr_no: '',
    issued_date: '',
    responsible_office: '',
    audit_type: '',
    audit_scope: '',
    to_uic: '',
    attention: '',
    require_condition: '',
    level_finding: '',
    problem_analis: '',
    answer_duedate: '',
    issue_ian: '',
    ian_no: '',
    encounter_conditon: '',
    audit_by: '',
    audit_date: '',
    acknowledge_by: '',
    acknowledge_date: '',
    status: '',
    temporarylink: '',
  };

  ngOnInit() {
    const accountid = sessionStorage.getItem('accountid');
    if (accountid) {
      this.currentAccountID = accountid;
      console.log('Retrieved accountid:', accountid);
      this.getAccountInfo();
    } else {
      window.location.href = '/login';
    }
  }

  account: any = {};

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:3000/showAccount', { accountid: this.currentAccountID });
      if (response.data.status === 200 && response.data.account) {
        this.account = response.data.account;
      } else {
        console.error('Error fetching account information:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error fetching account info!', error);
    }
  }

  async addNCRInit() {
    this.ncr_data.accountid = this.currentAccountID;
    console.log("Sending data:", this.ncr_data);
    try {
      const response = await axios.post('http://localhost:3000/addNCRInit', this.ncr_data);

      if (response.data.status === 200) {
        this.toastService.successToast('NCR form submitted successfully');
        console.log('NCR Init added successfully');
      } else {
        this.toastService.failedToast('Error submitting NCR form');
        console.error('Error adding NCR Init:', response.data.message);
      }
    } catch (error) {
      this.toastService.failedToast('There was an error creating NCR form');
      console.error('There was an error creating NCR form', error);
    }
  }
}
