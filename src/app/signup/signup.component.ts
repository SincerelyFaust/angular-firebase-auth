import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import firebaseClient from 'src/common/firebase';

interface PasswordValidationError {
  invalidPassword: boolean;
}

type PasswordValidatorFn = (
  control: AbstractControl
) => PasswordValidationError | null;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  hasSignupError = false;
  signupSuccess = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordValidator(),
        ],
      ],
    });
  }

  signup() {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.valid) {
      const email = this.signupForm.get('email')?.value;
      const password = this.signupForm.get('password')?.value;
      const auth = getAuth(firebaseClient);

      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          this.hasSignupError = false;
          this.signupSuccess = true;
          console.log('Successfully signed up!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 4000);
        })
        .catch(error => {
          console.error('Signup error', error);
          this.hasSignupError = true;
        });
    }
  }

  get passwordControl(): AbstractControl | null {
    return this.signupForm.get('password');
  }

  get emailControl(): AbstractControl | null {
    return this.signupForm.get('email');
  }

  passwordValidator(): PasswordValidatorFn {
    return (control: AbstractControl): PasswordValidationError | null => {
      const password = control.value;

      if (!password) {
        return null;
      }

      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const numberCount = (password.match(/\d/g) || []).length;
      const specialCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || [])
        .length;

      const valid =
        hasUppercase &&
        hasLowercase &&
        hasNumbers &&
        hasSpecialCharacters &&
        numberCount >= 3 &&
        specialCount >= 2;

      if (valid) {
        return null;
      }

      return { invalidPassword: true };
    };
  }
}
