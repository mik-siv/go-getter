import { Component, effect, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../shared/services/data-access/auth/auth.service';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';

export interface UserFormData {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<UserFormData>;
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      if (this.authService.user()) {
        this.router.navigate([RoutePaths.Home]);
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', { validators: [Validators.required, Validators.email] }],
      password: ['', { validators: [Validators.required, Validators.minLength(8)] }],
    });
  }

  login(): void {
    const email: string = this.loginForm.value.email || '';
    const password: string = this.loginForm.value.password || '';
    this.authService.login(email, password).subscribe();
  }

  get isFormInvalid(): boolean{
    return this.loginForm.invalid;
  }
}

