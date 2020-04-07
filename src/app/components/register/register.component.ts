import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { faBuilding, faUsers, faGlobe, faIndustry, faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { ModalDirective, ModalOptions, ModalModule } from 'ngx-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
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

    this.userService.getAllUsers().subscribe(
      data => 
      {
        const allUsers = data;
        allUsers.forEach(user => {
          if(user.userType === 'thirdparty'){
            this.AllInstitutions.push(user);
          }
        });
      }, error => console.log('Error getting all institutions')
    );

    this.industryService.getAllIndustrys().subscribe(
      data => this.AllIndustrys = data,
      error => console.log('Error getting all industries')
    );

    setTimeout(()=>{
      this.addTermsModal.show();
    }, 50);
    // this.superAdmin();

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
      institutionId: this.registrationForm.institutionId,
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
          dataUser => {
            localStorage.setItem('loggedUserToken', dataUser.token);
            localStorage.setItem('loggedUserName', dataUser.name);
            localStorage.setItem('loggedUserInstitution', dataUser.institutionId);
            localStorage.setItem('loggedUserEmail', dataUser.email);
            localStorage.setItem('loggedUserID', dataUser._id);
            localStorage.setItem('loggedCompanyId', dataUser.companyId);
            localStorage.setItem('permissionStatus', 'isCustomer');
            this.router.navigate(['/home/profile']);
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
