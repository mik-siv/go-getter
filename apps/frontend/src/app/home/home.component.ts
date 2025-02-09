import { Component, computed, DestroyRef, effect, inject, OnInit, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { RoutePaths } from '../app.routes';
import {
  ConfirmationDialogComponent,
} from '../shared/components/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {
  ConfirmationDialogData,
} from '../shared/components/confirmation-dialog/confirmation-dialog/models/ConfirmationDialogData';
import { ItemListComponent } from '../shared/components/item-list/item-list.component';
import { MaterialModule } from '../shared/material/material.module';
import { AuthStateService } from '../shared/services/data-access/auth/state/auth-state.service';
import { GoalService } from '../shared/services/data-access/goal/goal.service';
import { Goal } from '../shared/services/data-access/goal/models/goal.model';
import { GoalStateService } from '../shared/services/data-access/goal/state/goal-state.service';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';
import { SubgoalStateService } from '../shared/services/data-access/subgoal/state/subgoal-state.service';
import { SubgoalService } from '../shared/services/data-access/subgoal/subgoal.service';
import { User } from '../shared/services/data-access/user/models/user.model';
import { UserStateService } from '../shared/services/data-access/user/state/user-state.service';
import {
  SubgoalEditDialogComponent,
} from './components/subgoal-card/components/subgoal-edit-dialog/subgoal-edit-dialog.component';
import { SubgoalListComponent } from './components/subgoal-list/subgoal-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ItemListComponent, SubgoalListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  goalService = inject(GoalService);
  subgoalService = inject(SubgoalService);
  subgoalStateService = inject(SubgoalStateService);
  goalStateService = inject(GoalStateService);
  userStateService = inject(UserStateService);
  authStateService = inject(AuthStateService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  readonly dialog = inject(MatDialog);

  isPending: Signal<boolean> = computed(() => this.goalStateService.status() === RequestStatus.PENDING);
  isSubgoalPending = computed(() => this.subgoalStateService.status() === RequestStatus.PENDING);
  goals: Signal<Goal[]> = computed(() => Object.values(this.goalStateService.goals()));
  contributing_to: Signal<Goal[]> = computed(() => Object.values(this.goalStateService.contributing_to()));
  currentUser: Signal<User> = computed(() => this.userStateService.user());
  activeGoal: Goal;
  sideNavOpened = true;

constructor() {
  effect(() => {
    if (!this.authStateService.isAuthenticated()) {
      this.router.navigate([RoutePaths.Auth]);
    }
  });
  effect(() => {
      this.populateActiveGoal();
    });
  }

  ngOnInit(): void {
    this.fetchGoals();
  }

  setActiveGoal(goal: Goal): void {
    this.activeGoal = goal;
  }

  isGoalListEmpty(goalsList: Goal[]): boolean {
    return Array.isArray(goalsList) && goalsList.length > 0;
  }

  populateActiveGoal() {
    if (this.isGoalListEmpty(this.goals())) {
      this.setActiveGoal(this.goals()[0]);
    } else if (this.isGoalListEmpty(this.contributing_to())) {
      this.setActiveGoal(this.contributing_to()[0]);
    }
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

  createSubgoal(): void {
    this.dialog.open(SubgoalEditDialogComponent, {
      width: '500px',
    }).afterClosed().pipe(
      filter(data => !!data),
      map((result) => ({
        name: result.name,
        metadata: {
          description: result.description,
        },
        private: true,
        goalIds: [this.activeGoal.id],
      })),
      switchMap((subgoal) => this.subgoalService.createSubgoal(subgoal)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  fetchGoals(): void {
    this.goalService.getGoals().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}
