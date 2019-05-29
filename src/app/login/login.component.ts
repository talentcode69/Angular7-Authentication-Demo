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
    this.userService.login(this.f.username.value,this.f.password.value)
      .subscribe(res => {
        console.log(res);
        this.alertService.success(res['status']);
        if (res) {
          this.userService.current_user.id = res['id'];
          this.userService.current_user.userName = res['username'];
          this.userService.current_user.firstName = res['firstName'];
          this.userService.current_user.lastName = res['lastName'];
          this.userService.current_user.password = res['pwd'];
          console.log(this.userService.current_user);
          this.router.navigate(['/']);
        }
        else {
          this.alertService.error("Please input correctly");
          this.submited = false;
        }
      },
      error => {
        this.alertService.error(error);
        console.log(error);
        this.submited = false;
      });
  }
}
