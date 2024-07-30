import { Component, NgModule } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './user-guide.component.html',
  styleUrl: './user-guide.component.css'
})
export class UserGuideComponent {
  selectedTab: string = 'account';
  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  selectedMainTab: string = 'account'; // default selected main tab
  selectedNestedTab: string = 'loginpage'; // default selected nested tab within account

  selectMainTab(tab: string) {
    this.selectedMainTab = tab;
    if (tab === 'account') {
      this.selectedNestedTab = 'loginpage'; // set default nested tab for account
    }
  }

  selectNestedTab(nestedTab: string) {
    this.selectedNestedTab = nestedTab;
  }
onTabSelect(arg0: string) {
throw new Error('Method not implemented.');
}

formFields = [
  {
    name: 'Account Name',
    description: 'Displays the name associated with the account currently logged in.',
    action: 'Verify the correct account name is displayed. Contact your administrator if there is an issue.'
  },
  {
    name: 'NCR Init ID',
    description: 'Unique identifier assigned to the Non-Conformance Report initiation.',
    action: 'Enter the NCR Init ID in the format NCR-YYYY-XXX. Ensure it matches the corresponding NCR.'
  },
  {
    name: 'Proposed Closed Audit',
    description: 'Information about the proposed closed audit.',
    action: 'Enter details of the proposed audit closure.'
  },
  {
    name: 'Proposed Close Date',
    description: 'Date when the closure is proposed.',
    action: 'Select the date on which the closure is proposed.'
  },
  {
    name: 'Is Close',
    description: 'Indicates whether the report is closed.',
    action: 'Select "Close" or "Open" from the dropdown menu.'
  },
  {
    name: 'Effective',
    description: 'Indicates if the action is effective.',
    action: 'Select "Effective" or "Not Effective" from the dropdown menu.'
  },
  {
    name: 'Refer Verif',
    description: 'Reference verification information.',
    action: 'Enter the reference verification details.'
  },
  {
    name: 'Sheet No',
    description: 'Sheet number associated with the NCR.',
    action: 'Enter the sheet number for reference.'
  },
  {
    name: 'New NCR Issue No',
    description: 'Number for the newly issued NCR.',
    action: 'Enter the new NCR issue number.'
  },
  {
    name: 'Close Approved by',
    description: 'Name of the person who approved the closure.',
    action: 'Enter the name of the approver.'
  },
  {
    name: 'Close Approved Date',
    description: 'Date when the closure was approved.',
    action: 'Select the date when the closure was approved.'
  },
  {
    name: 'Verif Chied',
    description: 'Verification chief details.',
    action: 'Enter the name or details of the verification chief.'
  },
  {
    name: 'Verif Date',
    description: 'Date of verification.',
    action: 'Select the date when verification occurred.'
  },
  {
    name: 'Remark',
    description: 'Additional remarks or comments.',
    action: 'Enter any additional remarks related to the NCR.'
  }

];
fields = [
  { field: 'Audit Plan Number', description: 'Enter the Audit Plan Number. This number is unique to each audit plan and helps in tracking and referencing the specific audit.' },
  { field: 'NCR Number', description: 'Enter the NCR (Non-Conformance Report) Number as per the procedure outlined in WI/E-0902-01, Section 7.3.6. This number is crucial for identifying and referencing the specific non-conformance report.' },
  { field: 'Issuing Date', description: 'Enter the date on which the NCR is issued. This date is important for tracking the timeline and ensuring timely resolution of the non-conformance.' },
  { field: 'Responsible Office', description: 'Indicate the office or department that holds primary responsibility for addressing the finding. This ensures that the correct unit is accountable for corrective actions.' },
  { field: 'Type of Audit', description: 'Specify the type of audit being conducted (e.g., internal audit, external audit, supplier audit). This helps in categorizing the NCR and applying appropriate standards and procedures.' },
  { field: 'Procedure/Requirement', description: 'Mention the specific procedure or requirement that is being audited. This links the NCR to the relevant audit criteria and standards.' },
  { field: 'Level of Finding', description: 'Indicate the severity level of the finding (e.g., Level 1, Level 2, Level 3). This classification helps prioritize the NCR based on its impact.' },
  { field: 'Findings Confirmation', description: 'Select one option to confirm the findings.' },
  { field: 'Answer Deadline', description: 'Enter the deadline for providing a response to the NCR. This ensures timely follow-up and resolution.' },
  { field: 'Finding Condition', description: 'Describe the condition observed during the audit that led to the finding. Provide detailed and clear information to ensure understanding.' },
  { field: 'Issuer Information', description: 'Enter the name of the person who performed the audit and issued the NCR. Include the date of issuance and provide a signature.' },
  { field: 'Acceptance by Audited Person', description: 'The audited person should acknowledge the NCR by signing and dating the form. This indicates that they understand and accept the non-conformance identified.' },
  { field: 'Root Cause Analysis', description: 'Identify and document the root cause of the finding. This helps in understanding the underlying issue and preventing recurrence.' },
  { field: 'Corrective Actions', description: 'Outline the corrective actions to be taken to address the non-conformance. This ensures that the issue is resolved effectively.' },
  { field: 'Preventive Actions', description: 'Describe the preventive actions that will be implemented to prevent the non-conformance from recurring. This promotes continuous improvement.' },
  { field: 'Implementation Date', description: 'Enter the date by which the corrective action will be implemented. This helps in tracking progress and ensuring accountability.' },
  { field: 'Audited Person Signature', description: 'The audited person should sign to confirm the implementation of the corrective action.' },
  { field: 'Auditor Information', description: 'Enter the name of the auditor who verified the corrective action. Include the date and provide a signature.' },
  { field: 'Corrective Action Closure', description: 'Indicate whether the corrective action has been completed and closed. This confirms that the non-conformance has been addressed.' },
  { field: 'Effectiveness Status', description: 'Choose the effectiveness status of the corrective action (e.g., Effective, Not Effective). This helps in assessing the impact of the corrective measures.' },
  { field: 'Verification Document Number', description: 'Provide the verification document number that references the corrective action process. This links the NCR to relevant documentation.' },
  { field: 'New NCR Issue Number', description: 'Enter the new NCR issue number if additional non-conformances are identified during the verification process.' },
  { field: 'Approval Information', description: 'Enter the name of the person who approved the NCR. Include the date of approval and provide a signature. This finalizes the NCR process.' }
]
items = [
  // Example items, replace with real data
  { id_ior: 1, subject_ior: 'Subject 1', occur_nbr: '12345', occur_date: '2024-07-30', reference_ior: 'REF123', to_uic: 'UIC001', cc_uic: 'UIC002', category_ior: 'Category 1', type_or_phone_number: 'Type 1', level_type: 'Level 1', detail_occurrence: 'Detail 1', reported_by: 'User 1', reporter_uic: 'UIC003', report_date: '2024-07-30', report_identify: 'Identity 1', data_reference: 'Data 1', hirac_process: 'Yes', initial_probability: 'Low', initial_severity: 'Medium', initial_riskindex: '1', current_probability: 'Low', current_severity: 'Medium', current_riskindex: '1' }
];

exportToExcel() {
  // Implement export to Excel functionality
  console.log('Export to Excel');
}
auditselectedTab: string = 'ncrform';
   auditselectTab(tab: string) {
    this.auditselectedTab = tab;
  }
  

}

