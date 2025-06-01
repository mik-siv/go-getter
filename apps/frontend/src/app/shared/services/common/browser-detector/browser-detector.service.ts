import { inject, Injectable, signal } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WINDOW } from '../../../core/window-token/window.token';

@Injectable({
  providedIn: 'root',
})
export class BrowserDetectorService {
  private deviceDetectorService = inject(DeviceDetectorService);
  private window = inject(WINDOW);

  public readonly $isMobile = signal<boolean>(this.isMobile());

  constructor() {
    this.subscribeToWindowResize();
  }

  private isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }

  private subscribeToWindowResize(): void {
    this.window.addEventListener('resize', () => {
      this.$isMobile.set(this.isMobile());
    });
  }
}
