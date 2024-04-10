
import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
  showSpinner!: boolean;
  constructor( private router: Router) { }

  isDropdownOpen = false;
  submitted = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown() {
    this.isDropdownOpen = false;
  }
  logout() {
    // Show spinner
    this.showSpinner = true;
  
    // Clear session storage
    sessionStorage.clear();
  
    // Hide spinner after 2 seconds and navigate to login page
    setTimeout(() => {
      this.showSpinner = false;
      this.router.navigate(['/login']);
    }, 2000);
  }
  
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.profile-dropdown')) {
      this.closeDropdown();
    }
  }
  myprofile(){
    this.router.navigate(['/my-profile']);
  }
}
