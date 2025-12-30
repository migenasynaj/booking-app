import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { LoggedUserService } from '../../shared-services/logged-user-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLogOut } from '../../shared-component/user-log-out/user-log-out';

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
  private modalService = inject(NgbModal);
  username!: string | null;

  ngOnInit() {
    this.username = this.loggedUser.getUsername();
  }

  onLogout() {
    const modalRef = this.modalService.open(UserLogOut, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.closed.subscribe((confirmLogOut) => {
      if (!confirmLogOut) return;
      this.authenticationService.logout();
      this.router.navigate(['/auth']);
    });
  }
}
