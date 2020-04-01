import { Component, ViewChild, OnInit } from '@angular/core';
import { faBackward, } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { faListAlt, faDownload } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass']
})
export class ReportsComponent implements OnInit {
    constructor(
        private notifyService: NotificationService,
        private surveyService: SurveyService,
        private responseService: ResponseService,
        private questionService: QuestionService,
        private threatService: ThreatService
      ) {  }
      public ImprintLoader = false;
  //  tslint:disable
    
    // Icons
      public faBackward = faBackward;
      public faListAlt = faListAlt;
      public faDownload = faDownload;
    
      //
      public AllSurveys = [];//keep and rename..
      public AllResponses =[];
      public AllQuestions = [];
      public TemplateNameOnView = [];
      public TemplateQuestions = []; // keep and rename.
      public TemeplateViewSectionStatus = true; // keep.
      public QuestionsViewStatus = false; // keep and rename.

      ngOnInit() {
        localStorage.setItem('ActiveNav', 'reports');
        this.updatePage();
      }

      updatePage() {
        return new Promise((resolve, reject) => {
    
          this.responseService.getUsersResponses(localStorage.getItem('loggedUserID')).subscribe(
            data => 
            { 
             
              data.forEach(responseObj => {
                    this.surveyService.getOneSurvey(responseObj.surveyId).subscribe(
                     survey =>{
                         this.AllSurveys.push((survey));
                      }
                     )
                     responseObj.answers.forEach(answr => {
                      const question = {};
                        this.questionService.getOneQuestion(answr.questionId).subscribe(
                            questions=>{
                              
                               question['surveyId'] = responseObj.surveyId,
                               question['open'] = questions.open_question,
                              
                               question['question'] = questions.question
                                  if(answr.answer.length == 1){
                                  
                                  answr.answer.forEach(answr => {
                                  

                                    question['answer'] = answr.answer ? answr.answer: answr;
                                    question['recom'] = answr.recom ? answr.recom: '';
                                    question['level'] = answr.level ? answr.level : '';
                                    

                                    if(typeof(question['answer']) === 'object'){
                                      
                                      question['answer'] = answr.answer.answer;
                                      question['recom'] = answr.answer.recom;
                                      question['level'] = answr.answer.level;
                              
                                    }

                                    this.AllQuestions.push(question);
                                     
                                  });
                                
                            }
                            if(answr.answer.length>1){

                                question['answer'] = '';
                                question['recom'] = '';
                                question['level'] = '';

                              for(var i =0; i < answr.answer.length ; i++){
                                

                                question['answer'] = answr.answer[i].answer ? question['answer'] +" "+answr.answer[i].answer: '';
                                question['recom'] = answr.answer[i].recom ? question['recom'] + " " + answr.answer[i].recom: '';
                                question['level'] = answr.answer[i].level ? question['level'] + " " + answr.answer[i].level : '';
                                
                                if(i === answr.answer.length-1){
                                this.AllQuestions.push(question);
                                }
                              }
              
                            }
                    }

                    )
                    
                    });
                });
            },
            error => console.log('Error getting all surveys')
        );
     });
    }

    //keep and rename.
      viewSurveyTemplates() {
        this.TemeplateViewSectionStatus = true;
        this.QuestionsViewStatus = false;
      }
    
    
    //keep and rename.
      viewSurvey(name, id) {
        this.TemplateQuestions = [];
        this.TemplateNameOnView = name;
        let unSortedQuestions = this.AllQuestions.filter(( quiz) => quiz.surveyId === id ).map(e => e);
        // console.log(unSortedQuestions);
        this.TemplateQuestions = unSortedQuestions.sort((a, b) =>  a.position - b.position);
        this.TemeplateViewSectionStatus = false;
        this.QuestionsViewStatus = true;
    
    }
}
    