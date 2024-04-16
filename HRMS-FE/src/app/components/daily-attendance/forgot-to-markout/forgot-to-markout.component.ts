import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-to-markout',
  templateUrl: './forgot-to-markout.component.html',
  styleUrls: ['./forgot-to-markout.component.scss']
})
export class ForgotToMarkoutComponent {
  constructor(private router: Router) { 
  }
  skip() {
    this.router.navigateByUrl('/home');
  } 
}
