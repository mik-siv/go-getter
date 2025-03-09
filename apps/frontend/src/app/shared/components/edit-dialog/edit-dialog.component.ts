import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { Subgoal } from '../../services/data-access/subgoal/models/subgoal.model';
import { SubgoalEditForm } from './models/SubgoalEditForm';

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.scss',
})
export class EditDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditDialogComponent>);
  protected dialogData: Subgoal = inject(MAT_DIALOG_DATA)
  form: FormGroup<SubgoalEditForm>;
  readonly inputMinLength = 1;
  readonly inputMaxLength = 255;

  ngOnInit(): void {
    this.form = this.fb.group({
        name: [this.dialogData?.name, { validators: [Validators.required, Validators.minLength(this.inputMinLength), Validators.maxLength(this.inputMaxLength)] }],
        description: [this.dialogData?.metadata.description, { validators: [Validators.required, Validators.minLength(this.inputMinLength), Validators.maxLength(this.inputMaxLength)] }],
      },
    );
  }

  onConfirm(): void {
    this.dialogRef.close({
      name: this.form.get('name').value,
      description: this.form.get('description').value,
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
