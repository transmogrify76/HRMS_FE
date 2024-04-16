import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-markin',
  templateUrl: './forgot-markin.component.html',
  styleUrls: ['./forgot-markin.component.scss']
})
export class ForgotMarkinComponent {
  constructor(private router: Router) { 
  }

  skip() {
    this.router.navigateByUrl('/home');
  }  
}
