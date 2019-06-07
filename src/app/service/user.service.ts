import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse} from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public current_user: User;
  user_url = 'http://localhost:8000/users/';
  users: User[];
  constructor(private http: HttpClient) { }
  getAll() {
    this.http.get(this.user_url).subscribe((res:User[]) => {
      this.users = res;      
      console.log(this.users);
    });
    return this.users;
    //return this.http.get(this.user_url);
  }

  getById(id: number) {
      return this.http.get(this.user_url + id);
  }

  register(user: User) {
    return this.http.post(this.user_url + 'register', user);
  }
  login(username: String, password: String) {
    const obj = {
      username: username,
      pwd: password
    };
    return this.http.post(this.user_url + 'login', obj);
  }
  update(user: User) {
      return this.http.put(this.user_url +'update/' + user.id, user);
  }

  delete(id: number) {
      return this.http.delete(this.user_url+'delete/' + id);
  }
  logout() {
    this.current_user = null;
  }
}
