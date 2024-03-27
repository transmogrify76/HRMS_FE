import { Component, OnInit,HostListener  } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
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
}
