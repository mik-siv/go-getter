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
import {
  ConfirmationDialogData,
} from '../shared/components/confirmation-dialog/confirmation-dialog/models/ConfirmationDialogData';
import { UserService } from '../shared/services/data-access/user/user.service';
import { User } from '../shared/models/user.model';

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
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  readonly dialog = inject(MatDialog);

  isPending: Signal<boolean> = computed(() => this.goalService.status() === RequestStatus.PENDING);
  goals: Signal<Goal[]> = computed(() => this.goalService.goals());
  contributing_to: Signal<Goal[]> = computed(() => this.goalService.contributing_to());
  currentUser: Signal<User> = computed(() => this.authService.user());
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

  getDialogPrompt(goal: Goal, isContributingToGoal: boolean): ConfirmationDialogData {
    const content = isContributingToGoal ? `Do you want to stop contributing to '${goal.name}'?` : `Do you want to delete goal '${goal.name}'?`;
    return {
      title: 'Are you sure?',
      content,
    };
  }

  handleGoalDeletion(goal: Goal): void {
    this.openDialog('100', '100', this.getDialogPrompt(goal, false))
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.deleteGoal(goal);
        }
      });
  }

  handleRemoveGoalContribution(goal: Goal): void {
    this.openDialog('100', '100', this.getDialogPrompt(goal, true))
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          this.removeGoalContribution(goal);
        }
      });
  }

  deleteGoal(goal: Goal): void {
    this.goalService.deleteGoal(goal.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  removeGoalContribution(goal: Goal): void {
    this.goalService.removeGoalContributor(goal.id, this.currentUser().id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, prompt: ConfirmationDialogData): MatDialogRef<ConfirmationDialogComponent> {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: prompt,
    });
  }

  fetchGoals(): void {
    this.goalService.getGoals().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}
