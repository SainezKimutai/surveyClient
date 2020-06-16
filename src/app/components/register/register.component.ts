import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { faBuilding, faUsers, faGlobe, faIndustry, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router , ActivatedRoute, ParamMap} from '@angular/router';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { ModalDirective, ModalOptions, ModalModule } from 'ngx-bootstrap';
import { updateHeader } from 'src/app/shared/dev/dev';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private companyProfileService: CompanyProfileService,
    private industryService: IndustryService,
    private notifyService: NotificationService
  ) { }

  @ViewChild('termsModal', {static: true}) addTermsModal: ModalDirective;


  public AllIndustrys = [];
  public AllInstitutions = [];

  public ImprintLoader = false;
  public faBuilding = faBuilding;
  public faUsers = faUsers;
  public faIndustry = faIndustry;
  public faGlobe = faGlobe;
  public faEnvelope = faEnvelope;
  public faKey = faKey;
  public thirdParty;

  public formOne = true;
  public formTwo = false;

  public registrationForm;
  public passwordMatch = false;







  ngOnInit() {
    this.registrationForm = {
      companyName: '',
      logo: {
        url: '',
        name: ''
      },
      numberOfEmployees: null,
      companyType: '',
      institutionId: '',
      companyWebsite: '',
      companyId: '',
      password: '',
      password2: '',
      email: '',
      userType: 'customer'
    };

    this.checkIfInvited();

    this.userService.getAllUsers().subscribe(
      data => {
        const allUsers = data;
        allUsers.forEach(user => {
          if (user.userType === 'thirdparty') {
            this.AllInstitutions.push(user);
          }
        });
      }, error => console.log('Error getting all institutions')
    );

    this.industryService.getAllIndustrys().subscribe(
      data => this.AllIndustrys = data,
      error => console.log('Error getting all industries')
    );

    setTimeout(() => {
      this.addTermsModal.show();
    }, 50);
    // this.superAdmin();

  }

  checkIfInvited() {
    this.route.queryParams.subscribe(params => {

      if (params.institution) {
        this.thirdParty = params.institution;
        this.registrationForm.institutionId = params.institution;
      }

    });
  }




  // superAdmin() {
  //   const superAdmin = {
  //     companyId: '',
  //     password: 'admin',
  //     email: 'kim@admin.com',
  //     userType: 'admin'
  //   };
  //   this.userService.registerUser(superAdmin).subscribe(
  //     data => this.notifyService.showSuccess('User admin creates', 'Success'),
  //     error => this.notifyService.showError('could not create super admin', 'Failed.')
  //   );
  // }






  moveFormOne2Two() {
    this.formOne = false;
    this.formTwo = true;
  }

  backToFormOne() {
    this.formTwo = false;
    this.formOne = true;
  }

  passwordConformation() {
    if (this.registrationForm.password !== this.registrationForm.password2 ) { this.passwordMatch = false; }
    if (this.registrationForm.password === this.registrationForm.password2 ) { this.passwordMatch = true; }
  }



  register() {
    this.ImprintLoader = true;
    const newProfileData = {
      companyName: this.registrationForm.companyName,
      logo: {
        url: '',
        name: ''
      },
      numberOfEmployees: this.registrationForm.numberOfEmployees,
      companyType:  this.registrationForm.companyType,
      institutionId: this.thirdParty ? this.thirdParty : this.registrationForm.institutionId,
      companyWebsite: this.registrationForm.companyWebsite,
      companyAbout: '',
      companyAddress: '',
      companyEmail: ''
    };


    this.companyProfileService.createCompanyProfile(newProfileData).subscribe(
      dataProfile => {
        const newUserData = {
          companyId: dataProfile._id,
          password: this.registrationForm.password,
          institutionId: this.registrationForm.institutionId,
          email: this.registrationForm.email,
          userType: 'customer',
          userRole: 'admin',
          departmentId: '',
        };

        this.userService.registerUser(newUserData).subscribe(
           async dataUser => {
           sessionStorage.setItem('loggedUserToken', dataUser.token);
           sessionStorage.setItem('loggedUserName', dataUser.name);
           sessionStorage.setItem('loggedUserInstitution', dataUser.institutionId);
           sessionStorage.setItem('loggedUserEmail', dataUser.email);
           sessionStorage.setItem('loggedUserID', dataUser._id);
           sessionStorage.setItem('loggedCompanyId', dataUser.companyId);
           sessionStorage.setItem('permissionStatus', 'isCustomer');

           updateHeader().then(() => {
            this.router.navigate(['/home/profile']);
           });
          },
          error => {this.notifyService.showWarning('Could not submit', 'Failled');  this.ImprintLoader = false; }
        );

      },
      error => {this.notifyService.showWarning('Could not submit', 'Failled');  this.ImprintLoader = false; }
    );

  }



  ngOnDestroy() {
    this.ImprintLoader = false;
  }

}
