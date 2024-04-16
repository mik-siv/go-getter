import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

const material = [MatToolbarModule, MatSidenavModule, MatListModule];

@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {
}
