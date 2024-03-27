import { Component } from '@angular/core';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent {
  formData: { name: string, id: string } = { name: 'Dummy Name', id: 'Dummy Data' };
}
