/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, NgZone } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
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

  async logIn(email: string, password: string): Promise<boolean> {
    const auth = getAuth(firebaseClient);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      this.router.navigate(['/products']);
      console.log('Successfully logged in!');
      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const auth = getAuth(firebaseClient);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed up!');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 4000);
      return true;
    } catch (error) {
      console.error('Signup error', error);
      return false;
    }
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
