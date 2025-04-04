import { inject, Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class BrowserDetectorService {
  private deviceDetectorService = inject(DeviceDetectorService);

  isMobile(): boolean {
    return this.deviceDetectorService.isMobile();
  }
}
