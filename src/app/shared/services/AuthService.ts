/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, NgZone } from '@angular/core';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import firebaseClient from 'src/common/firebase';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: User | null = null;

  constructor(
    public router: Router,
    public ngZone: NgZone
  ) {
    const firebaseAuth = getAuth(firebaseClient);

    onAuthStateChanged(firebaseAuth, user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user == null) {
      return false;
    } else {
      return true;
    }
  }

  SignOut() {
    const firebaseAuth = getAuth(firebaseClient);
    return signOut(firebaseAuth).then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
