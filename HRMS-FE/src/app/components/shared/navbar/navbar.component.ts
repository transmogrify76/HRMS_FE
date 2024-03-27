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
    // const authToken = sessionStorage.getItem('authToken');
    // this.submitted = true;
    // if (authToken) {
    //   setTimeout(() => {
    //     this.authService.logout(authToken as string).subscribe(response => {
    //       if (response || response.success) {
    //         this.router.navigate(['/login']);
    //         sessionStorage.removeItem('authToken');
    //         this.toastr.success('Logged out successfully', '', {
    //           positionClass: 'toast-bottom-center'
    //         });
    //       } else {
    //         console.error('Logout failed:', response && response.error ? response.error : 'Unknown error');
    //         this.submitted = false;
    //       }
    //     }, error => {
    //       console.error('An error occurred during logout:', error);
    //       this.submitted = false;
    //     });
    //   }, 1000);
    // } else {
    //   console.warn('No auth token found in session storage');
    //   this.router.navigate(['/login']);
    //   this.submitted = false;
    // }
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
