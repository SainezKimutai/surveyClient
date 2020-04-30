import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { faEnvelope, faKey, faTimes, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private userService: UserService,
    private notifyService: NotificationService
  ) { }

  @ViewChild('infoModal', {static: true}) infoModal: ModalDirective;
  @ViewChild('#email', {static: false}) emailInput: ElementRef;
  @ViewChild('#password', {static: false}) passwordInput: ElementRef;

  // loader
  public ImprintLoader = false;

  // icon
  public faEnvelope = faEnvelope;
  public faKey = faKey;
  public faTimes = faTimes;
  public faEyeSlash = faEyeSlash;
  public faEye = faEye;

  public loginForm;


  public emailError = false;
  public passwordError = false;
  public PasswordType = 'password';


  ngOnInit() {

    this.loginForm = {
      email: '',
      password: ''
    };

    setTimeout(() => {
      this.infoModal.show();
    }, 50);

  }










  showPassword() {
    this.PasswordType = 'text';
  }
  hidePassword() {
    this.PasswordType = 'password';
  }






  emailCheck() {

    if (this.loginForm.email === '') {
      this.emailError = true;
    } else {
      this.emailError = false;
    }
  }

  passwordCheck() {
    if (this.loginForm.password === '') {
      this.passwordError = true;
    } else {
      this.passwordError = false;
    }
  }








  login() {

    if (this.loginForm.email === '') { this.emailError = true; }
    if (this.loginForm.password === '') { this.passwordError = true; }
    if (this.loginForm.email !== '' && this.loginForm.password !== '') {

    this.ImprintLoader = true;
    this.userService.loginUser(this.loginForm).subscribe(
      dataUser => {
        if (dataUser.userType === 'customer') {
          localStorage.setItem('loggedUserToken', dataUser.token);
          localStorage.setItem('loggedUserName', dataUser.name);
          localStorage.setItem('loggedUserEmail', dataUser.email);
          localStorage.setItem('loggedUserInstitution', dataUser.institutionId);
          localStorage.setItem('loggedUserID', dataUser._id);
          localStorage.setItem('loggedCompanyId', dataUser.companyId);
          localStorage.setItem('permissionStatus', 'isCustomer');
          this.router.navigate(['/home/survey']);
        }


        if (dataUser.userType === 'admin') {
          localStorage.setItem('loggedUserInstitution', dataUser._id);
          localStorage.setItem('loggedUserToken', dataUser.token);
          localStorage.setItem('loggedUserName', dataUser.name);
          localStorage.setItem('loggedUserEmail', dataUser.email);
          localStorage.setItem('loggedUserID', dataUser._id);
          localStorage.setItem('permissionStatus', 'isAdmin');
          this.router.navigate(['/home/admin']);
        }

        if (dataUser.userType === 'thirdparty') {
          localStorage.setItem('loggedUserInstitution', dataUser._id);
          localStorage.setItem('loggedUserToken', dataUser.token);
          localStorage.setItem('loggedUserName', dataUser.name);
          localStorage.setItem('loggedUserEmail', dataUser.email);
          localStorage.setItem('loggedUserID', dataUser._id);
          localStorage.setItem('permissionStatus', 'isThirdParty');
          this.router.navigate(['/home/dashboard']);
        }


      },
      error => {this.notifyService.showError(error.error.message, 'Access denied'); this.ImprintLoader = false; }
    );
  }
  }



  toLogin() {
    this.infoModal.hide();
  }


  ngOnDestroy() {
    this.ImprintLoader = false;
  }



}
