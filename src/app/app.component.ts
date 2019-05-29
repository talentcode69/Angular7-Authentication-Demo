import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: number;
  title = 'angular-crud-mysql';
  constructor(
    private router: Router,
    private userservice: UserService
  ) {

  }
  loggedin() {
    return this.userservice.current_user.id;
  }
  logout() {
    this.userservice.logout();
    this.router.navigate(['/login']);
  }
}
