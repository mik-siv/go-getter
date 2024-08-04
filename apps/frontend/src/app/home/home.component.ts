import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
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

  goalsApiData: Goal[] = [];
  activeGoal$: Goal;

  constructor() {
    effect(() => {
      if(!this.authService.user()){
        this.router.navigate([RoutePaths.Auth])
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
    ).subscribe((goals: Goal[]) => {
      this.goalsApiData = goals;
      if (Array.isArray(this.goalsApiData) && this.goalsApiData.length > 0) {
        this.setActiveGoal(this.goalsApiData[0]);
      }
    });
  }
}
