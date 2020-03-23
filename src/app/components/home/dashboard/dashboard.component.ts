import { Component, OnInit, ViewChild } from '@angular/core';
import {  faListAlt, faBuilding, faFire } from '@fortawesome/free-solid-svg-icons';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
// tslint:disable: max-line-length
// tslint:disable: prefer-const





  constructor(
    private userService: UserService,
    private companyProfileService: CompanyProfileService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private responseService: ResponseService
  ) { }

  @ViewChild('viewAnswersModal', {static: true, }) viewAnswersModal: ModalDirective;



  public faListAlt = faListAlt;
  public faBuilding = faBuilding;
  public faFire = faFire;

  public today = new Date();
  public thisYear = this.today.getFullYear();



  public AllUsers = [];
  public AllCompanies = [];
  public AllSurveys = [];
  public AllQuestions = [];
  public AllResponses = [];

// Top Cards variables
  public cardOneType: string;
  public cardOneLabels: Array<any>;
  public cardOneDatasets: Array<any>;
  public cardTwoType: string;
  public cardTwoLabels: Array<any>;
  public cardTwoDatasets: Array<any>;
  public cardThreeType: string;
  public cardThreeLabels: Array<any>;
  public cardThreeDatasets: Array<any>;
  public cardFourType: string;
  public cardFourLabels: Array<any>;
  public cardFourDatasets: Array<any>;
  public topCardsChart: any;



  public CompnayRiskRates = [];


// graph variables
  public graphType: string;
  public graphLabels: Array<any>;
  public graphDatasets: Array<any>;
  public graphChart: any;

  public QuestionsOnView = [];
  public companyNameOnView = '';
  public surveyNameOnView = '';





  ngOnInit() {
    this.updatePage().then(() => {this.topCardsChartFunction(); this.graphChartFuctions(); this.computeCompanyRiskRates(); } );
    localStorage.setItem('ActiveNav', 'dashboard');

  }





updatePage() {
  return new Promise((resolve, reject) => {

    this.userService.getAllUsers().subscribe( data => this.AllUsers = data, error => console.log('Error getting all users'));
    this.companyProfileService.getAllCompanyProfiles().subscribe( data => this.AllCompanies = data, error => console.log('Error getting all companies'));
    this.surveyService.getAllSurveys().subscribe( data => this.AllSurveys = data, error => console.log('Error getting all surveys'));
    this.questionService.getAllQuestions().subscribe( data => this.AllQuestions = data, error => console.log('Error getting all questions'));
    this.responseService.getAllResponses().subscribe( data => {this.AllResponses = data; resolve(); }, error => console.log('Error getting all responses'));

  });
}



getRandomColor() {
  let letters = '0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++ ) {color += letters[Math.floor(Math.random() * 16)]; }
  return color;
}


topCardsChartFunction() {


  // Card One
  let myCardOneDataSet = [];
  this.AllSurveys.forEach((surv) => {
    let surveysDone = this.AllResponses.filter((r) => r.surveyId === surv._id ).map(e => e);
    myCardOneDataSet.push(surveysDone.length);
  });

  this.cardOneType = 'line';

  this.cardOneLabels = this.AllSurveys.filter(() => true ).map(e => e.surveyName);

  this.cardOneDatasets = [{
      label: 'Companies',
      data: myCardOneDataSet,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];









  // Card Two
  let myCardTwoDataSet = [];
  this.AllCompanies.forEach((comp) => {
    let allSurveysDone = this.AllResponses.filter((r) => r.companyId === comp._id ).map(e => e.surveyId);
    let filteredSurveysDone = Array.from(new Set(allSurveysDone));
    myCardTwoDataSet.push(filteredSurveysDone.length);
  });
  this.cardTwoType = 'line';

  this.cardTwoLabels = this.AllCompanies.filter(() => true ).map(e => e.companyName);

  this.cardTwoDatasets = [{
      label: 'Survey',
      data: myCardTwoDataSet,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];







    // Card Three
  let myCardThreeLabels = [];


  let allIndustryTypes = this.AllCompanies.filter((r) => true).map(e => e.companyType);
  myCardThreeLabels = Array.from(new Set(allIndustryTypes));

  let myCardThreeDataSet = [];
  myCardThreeLabels.forEach((ind) => {
      let myIndustryComp = this.AllCompanies.filter((comp) => comp.companyType === ind ).map(e => e );
      myCardThreeDataSet.push(myIndustryComp.length);
  });


  this.cardThreeType = 'line';

  this.cardThreeLabels = myCardThreeLabels;

  this.cardThreeDatasets = [{
      label: 'No of Companies',
      data: myCardThreeDataSet,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];




  // card Fours
  let myCardFourDataSet = [];
  this.AllCompanies.forEach((comp) => {
    let allSurveysDone = this.AllResponses.filter((r) => r.companyId === comp._id ).map(e => e.surveyId);
    // let filteredSurveysDone = Array.from(new Set(allSurveysDone));
    myCardFourDataSet.push(allSurveysDone.length);
  });
  this.cardFourType = 'line';

  this.cardFourLabels = this.AllCompanies.filter(() => true ).map(e => e.companyName);

  this.cardFourDatasets = [{
      label: 'Opportunty',
      data: myCardFourDataSet,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];




  this.topCardsChart = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#00e676'
          }
    },
    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: true,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          display: false,
          stacked: true,
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

}







graphChartFuctions() {
  let mygraphDataSet = [];
  this.AllCompanies.forEach((comp) => {
    let allSurveysDone = this.AllResponses.filter((r) => r.companyId === comp._id ).map(e => e.surveyId);
    let filteredSurveysDone = Array.from(new Set(allSurveysDone));
    mygraphDataSet.push(filteredSurveysDone.length);
  });

  let myGraphLabelColors = [];

  this.graphType = 'bar';

  this.graphLabels = this.AllCompanies.filter(() => true ).map(e => e.companyName);
  this.graphLabels.forEach((e) => {
    myGraphLabelColors.push(this.getRandomColor());
  });
  this.graphDatasets = [{
      label: 'Risk',
      data: mygraphDataSet,
      backgroundColor: myGraphLabelColors,
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];




  this.graphChart = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#00e676'
          }
    },
    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: true,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          display: false,
          stacked: true,
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
}












computeCompanyRiskRates() {
  this.AllCompanies.forEach( (comp) => {
    this.AllResponses.forEach((resp) => {
      if (comp._id === resp.companyId) {
        for (let surv of this.AllSurveys) {
          if (resp.surveyId === surv._id) {

            let data = {
              companyId: comp._id,
              surveyId: surv._id,
              responseId: resp._id,
              companyName: comp.companyName,
              surveyName: surv.surveyName,
              riskRate: 'To be determined',
              recommendation: 'Awaiting...'
            };

            this.CompnayRiskRates.push(data);

          }
        }
      }
    });
  });
}





openAnswersModal(companyName, surveyName, surveyId, responseId) {
  this.companyNameOnView = companyName;
  this.surveyNameOnView = surveyName;
  this.QuestionsOnView = [];

  for (let resp of this.AllResponses) {
   if ( resp._id === responseId) {

    resp.answers.forEach((ans) => {

      for (let quiz of this.AllQuestions) {
        if (ans.questionId === quiz._id) {
          let theQuestions = {
            question: quiz.question,
            answers: []
          };

          quiz.choices.forEach((myAns, key, arr) => {
            if (ans.answer.includes(myAns.answer)) {
              theQuestions.answers.push({picked: true, answer: myAns.answer });
              if (Object.is(arr.length - 1, key)) {
                this.QuestionsOnView.push(theQuestions);
              }
            } else {
              theQuestions.answers.push({picked: false, answer: myAns.answer });
              if (Object.is(arr.length - 1, key)) {
                this.QuestionsOnView.push(theQuestions);
              }
            }
          });

          // break;
        }
      }

    });
    // break;
   }
 }


  this.viewAnswersModal.show();
}









}
