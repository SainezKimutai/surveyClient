import { Component, OnInit, ViewChild } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';
import { faCheck, faListAlt, faSpinner, faEraser} from '@fortawesome/free-solid-svg-icons';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.sass']
})
export class SurveyComponent implements OnInit {

// tslint:disable: max-line-length
 // tslint:disable: prefer-const


  constructor(
    private surveyService: SurveyService,
    private responseService: ResponseService,
    private questionService: QuestionService,
    private router: Router,
    private notifyService: NotificationService,
    ) { }
@ViewChild('deletePromptModal', {static: true}) deletePromptModal: ModalDirective;

  public AllSurveys = [];
  public AllQuestions = [];
  public AllResponses = [];
  public ImprintLoader = false;

  public faCheck = faCheck;
  public faListAlt = faListAlt;
  public faSpinner = faSpinner;
  public faEraser = faEraser;

  public surveyTobeErased = '';


  

  ngOnInit() {
    this.ImprintLoader = true;
    localStorage.setItem('ActiveNav', 'survey');
    this.updatePage().then(() => { this.checkForCompletedSurveys(); });
  }







  async updatePage() {
    return new Promise((resolve, reject) => {

    this.surveyService.getAllInstitutionSurveys().subscribe(
      data => {this.AllSurveys = data;
      },
      error => console.log('Error getting all surveys')
    );
    if (this.AllSurveys != null || this.AllSurveys.length !== 0 ) {
    this.questionService.getAllQuestions().subscribe(
      data => this.AllQuestions = data,
      error => console.log('Error getting all question')
    );
    this.responseService.getAllResponses().subscribe(
      data => {this.AllResponses = data; resolve(); },
      error => console.log('Error geting all Responses')
    );
    this.ImprintLoader = false;
    } else {
      this.ImprintLoader = false;
    }
  });
  }



  checkForCompletedSurveys() {
     this.AllSurveys =  this.AllSurveys.filter((surv) => {
        const myResponses = this.AllResponses.filter((resp) => (resp.companyId === localStorage.getItem('loggedCompanyId') && resp.surveyId === surv._id) && resp.userId === localStorage.getItem('loggedUserID') ).map( e => e);
        if (myResponses.length > 0) {
        let allQuizs = this.AllQuestions.filter((q) => q.surveyId === surv._id).map(e => e);
        let allAnswers = myResponses[0].answers;
        let myCompletionValue = (( Number(allAnswers.length) * 100 ) / Number(allQuizs.length)).toFixed(0);
        surv.done = Number(myCompletionValue);
        } else {
          surv.done = 0;
        }
        return true;
      }).map( e => e);

  }








  passSurveyToReset(id) {
    this.surveyTobeErased = id;
  }


  resetSurvey() {

    for (let resp of this.AllResponses) {
      if (resp.companyId === localStorage.getItem('loggedCompanyId') && resp.surveyId === this.surveyTobeErased && resp.userId === localStorage.getItem('loggedUserID') ) {

        this.responseService.deleteResponse(resp._id).subscribe(
          data => {
            this.updatePage().then(() => {
              this.checkForCompletedSurveys();
              this.notifyService.showSuccess('Survey Reset', 'Success');
              this.deletePromptModal.hide();
            });
          },
          error => this.notifyService.showError('Could not clear responses', 'Failed')
        );
        break;
      }
    }

  }














  async takeSurvey(survey) {
    // Navigate to /results?page=1
    this.router.navigate(['/answer'], { queryParams: { surveyId: survey._id, surveyName: survey.surveyName} });
  }



















}
