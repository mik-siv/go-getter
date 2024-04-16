import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

const material = [MatToolbarModule, MatSidenavModule];

@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialModule {
}
