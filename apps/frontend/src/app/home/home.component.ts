import { Component, computed, DestroyRef, effect, inject, OnInit, Signal } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { ItemListComponent } from '../shared/components/item-list/item-list.component';
import { GoalService } from '../shared/services/data-access/goal/goal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubgoalCardComponent } from './components/subgoal-card/subgoal-card.component';
import { SubgoalListComponent } from './components/subgoal-list/subgoal-list.component';
import { Goal } from '../shared/models/goal.model';
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
import { User } from '../shared/models/user.model';
import { UserStateService } from '../shared/services/data-access/user/state/user-state.service';
import { GoalStateService } from '../shared/services/data-access/goal/state/goal-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ItemListComponent, SubgoalCardComponent, SubgoalListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  goalService = inject(GoalService);
  goalStateService = inject(GoalStateService);
  userStateService = inject(UserStateService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  readonly dialog = inject(MatDialog);

  isPending: Signal<boolean> = computed(() => this.goalStateService.status() === RequestStatus.PENDING);
  goals: Signal<Goal[]> = computed(() => this.goalStateService.goals());
  contributing_to: Signal<Goal[]> = computed(() => this.goalStateService.contributing_to());
  currentUser: Signal<User> = computed(() => this.userStateService.user());
  activeGoal$: Goal;

  constructor() {
    effect(() => {
      if (!this.userStateService.user()) {
        this.router.navigate([RoutePaths.Auth]);
      }
    });
    effect(() => {
      if (this.isGoalListEmpty(this.goals())) {
        this.setActiveGoal(this.goals()[0]);
      } else if (this.isGoalListEmpty(this.contributing_to())) {
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

  isGoalListEmpty(goalsList: Goal[]): boolean {
    return Array.isArray(goalsList) && goalsList.length > 0;
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
