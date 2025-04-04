import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../../shared/services/data-access/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/data-access/user/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

export interface RegisterFormData {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        MatSuffix,
        ReactiveFormsModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup<RegisterFormData>;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  isLogin = output<boolean>();

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      username: ['', { validators: [Validators.required, Validators.minLength(3), Validators.maxLength(256)] }],
      password: ['', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(256)] }],
      confirmPassword: ['', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(256)] }],
    });
  }

  register(): void {
    const { email, password, username } = this.registerForm.value;
    this.userService.register(email, password, username)
      .pipe(
        switchMap(() => this.authService.login(email, password)),
        takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  get isFormInvalid(): boolean {
    return this.registerForm.invalid || this.registerForm.get('password').value !== this.registerForm.get('confirmPassword').value;
  }

  switchToLogin(): void {
    this.isLogin.emit(true);
  }
}
