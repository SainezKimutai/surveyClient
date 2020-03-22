import { Component, OnInit } from '@angular/core';
import { faBars, faArrowLeft, faChartLine, faUsers, faListAlt, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { ResponseService } from 'src/app/shared/services/responses.service';

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


  public faListAlt = faListAlt;

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

// graph variables
  public graphType: string;
  public graphLabels: Array<any>;
  public graphDatasets: Array<any>;
  public graphChart: any;



  ngOnInit() {
    this.updatePage().then(() => {this.topCardsChartFunction(); this.graphChartFuctions(); } );
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
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


topCardsChartFunction() {

  this.cardOneType = 'line';

  this.cardOneLabels = ['one', 'two', 'three', 'four'];

  this.cardOneDatasets = [{
      label: 'Opportunty',
      data: [2, 4 , 1, 3],
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];


  this.cardTwoType = 'line';

  this.cardTwoLabels = ['one', 'two', 'three', 'four'];

  this.cardTwoDatasets = [{
      label: 'Opportunty',
      data: [2, 4 , 1, 3],
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];




  this.cardThreeType = 'line';

  this.cardThreeLabels = ['one', 'two', 'three', 'four'];

  this.cardThreeDatasets = [{
      label: 'Opportunty',
      data: [2, 4 , 1, 3],
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 0.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];



  this.cardFourType = 'line';

  this.cardFourLabels = ['one', 'two', 'three', 'four'];

  this.cardFourDatasets = [{
      label: 'Opportunty',
      data: [2, 4 , 1, 3],
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

  let myGraphLabel = ['one', 'two', 'three', 'four'];
  let myGraphLabelColors = [];
  myGraphLabel.forEach((e) => {
    myGraphLabelColors.push(this.getRandomColor());
  });


  this.graphType = 'bar';

  this.graphLabels = myGraphLabel;

  this.graphDatasets = [{
      label: 'Opportunty',
      data: [2, 4 , 1, 3],
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




}
