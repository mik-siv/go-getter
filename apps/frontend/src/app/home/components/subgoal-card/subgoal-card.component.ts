import { Component, DestroyRef, inject, model, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';
import {
  ConfirmationDialogComponent,
} from '../../../shared/components/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {
  ConfirmationDialogData,
} from '../../../shared/components/confirmation-dialog/confirmation-dialog/models/ConfirmationDialogData';
import { MaterialModule } from '../../../shared/material/material.module';
import { Subgoal } from '../../../shared/services/data-access/subgoal/models/subgoal.model';
import { SubgoalService } from '../../../shared/services/data-access/subgoal/subgoal.service';

@Component({
  selector: 'app-subgoal-card',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './subgoal-card.component.html',
  styleUrl: './subgoal-card.component.scss',
})
export class SubgoalCardComponent implements OnInit {
  private subgoalService = inject(SubgoalService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  name: string;
  description: string;
  subgoal = model<Subgoal>();

  ngOnInit(): void {
    this.name = this.subgoal().name;
    this.description = this.subgoal().metadata?.description;
  }

  deleteSubgoal(): void {
    const dialogPrompt = {
      title: 'Are you sure?',
      content: `Do you want to delete subgoal '${this.name}'?`,
    };
    this.openConfirmationDialog('100', '100', dialogPrompt)
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap(() => this.subgoalService.deleteSubgoal(this.subgoal().id)),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe();
  }

  editSubgoal(): void {}

  openConfirmationDialog(enterAnimationDuration: string, exitAnimationDuration: string, prompt: ConfirmationDialogData): MatDialogRef<ConfirmationDialogComponent> {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: prompt,
    });
  }
}
