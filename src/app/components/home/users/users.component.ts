import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})


export class UsersComponent implements OnInit, OnDestroy {


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private notifyService: NotificationService,
    private companyProfileService: CompanyProfileService,
  ) {}

  // tslint:disable: prefer-const
  // tslint:disable: object-literal-shorthand


  @ViewChild('editNameModal', {static: true}) public editNameModal: ModalDirective;
  @ViewChild('editRoleModal', {static: true}) public editRoleModal: ModalDirective;
  @ViewChild('editPasswordModal', {static: true}) public editPasswordModal: ModalDirective;
  @ViewChild('deleteUserModal', {static: true}) public deleteUserModal: ModalDirective;

  // loader
  public ImprintLoader = false;

  // permission
  public toAdmin = false;
  public toCustomer = false;

  public AllCompanies = [];
  public myCompany: any;

  public editNameForm: FormGroup;
  public editRoleForm: FormGroup;
  public editPasswordForm: FormGroup;
  public inviteForm: FormGroup;

  public Users: Array<any>;
  public UserToBeEdited;
  public togglePassword: string;
  public showPasswordIcon: boolean;
  public hidePasswordIcon: boolean;


  public myInterval: any;




  ngOnInit() {


    window.localStorage.setItem('ActiveNav', 'users');
    if (localStorage.getItem('permissionStatus') === 'isAdmin') {
        this.toAdmin = true;
    } else if (localStorage.getItem('permissionStatus') === 'isCustomer') {
        this.toCustomer = true;
    }


    this.userService.getAllUsers().subscribe(
      data => {
        this.Users = data;
        if (localStorage.getItem('permissionStatus') === 'isCustomer') {
         this.Users = this.Users.filter((user) => user.companyId === localStorage.getItem('loggedCompanyId')).map(e => e);
        }
      },
      error => {
        console.log('Error In getting all Users');
      }
    ); // get all users

    this.companyProfileService.getAllCompanyProfiles().subscribe(
      data => {
        this.AllCompanies = data;
        for (const comp of this.AllCompanies) { if (comp._id === localStorage.getItem('loggedCompanyId')) { this.myCompany = comp; break; }}
      },
      error => console.log('Error geting all Companies')
    );


    this.togglePassword = 'password';
    this.hidePasswordIcon = false;
    this.showPasswordIcon = true;

    this.editNameForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.editRoleForm = this.formBuilder.group({
      role: ['', Validators.required]
    });

    this.editPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.inviteForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      companyId: (this.toAdmin ? '' : localStorage.getItem('loggedCompanyId')),
      userType: (this.toAdmin ? ['', [Validators.required]] : 'customer'),
      userRole: (this.toAdmin ? 'admin' : ['', [Validators.required]]),
      departmentId: (this.toAdmin ? '' : ['', [Validators.required]]),
    });



    this.myInterval = setInterval(() => {
    this.updatePage();
  }, 10000); // 10 sec

  }// ngOnInit()












  updatePage() {
    this.userService.getAllUsers().subscribe(
      data => {
        this.Users = data;
        if (localStorage.getItem('permissionStatus') === 'isCustomer') {
          this.Users = this.Users.filter((user) => user.companyId === localStorage.getItem('loggedCompanyId')).map(e => e);
         }
      },
      error => {
        console.log('Error In listing Users');
      }
    ); // listUsers()
  }


  get formEditName() { return this.editNameForm.controls; }
  get formEditRole() { return this.editRoleForm.controls; }
  get formEditPassword() { return this.editPasswordForm.controls; }
  get formInvite() { return this.inviteForm.controls; }




  editName(user) {
    this.UserToBeEdited = user;
  }

  editRole(user) {
    this.UserToBeEdited = user;
  }

  editPassword(user) {
    this.UserToBeEdited = user;
  }

  deleteUser(user) {
    this.UserToBeEdited = user;
  }

  showPassword() {
    this.togglePassword = 'text';
    this.hidePasswordIcon = true;
    this.showPasswordIcon = false;
  }

  hidePassword() {
    this.togglePassword = 'password';
    this.showPasswordIcon = true;
    this.hidePasswordIcon = false;
  }



  submitEditedName() {
    this.userService.updateUsers(this.UserToBeEdited._id, this.editNameForm.value).subscribe(
      data => {
        this.updatePage();
        this.notifyService.showSuccess('Name Changed', 'Success');
      },
      error => {
        this.notifyService.showError('No Changes', 'Error');
      }
    );
  }


  submitEditedRole() {
    this.userService.updateUsers(this.UserToBeEdited._id, this.editRoleForm.value).subscribe(
      data => {
        this.updatePage();
        this.notifyService.showSuccess('Role Changed', 'Success');
      },
      error => {
        this.notifyService.showError('No Changes', 'Error');
      }
    );
  }


  submitEditedPassword() {
    this.userService.updateUsers(this.UserToBeEdited._id, this.editPasswordForm.value).subscribe(
      data => {
        this.updatePage();
        this.notifyService.showSuccess('Password Changed', 'Success');
      },
      error => {
        this.notifyService.showError('No Changes', 'Error');
      }
    );
  }


  submitDeletedUser() {
    this.userService.deleteUser(this.UserToBeEdited._id).subscribe(
      data => {
        this.updatePage();
        this.notifyService.showSuccess('User Deleted', 'Success');
      },
      error => {
        this.notifyService.showError('No Changes', 'Error');
      }
    );
  }








  // email: ['', [Validators.required, Validators.email]],
  // companyId: (this.toAdmin ? '' : localStorage.getItem('loggedCompanyId')),
  // userType: (this.toAdmin ? ['', [Validators.required]] : 'customer'),
  // userRole: (this.toAdmin ? 'admin' : ['', [Validators.required]]),
  // departmentId: (this.toAdmin ? '' : ['', [Validators.required]]),

  informValidation() {
    if (this.inviteForm.value.email === '') {
      this.notifyService.showInfo('Please input valid email', 'Invalid email format');
      return;
    }
    if (this.inviteForm.value.departmentId === '') {
      this.notifyService.showInfo('Please select or set department for your company', 'No Department');
      return;
    }
    if (this.inviteForm.value.userRole === '') {
      this.notifyService.showInfo('Please select user role', 'No User role');
      return;
    }
    if (this.inviteForm.value.userType === '') {
      this.notifyService.showInfo('Please set user type', 'No User type');
      return;
    }

  }














  inviteUser() {
    this.ImprintLoader = true;


    let dataToBeSent = {
      sender: localStorage.getItem('loggedUserEmail'),
      reciever: this.inviteForm.value.email,
      companyId: this.inviteForm.value.companyId,
      userType: this.inviteForm.value.userType,
      userRole: this.inviteForm.value.userRole,
      deptId: this.inviteForm.value.departmentId,
      token: localStorage.getItem('loggedUserToken')
    };
    // console.log(dataToBeSent)
    this.userService.inviteUser(dataToBeSent).subscribe(
      data => {
        this.ImprintLoader = false;
        this.notifyService.showSuccess('Invitation Sent', 'Success');
      },
      error => {
        this.ImprintLoader = false;
        this.notifyService.showError('Not Sent', 'Error');
      }
    );



  }



  ngOnDestroy() {
    clearInterval(this.myInterval);
  }


}// End of Class
