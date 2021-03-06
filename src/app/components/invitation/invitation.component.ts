import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEnvelope, faKey, faUser, faPen } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { updateHeader } from 'src/app/shared/dev/dev';
import { LandingPageComponent } from '../landing-page/landing-page.component';


@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.sass']
})
export class InvitationComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private notifyService: NotificationService
  ) { }

  // loader
  public ImprintLoader = false;

  // icon
  public faEnvelope = faEnvelope;
  public faKey = faKey;
  public faUser = faUser;
  public faPen = faPen;



  public registrationForm: any;
  public passwordMatch = false;


  // Params Inputs
  public InvitedEmail: any;
  public InvitedToken: any;
  public InvitedUserType: any;
  public InvitedUserRole: any;
  public InvitedDeptId: any;
  public InvitedCompanyId: any;
  public InvitedInstitutionId: any;


  ngOnInit() {

    this.registrationForm = {
      name: '',
      password: '',
      password2: ''
    };

    this.activeRoute.queryParams.subscribe(params => {
      this.InvitedInstitutionId = params.institutionId;
      this.InvitedCompanyId = params.companyId;
      this.InvitedUserType = params.userType;
      this.InvitedUserRole = params.userRole;
      this.InvitedDeptId = params.deptId;
      this.InvitedEmail = params.email;
      this.InvitedToken = params.token;
      sessionStorage.setItem('invitedUserToken', params.token);
  });

  }






  passwordConformation() {
    if (this.registrationForm.password !== this.registrationForm.password2 ) { this.passwordMatch = false; }
    if (this.registrationForm.password === this.registrationForm.password2 ) { this.passwordMatch = true; }
  }










  register() {
    const myData = {
      companyId: this.InvitedCompanyId,
      password: this.registrationForm.password,
      institutionId: this.InvitedInstitutionId,
      email: this.InvitedEmail,
      name: this.registrationForm.name,
      userType: this.InvitedUserType,
      userRole: this.InvitedUserRole,
      departmentId: this.InvitedDeptId,
    };
    this.submitUser(myData);
  }




  submitUser(myCredentials) {
    this.ImprintLoader = true;

    this.userService.registerUser(myCredentials).subscribe(
      dataUser => {
        this.login(myCredentials.email, myCredentials.password);
      },
      error => {this.notifyService.showWarning('Could not submit', 'Failled');  this.ImprintLoader = false; }
    );


  }



  login(emailParam: any, passwordParam: any) {
    this.userService.loginUser({email: emailParam, password: passwordParam}).subscribe(
      dataUser =>  {
          if (dataUser.userType === 'customer') {
          sessionStorage.setItem('loggedUserToken', dataUser.token);
          sessionStorage.setItem('loggedUserName', dataUser.name);
          sessionStorage.setItem('loggedUserEmail', dataUser.email);
          sessionStorage.setItem('loggedUserInstitution', dataUser.institutionId);
          sessionStorage.setItem('loggedUserID', dataUser._id);
          sessionStorage.setItem('loggedCompanyId', dataUser.companyId);
          sessionStorage.setItem('permissionStatus', 'isCustomer');
          updateHeader().then(() => {
            this.router.navigate(['/home/survey']);
           });

          }


          if (dataUser.userType === 'admin') {
           sessionStorage.setItem('loggedUserInstitution', dataUser._id);
           sessionStorage.setItem('loggedUserToken', dataUser.token);
           sessionStorage.setItem('loggedUserName', dataUser.name);
           sessionStorage.setItem('loggedUserEmail', dataUser.email);
           sessionStorage.setItem('loggedUserID', dataUser._id);
           sessionStorage.setItem('permissionStatus', 'isAdmin');

           updateHeader().then(() => {
            this.router.navigate(['/home/admin']);
           });

          }

          if (dataUser.userType === 'thirdparty') {
           sessionStorage.setItem('loggedUserInstitution', dataUser._id);
           sessionStorage.setItem('loggedUserToken', dataUser.token);
           sessionStorage.setItem('loggedUserName', dataUser.name);
           sessionStorage.setItem('loggedUserEmail', dataUser.email);
           sessionStorage.setItem('loggedUserID', dataUser._id);
           sessionStorage.setItem('permissionStatus', 'isThirdParty');
           updateHeader().then(() => {
            this.router.navigate(['/home/dashboard']);
           });


          }

        },
        error => {this.notifyService.showError(error.error.message, 'Access denied'); this.ImprintLoader = false; }
      );
  }








  ngOnDestroy() {
    this.ImprintLoader = false;
  }

}
