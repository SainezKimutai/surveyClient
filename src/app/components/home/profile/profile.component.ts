import { Component, OnInit, ViewChild } from '@angular/core';
import { faBuilding, faFire, faComment, faEnvelope, faKey , faGlobe , faAddressBook,
  faEdit, faCheck, faListAlt, faBookReader, faTrash} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { FileUploadService } from 'src/app/shared/services/fileUpload.service';
import { dev } from 'src/app/shared/dev/dev';
import { ModalDirective } from 'ngx-bootstrap';

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
    private responseService: ResponseService,
    private fileUploadServcie: FileUploadService

  ) { }
  @ViewChild('viewAnswersModal', {static: true, }) viewAnswersModal: ModalDirective;
  @ViewChild('departmentModal', {static: true}) departmentModal: ModalDirective;
  @ViewChild('departmentFormModal', {static: true}) departmentFormModal: ModalDirective;
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



    public QuestionsOnView = [];
    public companyNameOnView = '';
    public surveyNameOnView = '';

    public CompanyRiskRates = [];




    public editProfileSwitch = false;
    public editDepartmentSwitch = false;
    public departmentInput = '';
    public departmentInputId = '';





  ngOnInit() {
    localStorage.setItem('ActiveNav', 'profile');
    this.loggedUserEmail = localStorage.getItem('loggedUserEmail');

    this.updatePage().then(() => {this.computeCompanyRiskRates(); });

  }



  updatePage() {
    return new Promise((resolve, reject) => {
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
      data => {this.AllResponses = data; resolve(); },
      error => console.log('Error geting all Responses')
    );
  });
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



  computeCompanyRiskRates() {

      this.AllResponses.forEach((resp) => {
        if (this.myCompany._id === resp.companyId) {

          for (const surv of this.AllSurveys) {
            if (resp.surveyId === surv._id) {

              const data = {
                companyId: this.myCompany._id,
                surveyId: surv._id,
                responseId: resp._id,
                companyName: this.myCompany.companyName,
                surveyName: surv.surveyName,
                riskRate: 'To be determined',
                recommendation: 'Awaiting...'
              };

              this.CompanyRiskRates.push(data);

            }
          }
        }
      });

  }






  openAnswersModal(companyName, surveyName, surveyId, responseId) {
    this.companyNameOnView = companyName;
    this.surveyNameOnView = surveyName;
    this.QuestionsOnView = [];

    for (const resp of this.AllResponses) {
     if ( resp._id === responseId) {

      resp.answers.forEach((ans) => {

        for (const quiz of this.AllQuestions) {
          if (ans.questionId === quiz._id) {
            const theQuestions = {
              question: quiz.question,
              answers: []
            };

            quiz.choices.forEach((myAns, key, arr) => {
              if (ans.answer.includes(myAns.answer)) {
                theQuestions.answers.push({picked: true, answer: myAns.answer });
                if (Object.is(arr.length - 1, key)) {
                  this.QuestionsOnView.push(theQuestions);
                }
              } else {
                theQuestions.answers.push({picked: false, answer: myAns.answer });
                if (Object.is(arr.length - 1, key)) {
                  this.QuestionsOnView.push(theQuestions);
                }
              }
            });

            // break;
          }
        }

      });
      // break;
     }
   }


    this.viewAnswersModal.show();
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
    if (this.myCompany.department) {

      if (this.departmentInputId === '') {
        this.myCompany.department.push({departmentName: this.departmentInput});

        this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: this.myCompany.department}).subscribe(
          data => {
            this.updatePage().then(() => {
              this.departmentInput = '';
              this.departmentInputId = '';
              this.notifyService.showSuccess('Department Created', 'Success');
              this.departmentFormModal.hide();
            });
          },
          error => this.notifyService.showError('Could not create department', 'Failed')
        );
      } else {
        for (const dept of this.myCompany.department) {
          if (dept._id === this.departmentInputId) {
            dept.departmentName = this.departmentInput;

            this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: this.myCompany.department}).subscribe(
              data => {
                this.updatePage().then(() => {
                  this.departmentInput = '';
                  this.departmentInputId = '';
                  this.notifyService.showSuccess('Department Created', 'Success');
                  this.departmentFormModal.hide();
                });
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
          this.updatePage().then(() => {
            this.departmentInput = '';
            this.departmentInputId = '';
            this.notifyService.showSuccess('Department Created', 'Success');
            this.departmentFormModal.hide();
          });
        },
        error => this.notifyService.showError('Could not create department', 'Failed')
      );
    }



  }








  deleteDepartment(id) {

    const findUser = this.AllUsers.filter((user) => (user.departmentId === id && user.companyId === this.myCompany._id)).map(e => e);

    if (findUser.length > 0) {
      this.notifyService.showWarning('re assign user under this department', 'Department Has Users !!');
    }
    if (findUser.length === 0) {

      const filterDepartment = this.myCompany.department.filter((dept) => dept._id !== id).map(e => e);

      this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: filterDepartment}).subscribe(
        data => {
          this.updatePage().then(() => {
            this.departmentInput = '';
            this.departmentInputId = '';
            this.notifyService.showSuccess('Department deleted', 'Success');
            this.departmentFormModal.hide();
          });
        },
        error => this.notifyService.showError('Could not delete department', 'Failed')
      );
    }

  }







}
