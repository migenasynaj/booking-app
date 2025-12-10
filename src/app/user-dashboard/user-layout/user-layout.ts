import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { GuesthouseService } from '../../shared-services/guesthouse-service';
import { Subject, takeUntil } from 'rxjs';
import { Guesthouse } from '../../shared-model/guesthouse.model';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);

  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth']);
  }
}
