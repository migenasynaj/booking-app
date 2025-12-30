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

  errorMessageUsername: string | null = null;
  errorMessageEmail: string | null = null;
  errorMessage: string | null = null;

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

  ngOnInit() {
    const token = this.authenticationService.getToken();

    if (token) {
      const user = JSON.parse(localStorage.getItem('user')!);

      if (user.role === 'Admin') {
        this.router.navigate(['/admin/'], { replaceUrl: true });
      } else {
        this.router.navigate(['/user'], { replaceUrl: true });
      }
    }
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

    this.authenticationService.loginUser(loginRequest).subscribe({
      next: (res) => {
        // console.log('Logged in!', res);
        if (res.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        alert('Invalid login credentials.');
      },
    });
  }

  hideErrorMessage() {
    setTimeout(() => {
      this.errorMessageEmail = null;
      this.errorMessageUsername = null;
      this.errorMessage = null;
    }, 3000);
  }

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

    this.authenticationService.registerUser(registerRequest).subscribe({
      next: (res) => {
        this.router.navigate(['user']);
      },
      error: (err) => {
        if (err.status === 400) {
          const errors = err.error?.errors;

          if (!errors) {
            this.errorMessage = 'Something went wrong. Please try again.';
            this.hideErrorMessage();
            return;
          }

          errors.forEach((msg: string) => {
            const lower = msg.toLowerCase();

            if (lower.includes('email')) {
              this.errorMessageEmail = msg;
            } else if (lower.includes('username')) {
              this.errorMessageUsername = msg;
            } else {
              this.errorMessage = msg;
            }
          });
          this.hideErrorMessage();
        }
      },
    });
  }
}
