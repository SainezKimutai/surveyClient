import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { faBook, faCheck, faEraser, faListAlt, faPowerOff, faSearch, faSpinner} from '@fortawesome/free-solid-svg-icons';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { UserService } from 'src/app/shared/services/user.service';

import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
// tslint:disable
// tslint:disable: prefer-const



public today = new Date();
public thisYear = this.today.getFullYear();




  constructor(
    private homeComponent: HomeComponent,
    private surveyService: SurveyService,
    private responseService: ResponseService,
    private questionService: QuestionService,
    private userService: UserService,
    private router: Router
  ) { }
public ImprintLoader = false;
public AllSurveys = [];
public SelectedSurvey: any;
public ViewAllSurvey = [];
public AllQuestions = [];
public AllResponses = [];
public ResponsesUsers = [];
public pageProgress = 0

public DashboardData = []
public ViewDashboardData = [];

public faCheck = faCheck;
public faListAlt = faListAlt;
public faSpinner = faSpinner;
public faEraser = faEraser;
public faPowerOff = faPowerOff;
public faSearch = faSearch;
public faBook = faBook;

public SurveySectionStatus = true;
public ResponsesSectionStatus = false;
public FilterName = ''



 ngOnInit() {
  sessionStorage.setItem('ActiveNav', 'dashboard');
  this.updatePage().then(()=> {
    this.getResponsesUsers().then(()=> {
      this.pageProgress = 100;
        // this.formatResponses()
    })
  })
 }



updatePage(): any {
  return new Promise((resolve, reject) => {
    this.pageProgress = 20;
    this.surveyService.getAllSurveys().subscribe(
      dataSurvey => {
        this.AllSurveys = dataSurvey.reverse()

        this.pageProgress = 40;
        this.responseService.getAllResponses().subscribe(
          dataRsp => {
          this.AllResponses = dataRsp;
          this.pageProgress = 60;
          if (this.AllResponses.length === 0) { this.pageProgress = 100; }
          resolve({});
    
          },
          error => console.log('Error geting all Survey')
        );
      },
      error => console.log('Error geting all Responses')
    );




});
}



getResponsesUsers() {
  return new Promise((resolve, reject) => {
    const userIds = this.AllResponses.map(e => e.userId)
    const userIdArray = Array.from(new Set(userIds));
    let num = userIdArray.length;
    userIdArray.forEach((userId, i, arr) => {
      this.userService.getOneUser(userId).subscribe(
        (userData) => {
          num = num - 1;
          this.ResponsesUsers = [...this.ResponsesUsers, userData]
          if (num === 0) {
            resolve({})
          }
        }, (err) => { 
           num = num - 1; console.log('User not found')
           if (num === 0) {
            resolve({})
          }
          }
      )
    })
  })
}



fetchData(survey): any {
  this.ImprintLoader = true;
    this.SelectedSurvey = survey;
    this.DashboardData = []
    this.ViewDashboardData = [];

    this.questionService.getQuestionsInASurvey(survey._id).subscribe(
      dataQuiz => {

        this.AllQuestions = dataQuiz;
       
        this.formatResponses()
        
      },
      error => console.log('Error getting all question')
    );

}




formatResponses() {
  let num = this.ResponsesUsers.length
  this.ResponsesUsers.forEach((user, i, arr) => {
    this.checkForCompletedSurveys(user).then(() => {
      num = num - 1
      if (num === 0 ) {
        this.ImprintLoader = false;
        this.SurveySectionStatus = false;
        this.ResponsesSectionStatus = true;
        this.DashboardData = this.DashboardData.sort((a, b) => b.done - a.done )
        this.ViewDashboardData = this.ViewDashboardData.sort((a, b) => b.done - a.done )


      }
    })

  })
  if (this.ResponsesUsers.length === 0) {
    this.ImprintLoader = false;
    this.SurveySectionStatus = false;
    this.ResponsesSectionStatus = true;
  }
}


checkForCompletedSurveys(userParam: any) {

  return new Promise((resolve, reject) => {
      let dashboardObject = {
        surveyName: '',
        surveyId: '',
        userId: '',
        userEmail: '',
        userCompanyId: '',
        done: null
      }
      dashboardObject.surveyName = this.SelectedSurvey.surveyName
      dashboardObject.surveyId = this.SelectedSurvey._id
      dashboardObject.userId = userParam._id
      dashboardObject.userEmail = userParam.email
      dashboardObject.userCompanyId = userParam.companyId



      let myResponses = this.AllResponses.filter((r) => r.surveyId === this.SelectedSurvey._id && r.userId === userParam._id ).map(e => e);
  
      if (myResponses.length > 0) {
          let allQuizs = this.AllQuestions.filter((q) => q.surveyId === this.SelectedSurvey._id).map(e => e);
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
              dashboardObject.done = Number(myCompletionValue);
              this.DashboardData = [...this.DashboardData, dashboardObject]
              this.ViewDashboardData = [...this.ViewDashboardData, dashboardObject];

              this.pageProgress = 100; resolve({}); 
            }

          });


      } else {
        dashboardObject.done = 0;
        // this.DashboardData = [...this.DashboardData, dashboardObject]
        // this.ViewDashboardData = [...this.ViewDashboardData, dashboardObject];
        this.pageProgress = 100; resolve({}); 

      }

  });
}




filterSurveys() {

  if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
    this.ViewDashboardData = this.DashboardData;
    } else {
      this.ViewDashboardData = this.DashboardData.filter(v => v.userEmail.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
    }

}

viewReport(itemParam: any) {
  this.router.navigate(['/home/reports'], { queryParams: {
    surveyName: itemParam.surveyName,
    surveyId: itemParam.surveyId,
    companyId: itemParam.userCompanyId,
    userId: itemParam.userId
  }});
}


back() {
  this.ResponsesSectionStatus = false;
  this.SurveySectionStatus = true;
}


 logOut() {
  this.homeComponent.logout();
}



}
