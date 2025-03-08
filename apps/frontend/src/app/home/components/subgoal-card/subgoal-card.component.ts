import { Component, model, OnInit, output } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { Subgoal } from '../../../shared/services/data-access/subgoal/models/subgoal.model';

@Component({
  selector: 'app-subgoal-card',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './subgoal-card.component.html',
  styleUrl: './subgoal-card.component.scss',
})
export class SubgoalCardComponent implements OnInit {

  name: string;
  description: string;
  subgoal = model<Subgoal>();
  subgoalDeleted = output<Subgoal>();

  ngOnInit(): void {
    this.name = this.subgoal().name;
    this.description = this.subgoal().metadata?.description;
  }

  deleteSubgoal(): void {
    this.subgoalDeleted.emit(this.subgoal());
  }

  editSubgoal(): void {}
}
