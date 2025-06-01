import { Injectable } from '@angular/core';
import { LocalStorageKeys } from './models/LocalStorageKeys';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  // Set a value in local storage
  setItem(key: LocalStorageKeys, value: string): void {
    localStorage.setItem(key, value);
  }

  // Get a value from local storage
  getItem(key: LocalStorageKeys): string | null {
    return localStorage.getItem(key);
  }

  // Remove a value from local storage
  removeItem(key: LocalStorageKeys): void {
    localStorage.removeItem(key);
  }

  // Clear all items from local storage
  clear(): void {
    localStorage.clear();
  }
}
