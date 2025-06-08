import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/models/interfaces/Auth';
import { ApiResponse } from 'src/app/models/interfaces/ApiResponse';
import { Account } from 'src/app/models/interfaces/Account';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  userEmail: string = '';
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAccount().subscribe({
      next: (response: ApiResponse<Account>) => {
        if (response.statusCode === 200 && response.data?.user) {
          this.userEmail = response.data.user.email;
        }
      },
      error: (error) => {
        console.error('Error getting user account:', error);
        // Handle unauthorized access
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }
  logout(): void {
    // Call the auth service logout method
    this.authService.logout().subscribe({
      next: () => {
        // Clear local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');

        // Navigate to login page
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Still clear storage and redirect even if API call fails
        localStorage.clear();
        this.router.navigate(['/login']);
      },
    });
  }
}
