import { Component, input, output } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { Subgoal } from '../../../shared/services/data-access/subgoal/models/subgoal.model';

@Component({
  selector: 'app-subgoal-card',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './subgoal-card.component.html',
  styleUrl: './subgoal-card.component.scss',
})
export class SubgoalCardComponent {
  subgoal = input<Subgoal>();
  subgoalDeleted = output<Subgoal>();
  subgoalEdit = output<Subgoal>();

  deleteSubgoal(): void {
    this.subgoalDeleted.emit(this.subgoal());
  }

  editSubgoal(): void {
    this.subgoalEdit.emit(this.subgoal());
  }
}
