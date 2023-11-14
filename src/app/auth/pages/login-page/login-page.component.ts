import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  public emailPatter: RegExp = new RegExp(
    '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  );

  public hide: boolean = true;
  public isLoading: boolean = false;

  public loginForm = new FormGroup({
    email: new FormControl<string>('john.doe@gmail.com', [
      Validators.required,
      Validators.pattern(this.emailPatter),
    ]),
    password: new FormControl<string>('123456', [Validators.required]),
  });

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {}

  public onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const email = this.loginForm.controls['email'].value!;
    const password = this.loginForm.controls['password'].value!;

    this.authService.login(email, password).subscribe((ok) => {
      if (!ok) {
        this.isLoading = false;
        this.showSnackBar('Invalid Credentials');
        return;
      }

      this.router.navigate(['/']);
    });
  }

  private showSnackBar(message: string): void {
    this.snackbar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
