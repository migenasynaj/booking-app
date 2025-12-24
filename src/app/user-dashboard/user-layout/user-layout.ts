import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { LoggedUserService } from '../../shared-services/logged-user-service';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private loggedUser = inject(LoggedUserService);

  username!: string | null;

  ngOnInit() {
    this.username = this.loggedUser.getUsername();
  }
  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth']);
  }
}
