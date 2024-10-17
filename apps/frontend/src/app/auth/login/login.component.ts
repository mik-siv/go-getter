import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../shared/services/data-access/auth/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthStateService } from '../../shared/services/data-access/auth/state/auth-state.service';

export interface LoginFormData {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<LoginFormData>;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  authStateService = inject(AuthStateService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  isLogin = output<boolean>();

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: ['', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(256)] }],
    });
  }

  login(): void {
    const email: string = this.loginForm.value.email || '';
    const password: string = this.loginForm.value.password || '';
    this.authService.login(email, password)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  get isFormInvalid(): boolean {
    return this.loginForm.invalid;
  }

  switchToRegister(): void {
    this.isLogin.emit(false);
  }
}

