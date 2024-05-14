import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RoutePaths } from '../../app.routes';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  RoutePaths = RoutePaths;

}
