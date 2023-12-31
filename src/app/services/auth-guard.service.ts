import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}
  canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    const isLoggedIn = this.authService.isLoggedIn;

    if (!isLoggedIn) {
      window.alert(
        'Access denied, you have to be logged in to view this page!'
      );
      this.router.navigate(['login']);
    }
    return true;
  }
}
