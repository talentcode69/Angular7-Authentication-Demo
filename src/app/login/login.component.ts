import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { AlertService } from '../service/alert.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submited = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
    ) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }
  get f() { return this.loginForm.controls;}
  onSubmit() {
    this.submited = true;
    
    if (this.loginForm.invalid)
      return;
    this.userService.login(this.f.username.value, this.f.password.value).subscribe((res: User) => {
      this.userService.current_user = res;
      console.log(this.userService.current_user);
      if (this.userService.current_user != null)
      {
        this.alertService.success("Success");
        this.router.navigate(['/']);
      }
      else {
        this.alertService.error("Please input correctly");
        this.submited = false;
      }
    });
    
  }
}
