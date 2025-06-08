import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { BrandingComponent } from 'src/app/layouts/full/sidebar/branding.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    BrandingComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  returnUrl: string = '/contract';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/contract';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Check if we have a valid response with data
          if (response.statusCode === 200 && response.data) {
            const token = response.data.access_token;
            if (token) {
              localStorage.setItem('accessToken', token);
              if (response.data.user) {
                localStorage.setItem(
                  'currentUser',
                  JSON.stringify(response.data.user)
                );
              }
              this.router.navigate([this.returnUrl]);
            } else {
              console.error('No access_token in response data:', response);
              this.error = 'Invalid server response structure';
            }
          } else {
            console.error('Invalid response:', response);
            this.error = response.message || 'Login failed';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error = error.error?.message || 'Login failed';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
