import { Component, computed, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../shared/material/material.module';
import { ItemListComponent } from '../shared/components/item-list/item-list.component';
import { GoalService } from '../shared/services/data-access/goal/goal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubgoalCardComponent } from './components/subgoal-card/subgoal-card.component';
import { SubgoalListComponent } from './components/subgoal-list/subgoal-list.component';
import { Goal, GoalsList } from '../shared/models/goal.model';
import { AuthService } from '../shared/services/data-access/auth/auth.service';
import { Router } from '@angular/router';
import { RoutePaths } from '../app.routes';
import { RequestStatus } from '../shared/services/data-access/models/RequestStatus';

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

  isPending = computed(() => this.goalService.status() === RequestStatus.PENDING);
  goalsApiData: Goal[] = [];
  contributingToGoalsApiData: Goal[] = [];
  activeGoal$: Goal;

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate([RoutePaths.Auth]);
      }
    });
  }

  ngOnInit() {
    this.fetchGoals();
  }

  setActiveGoal(goal: any) {
    this.activeGoal$ = goal;
  }

  fetchGoals() {
    this.goalService.getGoals().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((goals: GoalsList) => {
      this.goalsApiData = goals.goals;
      this.contributingToGoalsApiData = goals.contributing_to;
      if (Array.isArray(this.goalsApiData) && this.goalsApiData.length > 0) {
        this.setActiveGoal(this.goalsApiData[0]);
      } else if (Array.isArray(this.contributingToGoalsApiData) && this.contributingToGoalsApiData.length > 0) {
        this.setActiveGoal(this.contributingToGoalsApiData[0]);
      }
    });
  }
}
