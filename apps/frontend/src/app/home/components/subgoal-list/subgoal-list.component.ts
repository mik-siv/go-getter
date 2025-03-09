import { Component, Input, output } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { Goal } from '../../../shared/services/data-access/goal/models/goal.model';
import { Subgoal } from '../../../shared/services/data-access/subgoal/models/subgoal.model';
import { SubgoalCardComponent } from '../subgoal-card/subgoal-card.component';

@Component({
  selector: 'app-subgoal-list',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    SubgoalCardComponent,
  ],
  templateUrl: './subgoal-list.component.html',
  styleUrl: './subgoal-list.component.scss',
})
export class SubgoalListComponent {
  @Input() activeGoal: Goal;
  subgoalDelete = output<Subgoal>();
  subgoalEdit = output<Subgoal>();
}
