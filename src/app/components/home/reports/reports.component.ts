import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { faBackward, } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { faListAlt, faDownload, faChartLine, faChartBar, faChartPie } from '@fortawesome/free-solid-svg-icons';


import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';

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
        private threatCategoryService: ThreatCategoryService,
        private companyProfileService: CompanyProfileService,
        
      ) {  }
      public ImprintLoader = false;
  //  tslint:disable
    
    // Icons
      public faBackward = faBackward;
      public faListAlt = faListAlt;
      public faDownload = faDownload;
      public faChartLine = faChartLine;
      public faChartBar = faChartBar;
      public faChartPie = faChartPie;

      //
      public AllSurveys: any;//keep and rename..
      public AllResponses =[];
      public AllThreats = [];
      public AllThreatCategorys;
      public myCompany;
      public AllCompanies = [];
      public AllQuestions = [];
      public TemplateNameOnView;
      public TemplateOneViewId;
      public TemplateQuestions = []; // keep and rename.
      public TemeplateViewSectionStatus = true; // keep.
      public QuestionsViewStatus = false; // keep and rename.


      public riskIssueArray = [];
      public riskIssueArrayUnsorted = [];



      // chart
      public chart3Labels;
      public chart3Type;
      public chart3Datasets;
      public chart3ChartOptions;
      public chart3BgColors = [];
  
      public innerWidth: any;








      ngOnInit() {
        localStorage.setItem('ActiveNav', 'reports');

          this.updatePage().then(() => { this.getMoreData().then(() => { }) });
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
                                  
                                    
                                     if(typeof(question['answer']) === 'object') {
                                      
                                      question['answer'] = answr.answer.answer;
                                      question['recom'] = answr.answer.recom;
                                      question['level'] = answr.answer.level;
                                      question['threat'] = answr.answer.threatId ?  answr.answer.threat : '';
                                     }
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

        resolve();
     });
    }






    getMoreData() {
      return new Promise((resolve, reject) => {
        this.companyProfileService.getAllCompanyProfiles().subscribe(
          dataComp => {
            this.AllCompanies = dataComp;
            for (const comp of this.AllCompanies) { if (comp._id === localStorage.getItem('loggedCompanyId')) { this.myCompany = comp; break; }}

            this.threatService.getAllThreats().subscribe(
              dataTrt => {
              this.AllThreats = dataTrt;

              this.threatCategoryService.getAllThreatCategorys().subscribe(
                dataTrtCat => {
                  this.AllThreatCategorys = dataTrtCat;

                  this.responseService.getUsersResponses(localStorage.getItem('loggedUserID')).subscribe(
                    data => {this.AllResponses = data; resolve(); },
                    error => console.log('Error geting all Responses')
                  );

                },
                error => console.log('Error geting all threats')
              );
            },
              error => console.log('Error geting all threats')
            );
          },
          error => console.log('Error geting all threats')
        );


      })
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
        this.TemplateOneViewId = id;
        let unSortedQuestions = this.AllQuestions.filter(( quiz) => quiz.surveyId === id ).map(e => e);
        // console.log(unSortedQuestions);
        this.TemplateQuestions = unSortedQuestions.sort((a, b) =>  a.position - b.position);
    
        this.TemeplateViewSectionStatus = false;
        this.QuestionsViewStatus = true;

        this.riskIssuesFunction()
    
    }









  async downloadPdf() {
    this.ImprintLoader = true;
    this.notifyService.showInfo('..downloading', 'Pdf template')
    setTimeout(() => {
      
    let pageQuestions = 3;
    let pageNumber = 1;
    let reportConstantStartPosition = 15;

    const pdf = new jspdf('p', 'mm', 'a4');

    const headerTemplate = html2canvas(document.querySelector('#top-header'), {scale: 3});  
    const summaryGraph = html2canvas(document.querySelector('#summaryGraph'), {scale: 3});  

    headerTemplate.then((headerCanvas) => {
        // pdf.text(75, 20, `Risk Analysis Report`);
        // pdf.setFontSize(12);

        let img = new Image();
        if (this.myCompany.logo.url === '') {img.src = 'assets/images/logo.jpeg'; }
        if (this.myCompany.logo.url !== '') {img.src = this.myCompany.logo.url; }
        pdf.addImage(img, 'PNG', 90, 30, 30, 23);
        pdf.addImage(headerCanvas, 'PNG', 0, 60, 210, 15);

        pdf.text(95, 120, `${this.myCompany.companyName}`);
        pdf.setFontSize(10);
        pdf.text(80, 130, `Report generated by ${localStorage.getItem('loggedUserName')}`);
        pdf.setFontType("italic");
        pdf.setFontSize(9);
        pdf.text(95, 140, 'CopyRight @2020');
        pdf.setFontSize(9);

        pdf.addPage();
        
        summaryGraph.then((summaryGraphCanvard) => {
          pdf.addImage(summaryGraphCanvard, 'PNG', 10, 60, 200, 80);
          
          pdf.addPage();

          
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
                  reportConstantStartPosition = reportConstantStartPosition + 25
                }


                if ( key > pageQuestions) {
                      pageNumber = pageNumber + 1;
                      pageQuestions = pageQuestions + 4;
                      reportConstantStartPosition = 15
                      pdf.addPage();    
          
                }


                if (Object.is(arr.length - 1, key)) {

                  pdf.save('RiskAnalysisReport.pdf');
                  // pdf.output('dataurlnewwindow');
                  this.ImprintLoader = false;
                }

              }); 
          } )

        })


    })



  }, 50);


  }










  riskIssuesFunction() {
    this.riskIssueArrayUnsorted = []
    this.riskIssueArray = []

    this.AllThreats.forEach((threat) => {


      for (let trtCategory of this.AllThreatCategorys) {

        if (trtCategory._id === threat.category) {

            for (let response of this.AllResponses) {

              if (response.companyId === this.myCompany._id) {

                for (let survey of this.AllSurveys) {

                  if ((survey._id === response.surveyId &&   survey._id  === this.TemplateOneViewId)) {

                      response.answers.forEach( (respAns, idx2, array2) => {
                        if (respAns.answer[0].threatId === threat._id) {
                          let myRiskIssueObject = {
                            risk: threat.name,
                            riskCategory: trtCategory.threatCategoryName,
                            level: respAns.answer[0].level,
                            recom: respAns.answer[0].recom,
                            surveyName: survey.surveyName

                          };

                          this.riskIssueArrayUnsorted.push(myRiskIssueObject);
                          this.riskIssueArray = this.riskIssueArrayUnsorted.sort((a, b) => a.risk.localeCompare(b.risk));
                          this.chartSectionGraphsFunction();
                        }

                      });


                  }
                }


              }
            }

        }
      }

    });


  }











  
  chart3graphToLine() {
    this.chart3Type = 'line';
    this.chart3ChartOptions.legend.display = false;
    this.chart3ChartOptions.scales.xAxes[0].display = true;
    this.chart3Datasets[0].backgroundColor = 'whitesmoke';
    this.chart3Datasets[0].borderColor = 'gray';
    this.chart3Datasets[0].pointBorderColor = 'black';
  }
  chart3graphToBar() {
    this.chart3Type = 'bar';
    this.chart3ChartOptions.legend.display = false;
    this.chart3ChartOptions.scales.xAxes[0].display = true;
    this.chart3Datasets[0].backgroundColor = this.chart3BgColors;
    this.chart3Datasets[0].borderColor = 'white';
    this.chart3Datasets[0].pointBorderColor = 'white';
  }
  chart3graphToPie() {
    this.chart3Type = 'pie';
    this.chart3ChartOptions.legend.display = true;
    this.chart3ChartOptions.scales.xAxes[0].display = false;
    this.chart3Datasets[0].backgroundColor = this.chart3BgColors;
    this.chart3Datasets[0].borderColor = 'white';
    this.chart3Datasets[0].pointBorderColor = 'white';
  }


  @HostListener('window:resize', ['$event']) onResize() {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 992) {
      this.chart3ChartOptions.legend.position = 'top';
    }

    if (this.innerWidth > 992) {
      this.chart3ChartOptions.legend.position = 'right';
    }


  }



  chartSectionGraphsFunction() {

   // on the bottom
   let threatArray3 =  this.riskIssueArray.filter(() => true ).map(e => e.risk);
   let newThreatArray3 = Array.from(new Set(threatArray3));

   this.chart3Type = 'bar';

   this.chart3Labels = newThreatArray3;
   let mychart3Datasets = [];
   this.chart3BgColors = [];

   this.chart3Labels.forEach((riskEl) => {

   for (let rsk of this.riskIssueArray) {
     if (rsk.risk === riskEl) {
       if (rsk.level === 'Low') { mychart3Datasets.push(1); this.chart3BgColors.push('#4dbd74'); }
       if (rsk.level === 'Medium') { mychart3Datasets.push(2); this.chart3BgColors.push('#ffc107'); }
       if (rsk.level === 'High') { mychart3Datasets.push(3); this.chart3BgColors.push('#f86c6b'); }
       break;
     }
   }



   });

   this.chart3Datasets = [{
   label: 'Risk',
   data: mychart3Datasets,
   backgroundColor: this.chart3BgColors,
   borderColor: 'white',
   borderWidth: 1.5,
   pointBackgroundColor: 'transparent',
   pointHoverBackgroundColor: 'transparent',
   pointBorderColor: 'white',
   pointHoverBorderColor: 'gray'
 }];

   this.chart3ChartOptions = {
   title: {
     display: false,
     text: 'Sales',
     fontSize: 25
   },
   legend: {
     display: false,
     position: 'right',
     labels: {
           fontColor: '#73818f'
         }
   },
   layout: {
     padding: 10
   },
   tooltips: {
       enabled: true,
       callbacks: {
         label(tooltipItem, data) {

           if (tooltipItem.yLabel === 1 ) { return 'Low'; }
           if (tooltipItem.yLabel === 2 ) { return 'Medium'; }
           if (tooltipItem.yLabel === 3 ) { return 'High'; }
         },
     }
   },
   scales: {
     yAxes: [{
         display: false,
         gridLines: {
             drawBorder: false,
             display: false
         },
         stacked: false,
         ticks: {
             beginAtZero: true
         }
     }],
     xAxes: [{
         barPercentage: 0.4,
         display: true,
         stacked: false,
         gridLines: {
             drawBorder: true,
             display: false
         },
         ticks: {
           beginAtZero: false
         }
     }]
   },
   maintainAspectRatio: false,
   responsive: true,
   plugins: {
       datalabels: {
           anchor: 'end',
           align: 'top',
           formatter: Math.round,
           font: { weight: 'bold'}
       }
   }
   
 };










   this.onResize();
  }












} // Main
    