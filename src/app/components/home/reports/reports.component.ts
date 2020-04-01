import { Component, ViewChild, OnInit } from '@angular/core';
import { faBackward, } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { ModalDirective, ModalOptions, ModalModule } from 'ngx-bootstrap';
import { faCheck, faListAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { async } from '@angular/core/testing';

import * as jspdf from 'jspdf';
import 'jspdf-autotable';

declare let html2canvas: any;

// tslint:disable

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
        private threatService: ThreatService,
        
      ) {  }
      public ImprintLoader = false;
  //  tslint:disable
    
    // Icons
      public faBackward = faBackward;
      public faListAlt = faListAlt;
      public faDownload = faDownload;
    
      //
      public AllSurveys: any;//keep and rename..
      public AllResponses =[];
      public AllThreats = [];
      public AllQuestions = [];
      public TemplateNameOnView = [];
      public TemplateQuestions = []; // keep and rename.
      public TemeplateViewSectionStatus = true; // keep.
      public QuestionsViewStatus = false; // keep and rename.

      ngOnInit() {
        localStorage.setItem('ActiveNav', 'reports');
        this.threatService.getAllThreats().subscribe(
          data => this.AllThreats = data,
          error => console.log('Cannot get all error')
        )
        this.updatePage();
      }





      updatePage() {
        return new Promise((resolve, reject) => {
    
          this.responseService.getUsersResponses(localStorage.getItem('loggedUserID')).subscribe(
            data => 
            { 
             this.AllSurveys = [];
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
                                    question['threat'] = answr.threatId ? answr.threat: '';
                                  
                                    
                                      
                                      
                                      question['answer'] = answr.answer.answer;
                                      question['recom'] = answr.answer.recom;
                                      question['level'] = answr.answer.level;
                                      question['threat'] = answr.answer.threatId ?  answr.answer.threat : '';
                              
                                    });

                                    this.AllQuestions.push(question)
                                     
                                  
                                
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











  async downloadPdf() {
    this.ImprintLoader = true;
    this.notifyService.showInfo('..downloading', 'Pdf template')
    setTimeout(() => {
      
    let pageQuestions = 3;
    let pageNumber = 1;
    let reportConstantStartPosition = 30;

    const pdf = new jspdf('p', 'mm', 'a4');

    pdf.text(75, 20, `Risk Analysis Report`);
    pdf.setFontSize(12);
    let img = new Image();
    img.src = 'assets/images/logo1.jpg'; 
    pdf.addImage(img, 'PNG', 14, 10, 20, 16);

    this.TemplateQuestions.forEach((quiz, key, arr) => {
          
        const reportTemplate = html2canvas(document.querySelector(`#quiz${key}`), {scale: 3});   

        reportTemplate.then(reportCanvas => {

  
          let reportFinalStartPosition = Number(reportConstantStartPosition)


          if ( quiz.recom) {
            pdf.addImage(reportCanvas, 10, reportFinalStartPosition, 190, 60);
            reportConstantStartPosition = reportConstantStartPosition + 65
          }
          if (!quiz.recom) {
            pdf.addImage(reportCanvas, 10, reportFinalStartPosition, 190, 30);
            reportConstantStartPosition = reportConstantStartPosition + 35
          }


          if ( key > pageQuestions) {
                pageNumber = pageNumber + 1;
                pageQuestions = pageQuestions + 4;
                reportConstantStartPosition = 30
                pdf.addPage();    
     
          }


          if (Object.is(arr.length - 1, key)) {

            pdf.save('RiskAnalysisReport.pdf');
            // pdf.output('dataurlnewwindow');
            this.ImprintLoader = false;
          }

        }); 
    } )
  }, 50);


  }






} // Main
    