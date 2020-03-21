import { Component, OnInit } from '@angular/core';
import { faEnvelope, faKey , faGlobe , faAddressBook, faEdit, faCheck} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { FileUploadService } from 'src/app/shared/services/fileUpload.service';
import { dev } from 'src/app/shared/dev/dev';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
 // tslint:disable: max-line-length

  constructor(
    private notifyService: NotificationService,
    private userService: UserService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private companyProfileService: CompanyProfileService,
    public responseService: ResponseService,
    public fileUploadServcie: FileUploadService

  ) { }

    // icon
    public faEnvelope = faEnvelope;
    public faKey = faKey;
    public faGlobe = faGlobe;
    public faAddressBook = faAddressBook;
    public faEdit = faEdit;
    public faCheck = faCheck;

    public AllUsers = [];
    public AllCompanies = [];
    public AllSurveys = [];
    public AllQuestions = [];
    public AllResponses = [];

    public loggedUserEmail = '';
    public myCompany;


    public companyNameInputStatus = false;
    public companyNameInput = '';
    public companyAboutInputStatus = false;
    public companyAboutInput = '';
    public companyEmailInputStatus = false;
    public companyEmailInput = '';
    public companyWebsiteInputStatus = false;
    public companyWebsiteInput = '';
    public companyAddressInputStatus = false;
    public companyAddressInput = '';
    public userPasswordInputStatus = false;
    public userPasswordInput = '';
    public previewCompLogo = null;
    public myCompLogo;








  ngOnInit() {
    localStorage.setItem('ActiveNav', 'profile');
    this.loggedUserEmail = localStorage.getItem('loggedUserEmail');

    this.updatePage();
  }



  updatePage() {
    this.userService.getAllUsers().subscribe(
      data => this.AllUsers = data,
      error => console.log('Error geting all Users')
    );
    this.companyProfileService.getAllCompanyProfiles().subscribe(
      data => {
        this.AllCompanies = data;
        for (const comp of this.AllCompanies) { if (comp._id === localStorage.getItem('loggedCompanyId')) { this.myCompany = comp; break; }}
      },
      error => console.log('Error geting all Companies')
    );
    this.surveyService.getAllSurveys().subscribe(
      data => this.AllSurveys = data,
      error => console.log('Error geting all Surveys')
    );
    this.questionService.getAllQuestions().subscribe(
      data => this.AllQuestions = data,
      error => console.log('Error geting all Questions')
    );
    this.responseService.getAllResponses().subscribe(
      data => this.AllUsers = data,
      error => console.log('Error geting all Responses')
    );
  }



  changeCompanyName() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyName: this.companyNameInput}).subscribe(
      data => {
        this.updatePage();
        this.companyNameInput = '';
        this.companyNameInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }

  changeCompanyAbout() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyAbout: this.companyAboutInput}).subscribe(
      data => {
        this.updatePage();
        this.companyAboutInput = '';
        this.companyAboutInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }


  uploadLogo(fileInputOne) {
    this.myCompLogo =  fileInputOne.target.files[0] as File;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.previewCompLogo = fileReader.result;
    },
    fileReader.readAsDataURL(this.myCompLogo);
  }

  saveCompanyProfile() {
    // tslint:disable-next-line: new-parens
    const formData = new FormData;
    formData.append('fileUploaded', this.myCompLogo, this.myCompLogo.name);

    this.fileUploadServcie.uploadCompanyLogo(formData).subscribe(
      data => {
        const logoData = {
          url: `${dev.connect}static/images/companyProfileImages/${data.imageName}`,
          name: data.imageName
        };

        if (this.myCompany.logo.url !== '' ) { this.removeLogo(this.myCompany.logo.name ); }

        this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {logo: logoData}).subscribe(
          dataU => {
            this.updatePage();
            this.previewCompLogo = null;
            this.notifyService.showSuccess('Saved', 'Success');
          },
          error => this.notifyService.showError('Could not save', 'Failed')
        );



      },
      error => {
        this.notifyService.showError('Could not upload Picture', 'Failed');
      }
    );

  }


  removeLogo(name) {
    this.fileUploadServcie.removeCompanyLogo(name).subscribe(data => '', error => 'Erro deleting log');
  }

  changeCompanyEmail() {

    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyEmail: this.companyEmailInput}).subscribe(
      data => {
        this.updatePage();
        this.companyEmailInput = '';
        this.companyEmailInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }



  changeCompanyWebsite() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyWebsite: this.companyWebsiteInput}).subscribe(
      data => {
        this.updatePage();
        this.companyWebsiteInput = '';
        this.companyWebsiteInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }


  changeCompanyAddress() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyAddress: this.companyAddressInput}).subscribe(
      data => {
        this.updatePage();
        this.companyAddressInput = '';
        this.companyAddressInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }


  changeUserPasswordInput() {

    if ( this.userPasswordInput.toString().length < 4 ) {this.notifyService.showWarning('Should be more than 4 characters', 'Week Password'); } else {

    this.userService.updateUsers( localStorage.getItem('loggedUserID'), {password: this.userPasswordInput}).subscribe(
      data => {
        this.userPasswordInput = '';
        this.userPasswordInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
    }
  }











}
