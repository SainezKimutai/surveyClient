import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { faEnvelope, faKey, faTimes, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { async } from '@angular/core/testing';


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
  @ViewChild('resetModal', {static: true}) resetModal: ModalDirective;
  // loader
  public ImprintLoader = false;

  // icon
  public faEnvelope = faEnvelope;
  public faKey = faKey;
  public faTimes = faTimes;
  public faEyeSlash = faEyeSlash;
  public faEye = faEye;

  public loginForm;
  public resetForm;


  public emailError = false;
  public passwordError = false;
  public PasswordType = 'password';
  public resetEmail ='';
  public emailVerify = false;


  ngOnInit() {

    this.loginForm = {
      email: '',
      password: ''
    };

    this.resetForm = {
      email: ''
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
     async dataUser =>  {
        if (dataUser.userType === 'customer') {
         await sessionStorage.setItem('loggedUserToken', dataUser.token);
         await sessionStorage.setItem('loggedUserName', dataUser.name);
         await sessionStorage.setItem('loggedUserEmail', dataUser.email);
         await sessionStorage.setItem('loggedUserInstitution', dataUser.institutionId);
         await sessionStorage.setItem('loggedUserID', dataUser._id);
         await sessionStorage.setItem('loggedCompanyId', dataUser.companyId);
         await sessionStorage.setItem('permissionStatus', 'isCustomer');
          this.router.navigate(['/home/survey']);
        }


        if (dataUser.userType === 'admin') {
         await sessionStorage.setItem('loggedUserInstitution', dataUser._id);
         await sessionStorage.setItem('loggedUserToken', dataUser.token);
         await sessionStorage.setItem('loggedUserName', dataUser.name);
         await sessionStorage.setItem('loggedUserEmail', dataUser.email);
         await sessionStorage.setItem('loggedUserID', dataUser._id);
         await sessionStorage.setItem('permissionStatus', 'isAdmin');
          this.router.navigate(['/home/admin']);
        }

        if (dataUser.userType === 'thirdparty') {
         await sessionStorage.setItem('loggedUserInstitution', dataUser._id);
         await sessionStorage.setItem('loggedUserToken', dataUser.token);
         await sessionStorage.setItem('loggedUserName', dataUser.name);
         await sessionStorage.setItem('loggedUserEmail', dataUser.email);
         await sessionStorage.setItem('loggedUserID', dataUser._id);
         await sessionStorage.setItem('permissionStatus', 'isThirdParty');
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

  passwordReset(){
    this.resetModal.show();
  }

  sendResetEmail(){
    this.ImprintLoader = true;
    const user ={
      email: this.resetEmail
    }

    this.userService.sendResetEmail(user).subscribe(
      user=>{
        this.resetModal.hide();
        this.notifyService.showSuccess("Check your email, password reset instructions were sent", "Success!")
        this.ImprintLoader = false;
      },err=>{
        this.ImprintLoader = false;
        this.notifyService.showError("An error occured, are you sure you used the right email?", "Failed")
      }
    )
  }

  checkEmail(){
    
    if(this.resetEmail.includes('@') && this.resetEmail.includes('.')){
      this.emailVerify  = true;
    }
  }


}
