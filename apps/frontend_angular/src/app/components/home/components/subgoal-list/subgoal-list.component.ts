import { Component, Input } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { SubgoalCardComponent } from '../subgoal-card/subgoal-card.component';
import { Goal } from '../../../../models/goal.model';

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
}
