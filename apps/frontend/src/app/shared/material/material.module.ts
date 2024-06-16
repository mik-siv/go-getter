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

const material = [MatToolbarModule, MatSidenavModule, MatListModule, MatListOption, MatSelectionList, MatCardModule, MatButtonModule, MatGridListModule, MatFormFieldModule, MatIconModule, MatInputModule];


@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {
}
