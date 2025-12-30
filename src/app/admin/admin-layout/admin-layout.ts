import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLogOut } from '../../shared-component/user-log-out/user-log-out';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  // onLogout() {
  //   this.authenticationService.logout();
  //   this.router.navigate(['/auth']);
  // }
  onLogout() {
    const modalRef = this.modalService.open(UserLogOut, {
      centered: true,
    });

    modalRef.result.then((confirmed) => {
      if (confirmed) {
        this.authenticationService.logout();
        this.router.navigate(['/auth']);
      }
    });
  }
}
