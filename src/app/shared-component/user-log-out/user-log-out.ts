import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-user-log-out',
  imports: [ɵInternalFormsSharedModule],
  templateUrl: './user-log-out.html',
  styleUrl: './user-log-out.css',
})
export class UserLogOut {
  activeModal = inject(NgbActiveModal);

  onConfirm() {
    this.activeModal.close('confirm');
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
