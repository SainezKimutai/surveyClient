import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faChartLine, faChartBar, faChartPie, faListAlt, faBuilding, faFire } from '@fortawesome/free-solid-svg-icons';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

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
    private threatService: ThreatService,
    private threatCategoryService: ThreatCategoryService,
    private notification: NotificationService
  ) { }

  @ViewChild('viewAnswersModal', {static: true, }) viewAnswersModal: ModalDirective;


  public innerWidth: any;
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
  public AllThreatCategorys = [];


// Icons
  public faChartLine = faChartLine;
  public faChartBar = faChartBar;
  public faChartPie = faChartPie;

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


  // Third Section graph variables
  public third1Type;
  public third1Labels;
  public third1Datasets;
  public third1ChartOptions;
  public third1Legend;
  public third1BgColors = [];
  public third2Labels;
  public third2Type;
  public third2Datasets;
  public third2ChartOptions;
  public third2BgColors = [];
  public third2Legend;


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
      this.updatePage().then(() => {this.topCardsChartFunction(); this.computeCompanyRiskRates(); this.riskIssuesFunction(); } );
    } else if (localStorage.getItem('permissionStatus') === 'isThirdParty') {
      this.updatePage2().then(() => {this.topCardsChartFunction(); this.computeCompanyRiskRates(); this.riskIssuesFunction(); } );
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

            this.threatService.getAllInstitutionThreats().subscribe( dataThreats => {
              this.AllThreats = dataThreats;


              this.responseService.getAllResponses().subscribe( dataResponse => {
                this.AllResponses = dataResponse;

                this.threatCategoryService.getAllByInstitutions().subscribe ( dataThreatCat => {
                  this.AllThreatCategorys = dataThreatCat; resolve();

                }, error => console.log('Error getting all threat Categories'));


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
                this.AllResponses = dataResponse;


                this.threatCategoryService.getAllByInstitutions().subscribe ( dataThreatCat => {
                  this.AllThreatCategorys = dataThreatCat; resolve();
                  console.log("ALL loaded")

                }, error => console.log('Error getting all threat Categories'));


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
          barPercentage: 0.4,
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





third1graphToLine() {
  this.third1Type = 'line';
  this.third1ChartOptions.legend.display = false;
  this.third1ChartOptions.scales.xAxes[0].display = true;
  this.third1Datasets[0].backgroundColor = 'whitesmoke';
  this.third1Datasets[0].borderColor = 'gray';
  this.third1Datasets[0].pointBorderColor = 'black';
}
third1graphToBar() {
  this.third1Type = 'bar';
  this.third1ChartOptions.legend.display = false;
  this.third1ChartOptions.scales.xAxes[0].display = true;
  this.third1Datasets[0].backgroundColor = this.third1BgColors;
  this.third1Datasets[0].borderColor = 'white';
  this.third1Datasets[0].pointBorderColor = 'white';
}
third1graphToPie() {
  this.third1Type = 'pie';
  this.third1ChartOptions.legend.display = true;
  this.third1ChartOptions.scales.xAxes[0].display = false;
  this.third1Datasets[0].backgroundColor = this.third1BgColors;
  this.third1Datasets[0].borderColor = 'white';
  this.third1Datasets[0].pointBorderColor = 'white';
}

third2graphToLine() {
  this.third2Type = 'line';
  this.third2ChartOptions.legend.display = false;
  this.third2ChartOptions.scales.xAxes[0].display = true;
  this.third2Datasets[0].backgroundColor = 'whitesmoke';
  this.third2Datasets[0].borderColor = 'gray';
  this.third2Datasets[0].pointBorderColor = 'black';
}
third2graphToBar() {
  this.third2Type = 'bar';
  this.third2ChartOptions.legend.display = false;
  this.third2ChartOptions.scales.xAxes[0].display = true;
  this.third2Datasets[0].backgroundColor = this.third2BgColors;
  this.third2Datasets[0].borderColor = 'white';
  this.third2Datasets[0].pointBorderColor = 'white';
}
third2graphToPie() {
  this.third2Type = 'pie';
  this.third2ChartOptions.legend.display = true;
  this.third2ChartOptions.scales.xAxes[0].display = false;
  this.third2Datasets[0].backgroundColor = this.third2BgColors;
  this.third2Datasets[0].borderColor = 'white';
  this.third2Datasets[0].pointBorderColor = 'white';
}





@HostListener('window:resize', []) onResize() {
  this.innerWidth = window.innerWidth;

  if (this.innerWidth < 992) {
    this.third1ChartOptions.legend.position = 'top';
    this.third2ChartOptions.legend.position = 'top';
  }

  if (this.innerWidth > 992) {
    this.third1ChartOptions.legend.position = 'bottom';
    this.third2ChartOptions.legend.position = 'bottom';
  }


}




thirdSectionGraphsFunction() {
  this.third1Legend = false;
  this.third2Legend = false;
  console.log("thirdSectionGraphsFunction called");
  // on the left
  this.third1Type = 'pie';

  let threatCatArray =  this.riskIssueArray.filter(() => true ).map(e => e.riskCategory);
  let newThreatCatArray = Array.from(new Set(threatCatArray));
  this.third1Labels = newThreatCatArray;
  let mythird1Datasets = [];
  this.third1BgColors = [];

  this.third1Labels.forEach((riskCatEl) => {
    this.third1BgColors.push(this.getRandomColor());
    let myArr = this.riskIssueArray.filter((rsk) => rsk.riskCategory === riskCatEl ).map(e => e);
    mythird1Datasets.push(myArr.length);


    });

  this.third1Datasets = [{
    label: 'Risk',
    data: mythird1Datasets,
    backgroundColor: this.third1BgColors,
    borderColor: 'white',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'white',
    pointHoverBorderColor: 'gray'
  }];

  console.log(this.third1Datasets);

  this.third1ChartOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: true,
      position: 'bottom',
      labels: {
            fontColor: '#73818f'
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
          stacked: false,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          barPercentage: 0.4,
          display: false,
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









 // on the right
  let threatArray =  this.riskIssueArray.filter(() => true ).map(e => e.risk);
  let newThreatArray = Array.from(new Set(threatArray));

  this.third2Type = 'pie';

  this.third2Labels = newThreatArray;
  let mythird2Datasets = [];
  this.third2BgColors = [];

  this.third2Labels.forEach((riskEl) => {
    this.third2BgColors.push(this.getRandomColor());
    let myArr2 = this.riskIssueArray.filter((rsk) => rsk.risk === riskEl ).map(e => e);
    mythird2Datasets.push(myArr2.length);
   });

  this.third2Datasets = [{
   label: 'Risk',
   data: mythird2Datasets,
   backgroundColor: this.third2BgColors,
   borderColor: 'white',
   borderWidth: 1.5,
   pointBackgroundColor: 'transparent',
   pointHoverBackgroundColor: 'transparent',
   pointBorderColor: 'white',
   pointHoverBorderColor: 'gray'
 }];

  this.third2ChartOptions = {
   title: {
     display: false,
     text: 'Sales',
     fontSize: 25
   },
   legend: {
     display: true,
     position: 'bottom',
     itemWidth: 10,
     labels: {
           fontColor: '#73818f'
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
         stacked: false,
         ticks: {
             beginAtZero: true
         }
     }],
     xAxes: [{
         barPercentage: 0.4,
         display: false,
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

} // end of thirdSectionGraphsFunction















graphChartToLine() {
  this.graphType = 'line';
  this.graphChart.legend.display = false;
  this.graphChart.scales.xAxes[0].display = true;
  this.graphDatasets[0].backgroundColor = 'whitesmoke';
  this.graphDatasets[0].borderColor = 'gray';
  this.graphDatasets[0].pointBorderColor = 'black';
}
graphChartToBar() {
  this.graphType = 'bar';
  this.graphChart.legend.display = false;
  this.graphChart.scales.xAxes[0].display = true;
  this.graphDatasets[0].backgroundColor = ['#02b0cc', 'orange', 'red' ];
  this.graphDatasets[0].borderColor = 'white';
  this.graphDatasets[0].pointBorderColor = 'white';
}
graphChartToPie() {
  this.graphType = 'pie';
  this.graphChart.legend.display = true;
  this.graphChart.scales.xAxes[0].display = false;
  this.graphDatasets[0].backgroundColor = ['#02b0cc', 'orange', 'red' ];
  this.graphDatasets[0].borderColor = 'white';
  this.graphDatasets[0].pointBorderColor = 'white';
}



switchGraphDataset(num) {
  let lowValue = null;
  let mediumValue = null;
  let highValue = null;
  let riskArray = this.riskIssueArray.filter(() => true ).map(e => e.risk);
  let filterRiskArray = Array.from(new Set(riskArray));

  for ( let risk of filterRiskArray) {

    if ( this.riskIssueArrayToGraph[num] === risk ) {
      let myRAray = this.riskIssueArray.filter((r) => r.risk === risk).map(e => e);
      let low = myRAray.filter((r) => r.level === 'Low').map(e => e);
      lowValue = low.length;
      let medium = myRAray.filter((r) => r.level === 'Medium').map(e => e);
      mediumValue = medium.length;
      let high = myRAray.filter((r) => r.level === 'High').map(e => e);
      highValue = high.length;

      break;
    }

  }

  this.activeRisk = this.riskIssueArrayToGraph[num];
  this.graphDatasets[0].data = [ lowValue, mediumValue, highValue];

}











graphChartFunction(num) {
  let lowValue = null;
  let mediumValue = null;
  let highValue = null;
  let riskArray = this.riskIssueArray.filter(() => true ).map(e => e.risk);
  let filterRiskArray = Array.from(new Set(riskArray));

  for ( let risk of filterRiskArray) {

    if ( this.riskIssueArrayToGraph[num] === risk ) {
      let myRAray = this.riskIssueArray.filter((r) => r.risk === risk).map(e => e);

      let low = myRAray.filter((r) => r.level === 'Low').map(e => e);
      lowValue = low.length;
      let medium = myRAray.filter((r) => r.level === 'Medium').map(e => e);
      mediumValue = medium.length;
      let high = myRAray.filter((r) => r.level === 'High').map(e => e);
      highValue = high.length;

      break;
    }


  }


  this.activeRisk = this.riskIssueArrayToGraph[num];

  this.graphType = 'bar';

  this.graphLabels = ['Low', 'Medium', 'High'];
  // this.graphLabels.forEach((e) => {
  //   myGraphLabelColors.push(this.getRandomColor());
  // });
  this.graphDatasets = [
    {
      label: this.riskIssueArrayToGraph[num],
      data: [ lowValue, mediumValue, highValue],
      backgroundColor: ['#02b0cc', 'orange', 'red' ],
      borderColor: 'white',
      borderWidth: 1.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }
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
            fontColor: '#73818f'
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







riskIssuesFunction() {

  this.AllThreats.forEach((threat) => {
    for (let trtCategory of this.AllThreatCategorys) {
      if (trtCategory._id === threat.category) {
        this.AllCompanies.forEach( (comp) => {
          for (let response of this.AllResponses) {
            if (response.companyId === comp._id) {
              for (let survey of this.AllSurveys) {
                if ((survey._id === response.surveyId)) {

                    response.answers.forEach( (respAns, idx2, array2) => {
                      if (respAns.answer[0].threatId === threat._id) {
                        let myRiskIssueObject = {
                          risk: threat.name,
                          riskCategory: trtCategory.threatCategoryName,
                          level: respAns.answer[0].level,
                          recom: respAns.answer[0].recom,
                          surveyName: survey.surveyName,
                          company: comp.companyName,
                        };

                        this.riskIssueArrayUnsorted.push(myRiskIssueObject);
                        this.riskIssueArray = this.riskIssueArrayUnsorted.sort((a, b) => a.risk.localeCompare(b.risk));
                        let newRiskArray = this.riskIssueArray.filter(() => true ).map(e => e.risk);
                        this.riskIssueArrayToGraph = Array.from(new Set(newRiskArray));


                        this.graphChartFunction(0);
                        this.thirdSectionGraphsFunction();
                      }

                    });


                }
              }


            }
          }

        });

      }
    }

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
