import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { Subgoal } from '../../../../../shared/services/data-access/subgoal/models/subgoal.model';
import { SubgoalEditForm } from './models/SubgoalEditForm';

@Component({
  selector: 'app-subgoal-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule],
  templateUrl: './subgoal-edit-dialog.component.html',
  styleUrl: './subgoal-edit-dialog.component.scss',
})
export class SubgoalEditDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  subgoal = input<Subgoal>();
  form: FormGroup<SubgoalEditForm>;
  readonly inputMinLength = 1;
  readonly inputMaxLength = 256;

  ngOnInit(): void {
    this.form = this.fb.group({
        name: [this.subgoal().name, { validators: [Validators.required, Validators.minLength(this.inputMinLength), Validators.maxLength(this.inputMaxLength)] }],
        description: [this.subgoal().metadata.description, { validators: [Validators.required, Validators.minLength(this.inputMinLength), Validators.maxLength(this.inputMaxLength)] }],
      },
    );
  }
}
