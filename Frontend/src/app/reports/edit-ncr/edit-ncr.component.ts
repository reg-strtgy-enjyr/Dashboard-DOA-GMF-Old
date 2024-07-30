import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import axios from 'axios';

@Component({
  selector: 'app-edit-ncr',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './edit-ncr.component.html',
  styleUrl: './edit-ncr.component.css'
})
export class EditNCRComponent implements OnInit {

  accountid: string | null = null;
  regulationbased: string | null = null;
  subject: string | null = null;
  audit_no: string | null = null;
  ncr_no: string | null = null;
  issued_data: string | null = null;
  responsible_office: string | null = null;
  audit_type: string | null = null;
  audit_scope: string | null = null;
  to_uic: string | null = null;
  attention: string | null = null;
  require_condition: string | null = null;
  level_finding: string | null = null;
  problem_analis: string | null = null;
  answer_duedate: string | null = null;
  issue_ian: string | null = null;
  ian_no: string | null = null;
  encounter_conditon: string | null = null;
  audit_by: string | null = null;
  audit_date: string | null = null;
  acknowledge_by: string | null = null;
  acknowledge_date: string | null = null;
  status: string | null = null;
  temporarylink: string | null = null;

  account: any = {};

  ngOnInit() {
    this.accountid = sessionStorage.getItem('accountid');
    console.log('Retrieved accountid:', this.accountid);
    if (this.accountid) {
      this.getAccountInfo();
    }
  }

  async getAccountInfo() {
    try {
      const response = await axios.post('http://localhost:3000/showAccount', { 
        accountid: this.accountid 
      });
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
    try {
      const response = await axios.post('http://localhost:3000/addNCRInit', { 
        accountid: this.accountid, 
        regulationbased: this.regulationbased,
        subject: this.subject,
        audit_no: this.audit_no,
        ncr_no: this.ncr_no,
        issued_data: this.issued_data,
        responsible_office: this.responsible_office,
        audit_type: this.audit_type,
        audit_scope: this.audit_scope,
        to_uic: this.to_uic,
        attention: this.attention,
        require_condition: this.require_condition,
        level_finding: this.level_finding,
        problem_analis: this.problem_analis,
        answer_duedate: this.answer_duedate,
        issue_ian: this.issue_ian,
        ian_no: this.ian_no,
        encounter_conditon: this.encounter_conditon,
        audit_by: this.audit_by,
        audit_date: this.audit_date,
        acknowledge_by: this.acknowledge_by,
        acknowledge_date: this.acknowledge_date,
        status: this.status,
        temporarylink: this.temporarylink
      });
      if (response.data.status === 200) {
        console.log('NCR Init added successfully');
        // Handle success (e.g., update UI, reset form, etc.)
      } else {
        console.error('Error adding NCR Init:', response.data.message);
      }
    } catch (error) {
      console.error('There was an error adding NCR Init!', error);
    }
  }
}
