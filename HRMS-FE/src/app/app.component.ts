import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HRMS-FE';
  hideNavbar: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar = this.shouldHideNavbar(event.url);
      }
    });
  }

  shouldHideNavbar(url: string): boolean {
    return url === '/' ||  url === '/login' || url === '/forgot-password';
  }
}
