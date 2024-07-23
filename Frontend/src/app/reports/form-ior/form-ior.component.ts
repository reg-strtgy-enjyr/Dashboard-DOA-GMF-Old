import { Component, OnInit, forwardRef } from '@angular/core';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { ControlValueAccessor,NG_VALUE_ACCESSOR} from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-form-ior',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './form-ior.component.html',
  styleUrl: './form-ior.component.css'
})
export class FormIORComponent implements OnInit {

  accountid: string | null = null;
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
}

@Component({
  selector: 'app-custom-date-input',
  template: `
    <input type="text" [value]="value" (input)="onInput($event)" placeholder="YYYY-MM-SSS"/>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateInputComponent),
      multi: true
    }
  ]
})
export class CustomDateInputComponent implements ControlValueAccessor {
  value: string = '';

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatDate(input.value);
    this.value = formattedValue;
    this.onChange(formattedValue);
  }

  formatDate(value: string): string {
    // Simple formatting: YYYY-MM-SSS
    const cleanedValue = value.replace(/\D+/g, ''); // Remove all non-digit characters
    const year = cleanedValue.slice(0, 4);
    const month = cleanedValue.slice(4, 6);
    const milliseconds = cleanedValue.slice(6, 9);
    
    return `${year}-${month}-${milliseconds}`;
  }
}

