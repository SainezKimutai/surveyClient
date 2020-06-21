import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEnvelope, faKey, faUser, faPen } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { updateHeader } from 'src/app/shared/dev/dev';


@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.sass']
})
export class InvitationComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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


  ngOnInit() {

    this.registrationForm = {
      name: '',
      password: '',
      password2: ''
    };

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.InvitedCompanyId = params.get('companyId');
      this.InvitedUserType = params.get('userType');
      this.InvitedUserRole = params.get('userRole');
      this.InvitedDeptId = params.get('deptId');
      this.InvitedEmail = params.get('email');
      this.InvitedToken = params.get('token');
      sessionStorage.setItem('invitedUserToken', params.get('token'));
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
      email: this.InvitedEmail,
      name: this.InvitedUserType === 'thirdparty' ? this.registrationForm.name : '',
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
        console.log(dataUser);
        this.redirect(dataUser);
      },
      error => {this.notifyService.showWarning('Could not submit', 'Failled');  this.ImprintLoader = false; }
    );


  }



  redirect(dataUser) {

    if ( this.InvitedUserType === 'admin') {
      sessionStorage.setItem('loggedUserToken', dataUser.token);
      sessionStorage.setItem('loggedUserName', dataUser.name);
      sessionStorage.setItem('loggedUserEmail', dataUser.email);
      sessionStorage.setItem('loggedUserID', dataUser._id);
      sessionStorage.setItem('loggedCompanyId', dataUser.companyId);
      sessionStorage.setItem('permissionStatus', 'isAdmin');
      updateHeader().then(() => {
        this.router.navigate(['/home/admin']);
      });

    }

    if ( this.InvitedUserType === 'thirdparty') {

      sessionStorage.setItem('loggedUserToken', dataUser.token);
      sessionStorage.setItem('loggedUserName', dataUser.name);
      sessionStorage.setItem('loggedUserEmail', dataUser.email);
      sessionStorage.setItem('loggedUserID', dataUser._id);
      sessionStorage.setItem('loggedCompanyId', dataUser.companyId);
      sessionStorage.setItem('permissionStatus', 'isThirdParty');
      updateHeader().then(() => {
        this.router.navigate(['/home/dashboard']);
      });

    }


    if ( this.InvitedUserType === 'customer') {
      sessionStorage.setItem('loggedUserToken', dataUser.token);
      sessionStorage.setItem('loggedUserName', dataUser.name);
      sessionStorage.setItem('loggedUserEmail', dataUser.email);
      sessionStorage.setItem('loggedUserID', dataUser._id);
      sessionStorage.setItem('loggedCompanyId', dataUser.companyId);
      sessionStorage.setItem('permissionStatus', 'isCustomer');
      updateHeader().then(() => {
        this.router.navigate(['/home/profile']);
      });

    }

  }









  ngOnDestroy() {
    this.ImprintLoader = false;
  }

}
