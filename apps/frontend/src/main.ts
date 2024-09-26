import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (environment.production) {
      enableProdMode();
    }
  })
  .catch((err) => console.error(err));
