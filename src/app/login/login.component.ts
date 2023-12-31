import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';

interface PasswordValidationError {
  invalidPassword: boolean;
}

type PasswordValidatorFn = (
  control: AbstractControl
) => PasswordValidationError | null;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  hasLoginError = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
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

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.auth.logIn(email, password).then(success => {
        if (success === false) this.hasLoginError = true;
      });
    }
  }

  get passwordControl(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  get emailControl(): AbstractControl | null {
    return this.loginForm.get('email');
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
