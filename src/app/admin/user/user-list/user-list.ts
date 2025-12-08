import { Component, inject } from '@angular/core';
import { UserService } from '../user-service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../u-model/user-list.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();
  private router = inject(Router); //navigate different route

  user!: User[];
  error: string | null = null;
  loading = true;

  editUser(id: string) {
    // console.log('Editing user with ID:', id);
    this.router.navigate(['/admin/users', id]);
  }

  ngOnInit() {
    this.userService
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user = data;
        },
        error: () => {
          this.error = 'Failed to load users. Please try again later.';
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
