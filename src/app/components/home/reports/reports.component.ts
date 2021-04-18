import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { faListAlt, faDownload, faArrowLeft, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { HomeComponent } from '../home.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
        private responseService: ResponseService,
        private questionService: QuestionService,
        private activatedRoute: ActivatedRoute,
        private companyProfileService: CompanyProfileService,
        private location: Location
        
      ) {  }
@ViewChild('reportTemplate', {static: false}) reportTemplate: ElementRef;
public ImprintLoader = false;
public PageHasLoaded = false;

public today = new Date();
public thisYear = this.today.getFullYear();


// Icons
public faArrowLeft = faArrowLeft;
public faListAlt = faListAlt;
public faDownload = faDownload;
public faPowerOff = faPowerOff;
public faSearch = faSearch;


public ActiveSurveyName: any;
public ActiveSurveyId: any;

public MyResponse = [];
public Questions = []
public QuestionsIds = [];
public FinalResponses = [];
public CompanyName = '';
public CompanyId: any;
public UserId: any;


      ngOnInit() {
        sessionStorage.setItem('ActiveNav', 'reports');
   

        this.activatedRoute.queryParams.subscribe((param) => {
          this.ActiveSurveyName = param.surveyName;
          this.ActiveSurveyId = param.surveyId;
          this.CompanyId = param.companyId
          this.UserId = param.userId
          this.ImprintLoader = true;
          this.updatePage().then(() => {
            this.formatData().then(()=> {
              this.ImprintLoader = false;
              this.PageHasLoaded = true;
            })
           });


        })
      }





updatePage() {
  return new Promise((resolve, reject) => {
  let respsone_num = 3
  const data = {userId: this.UserId, companyId: this.CompanyId, surveyId: this.ActiveSurveyId}
  this.responseService.getByUserIdCompanyIdSurveyId(data).subscribe(
    (data) => {
      respsone_num = respsone_num - 1;
      this.MyResponse = data.filter(res => res.surveyId === this.ActiveSurveyId).map(e => e)[0].answers
      if (respsone_num === 0 ) { resolve({}) }
    }, (err) => { console.log(err)}
  )

  this.questionService.getQuestionsInASurvey(this.ActiveSurveyId).subscribe(
    (data) => {
      respsone_num = respsone_num - 1;
      this.Questions = data;
      this.QuestionsIds = data.map(e => e._id)
      if (respsone_num === 0 ) { resolve({}) }
    }, () => {}
  )

  this.companyProfileService.getOneCompanyProfile(this.CompanyId).subscribe(
    (data) => {
      respsone_num = respsone_num - 1;
      this.CompanyName = data.companyName
      if (respsone_num === 0 ) { resolve({}) }
    }, () => {}
  )

});
}


formatData(): any {
  this.FinalResponses = [];
  return new Promise((resolve, reject)=> {
    this.MyResponse.forEach((responseObject, i, arr) => {
      let quiz_index = this.QuestionsIds.indexOf(responseObject.questionId)
      let question_name = this.Questions[quiz_index].question
      if (responseObject.answer[0].answer.answer) {
        let my_answers = responseObject.answer[0].answer.answer.split(',')
        this.FinalResponses.push({question: question_name, answers: my_answers})
      } else {
        let my_answers = [responseObject.answer[0].answer]
        this.FinalResponses.push({question: question_name, answers: my_answers})
      }
      if (i === arr.length -1 ) { resolve({}) }
    });
  })
}








back(): void {
  this.location.back();
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
      

      // const headerTemplate = html2canvas(document.querySelector('#top-header'), {scale: 1});  
      // const summaryGraph = html2canvas(document.querySelector('#summaryGraph'), {scale: 3});  
      const reportTemplateFunc = html2canvas(document.querySelector('#reportTemplate'), {scale: 1, allowTaint:false}); 
      

        const pdf = new jspdf('p', 'pt',  [PDF_Width, PDF_Height]);
        pdf.setFontType('bold');
        pdf.setFontSize(30);
        pdf.text(`${this.CompanyName.toUpperCase()}`, PDF_Width / 2, 620, 'center');
        pdf.setFontSize(20);
        pdf.text(`${this.ActiveSurveyName}`, PDF_Width / 2, 680, 'center');
        pdf.setFontType("italic");
        pdf.setFontSize(15);
        pdf.text(`Report generated by Tactive Admin`, PDF_Width / 2, 720, 'center');
        pdf.text(`CopyRight @ ${this.thisYear}`, PDF_Width / 2, 750, 'center');
        pdf.addPage();
  
          reportTemplateFunc.then((canvas) => {

              console.log(canvas.height+"  "+canvas.width);
              let imgData = canvas.toDataURL("image/jpeg", 1.0);
                pdf.addImage(imgData, 'JPG', top_left_margin, 0,canvas_image_width,canvas_image_height);
              
              
              for (let i = 1; i <= totalPDFPages; i++) { 
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i),canvas_image_width,canvas_image_height);
              }
              
            pdf.save(`${this.ActiveSurveyName.split(' ').join('_')}_${this.CompanyName.split(' ').join('_')}.pdf`);
              this.ImprintLoader = false;
          })
  
      

    }, 100);
};










































  logOut() {
    this.homeComponent.logout();
  }

















} // Main
    