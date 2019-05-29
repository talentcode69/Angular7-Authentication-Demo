import { Component, OnInit, Input } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent implements OnInit {
  user: User = new User();
  updateForm: FormGroup;
  submited = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUser();
    console.log(this.user);
    this.updateForm = this.formBuilder.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get f() { return this.updateForm.controls;}
  getUser() {
    console.log(this.userService.current_user.id);
    this.userService.getById(this.userService.current_user.id).subscribe(user => {
      console.log(user);
      this.user.id = user['id'];
      this.user.userName = user['username'];
      this.user.firstName = user['firstName'];
      this.user.lastName = user['lastName'];
      this.user.password = user['pwd'];
    });
  }
  delete() {
    this.userService.delete(this.userService.current_user.id).subscribe(res => {
      if (res['status'] && res['status'] == "success") {
        this.userService.logout();
        this.router.navigate(['/']);
      }
    })
  }
  onSubmit() {
    this.submited = true;
    if (this.updateForm.invalid)
      return;
    this.userService.update(this.user)
      .subscribe(res => {
        console.log(res['status']+':'+res['id']);
        this.alertService.success(res['status']);
        this.router.navigate(['/']);
      },
      error => {
        this.alertService.error(error);
        console.log(error);
        this.submited = false;
      });

    
  }
}
