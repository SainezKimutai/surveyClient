import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { faBuilding, faUsers, faGlobe, faIndustry, faEnvelope, faKey, faPen} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router , ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'app-passwordreset',
    templateUrl: './passwordreset.component.html',
    styleUrls: ['./passwordreset.component.sass']
  })
  export class PasswordResetComponent implements OnInit {

    // tslint:disable
    email: String;
    token: String;

    public passwordResetForm;
    public passwordMatch = false;
    public ImprintLoader = false;

    public faBuilding = faBuilding;
    public faUsers = faUsers;
    public faIndustry = faIndustry;
    public faGlobe = faGlobe;
    public faEnvelope = faEnvelope;
    public faKey = faKey;
    public faPen = faPen;
    

    //ef212516dhj267162718h87126782 
     constructor(
       private router: Router,
       private activeRoute: ActivatedRoute,
       private userService: UserService,
       private notifyService: NotificationService
     ) { }
   
      
     ngOnInit() {
       this.activeRoute.queryParams.subscribe(params => {
           this.email = params.email;
           this.token = params.token;
       });
       this.passwordResetForm = {
        password: '',
        password2: '',
        email: this.email,
      };

       console.log(this.email);
     }

     resetPassword(){
        this.ImprintLoader = true;
         this.userService.passwordReset(this.passwordResetForm).subscribe(user=> {
             this.ImprintLoader = false;
            this.notifyService.showSuccess('Password successfully reset, redirecting to login page', 'Success');
             this.delay(4000).then(any=>{
                this.router.navigateByUrl('/landing_page');
           });
         }, err => {
            this.ImprintLoader = false;
            {this.notifyService.showWarning('Could not submit', 'Failled'); }
         })

     }

     passwordConformation() {
        if (this.passwordResetForm.password !== this.passwordResetForm.password2 ) { this.passwordMatch = false; }
        if (this.passwordResetForm.password === this.passwordResetForm.password2 ) { this.passwordMatch = true; }
      }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
      
   }