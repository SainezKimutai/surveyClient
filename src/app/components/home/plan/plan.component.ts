import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { faListAlt, faCheck, faSpinner, faBusinessTime, faPowerOff, faSearch, faBook } from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import { PlansService } from 'src/app/shared/services/plan.service';
import { ModalDirective } from 'ngx-bootstrap';
import { TaskPlanService } from 'src/app/shared/services/taskPlan.service';
import { HomeComponent } from '../home.component';


// tslint:disable

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.sass']
})
export class PlanComponent implements OnInit {


    constructor(
        private notifyService: NotificationService,
        private homeComponent: HomeComponent,
        private plansService: PlansService,
        private surveyService: SurveyService,
        private responseService: ResponseService,
        private questionService: QuestionService,
        private taskPlanService: TaskPlanService
      ) {  }

      @ViewChild('addPlanModal', {static: true}) addPlanModal: ModalDirective;

public ListPlanStatus = true;
public EditPlanStatus = false;


public AllPlans = [];
public ViewAllPlans = [];
public AllSurveys = []; 
public ViewAllSurvey = [];
public AllQuestions1 = [];
public AllQuestions2 = [];
public AllResponses = [];
public TaskPlan = [];
public ImprintLoader = false;
public pageProgress = 0;

public faCheck = faCheck;
public faListAlt = faListAlt;
public faSpinner = faSpinner;
public faBusinessTime = faBusinessTime;
public faPowerOff = faPowerOff;
public faSearch = faSearch;
public faBook = faBook;

public TemplateQuestions: any;

public PlanSurveyId: any;
public PlanResponseId: any;
public NewPlan = [];
public planName = '';

public FilterName = ''
public FilterName2 = '';




ngOnInit() {
    sessionStorage.setItem('ActiveNav', 'plan');
    this.updatePage().then(() => { this.checkForCompletedSurveys().then(() => { 
      this.ViewAllSurvey = this.AllSurveys; 
      this.ViewAllPlans = this.AllPlans; 
      this.removeUnUsedTasks();  
    }); });
}




async updatePage() {
  return new Promise((resolve, reject) => {

this.plansService.getAllCompanyPlans().subscribe(
  dataPlan => {
    this.AllPlans = dataPlan;
 
    // this.AllPlans.forEach((p) => {
    //     this.plansService.deletePlan(p._id).subscribe(() => this.notifyService.showSuccess('deleted', 'Deleted'))
    //   })

    this.taskPlanService.getAllTaskPlanByCompanyId().subscribe(
      dataTask => {
        this.TaskPlan = dataTask;
                    
      this.surveyService.getAllInstitutionSurveys().subscribe(
        dataSurvey => {
        
          this.AllSurveys = dataSurvey;
          this.pageProgress = 25;

          this.questionService.getAllQuestions().subscribe(
            dataQuiz => {

              this.AllQuestions1 = dataQuiz;
              this.pageProgress = 50;


              this.responseService.getUsersResponses().subscribe(
                dataRsp => {

                this.AllResponses = dataRsp;
                this.pageProgress = 75;
                if (this.AllResponses.length === 0) { this.pageProgress = 100; }
                this.checkIfPlanExists().then(() => resolve({}))
              

                },
                error => console.log('Error geting all Responses')
              );

            },
            error => console.log('Error getting all question')
          );
        },
        error => console.log('Error getting all surveys')
      );
     
  }, error => console.log('Error getting task plan')
  )
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
    resolve({});
  })
}



checkForCompletedSurveys() {
  return new Promise((resolve, reject) => {
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

          this.pageProgress = 100;  resolve({})}

      });


      } else {
        surv.done = 0;
        if (ind === arr.length - 1) { this.pageProgress = 100; resolve({})}

      }
      this.pageProgress = 100; resolve({})
     
      return true;
    }).map( e => e);
    if (this.AllSurveys.length === 0) { this.pageProgress = 100; resolve({})}
  })
}









formatQuestions() {
  return new Promise((resolve, reject) => {
    this.AllQuestions2 = [];
    this.responseService.getUsersResponses().subscribe(
      data => { 
  
        data.forEach((responseObj, ind1, arr1) => {
               responseObj.answers.forEach((mainAnswer , ind2, arr2) => {
                const question = {};
                  this.questionService.getOneQuestion(mainAnswer.questionId).subscribe(
                      questions => {
                         question['responseId'] = responseObj._id;
                         question['surveyId'] = responseObj.surveyId,
                         question['open'] = questions.open_question,
                         question['position'] = mainAnswer.position,

                         
                        
                         question['question'] = questions.question
                            if(mainAnswer.answer.length == 1){
                            
                            
                              mainAnswer.answer.forEach(answr => {
                              
                              question['answer'] = answr.answer ? answr.answer: answr;
                              question['recom'] = answr.recom ? answr.recom: '';
                              question['level'] = answr.level ? answr.level : '';
                              question['threat'] = answr.threatId ? answr.threat: '';
                              question['threatId'] = answr.threatId ? answr.threatId: '';
                              question['answerId'] = mainAnswer._id ?  mainAnswer._id : '';
                             
                            
                              
                               if(typeof(question['answer']) === 'object') { 
                            
                                question['answer'] = answr.answer.answer;
                                question['recom'] = answr.answer.recom;
                                question['level'] = answr.answer.level;
                                question['threat'] = answr.answer.threatId ?  answr.answer.threat : '';
                                question['threatId'] = answr.answer.threatId ?  answr.answer.threatId : '';
                                question['answerId'] = mainAnswer._id ? mainAnswer._id : '';
                                
                               }
                              });

                              this.AllQuestions2.push(question)
                               
                            
                          
                            };
                            if(mainAnswer.answer.length>1){

                                  question['answer'] = '';
                                  question['recom'] = '';
                                  question['level'] = '';
                                  question['threat'] = '';
                                  question['threatId'] = '';
                                  question['answerId'] = '';

                                  for(var i =0; i < mainAnswer.answer.length ; i++){
                                    

                                    question['answer'] = mainAnswer.answer[i].answer ? question['answer'] +" "+mainAnswer.answer[i].answer: '';
                                    question['recom'] = mainAnswer.answer[i].recom ? question['recom'] + " " + mainAnswer.answer[i].recom: '';
                                    question['level'] = mainAnswer.answer[i].level ? question['level'] + " " + mainAnswer.answer[i].level : '';
                                  
                                    
                                    if(i === mainAnswer.answer.length-1){
                                    this.AllQuestions2.push(question);
                                    }
                                  }
                  
                            }
                          // check for last loop
                          if ((ind1 === arr1.length - 1) && (ind2 === arr2.length - 1)){
                           
                            resolve({});
                          }
                    })
              
              }); // responseObj.answers.forEach(answr => {

          });   // data.forEach(responseObj => {
      },
      error => console.log('Error getting all surveys')
  );

});
}







filterSurveys() {
  if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
    this.ViewAllSurvey = this.AllSurveys;
    } else {
      this.ViewAllSurvey = this.AllSurveys.filter(v => v.surveyName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
    }
}


filterPlans() {
  if (!this.FilterName2 || this.FilterName2 === null || this.FilterName2 === '' || this.FilterName2.length  < 1) {
    this.ViewAllPlans = this.AllPlans;
    } else {
      this.ViewAllPlans = this.AllPlans.filter(v => v.name.toLowerCase().indexOf(this.FilterName2.toLowerCase()) > -1).slice(0, 10);
    }
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
  this.PlanResponseId = reportArr[0].responseId
  reportArr.forEach((reportElement, ind, arr) => {
    if(reportElement.threat && (reportElement.level === 'Medium' || reportElement.level === 'High')) {
      let planObj = {
          threat: {
              answerId: reportElement.answerId,
              threatId: reportElement.threatId,
              threat: reportElement.threat,
              level: reportElement.level,
              recom: reportElement.recom
          },
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
      companyId: sessionStorage.getItem('loggedCompanyId'),
      surveyId: this.PlanSurveyId,
      responseId: this.PlanResponseId,
      name: this.planName,
      plan: this.NewPlan
    }
    this.plansService.createPlan(MyNewPlan).subscribe(
      data => {
        this.updatePage().then(() => { 
          this.checkForCompletedSurveys().then(() => {
            this.ViewAllSurvey = this.AllSurveys; 
            this.ViewAllPlans = this.AllPlans; 
            this.ImprintLoader = false;
            this.notifyService.showSuccess('Plan created', 'Success');
          }); 

        });

      }, error => {
        this.ImprintLoader = false;
        this.notifyService.showError('Could not create plan', 'Failed')
      }
    )
  }
}





editPlan(plan: any) {
  sessionStorage.setItem('planOnEdit', JSON.stringify(plan))
  this.EditPlanStatus = true;
  this.ListPlanStatus = false;
}


toListsPage() {
  this.EditPlanStatus = false;
  this.ListPlanStatus = true;
  this.updatePage().then(() => { this.checkForCompletedSurveys().then(() => {    
    this.ViewAllSurvey = this.AllSurveys; 
    this.ViewAllPlans = this.AllPlans; 
    this.removeUnUsedTasks() 
  });});
}










removeUnUsedTasks() {
  this.TaskPlan.forEach((taskPlanElement) => {
    let shared = false ;
    this.AllPlans.forEach((planParam, ind1, arr1) => {
      planParam.plan.forEach((pp, ind2, arr2) => {
        if( pp.tasks.indexOf(taskPlanElement._id) !== -1) {
          shared = true;
        }
        if (ind1 === arr1.length - 1 && ind2 === arr2.length -1 ) {
          if (!shared) {
            this.taskPlanService.deleteTaskPlan(taskPlanElement._id).subscribe(data => console.log('TaskPlan deleted'), error => 'Error deleting unsued task plans')
          }
        }
      })
    })
  })
}










logOut() {
  this.homeComponent.logout();
}








} // end of your class