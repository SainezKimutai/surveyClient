import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';


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
    private notifyService: NotificationService
  ) { }


  public ImprintLoader = false;
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
      companyWebsite: '',
      companyId: '',
      password: '',
      password2: '',
      email: '',
      userType: 'customer'
    };


  }



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
      companyWebsite: this.registrationForm.companyWebsite
    };
    this.companyProfileService.createCompanyProfile(newProfileData).subscribe(
      dataProfile => {

        const newUserData = {
          companyId: dataProfile._id,
          password: this.registrationForm.password,
          email: this.registrationForm.email,
          userType: 'customer'
        };

        this.userService.registerUser(newUserData).subscribe(
          dataUser => {
            localStorage.setItem('loggedUserName', dataUser.name);
            localStorage.setItem('loggedUserEmail', dataUser.email);
            localStorage.setItem('loggedUserID', dataUser._id);
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
