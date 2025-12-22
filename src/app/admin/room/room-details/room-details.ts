import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Room } from '../../../shared-model/room-list.model';
import { Amenities } from '../../../shared-model/enum';
import { RoomService } from '../../../shared-services/room-service';
import { CreateRoomModel } from '../r-model/create-room-list.model';

@Component({
  selector: 'app-room-details',
  imports: [ReactiveFormsModule],
  templateUrl: './room-details.html',
  styleUrl: './room-details.css',
})
export class RoomDetails {
  private service = inject(RoomService);
  activeModal = inject(NgbActiveModal);

  @Input() roomId!: number;
  @Input() guesthouseId!: number;
  @Input() guesthouseName!: string;
  @Input() mode: 'create' | 'edit' | 'delete' = 'create';
  @Input() roomName!: string;

  room!: Room;
  loading = true;
  error: string | null = null;

  form = new FormGroup({
    name: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(50), Validators.minLength(3)],
    }),
    description: new FormControl<string>('', {
      validators: [Validators.required, Validators.maxLength(500), Validators.minLength(10)],
    }),
    image: new FormControl<string>(''),
    price: new FormControl<number | null>(null, {
      validators: [Validators.maxLength(0.01)],
    }),
    numberOfBeds: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.maxLength(10), Validators.minLength(1)],
    }),
    amenities: new FormControl<Amenities[]>([], { validators: [Validators.required] }),
    guesthouseName: new FormControl<string | null>(null),
  });

  get nameIsInvalid() {
    return this.form.controls.name.touched && this.form.controls.name.invalid;
  }

  get descriptionIsInvalid() {
    return this.form.controls.description.touched && this.form.controls.description.invalid;
  }

  get numberOfBedsIsInvalid() {
    return this.form.controls.numberOfBeds.touched && this.form.controls.numberOfBeds.invalid;
  }

  amenityValues() {
    return Object.values(Amenities).filter((v) => typeof v === 'number') as number[];
  }

  getAmenityName(a: number): string {
    return Amenities[a];
  }

  onAmenityToggle(value: number, checked: boolean) {
    const current = this.form.value.amenities ?? [];

    if (checked) {
      this.form.controls.amenities.setValue([...current, value]);
    } else {
      this.form.controls.amenities.setValue(current.filter((a) => a !== value));
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const fullBase64 = reader.result as string;
      const base64 = fullBase64.split(',')[1];
      this.form.controls.image.setValue(base64);
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.form.controls.image.setValue('');
  }

  private createEmptyRoom(): Room {
    return {
      id: 0,
      name: '',
      description: '',
      image: '',
      price: 0,
      numberOfBeds: 0,
      guestHouseId: 0,
      amenities: [],
    };
  }

  ngOnInit() {
    console.log('MODE:', this.mode);
    if (this.mode === 'edit') {
      this.service.getRoomById(this.roomId).subscribe({
        next: (data) => {
          this.room = data;

          this.form.patchValue({
            name: data.name,
            description: data.description,
            image: data.image,
            price: data.price,
            numberOfBeds: data.numberOfBeds,
            amenities: data.amenities,
            guesthouseName: this.guesthouseName,
          });

          this.loading = false;
        },

        error: () => {
          (this.error = 'Failed to load room details'), (this.loading = false);
        },
      });
    }

    if (this.mode === 'delete') {
      this.loading = false;
    }

    if (this.mode === 'create') {
      this.room = this.createEmptyRoom();

      this.form.patchValue({
        guesthouseName: this.guesthouseName,
      });

      this.loading = false;
      return;
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updatedRoom: Room = {
      ...this.room,
      name: this.form.value.name!,
      description: this.form.value.description!,
      image: this.form.value.image!,
      price: this.form.value.price!,
      numberOfBeds: this.form.value.numberOfBeds!,
      amenities: this.form.value.amenities!,
    };

    this.service.updateRoom(this.roomId, updatedRoom).subscribe({
      next: () => this.activeModal.close('saved'),
      error: () => alert('Failed to update room'),
    });
  }

  onDelete() {
    this.service.deleteRoomById(this.roomId).subscribe({
      next: () => this.activeModal.close('deleted'),
      error: () => alert('Failed to update room'),
    });
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  onCreate() {
    console.log('Is Create Mode:', this.mode === 'create');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newRoom: CreateRoomModel = {
      name: this.form.getRawValue().name!,
      description: this.form.getRawValue().description!,
      image: this.form.getRawValue().image!,
      price: this.form.getRawValue().price!,
      numberOfBeds: this.form.getRawValue().numberOfBeds!,
      amenities: this.form.getRawValue().amenities!,
      guesthouseId: this.guesthouseId,
    };

    this.service.createRoom(newRoom).subscribe({
      next: () => this.activeModal.close('created'),
      error: () => alert('Failed to create guesthouse'),
    });
  }
}
