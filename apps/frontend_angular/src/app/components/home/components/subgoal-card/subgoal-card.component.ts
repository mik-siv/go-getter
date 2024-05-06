import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { Subgoal } from '../../../../models/goal.model';

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
  @Input() subgoal: Subgoal;

  ngOnInit(): void {
    this.name = this.subgoal.name;
    this.description = this.subgoal.metadata?.description;
  }
}
