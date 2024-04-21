import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ItemListComponent } from '../shared/item-list/item-list.component';
import { GoalService } from '../../services/restful/goal/goal.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, ItemListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  goalService = inject(GoalService);
  goalsApiData: any[] = [];

  activeGoal = { id: '0', name: 'Default' };

  ngOnInit() {
    this.fetchGoals();
  }

  setActiveGoal(goal: any) {
    this.activeGoal = goal;
  }

  fetchGoals() {
    this.goalService.getGoals().subscribe((goals: any[]) => {
      this.goalsApiData = goals;
    });
    if (Array.isArray(this.goalsApiData) && this.goalsApiData.length > 0) {
      this.setActiveGoal(this.goalsApiData[0]);
    }
  }
}
