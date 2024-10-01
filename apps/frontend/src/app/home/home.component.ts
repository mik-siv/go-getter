import { Component, computed, DestroyRef, effect, inject, OnInit, Signal } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { ItemListComponent } from '../shared/components/item-list/item-list.component';
import { GoalService } from '../shared/services/data-access/goal/goal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubgoalCardComponent } from './components/subgoal-card/subgoal-card.component';
import { SubgoalListComponent } from './components/subgoal-list/subgoal-list.component';
import { Goal } from '../shared/models/goal.model';
import { AuthService } from '../shared/services/data-access/auth/auth.service';
import { Router } from '@angular/router';
import { RoutePaths } from '../app.routes';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
} from '../shared/components/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ItemListComponent, SubgoalCardComponent, SubgoalListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  goalService = inject(GoalService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  readonly dialog = inject(MatDialog);

  isPending: Signal<boolean> = computed(() => this.goalService.status() === RequestStatus.PENDING);
  goals: Signal<Goal[]> = computed(() => this.goalService.goals());
  contributing_to: Signal<Goal[]> = computed(() => this.goalService.contributing_to());
  activeGoal$: Goal;

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate([RoutePaths.Auth]);
      }
    });
    effect(() => {
      if (Array.isArray(this.goals()) && this.goals().length > 0) {
        this.setActiveGoal(this.goals()[0]);
      } else if (Array.isArray(this.contributing_to()) && this.contributing_to().length > 0) {
        this.setActiveGoal(this.contributing_to()[0]);
      }
    });
  }

  ngOnInit(): void {
    this.fetchGoals();
  }

  setActiveGoal(goal: Goal): void {
    this.activeGoal$ = goal;
  }

  deleteGoal(goal: Goal): void {
    this.openDialog('100', '100')
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
      });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): MatDialogRef<ConfirmationDialogComponent> {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  fetchGoals(): void {
    this.goalService.getGoals().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}
