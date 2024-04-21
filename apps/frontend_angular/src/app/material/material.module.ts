import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule, MatListOption, MatSelectionList } from '@angular/material/list';

const material = [MatToolbarModule, MatSidenavModule, MatListModule, MatListOption, MatSelectionList];

@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {
}
