import { Component } from '@angular/core';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-user-guide',
  standalone: true,
  imports: [FooterComponent, NavbarComponent],
  templateUrl: './user-guide.component.html',
  styleUrl: './user-guide.component.css'
})
export class UserGuideComponent {

}
