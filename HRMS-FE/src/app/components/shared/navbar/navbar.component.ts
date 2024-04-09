
import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
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
    sessionStorage.clear();
    this.router.navigate(['/login']);
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
