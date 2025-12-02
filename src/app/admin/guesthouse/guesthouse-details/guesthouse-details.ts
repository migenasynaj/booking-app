import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GuesthouseService } from '../guesthouse-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Guesthouse, GuesthouseCreateModel } from '../g-model/guesthouse.model';

@Component({
  selector: 'app-guesthouse-details',
  imports: [ReactiveFormsModule],
  templateUrl: './guesthouse-details.html',
  styleUrl: './guesthouse-details.css',
})
export class GuesthouseDetails {
  @Input() guesthouseId!: number;
  @Input() guesthouseName!: string;
  @Input() mode: 'edit' | 'create' | 'delete' = 'edit';

  private service = inject(GuesthouseService);
  activeModal = inject(NgbActiveModal);

  guesthouse!: Guesthouse;
  loading = true;
  error: string | null = null;

  form = new FormGroup({
    id: new FormControl<number | null>(null),
    name: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(20), Validators.minLength(3)],
    }),
    description: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(60), Validators.minLength(10)],
    }),
  });

  get nameIsInvalid() {
    return this.form.controls.name.touched && this.form.controls.name.invalid;
  }

  get descriptionIsInvalid() {
    return this.form.controls.description.touched && this.form.controls.description.invalid;
  }

  private createEmptyGuesthouse(): Guesthouse {
    return {
      id: 0,
      name: '',
      description: '',
    };
  }

  ngOnInit() {
    console.log('MODE:', this.mode);
    if (this.mode === 'edit') {
      this.service.getGuesthouseById(this.guesthouseId).subscribe({
        next: (data) => {
          this.guesthouse = data;

          this.form.patchValue({
            name: data.name,
            description: data.description,
          });

          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load guesthouse details';
          this.loading = false;
        },
      });
    }

    if (this.mode === 'delete') {
      this.loading = false;
    }

    if (this.mode === 'create') {
      this.guesthouse = this.createEmptyGuesthouse();

      this.loading = false;
      return;
    }
  }

  onSave() {
    if (this.form.invalid) {
      // console.log('invalid form!', this.form.getRawValue());
      this.form.markAllAsTouched();
      return;
    }
    const updatedGuesthouse: Guesthouse = {
      ...this.guesthouse,
      name: this.form.value.name!,
      description: this.form.value.description!,
    };
    this.service.updateGuesthouse(this.guesthouseId, updatedGuesthouse).subscribe({
      next: () => this.activeModal.close('saved'),
      error: () => alert('Failed to update guesthouse'),
    });
  }

  onDelete() {
    this.service.deleteGuesthouseById(this.guesthouseId).subscribe({
      next: () => this.activeModal.close('deleted'),
      error: () => alert('Failed to delete guesthouse'),
    });
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  onCreate() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newGuesthouse: GuesthouseCreateModel = {
      name: this.form.getRawValue().name!,
      description: this.form.getRawValue().description!,
    };

    this.service.createGuesthouse(newGuesthouse).subscribe({
      next: () => this.activeModal.close('created'),
      error: () => alert('Failed to create guesthouse'),
    });
  }
}
