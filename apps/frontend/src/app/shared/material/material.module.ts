import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';

const material = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatListOption,
  MatSelectionList,
  MatCardModule,
  MatButtonModule,
  MatGridListModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatExpansionModule,
  MatDialogModule,
];


@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {
}
