import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth']);
  }
}
