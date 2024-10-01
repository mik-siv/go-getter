import { Injectable } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor() {
  }

  /**
   * Handles errors.
   *
   * @param {Error} error - The error to be handled.
   * @return {void}
   */
  handleError(error: Error): void {
    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  /**
   * Handles HTTP error response.
   *
   * @param {HttpErrorResponse} error - The HTTP error response object.
   * @private
   */
  private handleHttpError(error: HttpErrorResponse) {
    console.error('Server Error:', error.error);
  }

  /**
   * Handles generic errors and logs the error to the console.
   *
   * @param {Error} error - The error to handle.
   *
   * @private
   */
  private handleGenericError(error: Error) {
    console.error(error);
  }
}
