import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { LoginRequest } from './auth.model/login.model';
import { Router } from '@angular/router';
import { RegisterRequest } from './auth.model/register.model';

@Component({
  selector: 'app-authentication',
  imports: [ReactiveFormsModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  mode: 'login' | 'register' = 'login';

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  get emailIsInvalid() {
    return this.loginForm.controls.email.touched && this.loginForm.controls.email.invalid;
  }
  get passwordIsInvalid() {
    return this.loginForm.controls.password.touched && this.loginForm.controls.password.invalid;
  }

  registerForm = new FormGroup({
    firstName: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(2)],
    }),
    lastName: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(2)],
    }),
    username: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(20), Validators.minLength(2)],
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.pattern(
          '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;\'?/><.,])(?!.*\\s).{6,10}$'
        ),
      ],
    }),
    phoneNumber: new FormControl<string>('', {
      validators: [Validators.required, Validators.pattern('^[0-9]{8,15}$')],
    }),
  });

  get firstNameIsInvalid() {
    return (
      this.registerForm.controls.firstName.touched && this.registerForm.controls.firstName.invalid
    );
  }
  get lastNameIsInvalid() {
    return (
      this.registerForm.controls.lastName.touched && this.registerForm.controls.lastName.invalid
    );
  }
  get usernameIsInvalid() {
    return (
      this.registerForm.controls.username.touched && this.registerForm.controls.username.invalid
    );
  }
  get emailInvalid() {
    return this.registerForm.controls.email.touched && this.registerForm.controls.email.invalid;
  }
  get passwordInvalid() {
    return (
      this.registerForm.controls.password.touched && this.registerForm.controls.password.invalid
    );
  }
  get phoneNumberInvalid() {
    return (
      this.registerForm.controls.phoneNumber.touched &&
      this.registerForm.controls.phoneNumber.invalid
    );
  }

  switchMode(mode: 'login' | 'register') {
    this.mode = mode;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authenticationService.login(loginRequest).subscribe({
      next: (res) => {
        console.log('Logged in!', res);
        this.router.navigate(['/admin']);
      },
      error: () => alert('Invalid login credentials.'),
    });
  }

  // onLogout() {
  //   this.authenticationService.logout();
  //   this.router.navigate(['/authentication']); // or your login route
  // }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerRequest: RegisterRequest = {
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      username: this.registerForm.value.username!,
      email: this.registerForm.value.email!,
      phoneNumber: this.registerForm.value.phoneNumber!,
      password: this.registerForm.value.password!,
    };

    this.authenticationService.register(registerRequest).subscribe({
      next: (res) => {
        console.log('Registered!', res);
        this.router.navigate(['/admin']);
      },
      error: () => alert('Registration failed'),
    });
  }
}
