import { Component, inject } from '@angular/core';
import { UserService } from '../../../shared-services/user-service';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../shared-model/user-list.model';
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
  state: 'loading' | 'error' | 'empty' | 'data' = 'loading';
  message!: string;

  editUser(id: string) {
    this.router.navigate(['/admin/users', id]);
  }

  ngOnInit() {
    this.state = 'loading';
    this.userService
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user = data;
          if (data.length === 0) {
            this.state = 'empty';
          } else {
            this.state = 'data';
          }
        },
        error: () => {
          this.error = 'Failed to load users. Please try again later.';
          this.state = 'error';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
