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
selectedTab: any;
onTabSelect(arg0: string) {
throw new Error('Method not implemented.');
}
  selectTab(tab: string) {
    this.selectedTab = tab;
}
}
