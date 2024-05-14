import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ItemListComponent } from '../shared/item-list/item-list.component';
import { GoalService } from '../../services/restful/goal/goal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubgoalCardComponent } from './components/subgoal-card/subgoal-card.component';
import { SubgoalListComponent } from './components/subgoal-list/subgoal-list.component';
import { Goal } from '../../models/goal.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ItemListComponent, SubgoalCardComponent, SubgoalListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  goalService = inject(GoalService);
  goalsApiData: Goal[] = [];
  destroyRef = inject(DestroyRef);

  activeGoal$: Goal;

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
