import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


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
      localStorage.setItem('invitedUserToken', params.get('token'));
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
        this.redirect(dataUser);
      },
      error => {this.notifyService.showWarning('Could not submit', 'Failled');  this.ImprintLoader = false; }
    );


  }



  redirect(dataUser) {

    if ( this.InvitedUserType === 'admin') {
      localStorage.setItem('loggedUserToken', dataUser.token);
      localStorage.setItem('loggedUserName', dataUser.name);
      localStorage.setItem('loggedUserEmail', dataUser.email);
      localStorage.setItem('loggedUserID', dataUser._id);
      localStorage.setItem('loggedCompanyId', dataUser.companyId);
      localStorage.setItem('permissionStatus', 'isAdmin');
      this.router.navigate(['/home/dashboard']);
    }

    if ( this.InvitedUserType === 'thirdparty') {
      localStorage.setItem('loggedUserToken', dataUser.token);
      localStorage.setItem('loggedUserName', dataUser.name);
      localStorage.setItem('loggedUserEmail', dataUser.email);
      localStorage.setItem('loggedUserID', dataUser._id);
      localStorage.setItem('loggedCompanyId', dataUser.companyId);
      localStorage.setItem('permissionStatus', 'isThirdParty');
      this.router.navigate(['/home/dashboard']);
    }


    if ( this.InvitedUserType === 'customer') {
      localStorage.setItem('loggedUserToken', dataUser.token);
      localStorage.setItem('loggedUserName', dataUser.name);
      localStorage.setItem('loggedUserEmail', dataUser.email);
      localStorage.setItem('loggedUserID', dataUser._id);
      localStorage.setItem('loggedCompanyId', dataUser.companyId);
      localStorage.setItem('permissionStatus', 'isCustomer');
      this.router.navigate(['/home/profile']);
    }

  }









  ngOnDestroy() {
    this.ImprintLoader = false;
  }

}
