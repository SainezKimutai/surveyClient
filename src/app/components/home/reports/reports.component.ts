import { Component, ViewChild, OnInit, HostListener, ElementRef } from '@angular/core';
import { faBackward, } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { faListAlt, faDownload, faChartLine, faChartBar, faChartPie, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { HomeComponent } from '../home.component';

declare let html2canvas: any;

// tslint:disable

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass']
})
export class ReportsComponent implements OnInit {
    constructor(
        private homeComponent: HomeComponent,
        private surveyService: SurveyService,
        private responseService: ResponseService,
        private questionService: QuestionService,
        private threatService: ThreatService,
        private threatCategoryService: ThreatCategoryService,
        private companyProfileService: CompanyProfileService,
        
      ) {  }
      @ViewChild('reportTemplate', {static: false}) reportTemplate: ElementRef;
      public ImprintLoader = false;
      public pageProgress = 0;
      public pdfDownloadProgress: number = 20;
  //  tslint:disable
  
  
    public today = new Date();
    public thisYear = this.today.getFullYear();


    // Icons
      public faBackward = faBackward;
      public faListAlt = faListAlt;
      public faDownload = faDownload;
      public faChartLine = faChartLine;
      public faChartBar = faChartBar;
      public faChartPie = faChartPie;
      public faPowerOff = faPowerOff;
      public faSearch = faSearch;

      //
      public AllSurveys: any;//keep and rename..
      public ViewAllSurvey = [];
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


      public pluginDataLabels = [pluginDataLabels]
      // chart
      public chart3Labels;
      public chart3Type;
      public chart3Datasets;
      public chart3ChartOptions;
      public chart3BgColors = [];
  
      public innerWidth: any;
      public onResizeStatus = false;
      public myInterval: any;

      public FilterName = '';








      ngOnInit() {
        sessionStorage.setItem('ActiveNav', 'reports');
          this.updatePage().then(() => { this.getMoreData().then(() => { this.ViewAllSurvey = this.AllSurveys }) });
      }





      updatePage() {
        return new Promise((resolve, reject) => {
    
          this.responseService.getUsersResponses(sessionStorage.getItem('loggedUserID')).subscribe(
            data => 
            { 
             this.AllSurveys = [];
             this.pageProgress = 10;
          
              data.forEach((responseObj, ind1, arr1) => {
                    this.surveyService.getOneSurvey(responseObj.surveyId).subscribe(
                     survey =>{
                         this.AllSurveys.push((survey));
                      }
                     )
                     responseObj.answers.forEach((answr , ind2, arr2) => {
                      const question = {};
                        this.questionService.getOneQuestion(answr.questionId).subscribe(
                            questions=>{
                              
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

                                    this.AllQuestions.push(question)
                                     
                                  
                                
                                  };
                                  if(answr.answer.length>1){

                                        question['answer'] = '';
                                        question['recom'] = '';
                                        question['level'] = '';
                                        question['threat'] = '';

                                        for(let i =0; i < answr.answer.length ; i++){
                                          

                                          question['answer'] = answr.answer[i].answer ? question['answer'] +" "+answr.answer[i].answer: '';
                                          question['recom'] = answr.answer[i].recom ? question['recom'] + " " + answr.answer[i].recom: '';
                                          question['level'] = answr.answer[i].level ? question['level'] + " " + answr.answer[i].level : '';
                                        
                                          
                                          if(i === answr.answer.length-1){
                                          this.AllQuestions.push(question);
                                          }
                                        }
                        
                                  }
                                // check for last loop
                                if ((ind1 === arr1.length - 1) && (ind2 === arr2.length - 1)){
                                  this.pageProgress = 60;
                                  resolve();
                                }
                    })
                    
                    }); // responseObj.answers.forEach(answr => {

                });   // data.forEach(responseObj => {
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
            for (const comp of this.AllCompanies) { if (comp._id === sessionStorage.getItem('loggedCompanyId')) { this.myCompany = comp;  this.pageProgress = 70; break; }}
           

            this.threatService.getAllThreats().subscribe(
              dataTrt => {
              this.AllThreats = dataTrt;
              this.pageProgress = 80;

              this.threatCategoryService.getAllThreatCategorys().subscribe(
                dataTrtCat => {
                  this.AllThreatCategorys = dataTrtCat;
                  this.pageProgress = 90;

                  this.responseService.getUsersResponses(sessionStorage.getItem('loggedUserID')).subscribe(
                    data => {this.AllResponses = data; resolve(); this.pageProgress = 100; },
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
        let AnsweredQuestion = unSortedQuestions.filter(( quiz) => quiz.answer !== 'Not answered').map(e => e);
        this.TemplateQuestions = AnsweredQuestion.sort((a, b) =>  a.position - b.position);
        this.TemeplateViewSectionStatus = false;
        this.QuestionsViewStatus = true;

        this.riskIssuesFunction()
    
    }






    filterSurveys() {
      if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
        this.ViewAllSurvey = this.AllSurveys;
        } else {
          this.ViewAllSurvey = this.AllSurveys.filter(v => v.surveyName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
        }
    }



















    downloadPdf(){
      this.ImprintLoader = true;
      setTimeout(() => {
      let HTML_Width = this.reportTemplate.nativeElement.offsetWidth;
      let HTML_Height =  this.reportTemplate.nativeElement.offsetHeight;
      let top_left_margin = 15;
      let PDF_Width = HTML_Width+(top_left_margin*2);
      let PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;
      
      let totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;
      

      const headerTemplate = html2canvas(document.querySelector('#top-header'), {scale: 1});  
      const summaryGraph = html2canvas(document.querySelector('#summaryGraph'), {scale: 3});  
      const reportTemplateFunc = html2canvas(document.querySelector('#reportTemplate'), {scale: 1, allowTaint:false}); 
      

      headerTemplate.then((headerCanvas) => {
        const pdf = new jspdf('p', 'pt',  [PDF_Width, PDF_Height]);
        pdf.addImage(headerCanvas, 'PNG', 0, 450, canvas_image_width + 30, 70);
        pdf.setFontType('bold');
        pdf.setFontSize(30);
        pdf.text(`${this.myCompany.companyName.toUpperCase()}`, PDF_Width / 2, 620, 'center');
        pdf.setFontSize(20);
        pdf.text(`${this.TemplateNameOnView}`, PDF_Width / 2, 680, 'center');
        pdf.setFontType("italic");
        pdf.setFontSize(15);
        pdf.text(`Report generated by Tactive Admin`, PDF_Width / 2, 720, 'center');
        pdf.text(`CopyRight @ ${this.thisYear}`, PDF_Width / 2, 750, 'center');
        pdf.addPage();
        
        summaryGraph.then((summaryGraphCanletd) => {
          pdf.addImage(summaryGraphCanletd, 'PNG', 15, 450, canvas_image_width, 400);
          pdf.addPage();

          reportTemplateFunc.then((canvas) => {

              console.log(canvas.height+"  "+canvas.width);
              let imgData = canvas.toDataURL("image/jpeg", 1.0);
                pdf.addImage(imgData, 'JPG', top_left_margin, 0,canvas_image_width,canvas_image_height);
              
              
              for (let i = 1; i <= totalPDFPages; i++) { 
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i),canvas_image_width,canvas_image_height);
              }
              
              pdf.save('RiskAnalysisReport.pdf');
              this.ImprintLoader = false;
          })
      });
      });

    }, 100);
};












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
    this.chart3Datasets[0].backgroundColor = 'rgb(5, 188, 255)',
    this.chart3Datasets[0].borderColor = 'blue';
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


  @HostListener('window:resize', []) onResize() {
    this.innerWidth = window.innerWidth;
    if (this.onResizeStatus) {
      if (this.innerWidth < 992) {
        this.chart3ChartOptions.legend.position = 'top';
      }
  
      if (this.innerWidth > 992) {
        this.chart3ChartOptions.legend.position = 'right';
      }
    }
  }














  random_rgba() {
    let o = Math.round, r = Math.random, s = 255;
    let p = o(r()*s);
    let pp = o(r()*s);
    let ppp = o(r()*s);
    let color = {
      light:  'rgba(' + p + ',' + pp + ',' + ppp + ',' + .3 + ')',
      mild:  'rgba(' + p + ',' + pp + ',' + ppp + ',' + .7 + ')',
      dark:  'rgba(' + p + ',' + pp + ',' + ppp + ',' + 1 + ')'
    }
    
   
    return color
}










  chartSectionGraphsFunction() {

let getRisk = this.riskIssueArray.filter(() => true ).map(e => e.risk);
let RiskInvolved1 = Array.from( new Set(getRisk));

let RiskInvolved =  RiskInvolved1.reduce((unique, item) => {
  let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
  let item2 = item.toLowerCase().replace(/ /g,''); 
  return unique1.includes(item2) ? unique : [...unique, item]
}, []);


let MyComparisonDataSet = []

this.AllSurveys.forEach((surveyElem) => {

  if(this.TemplateOneViewId === surveyElem._id ) {


  RiskInvolved.forEach((riskElm) => {

    let getMyRisk = this.riskIssueArray.filter((r) => r.risk.toLowerCase().replace(/ /g,'') === riskElm.toLowerCase().replace(/ /g,'') ).map(e => e)
    let getLowRisk = getMyRisk.filter((r) => r.level === 'Low' ).map(e => e)
    let getMediumRisk = getMyRisk.filter((r) => r.level === 'Medium' ).map(e => e)
    let getHighRisk = getMyRisk.filter((r) => r.level === 'High' ).map(e => e)

    let totalLowRiskNum = getLowRisk.length;
    let totalMediumRiskNum = getMediumRisk.length;
    let totalHighRiskNum = getHighRisk.length;

    let totalPoints = ((totalLowRiskNum * 1) + (totalMediumRiskNum * 2) + (totalHighRiskNum * 3))
    let totalRiskNum = totalLowRiskNum + totalMediumRiskNum + totalHighRiskNum
    
    let finalValue = Math.round(totalPoints / totalRiskNum)

    if(!finalValue) {finalValue = 0}
    let dataOnj = {
      label: riskElm,
      data : finalValue
    }  
    MyComparisonDataSet.push(dataOnj)

  })


  }
})



this.chart3Type = 'line';


this.chart3BgColors = []

  MyComparisonDataSet = MyComparisonDataSet.sort((a, b) => b.data - a.data)

  MyComparisonDataSet.forEach((d) => {
    if (d.data === 1) { this.chart3BgColors.push('#4dbd74'); }
    if (d.data === 2) { this.chart3BgColors.push('#ffc107'); }
    if (d.data === 3) { this.chart3BgColors.push('#f86c6b'); }
  })

  this.chart3Labels = MyComparisonDataSet.filter(() => true).map(e => e.label);



   this.chart3Datasets = [{
    label: 'Risk Level',
    data: MyComparisonDataSet.filter(() => true).map(e => e.data),
    backgroundColor: 'rgb(5, 188, 255)',
    borderColor: 'blue',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'black',
    pointHoverBorderColor: 'black'
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
           if (tooltipItem.yLabel === 0) {return 'Not Assessed'}
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
         barPercentage: 0.5,
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
      clamp: false,
      anchor: 'end',
      align: 'start',
      color: 'black',
      formatter: function(value, context) {
        if (value === 0) {return 'Not Assessed'}
        if (value === 1 ) { return 'Low'; }
        if (value === 2 ) { return 'Medium'; }
        if (value === 3 ) { return 'High'; }
      },
      font: { weight: 100, size: 12 },
      listeners: {
        enter: function(context) {
          context.hovered = true;
          return true;
        },
        leave: function(context) {
          context.hovered = false;
          return true;
        }
      }
    }
  }
   
 };










  this.onResizeStatus = true;
  this.onResize();
  }












  logOut() {
    this.homeComponent.logout();
  }

















} // Main
    