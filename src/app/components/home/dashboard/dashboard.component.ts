import { Component, OnInit, ViewChild } from '@angular/core';
import {  faListAlt, faBuilding, faFire } from '@fortawesome/free-solid-svg-icons';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';

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
    private responseService: ResponseService,
    private threatService: ThreatService
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
  public AllThreats = [];

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

  public riskIssueArrayUnsorted = [];
  public riskIssueArray = [];
  public riskIssueArrayToGraph = [];
  public activeRisk;



  ngOnInit() {

    localStorage.setItem('ActiveNav', 'dashboard');

    if (localStorage.getItem('permissionStatus') === 'isAdmin') {
      this.updatePage().then(() => {this.topCardsChartFunction(); this.computeCompanyRiskRates(); this.riskIssuesFuctions(); } );
    } else if (localStorage.getItem('permissionStatus') === 'isThirdParty') {
      console.log("THirdParty");
      this.updatePage().then(() => {this.topCardsChartFunction(); this.computeCompanyRiskRates(); this.riskIssuesFuctions(); } );
    }


  }





updatePage() {
  return new Promise((resolve, reject) => {

    this.userService.getAllUsers().subscribe( datauser => {
      this.AllUsers = datauser;

      this.companyProfileService.getAllCompanyProfiles().subscribe( dataCompanies => {

        this.AllCompanies = dataCompanies;

        this.surveyService.getAllInstitutionSurveysAdmin().subscribe( dataSurvey => {

          this.AllSurveys = dataSurvey;

          this.questionService.getAllQuestions().subscribe( dataQuestion => {
            this.AllQuestions = dataQuestion;

            this.threatService.getAllThreats().subscribe( dataThreats => {
              this.AllThreats = dataThreats;


              this.responseService.getAllResponses().subscribe( dataResponse => {
                this.AllResponses = dataResponse; resolve();


              }, error => console.log('Error getting all responses'));


            }, error => console.log('Error getting all threats') );

          }, error => console.log('Error getting all questions'));


        }, error => console.log('Error getting all surveys'));


      }, error => console.log('Error getting all companies'));

    }, error => console.log('Error getting all users'));

  });
}










updatePage2() {
  return new Promise((resolve, reject) => {

    this.userService.getAllUsers().subscribe( datauser => {
      this.AllUsers = datauser;

      this.companyProfileService.getAllCompaniesByInstitutionId().subscribe( dataCompanies => {

        this.AllCompanies = dataCompanies;

        this.surveyService.getAllInstitutionSurveys().subscribe( dataSurvey => {

          this.AllSurveys = dataSurvey;

          this.questionService.getAllQuestions().subscribe( dataQuestion => {
            this.AllQuestions = dataQuestion;

            this.threatService.getAllThreats().subscribe( dataThreats => {
              this.AllThreats = dataThreats;


              this.responseService.getAllResponses().subscribe( dataResponse => {
                this.AllResponses = dataResponse; resolve();


              }, error => console.log('Error getting all responses'));


            }, error => console.log('Error getting all threats') );

          }, error => console.log('Error getting all questions'));


        }, error => console.log('Error getting all surveys'));


      }, error => console.log('Error getting all companies'));

    }, error => console.log('Error getting all users'));

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
      borderWidth: 1.5,
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
      borderWidth: 1.5,
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
      borderWidth: 1.5,
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
      label: 'Risk',
      data: myCardFourDataSet,
      backgroundColor: 'transparent',
      borderColor: 'white',
      borderWidth: 1.5,
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


graphChartFuctions(num) {
  let lowArray = [];
  let mediumArray = [];
  let highArray = [];
  let riskArray = this.riskIssueArray.filter(() => true ).map(e => e.risk);
  let filterRiskArray = Array.from(new Set(riskArray));

  for ( let risk of filterRiskArray) {

    if ( this.riskIssueArrayToGraph[num] === risk ) {
      let myRAray = this.riskIssueArray.filter((r) => r.risk === risk).map(e => e);

      let low = myRAray.filter((r) => r.level === 'Low').map(e => e);
      lowArray.push(low.length);
      let medium = myRAray.filter((r) => r.level === 'Medium').map(e => e);
      mediumArray.push(medium.length);
      let high = myRAray.filter((r) => r.level === 'High').map(e => e);
      highArray.push(high.length);

      break;
    }


  }


  this.activeRisk = this.riskIssueArrayToGraph[num];

  this.graphType = 'bar';

  this.graphLabels = [this.riskIssueArrayToGraph[num]];
  // this.graphLabels.forEach((e) => {
  //   myGraphLabelColors.push(this.getRandomColor());
  // });
  this.graphDatasets = [

    {
      label: 'Low', data: lowArray,
      backgroundColor: '#02b0cc'
    }, {
      label: 'Medium', data: highArray,
      backgroundColor: 'orange'
    }, {
      label: 'High', data: highArray,
      backgroundColor: 'red'
    },

  ];




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
          display: true,
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







riskIssuesFuctions() {
  this.AllResponses.forEach((resp, idx1, array1) => {

      for (let surv of this.AllSurveys) {
        if (surv._id === resp.surveyId) {

          for (let comp of this.AllCompanies) {
            if (comp._id === resp.companyId) {

              resp.answers.forEach( (respAns, idx2, array2) => {
                if (respAns.answer[0].threatId.length > 5) {

                  for ( let trt of this.AllThreats) {

                      for (let trtInference of trt.categorization_inferences) {
                        if (trtInference.category === respAns.answer[0].level) {
                          let myRiskIssueObject = {
                            risk: trt.name,
                            level: respAns.answer[0].level,
                            recom: respAns.answer[0].recom,
                            surveyName: surv.surveyName,
                            company: comp.companyName,
                          };


                          this.riskIssueArrayUnsorted.push(myRiskIssueObject);
                          this.riskIssueArray = this.riskIssueArrayUnsorted.sort((a, b) => a.risk.localeCompare(b.risk));
                          let newRiskArray = this.riskIssueArray.filter(() => true ).map(e => e.risk);
                          this.riskIssueArrayToGraph = Array.from(new Set(newRiskArray));
                          this.graphChartFuctions(0);



                          break;
                      }


                    }

                  }

                }

              });

              break;
            }
          }
          break;
        }
      }
    });
}








filterRisks() {

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

            ans.answer.forEach((a) => {
              if (a.answer === myAns.answer ) {
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
