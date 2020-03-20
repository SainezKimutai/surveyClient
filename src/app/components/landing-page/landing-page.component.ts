import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';


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

  // loader
  public ImprintLoader = false;

  // icon
  public faEnvelope = faEnvelope;
  public faKey = faKey;

  public loginForm;


  ngOnInit() {

    this.loginForm = {
      email: '',
      password: ''
    };

  }


  login() {
    this.ImprintLoader = true;
    this.userService.loginUser(this.loginForm).subscribe(
      dataUser => {

        if (dataUser.userType === 'customer') {
          localStorage.setItem('loggedUserName', dataUser.name);
          localStorage.setItem('loggedUserEmail', dataUser.email);
          localStorage.setItem('loggedUserID', dataUser._id);
          localStorage.setItem('permissionStatus', 'isCustomer');
          this.router.navigate(['/home/profile']);
        }


        if (dataUser.userType === 'admin') {
          localStorage.setItem('loggedUserName', dataUser.name);
          localStorage.setItem('loggedUserEmail', dataUser.email);
          localStorage.setItem('loggedUserID', dataUser._id);
          localStorage.setItem('permissionStatus', 'isAdmin');
          this.router.navigate(['/home/editorial']);
        }

        if (dataUser.userType === 'thirdparty') {
          localStorage.setItem('loggedUserName', dataUser.name);
          localStorage.setItem('loggedUserEmail', dataUser.email);
          localStorage.setItem('loggedUserID', dataUser._id);
          localStorage.setItem('permissionStatus', 'isThirdParty');
          this.router.navigate(['/home/dashboard']);
        }


      },
      error => {this.notifyService.showError(error.error.message, 'Access denied'); this.ImprintLoader = false;}
    );
  }





  ngOnDestroy() {
    this.ImprintLoader = false;
  }



}
