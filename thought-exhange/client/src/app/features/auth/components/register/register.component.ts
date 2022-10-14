import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isFormSubmitted = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.currentUser$.value) this.router.navigate(['posts']);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registerForm = new FormGroup(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      this.confirmPasswordValidator
    );
  }

  confirmPasswordValidator = (formGroup: any) => {
    if (
      formGroup.controls['password'].value !==
      formGroup.controls['confirmPassword'].value
    ) {
      // negative validatio, need to return an object like the one below
      return { passwordMismatch: true };
    } else {
      // positive validation you need to return null
      return null;
    }
  };

  onFormSubmit() {
    this.isFormSubmitted = true;

    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;

    this.authService.registerUser({ username, email, password });
  }
}
