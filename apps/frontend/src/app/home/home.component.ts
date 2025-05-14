import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal, Signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { RoutePaths } from '../app.routes';
import {
  ConfirmationDialogComponent,
} from '../shared/components/confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {
  ConfirmationDialogData,
} from '../shared/components/confirmation-dialog/confirmation-dialog/models/ConfirmationDialogData';
import { EditDialogComponent } from '../shared/components/edit-dialog/edit-dialog.component';
import { ItemListComponent } from '../shared/components/item-list/item-list.component';
import { MaterialModule } from '../shared/material/material.module';
import { BrowserDetectorService } from '../shared/services/common/browser-detector/browser-detector.service';
import { AuthStateService } from '../shared/services/data-access/auth/state/auth-state.service';
import { GoalService } from '../shared/services/data-access/goal/goal.service';
import { Goal } from '../shared/services/data-access/goal/models/goal.model';
import { GoalStateService } from '../shared/services/data-access/goal/state/goal-state.service';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';
import { Subgoal } from '../shared/services/data-access/subgoal/models/subgoal.model';
import { SubgoalStateService } from '../shared/services/data-access/subgoal/state/subgoal-state.service';
import { SubgoalService } from '../shared/services/data-access/subgoal/subgoal.service';
import { User } from '../shared/services/data-access/user/models/user.model';
import { UserStateService } from '../shared/services/data-access/user/state/user-state.service';
import { SubgoalListComponent } from './components/subgoal-list/subgoal-list.component';

@Component({
  selector: 'app-home',
  imports: [MaterialModule, ItemListComponent, SubgoalListComponent, NgClass, NgTemplateOutlet],
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
  sideNav: Signal<MatSidenav> = viewChild('sideNav');

  isPending: Signal<boolean> = computed(() => this.goalStateService.status() === RequestStatus.PENDING);
  isSubgoalPending = computed(() => this.subgoalStateService.status() === RequestStatus.PENDING);
  goals: Signal<Goal[]> = computed(() => Object.values(this.goalStateService.goals()));
  contributing_to: Signal<Goal[]> = computed(() => Object.values(this.goalStateService.contributing_to()));
  currentUser: Signal<User> = computed(() => this.userStateService.user());
  activeGoal = signal<Goal>(null);
  protected isMobile = inject(BrowserDetectorService).$isMobile;

  sideNavOpened = true;

  constructor() {
    effect(() => {
      if (!this.authStateService.isAuthenticated()) {
        this.router.navigate([RoutePaths.Auth]);
      }
    });
    effect(() => {
      if (this.goals() && !this.activeGoal())
        this.populateActiveGoal();
    });
  }

  ngOnInit(): void {
    this.fetchGoals();
  }

  setActiveGoal(goal: Goal): void {
    this.activeGoal.set(goal);
    this.closeSideNavOnMobile();
  }

  isGoalListEmpty(goalsList: Goal[]): boolean {
    return Array.isArray(goalsList) && goalsList.length > 0;
  }

  closeSideNavOnMobile(): void {
    if (this.isMobile()) this.sideNav().close();
  }

  populateActiveGoal(): void {
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
    this.dialog.open(EditDialogComponent, {
      width: '500px',
    }).afterClosed().pipe(
      filter(data => !!data),
      map((result) => ({
        name: result.name,
        metadata: {
          description: result.description,
        },
        private: true,
        goalIds: [this.activeGoal().id],
      })),
      switchMap((subgoal) => this.subgoalService.createSubgoal(subgoal)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((result) => {
      this.activeGoal.update(current => ({ ...current, subgoals: [...current.subgoals, result] }));
    });
  }

  deleteSubgoal(subgoal: Subgoal): void {
    const dialogPrompt = {
      title: 'Are you sure?',
      content: `Do you want to delete subgoal '${subgoal.name}'?`,
    };
    this.openDialog('100', '100', dialogPrompt)
      .afterClosed()
      .pipe(
        filter((result) => !!result),
        switchMap(() => this.subgoalService.deleteSubgoal(subgoal.id)),
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(() => {
      this.activeGoal.update(current => ({ ...current, subgoals: current.subgoals.filter(s => s.id !== subgoal.id) }));
    });
  }

  editSubgoal(subgoal: Subgoal): void {
    this.dialog.open(EditDialogComponent, {
      data: subgoal,
      width: '500px',
    }).afterClosed().pipe(
      filter(data => !!data),
      map((result) => ({ ...subgoal, name: result.name, metadata: { description: result.description } })),
      switchMap((data) => this.subgoalService.updateSubgoal(subgoal.id, data)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((result) => {
      this.activeGoal.update(current => ({
        ...current,
        subgoals: [
          ...current.subgoals.slice(0, current.subgoals.findIndex(s => s.id === subgoal.id)),
          result,
          ...current.subgoals.slice(current.subgoals.findIndex(s => s.id === subgoal.id) + 1),
        ],
      }));
    });
  }

  createGoal(): void {
    this.dialog.open(EditDialogComponent, {
      width: '500px',
    }).afterClosed().pipe(
      filter(data => !!data),
      map((result) => ({
        name: result.name,
        metadata: {
          description: result.description,
        },
        private: true,
      })),
      switchMap((goal) => this.goalService.createGoal(goal)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  updateGoal(goal: Goal): void {
    this.dialog.open(EditDialogComponent, {
      width: '500px',
      data: goal,
    }).afterClosed().pipe(
      filter(data => !!data),
      map((result) => ({
        name: result.name,
        metadata: {
          description: result.description,
        },
      })),
      switchMap((updatedData) => this.goalService.updateGoal(goal.id, updatedData)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(data => this.activeGoal.set(data));
  }

  fetchGoals(): void {
    this.goalService.getGoals().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }
}
