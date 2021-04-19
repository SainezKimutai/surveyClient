import { Component, OnInit, ViewChild } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';
import { faCheck, faListAlt, faSpinner, faBook, faEraser, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { HomeComponent } from '../home.component';
import { Location } from '@angular/common';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.sass']
})
export class SurveyComponent implements OnInit {

// tslint:disable: max-line-length
 // tslint:disable: prefer-const


  constructor(
    private homeComponent: HomeComponent,
    private surveyService: SurveyService,
    private responseService: ResponseService,
    private questionService: QuestionService,
    private router: Router,
    private notifyService: NotificationService,
    private userService: UserService,
    private location: Location
    ) { }
@ViewChild('deletePromptModal', {static: true}) deletePromptModal: ModalDirective;

  public AllSurveys = [];
  public ViewAllSurvey = [];
  public AllQuestions = [];
  public AllResponses = [];
  public ImprintLoader = false;
  public pageProgress = 0;

  public faCheck = faCheck;
  public faListAlt = faListAlt;
  public faSpinner = faSpinner;
  public faEraser = faEraser;
  public faPowerOff = faPowerOff;
  public faSearch = faSearch;
  public faBook = faBook;

  public surveyTobeErased = '';

  public FilterName = '';



  ngOnInit() {
    sessionStorage.setItem('ActiveNav', 'survey');
    this.updatePage().then(() => { this.checkForCompletedSurveys().then(() => { this.ViewAllSurvey = this.AllSurveys; } ); });
  }







  async updatePage() {
    return new Promise((resolve, reject) => {

    // tslint:disable: deprecation
    this.surveyService.getAllInstitutionSurveys().subscribe(
      dataSurvey => {

        this.AllSurveys = dataSurvey;

        this.pageProgress = 25;

        this.questionService.getAllQuestions().subscribe(
          dataQuiz => {

            this.AllQuestions = dataQuiz;
            this.pageProgress = 50;


            this.responseService.getUsersResponses().subscribe(
              dataRsp => {

              this.AllResponses = dataRsp;
              this.pageProgress = 75;
              if (this.AllResponses.length === 0) { this.pageProgress = 100; }
              resolve({});

              },
              error => console.log('Error geting all Responses')
            );

          },
          error => console.log('Error getting all question')
        );
      },
      error => console.log('Error getting all surveys')
    );

  });
  }



  checkForCompletedSurveys() {
    return new Promise((resolve, reject) => {
     this.AllSurveys =  this.AllSurveys.filter((surv, ind, arr) => {
        let myResponses = this.AllResponses.filter((r) => r.surveyId === surv._id).map(e => e);
        if (myResponses.length > 0) {
        let allQuizs = this.AllQuestions.filter((q) => q.surveyId === surv._id).map(e => e);
        let allQuizs2 = allQuizs.sort((a, b) =>  b.position - a.position);
        let allQuizs3 = allQuizs2.reverse();
        let allAnswers = myResponses[0].answers;
        let allAnswersNumber = Number(allAnswers.length);
        let nextQuiz = 0;



        allQuizs3.forEach((quiz, ind2, arr2) => {

          if (nextQuiz === 1) {
            let isAnswerPresent = allAnswers.filter((ans) => ans.questionId === quiz._id ).map(e => e );
            if (isAnswerPresent.length === 0) {allAnswersNumber = Number(allAnswersNumber) + 1; }
            nextQuiz = 0;
          }
          if (quiz.linked === true) {
            nextQuiz = nextQuiz + 1;
          }

          if ( ind2 === arr2.length - 1) {

            let myCompletionValue =  Number((( Number(allAnswersNumber) * 100 ) / Number(allQuizs2.length)).toFixed(0));
            surv.done = Number(myCompletionValue);

            this.pageProgress = 100; resolve({}); }

        });


        } else {
          surv.done = 0;
          if (ind === arr.length - 1) { this.pageProgress = 100; resolve({}); }

        }
        this.pageProgress = 100;
        resolve({});
        return true;
      }).map( e => e);
    });
  }








  passSurveyToReset(id) {
    this.surveyTobeErased = id;
  }


  resetSurvey() {
    this.deletePromptModal.hide();
    this.ImprintLoader = true;
    for (let resp of this.AllResponses) {
      if (resp.companyId === sessionStorage.getItem('loggedCompanyId') && resp.surveyId === this.surveyTobeErased && resp.userId === sessionStorage.getItem('loggedUserID') ) {

        this.responseService.deleteResponse(resp._id).subscribe(
          data => {
            this.updatePage().then(() => {
              this.checkForCompletedSurveys().then(() => { this.ViewAllSurvey = this.AllSurveys; } );
              this.ImprintLoader = false;
              this.notifyService.showSuccess('Survey Reset', 'Success');
            });
          },
          error => { this.ImprintLoader = false; this.notifyService.showError('Could not clear responses', 'Failed'); }
        );
        break;
      }
    }

  }





  filterSurveys() {

      if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
        this.ViewAllSurvey = this.AllSurveys;
        } else {
          this.ViewAllSurvey = this.AllSurveys.filter(v => v.surveyName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
        }

  }









  async takeSurvey(survey) {
    // Navigate to /results?page=1
    this.router.navigate(['/answer'], { queryParams: { surveyId: survey._id, surveyName: survey.surveyName} });
  }








  logOut() {
    this.homeComponent.logout();
  }





  // func() {
  //   this.userService.getAllUsers().subscribe(
  //     (data) => {

  //       let alluser = data.filter(u => u.userType !== 'thirdparty').map(e => e);

  //       const newUser = alluser.splice(97, 1);
  //       console.log(newUser);
  //     }, (err) => {
  //       console.log(err);
  //     }
  //   );
  // }



  viewReport(name, id) {
    this.router.navigate(['/home/reports'], { queryParams: {
      surveyName: name,
      surveyId: id,
      companyId: sessionStorage.getItem('loggedCompanyId'),
      userId: sessionStorage.getItem('loggedUserID')
    }});

}







}
