import { Component, inject, Input } from '@angular/core';
import { UserService } from '../../../shared-services/user-service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../shared-model/user-list.model';

@Component({
  selector: 'app-user-details',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails {
  private service = inject(UserService);
  private destroy$ = new Subject<void>();

  private activatedRoute = inject(ActivatedRoute); //reads the current route

  user!: User;
  loading = true;
  error: string | null = null;
  userId!: string;
  successMessage: string | null = null;

  form = new FormGroup({
    firstName: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(2)],
    }),
    lastName: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(2)],
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email, Validators.minLength(5)],
    }),
    phoneNumber: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  get firstNameIsInvalid() {
    return this.form.controls.firstName.touched && this.form.controls.firstName.invalid;
  }

  get lastNameIsInvalid() {
    return this.form.controls.lastName.touched && this.form.controls.lastName.invalid;
  }

  get emailIsInvalid() {
    return this.form.controls.email.touched && this.form.controls.email.invalid;
  }

  get phoneNumberIsInvalid() {
    return this.form.controls.phoneNumber.touched && this.form.controls.phoneNumber.invalid;
  }

  hideSuccessMessage() {
    setTimeout(() => (this.successMessage = null), 3000);
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id')!;

    this.service
      .getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user = data;

          this.form.patchValue({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
          });

          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load user.';
          this.loading = false;
        },
      });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updatedUser: User = {
      ...this.user,
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.form.value.email!,
      phoneNumber: this.form.value.phoneNumber!,
    };
    this.service
      .updateUser(this.userId, updatedUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'User saved successfully!';
          this.hideSuccessMessage();
          //  this.userId
        },
        error: () => {
          this.error = 'Failed to update user.';
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
