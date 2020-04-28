import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { faEnvelope, faKey, faTimes } from '@fortawesome/free-solid-svg-icons';
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

  // loader
  public ImprintLoader = false;

  // icon
  public faEnvelope = faEnvelope;
  public faKey = faKey;
  public faTimes = faTimes;

  public loginForm;


  ngOnInit() {

    this.loginForm = {
      email: '',
      password: ''
    };

    setTimeout(() => {
      this.infoModal.show();
    }, 50);

  }


  login() {
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



  toLogin() {
    this.infoModal.hide();
  }


  ngOnDestroy() {
    this.ImprintLoader = false;
  }



}
