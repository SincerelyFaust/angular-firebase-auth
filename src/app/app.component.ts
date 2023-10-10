import { Component } from '@angular/core';
import { AuthService } from './shared/services/AuthService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-firebase-auth';

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }

  logOut() {
    this.authService.SignOut();
  }
}
