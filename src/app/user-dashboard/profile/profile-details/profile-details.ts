import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoggedUserService } from '../../../shared-services/logged-user-service';
import { User } from '../../../shared-model/user-list.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../shared-services/user-service';

@Component({
  selector: 'app-profile-details',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './profile-details.html',
  styleUrl: './profile-details.css',
})
export class ProfileDetails {
  private loggedUser = inject(LoggedUserService);
  private userService = inject(UserService);
  userId!: string;

  user!: User;

  form!: FormGroup;
  loading = true;
  isEditing = false;

  ngOnInit() {
    const id = this.loggedUser.getUserId();

    if (!id) {
      throw new Error('User not found in localStorage');
    }

    this.userId = id;

    this.loadUser();
  }

  private loadUser() {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.user = user;

        this.form = new FormGroup({
          firstName: new FormControl(user.firstName),
          lastName: new FormControl(user.lastName),
          email: new FormControl({ value: user.email, disabled: true }),
          phoneNumber: new FormControl(user.phoneNumber),
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load user:', err);

        this.loading = false;
      },
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancel() {
    this.isEditing = false;
  }

  save() {
    if (this.form.invalid) return;

    const updatedData = this.form.getRawValue();

    this.userService.updateUser(this.userId, updatedData).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;

        const stored = this.loggedUser.getCurrentUser();
        if (stored) {
          localStorage.setItem('user', JSON.stringify({ ...stored, ...updatedUser }));
        }

        this.isEditing = false;
      },
    });
  }
}
