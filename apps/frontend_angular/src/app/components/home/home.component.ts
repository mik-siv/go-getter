import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ItemListComponent } from '../shared/item-list/item-list.component';
import { GoalService } from '../../services/restful/goal/goal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubgoalCardComponent } from './components/subgoal-card/subgoal-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ItemListComponent, SubgoalCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  goalService = inject(GoalService);
  goalsApiData: any[] = [];
  destroyRef = inject(DestroyRef);

  activeGoal = { id: '0', name: 'Default', subgoals: [{ id: '0', name: 'Default', description: 'Default' }] };

  ngOnInit() {
    this.fetchGoals();
  }

  setActiveGoal(goal: any) {
    this.activeGoal = goal;
  }

  fetchGoals() {
    this.goalService.getGoals().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((goals: any[]) => {
      this.goalsApiData = goals;
      if (Array.isArray(this.goalsApiData) && this.goalsApiData.length > 0) {
        this.setActiveGoal(this.goalsApiData[0]);
      }
    });
  }
}
