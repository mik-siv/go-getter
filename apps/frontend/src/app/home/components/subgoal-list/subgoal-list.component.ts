import { Component, inject, Input, output } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { BrowserDetectorService } from '../../../shared/services/common/browser-detector/browser-detector.service';
import { Goal } from '../../../shared/services/data-access/goal/models/goal.model';
import { Subgoal } from '../../../shared/services/data-access/subgoal/models/subgoal.model';
import { SubgoalCardComponent } from '../subgoal-card/subgoal-card.component';

@Component({
  selector: 'app-subgoal-list',
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
  protected isMobile = inject(BrowserDetectorService).isMobile();
  subgoalDelete = output<Subgoal>();
  subgoalEdit = output<Subgoal>();
}
