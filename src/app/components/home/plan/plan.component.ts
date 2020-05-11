import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { faListAlt, faCheck, faSpinner, faBusinessTime } from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { PlansService } from 'src/app/shared/services/plan.service';


// tslint:disable

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.sass']
})
export class PlanComponent implements OnInit {


    constructor(
        private notifyService: NotificationService,
        private plansService: PlansService,
        private surveyService: SurveyService,
        private responseService: ResponseService,
        private questionService: QuestionService,
        private threatService: ThreatService,
        private threatCategoryService: ThreatCategoryService,
        private companyProfileService: CompanyProfileService,
        
      ) {  }

public AllPlans = [];
public AllSurveys = [];
public AllQuestions = [];
public AllResponses = [];
public ImprintLoader = false;
public pageProgress = 0;

public faCheck = faCheck;
public faListAlt = faListAlt;
public faSpinner = faSpinner;
public faBusinessTime = faBusinessTime;





ngOnInit() {
    localStorage.setItem('ActiveNav', 'plan');
    this.updatePage().then(() => { this.checkForCompletedSurveys(); });
}




async updatePage() {
  return new Promise((resolve, reject) => {

this.plansService.getAllCompanyPlans().subscribe(
  dataPlan => {
    this.AllPlans = dataPlan;

  this.surveyService.getAllInstitutionSurveys().subscribe(
    dataSurvey => {

      this.AllSurveys = dataSurvey;
      this.pageProgress = 25;

      this.questionService.getAllQuestions().subscribe(
        dataQuiz => {

          this.AllQuestions = dataQuiz;
          this.pageProgress = 50;


          this.responseService.getUsersResponses(localStorage.getItem('loggedUserID')).subscribe(
            dataRsp => {

            this.AllResponses = dataRsp;
            this.pageProgress = 75;
            if (this.AllResponses.length === 0) { this.pageProgress = 100; }
            this.checkIfPlanExists().then(() => resolve())
          

            },
            error => console.log('Error geting all Responses')
          );

        },
        error => console.log('Error getting all question')
      );
    },
    error => console.log('Error getting all surveys')
  );
},
error => console.log('Error getting all plans')
);

});
}




checkIfPlanExists() {
  return new Promise((resolve, reject) => {
    this.AllSurveys = this.AllSurveys.filter((surv) => {
      let x = this.AllPlans.map((e) => e.surveyId).indexOf(surv._id);
      if ( x === -1 ) { return true }
      if ( x !== -1 ) { return false }
    }).map((e => e));
    resolve();
  })
}



checkForCompletedSurveys() {

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

          this.pageProgress = 100; }

      });


      } else {
        surv.done = 0;
        if (ind === arr.length - 1) { this.pageProgress = 100; }

      }
      this.pageProgress = 100;
      return true;
    }).map( e => e);

}


























} // end of your class