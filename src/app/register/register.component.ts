import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { AlertService } from '../service/alert.service';
import { Router } from '@angular/router';
import { User } from '../model/user';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submited = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
    ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get f() { return this.registerForm.controls;}
  onSubmit() {
    var user = new User();
    user.userName = this.f.userName.value;
    user.firstName = this.f.firstName.value;
    user.lastName = this.f.lastName.value;
    user.password = this.f.password.value;               
    this.submited = true;
    if (this.registerForm.invalid)
      return;
    this.userService.register(user)
      .subscribe(res => {
        console.log(res['status']+':'+res['id']);
        this.alertService.success(res['status']);
        this.userService.current_user.id = res['id'];
        this.userService.current_user.userName = res['username'];
        this.userService.current_user.firstName = res['firstName'];
        this.userService.current_user.lastName = res['lastName'];
        this.userService.current_user.password = res['pwd'];
        this.router.navigate(['/']);
      },
      error => {
        this.alertService.error(error);
        console.log(error);
        this.submited = false;
      });

    
  }

}
