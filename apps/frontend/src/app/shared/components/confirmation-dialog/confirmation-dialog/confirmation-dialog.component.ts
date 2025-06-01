import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogData } from './models/ConfirmationDialogData';

@Component({
    selector: 'app-confirmation-dialog',
    imports: [MaterialModule],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  protected dialogData: ConfirmationDialogData = inject(MAT_DIALOG_DATA)

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
