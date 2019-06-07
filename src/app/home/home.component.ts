import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { User } from '../model/user';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {formatDate } from '@angular/common';
class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  headElements = ['ID','UserName','FirstName','LastName','Password','Created At','Updated At','Actions'];
  dtOptions: DataTables.Settings = {};
  users: User[];
  selected_user: User;
  updateForm: FormGroup;
  modalRef: NgbModalRef;
  md_title: String;
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }
  columns = [
    { name: 'ID', prp: 'id' },
    { name: 'UserName', prop: 'username' },
    { name: 'FirstName', prop: 'firstName' },
    { name: 'LastName', prop: 'lastName' },
    { name: 'Password', prop: 'pwd' },
    { name: 'Created At', prop: 'created_at' },
    { name: 'Updated At',prop: 'updated_at' }];
  ngOnInit() {
    this.users = this.userService.getAll();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.updateForm = this.formBuilder.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get up_f() { return this.updateForm.controls;}
  getusername() {
    if (this.userService.current_user == null)
      return false;
    return this.userService.current_user.username;
  }
  getisadmin() {
    if (this.userService.current_user == null)
      return 0;
    console.log("admin:" + this.userService.current_user.admin);
    console.log(this.users);
    return this.userService.current_user.admin;
  }
  delete_user(id: number) {
    console.log(id);
    this.userService.delete(id).subscribe(res => {
      if (res['status'] && res['status'] == "success") {
        console.log("delete:success");
        this.users.splice(this.get_id_from_users(this.find_element_of_user(id)), 1);
        console.log(this.users);
      }
    });
  }
  find_element_of_user(id: number) {
    return this.users.find(function (element) { return element.id == id; });
  }
  get_id_from_users(puser: User) {
    return this.users.indexOf(puser);
  }
  edit_user(content, id: number) {
    this.md_title = "Update User";
    this.selected_user = this.find_element_of_user(id);
    console.log(id);
    console.log(this.selected_user);
    this.up_f.userName.setValue(this.selected_user.username);
     this.up_f.firstName.setValue(this.selected_user.firstName);
     this.up_f.lastName.setValue(this.selected_user.lastName);
    this.up_f.password.setValue(this.selected_user.pwd);
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalRef.result.then((result) => {
      console.log(result);
      this.users.splice(this.get_id_from_users(this.find_element_of_user(id)), 1, this.selected_user);
      this.selected_user = null;
      this.clear_form();
    }, (reason) => {
        console.log(this.getDismissReason(reason));
        this.clear_form();
      });
  }
  clear_form() {
    this.up_f.userName.setValue('');
    this.up_f.firstName.setValue('');
    this.up_f.lastName.setValue('');
    this.up_f.password.setValue('');
  }
  add_user(content) {
    this.md_title = "Add User";
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    this.modalRef.result.then((result) => {
      console.log(result);

    }, (reason) => {
      console.log(this.getDismissReason(reason));
      });
  }
  Date_format(date: number) {
    return formatDate(date, "yyyy-MM-dd hh:mm a", 'en-US', '+0530');
  }
  onUpdate() {
    if (this.selected_user != null) {
      console.log("onUpdate");
      if (this.updateForm.invalid)
        return;
      this.selected_user.username = this.up_f.userName.value;
      this.selected_user.firstName = this.up_f.firstName.value;
      this.selected_user.lastName = this.up_f.lastName.value;
      this.selected_user.pwd = this.up_f.password.value;
      this.selected_user.updated_at = this.Date_format(Date.now());
      console.log(this.selected_user);
      this.userService.update(this.selected_user).subscribe(res => {
        if (res['status'] == 'success') {
          console.log("update success");
          this.modalRef.close();
        }
        else
          console.log("Failed");
      });
    } else {
      console.log("onSave");
      if (this.updateForm.invalid)
        return;
      var new_user = new User();
      new_user.username = this.up_f.userName.value;
      new_user.firstName = this.up_f.firstName.value;
      new_user.lastName = this.up_f.lastName.value;
      new_user.pwd = this.up_f.password.value;
      new_user.updated_at = this.Date_format(Date.now());
      new_user.created_at = new_user.updated_at;
      console.log(new_user);
      this.userService.register(new_user).subscribe(res => {
        if (res != null) {
          console.log("update success");
          new_user.id = res['id'];
          this.users.push(new_user);
          this.modalRef.close();
        }
        else
          console.log("Failed");
      });
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
