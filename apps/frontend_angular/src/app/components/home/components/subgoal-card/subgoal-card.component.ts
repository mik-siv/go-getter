import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-subgoal-card',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './subgoal-card.component.html',
  styleUrl: './subgoal-card.component.scss',
})
export class SubgoalCardComponent {
  @Input() name: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() uuid: string = '';

}
