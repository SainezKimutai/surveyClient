import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faBuilding, faFire, faComment, faEnvelope, faKey , faGlobe , faAddressBook,
  faEdit, faCheck, faListAlt, faBookReader, faTrash, faChartLine, faChartBar, faChartPie,
  faArrowCircleRight, faArrowCircleLeft, faPlus,
  faFileAlt, faCommentAlt, faImage, faVideo, faFileWord, faFileExcel,
  faFilePowerpoint, faFilePdf, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { FileUploadService } from 'src/app/shared/services/fileUpload.service';
import { dev } from 'src/app/shared/dev/dev';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { PlansService } from 'src/app/shared/services/plan.service';
import { TaskPlanService } from 'src/app/shared/services/taskPlan.service';
import { ActivityPlanService } from 'src/app/shared/services/activityPlan.service';
import { HomeComponent } from '../home.component';
import { MixedColors } from 'src/app/shared/colors/color';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
 // tslint:disable
// tslint:disable: prefer-const

  constructor(
    private notifyService: NotificationService,
    private userService: UserService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private companyProfileService: CompanyProfileService,
    private responseService: ResponseService,
    private homeComponent: HomeComponent,
    private threatService: ThreatService,
    private threatCategoryService: ThreatCategoryService,
    private industryService: IndustryService,
    private plansService: PlansService,
    private taskPlanService: TaskPlanService,
    private activityPlanService: ActivityPlanService

  ) { }
  @ViewChild('viewAnswersModal', {static: true, }) viewAnswersModal: ModalDirective;
  @ViewChild('departmentModal', {static: true}) departmentModal: ModalDirective;
  @ViewChild('departmentFormModal', {static: true}) departmentFormModal: ModalDirective;
  @ViewChild('planDocsModal', {static: true}) planDocsModal: ModalDirective;
  @ViewChild('viewDescriptionModal', {static: true}) viewDescriptionModal: ModalDirective;


  public ImprintLoader = false;
  public ZeroSurveyDone = false;
  public noteOne = ''
  public noteTwo = '';

  public profileMinimized = false;


  // icon
    public faEnvelope = faEnvelope;
    public faKey = faKey;
    public faGlobe = faGlobe;
    public faAddressBook = faAddressBook;
    public faEdit = faEdit;
    public faCheck = faCheck;
    public faBuilding = faBuilding;
    public faFire = faFire;
    public faComment = faComment;
    public faListAlt = faListAlt;
    public faBookReader = faBookReader;
    public faTrash = faTrash;
    public faArrowCircleRight = faArrowCircleRight;
    public faArrowCircleLeft = faArrowCircleLeft;
    public faFileAlt = faFileAlt;
    public faCommentAlt = faCommentAlt;
    public faImage = faImage;
    public faVideo = faVideo;
    public faFileWord = faFileWord;
    public faFileExcel = faFileExcel;
    public faFilePowerpoint = faFilePowerpoint;
    public faFilePdf = faFilePdf;
    public faPowerOff = faPowerOff;

    public faPlus = faPlus;

 

    public AllUsers = [];
    public loggedUserEmail = '';
    public myCompany;
    public MyUserName = '---';

    public companyNameInputStatus = false;
    public companyNameInput = '';
    public companyAboutInputStatus = false;
    public companyAboutInput = '';
    public companyTypeInputStatus = false;
    public companyTypeInput = '';
    public companyWebsiteInputStatus = false;
    public companyWebsiteInput = '';
    public myUserNameInputStatus = false;
    public myUserNameInput = '';
    public numberOfEmployeesInputStatus = false;
    public numberOfEmployeesInput = '';
    public userPasswordInputStatus = false;
    public userPasswordInput = '';
    public previewCompLogo = null;
    public myCompLogo;



    public QuestionsOnView = [];
    public companyNameOnView = '';
    public surveyNameOnView = '';

    public CompanyRiskRates = [];




    public editProfileSwitch = false;
    public editDepartmentSwitch = false;
    public departmentInput = '';
    public departmentInputId = '';


   








  async ngOnInit() {
    sessionStorage.setItem('ActiveNav', 'profile');
    this.loggedUserEmail = sessionStorage.getItem('loggedUserEmail');

    this.ImprintLoader = true;
    this.updatePage().then(() => { this.ImprintLoader = false; });

  }





  updatePage() {
    return new Promise((resolve, reject) => {
      this.companyProfileService.getOneCompanyProfile(sessionStorage.getItem('loggedCompanyId')).subscribe(
        (data) => {
          this.myCompany = data;
          resolve({});
        }, (err) => { console.log(err)}
      )
      this.userService.getAllUsers().subscribe(
        (data) => {
          this.AllUsers = data.filter((user) => { user.companyId === sessionStorage.getItem('loggedCompanyId') }).map(e=> e);
          resolve({});
        }, (err) => { console.log(err)}
      )
  });
  }







  minimizeProfile() {
    // this.profileMinimized = !this.profileMinimized;
  }












  changeCompanyName() {
    this.ImprintLoader = true;
    this.companyProfileService.updateCompanyProfile( sessionStorage.getItem('loggedCompanyId'), {companyName: this.companyNameInput}).subscribe(
      data => {
        this.myCompany = data;
        this.ImprintLoader = false;
        this.companyNameInput = '';
        this.companyNameInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }




  changeCompanyType() {
    this.ImprintLoader = true;
    this.companyProfileService.updateCompanyProfile( sessionStorage.getItem('loggedCompanyId'), {companyType: this.companyTypeInput}).subscribe(
      data => {
        this.myCompany = data;
        this.ImprintLoader = false;
        this.companyTypeInput = '';
        this.companyTypeInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');

      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }



  changeCompanyWebsite() {
    this.ImprintLoader = true;
    this.companyProfileService.updateCompanyProfile( sessionStorage.getItem('loggedCompanyId'), {companyWebsite: this.companyWebsiteInput}).subscribe(
      data => {
        this.myCompany = data;
        this.ImprintLoader = false;
        this.companyWebsiteInput = '';
        this.companyWebsiteInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');

      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }


  changeNumberOfEmployees() {
    this.ImprintLoader = true;
    this.companyProfileService.updateCompanyProfile( sessionStorage.getItem('loggedCompanyId'), {numberOfEmployees: this.numberOfEmployeesInput}).subscribe(
      data => {
        this.myCompany = data;
        this.ImprintLoader = false;
        this.numberOfEmployeesInput = '';
        this.numberOfEmployeesInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');

      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }

  changeMyUserName() {
    this.ImprintLoader = true;
    this.userService.updateUsers( sessionStorage.getItem('loggedUserID'), {name: this.myUserNameInput}).subscribe(
      data => {

        this.ImprintLoader = false;
        this.myUserNameInput = '';
        this.myUserNameInputStatus = false;
        this.MyUserName = data.name;
        this.notifyService.showSuccess('Saved', 'Success');

      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }



  changeUserPasswordInput() {
    this.ImprintLoader = true;
    if ( this.userPasswordInput.toString().length < 4 ) {this.notifyService.showWarning('Should be more than 4 characters', 'Week Password'); } else {

    this.userService.updateUsers( sessionStorage.getItem('loggedUserID'), {password: this.userPasswordInput}).subscribe(
      data => {
        this.userPasswordInput = '';
        this.ImprintLoader = false;
        this.userPasswordInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
    }
  }










  showDepartmentFormModal() {
    this.departmentInput = '';
    this.departmentInputId = '';
    this.departmentFormModal.show();
  }


  editProfile(item) {
    this.departmentInput = item.departmentName;
    this.departmentInputId = item._id;
    this.departmentFormModal.show();
  }





  saveDepartment() {
    this.ImprintLoader = true;
    if (this.myCompany.department) {

      if (this.departmentInputId === '') {
        this.myCompany.department.push({departmentName: this.departmentInput});

        this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: this.myCompany.department}).subscribe(
          data => {
            this.ImprintLoader = false;
            this.myCompany = data;
            this.departmentInput = '';
            this.departmentInputId = '';
            this.notifyService.showSuccess('Department Created', 'Success');
            this.departmentFormModal.hide();
          },
          error => this.notifyService.showError('Could not create department', 'Failed')
        );
      } else {
        for (const dept of this.myCompany.department) {
          if (dept._id === this.departmentInputId) {
            dept.departmentName = this.departmentInput;

            this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: this.myCompany.department}).subscribe(
              data => {
                this.ImprintLoader = false;
                this.myCompany = data;
                this.departmentInput = '';
                this.departmentInputId = '';
                this.notifyService.showSuccess('Department Created', 'Success');
                this.departmentFormModal.hide();
              },
              error => this.notifyService.showError('Could not create department', 'Failed')
            );
            break;
          }
        }


      }





    } else {
      const newDepartment = [{departmentName: this.departmentInput}];
      this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: newDepartment}).subscribe(
        data => {
          this.ImprintLoader = false;
          this.myCompany = data;
          this.departmentInput = '';
          this.departmentInputId = '';
          this.notifyService.showSuccess('Department Created', 'Success');
          this.departmentFormModal.hide();
        },
        error => this.notifyService.showError('Could not create department', 'Failed')
      );
    }



  }








  deleteDepartment(id) {
    this.ImprintLoader = true;
    const findUser = this.AllUsers.filter((user) => (user.departmentId === id && user.companyId === this.myCompany._id)).map(e => e);

    if (findUser.length > 0) {
      this.notifyService.showWarning('re assign user under this department', 'Department Has Users !!');
    }
    if (findUser.length === 0) {

      const filterDepartment = this.myCompany.department.filter((dept) => dept._id !== id).map(e => e);

      this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: filterDepartment}).subscribe(
        data => {
          this.ImprintLoader = false;
          this.myCompany = data;
          this.departmentInput = '';
          this.departmentInputId = '';
          this.notifyService.showSuccess('Department Deleted', 'Success');
          this.departmentFormModal.hide();
        },
        error => this.notifyService.showError('Could not delete department', 'Failed')
      );
    }

  }



























  logOut() {
    this.homeComponent.logout();
  }






} // end of main class
