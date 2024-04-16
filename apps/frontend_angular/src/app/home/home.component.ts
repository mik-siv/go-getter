import { Component } from '@angular/core';
import { MaterialModule } from '../material/material.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  goalsApiData = [{
    id: '1',
    name: 'first goal',
    subgoals: [{ name: '1st subgoal' }, { name: 'second subgoal' }],
  }, {
    id: '2',
    name: 'Become a Backend developer',
    subgoals: [{ name: '3rd subgoal' }, { name: '4th subgoal' }],
  }];
}
