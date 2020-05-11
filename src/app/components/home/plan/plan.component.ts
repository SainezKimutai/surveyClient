import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ModalDirective } from 'ngx-bootstrap';


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

      @ViewChild('addPlanModal', {static: true}) addPlanModal: ModalDirective;

public AllPlans = [];
public AllSurveys = [];
public AllQuestions1 = [];
public AllQuestions2 = [];
public AllResponses = [];
public ImprintLoader = false;
public pageProgress = 0;

public faCheck = faCheck;
public faListAlt = faListAlt;
public faSpinner = faSpinner;
public faBusinessTime = faBusinessTime;

public TemplateQuestions: any;

public PlanSurveyId: any;
public NewPlan = [];
public planName = '';




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

          this.AllQuestions1 = dataQuiz;
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
      let allQuizs = this.AllQuestions1.filter((q) => q.surveyId === surv._id).map(e => e);
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









formatQuestions() {
  return new Promise((resolve, reject) => {

    this.responseService.getUsersResponses(localStorage.getItem('loggedUserID')).subscribe(
      data => { 
        data.forEach((responseObj, ind1, arr1) => {
               responseObj.answers.forEach((answr , ind2, arr2) => {
                const question = {};
        
                  this.questionService.getOneQuestion(answr.questionId).subscribe(
                      questions => {
                        
                         question['surveyId'] = responseObj.surveyId,
                         question['open'] = questions.open_question,
                         question['position'] = answr.position,

                         
                        
                         question['question'] = questions.question
                            if(answr.answer.length == 1){
                            
                            
                            answr.answer.forEach(answr => {
                              
                              question['answer'] = answr.answer ? answr.answer: answr;
                              question['recom'] = answr.recom ? answr.recom: '';
                              question['level'] = answr.level ? answr.level : '';
                              question['threat'] = answr.threatId ? answr.threat: '';
                            
                              
                               if(typeof(question['answer']) === 'object') { 
                                question['answer'] = answr.answer.answer;
                                question['recom'] = answr.answer.recom;
                                question['level'] = answr.answer.level;
                                question['threat'] = answr.answer.threatId ?  answr.answer.threat : '';
                                
                               }
                              });

                              this.AllQuestions2.push(question)
                               
                            
                          
                            };
                            if(answr.answer.length>1){

                                  question['answer'] = '';
                                  question['recom'] = '';
                                  question['level'] = '';
                                  question['threat'] = '';

                                  for(var i =0; i < answr.answer.length ; i++){
                                    

                                    question['answer'] = answr.answer[i].answer ? question['answer'] +" "+answr.answer[i].answer: '';
                                    question['recom'] = answr.answer[i].recom ? question['recom'] + " " + answr.answer[i].recom: '';
                                    question['level'] = answr.answer[i].level ? question['level'] + " " + answr.answer[i].level : '';
                                  
                                    
                                    if(i === answr.answer.length-1){
                                    this.AllQuestions2.push(question);
                                    }
                                  }
                  
                            }
                          // check for last loop
                          if ((ind1 === arr1.length - 1) && (ind2 === arr2.length - 1)){
                           
                            resolve();
                          }
                    })
              
              }); // responseObj.answers.forEach(answr => {

          });   // data.forEach(responseObj => {
      },
      error => console.log('Error getting all surveys')
  );

});
}







createPlan(surveyId: any) {
this.ImprintLoader = true;
this.PlanSurveyId = surveyId;
 this.formatQuestions().then(() => {
  let unSortedQuestions = this.AllQuestions2.filter(( quiz) => quiz.surveyId === surveyId ).map(e => e);
  this.TemplateQuestions = unSortedQuestions.sort((a, b) =>  a.position - b.position);
  
  this.getTheTreats( this.TemplateQuestions)
 })
}



getTheTreats(reportArr: any) {
  this.NewPlan = [];
  reportArr.forEach((reportElement, ind, arr) => {
    if(reportElement.threat) {
      let planObj = {
          threat: {
              threat: reportElement.threat,
              level: reportElement.level,
              recom: reportElement.recom
          },
          actionable: '',
          tasks : [],
          tracker: []
      }
      this.NewPlan.push(planObj)

      if(ind === arr.length - 1) {
        this.ImprintLoader = false;
        this.planName = '';
        this.addPlanModal.show();
      }
    } else {
      if(ind === arr.length - 1) {
        this.ImprintLoader = false;
        this.planName = '';
        this.addPlanModal.show();
      }
    }

  });


}


surveyUncomplete() {
  this.notifyService.showInfo('Please complete the survey before creating a plan', 'Survey Not Complete')
}






addPlan() {
  if (this.planName === '') {
    this.notifyService.showWarning('Type plan name', 'Blank Input');
  } else {
    this.ImprintLoader = true;
    this.addPlanModal.hide();
    let MyNewPlan = {
      companyId: localStorage.getItem('loggedCompanyId'),
      surveyId: this.PlanSurveyId,
      name: this.planName,
      plan: this.NewPlan,
      reporting: 'weekly'
    }
    this.plansService.createPlan(MyNewPlan).subscribe(
      data => {
        this.updatePage().then(() => { 
          this.checkForCompletedSurveys(); 
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Plan created', 'Success');
        });

      }, error => {
        this.ImprintLoader = false;
        this.notifyService.showError('Could not create plan', 'Failed')
      }
    )
  }
}




} // end of your class