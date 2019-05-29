import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public current_user: User = new User();
  user_url = 'http://localhost:8000/users/';
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get<User[]>(this.user_url);
  }

  getById(id: number) {
      return this.http.get(this.user_url + id);
  }

  register(user: User) {
  
      return this.http.post(this.user_url+'register', user);
  }
  login(username: String, password: String) {
    const obj = {
      username: username,
      password: password
    };
    return this.http.post(this.user_url+'login', obj);
  }
  update(user: User) {
      return this.http.put(this.user_url +'update/' + user.id, user);
  }

  delete(id: number) {
      return this.http.delete(this.user_url+'delete/' + id);
  }
  logout() {
    this.current_user = new User();
  }
}
