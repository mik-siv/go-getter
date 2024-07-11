import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../../shared/services/data-access/auth/auth.service';
import { Router } from '@angular/router';

export interface RegisterFormData {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-register',
  standalone: true,
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
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup<RegisterFormData>;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  isLogin = output<boolean>();

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: ['', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(256)] }],
      confirmPassword: ['', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(256)] }],
    });
  }

  get isFormInvalid(): boolean {
    return this.registerForm.invalid || this.registerForm.get('password').value !== this.registerForm.get('confirmPassword').value;
  }

  switchToLogin(): void {
    this.isLogin.emit(true);
  }
}
