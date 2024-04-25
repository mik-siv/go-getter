import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

const material = [MatToolbarModule, MatSidenavModule, MatListModule, MatListOption, MatSelectionList, MatCardModule, MatButtonModule];

@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {
}
