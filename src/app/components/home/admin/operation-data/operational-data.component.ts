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
import { TrafficService } from 'src/app/shared/services/traffic.service';

@Component({
  selector: 'app-operational-data',
  templateUrl: './operational-data.component.html',
  styleUrls: ['./operational-data.component.sass']
})
export class AdminOperationalDataComponent implements OnInit {
// tslint:disable
// tslint:disable: prefer-const





constructor(
  private userService: UserService,
  private companyProfileService: CompanyProfileService,
  private surveyService: SurveyService,
  private questionService: QuestionService,
  private responseService: ResponseService,
  private threatService: ThreatService,
  private threatCategoryService: ThreatCategoryService,
  private notification: NotificationService,
  private trafficService: TrafficService
) { }

@ViewChild('viewAnswersModal', {static: true, }) viewAnswersModal: ModalDirective;


public innerWidth: any;
public onResizeStatus = false;
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
public AllTraffic = [];


// Icons
public faChartLine = faChartLine;
public faChartBar = faChartBar;
public faChartPie = faChartPie;

// Top Cards variables
public AllThirdParties = [];
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
public chartsProgress = 0;
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


//
public thirrdPartyType: string;
public thirrdPartyLabels: Array<any>;
public thirrdPartyDatasets: Array<any>;
public thirrdPartyChart: any;

public thirrdPartySurveys = [];
public thirrdPartyCompanys = [];
public listTirdPartyIsGraph = true;

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
public riskIssueArrayPerRisk = [];
public riskIssueArrayPerCompany = []
public activeRisk;
public myGraphLabelColors = [];

public surveyStatus = 0;

// company risk

public companyRiskArray = [];
public activeCompany;
public activeCompanyTotalRiskRate = null;


// trafic
public trafficType;
public trafficLabels;
public trafficDatasets;
public trafficChartOptions;
public trafficBgColors = [];











  ngOnInit() {
    
    this.updatePage().then(() => { this.riskIssuesFunction(); this.trafficFunction(); } );

  }












  updatePage() {

    return new Promise((resolve, reject) => {
  
      this.userService.getAllUsers().subscribe( datauser => {
        this.AllUsers = datauser;
        this.chartsProgress = 10
  
        this.companyProfileService.getAllCompanyProfiles().subscribe( dataCompanies => {
  
          this.AllCompanies = dataCompanies.filter((comp)=> comp.institutionId && comp.institutionId !== '' ).map(e => e);
          this.chartsProgress = 20
  
          this.surveyService.getAllSurveys().subscribe( dataSurvey => {
          
            this.AllSurveys = dataSurvey;
            this.chartsProgress = 30
  
            this.questionService.getAllQuestions().subscribe( dataQuestion => {
              this.AllQuestions = dataQuestion;
              this.chartsProgress = 40
  
              this.threatService.getAllThreats().subscribe( dataThreats => {
                this.AllThreats = dataThreats;
  
                this.chartsProgress = 50
                this.responseService.getAllResponses().subscribe( dataResponse => {
                  this.AllResponses = dataResponse;
                  this.chartsProgress = 60

                  this.trafficService.getAllTraffic().subscribe( dataTrafic => {
                      this.AllTraffic = dataTrafic; 
                      this.chartsProgress = 65

                      this.threatCategoryService.getAllThreatCategorys().subscribe ( dataThreatCat => {
                        this.AllThreatCategorys = dataThreatCat; resolve();
                        this.chartsProgress = 70
                      }, error => console.log('Error getting all threat Categories'));
      

                    }, error => console.log('Error getting all threat Categories')

                  )
  
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
  
  


















  async topCardsChartFunction() {
  
    this.AllThirdParties = this.AllUsers.filter((e) => e.userType === 'thirdparty').map(e => e);
    // Card One
    let myCardOneDataSet = [];
    this.AllThirdParties.forEach((thd) => {
      let myComp = this.AllCompanies.filter((r) => r.institutionId === thd._id ).map(e => e);
      myCardOneDataSet.push(myComp.length);
    });
  
    this.cardOneType = 'line';
  
    this.cardOneLabels = this.AllUsers.filter((e) => e.userType === 'thirdparty').map(e => e.name);
  
    this.cardOneDatasets = [{
        label: 'Associated Companies',
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


    let myCardThreeCompanyArr = []
    this.riskIssueArrayPerCompany.forEach((compElem) => {

      let myRiskArray = this.riskIssueArray.filter((r)=> r.company === compElem ).map(e => e);

      let LowRate = myRiskArray.filter((r)=> r.level === 'Low' ).map(e => e);
      let MediumRate = myRiskArray.filter((r)=> r.level === 'Medium' ).map(e => e);
      let HighRate = myRiskArray.filter((r)=> r.level === 'High' ).map(e => e);
      
      let totalRiskNum = this.companyRiskArray.length;
      let lowRiskNum = LowRate.length;
      let mediumRiskNum = MediumRate.length;
      let highRiskNum = HighRate.length;
  
      let lowRiskValue = lowRiskNum * 1;
      let medumRiskValue = mediumRiskNum * 2;
      let highRiskValue = highRiskNum * 3;
      let totalRiskValue = totalRiskNum * 3
  
      let myTotalRiskValue = Number(lowRiskValue) + Number(medumRiskValue) + Number(highRiskValue);
  

      let compObj = {
        companyName: compElem,
        averageRiskrate: ((myTotalRiskValue * 100) / totalRiskValue).toFixed(1)
      }
      myCardThreeCompanyArr.push(compObj)

    })










  
  
    let allIndustryTypes = this.AllCompanies.filter((r) => true).map(e => e.companyType);
    myCardThreeLabels = Array.from(new Set(allIndustryTypes));
  
    let myCardThreeDataSet = [];
    myCardThreeLabels.forEach((ind) => {
      let value = 0;
      let num = 0;
      myCardThreeCompanyArr.forEach((dataElm) => {
        this.AllCompanies.forEach((comp) => {
          if(dataElm.companyName === comp.companyName && ind === comp.companyType){
            value = value + Number(dataElm.averageRiskrate)
            num++
          } 
        })
      })
      if(num !== 0 && value !== 0) {
        myCardThreeDataSet.push(value / num)
      } else {
        myCardThreeDataSet.push(0)
      }
    
    });
  

    this.cardThreeType = 'line';
  
    this.cardThreeLabels = myCardThreeLabels;
  
    this.cardThreeDatasets = [{
        label: 'A. Risk Rate',
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
    let myCardFourLabelArr = []
    let myCardFourDataSet = []
    this.riskIssueArrayPerCompany.forEach((compElem) => {

      let myRiskArray = this.riskIssueArray.filter((r)=> r.company === compElem ).map(e => e);

      let LowRate = myRiskArray.filter((r)=> r.level === 'Low' ).map(e => e);
      let MediumRate = myRiskArray.filter((r)=> r.level === 'Medium' ).map(e => e);
      let HighRate = myRiskArray.filter((r)=> r.level === 'High' ).map(e => e);
      
      let totalRiskNum = this.companyRiskArray.length;
      let lowRiskNum = LowRate.length;
      let mediumRiskNum = MediumRate.length;
      let highRiskNum = HighRate.length;
  
      let lowRiskValue = lowRiskNum * 1;
      let medumRiskValue = mediumRiskNum * 2;
      let highRiskValue = highRiskNum * 3;
      let totalRiskValue = totalRiskNum * 3
  
      let myTotalRiskValue = Number(lowRiskValue) + Number(medumRiskValue) + Number(highRiskValue);
  
      myCardFourLabelArr.push(compElem);
      myCardFourDataSet.push(((myTotalRiskValue * 100) / totalRiskValue).toFixed(1))
    })



    this.cardFourType = 'line';
  
    this.cardFourLabels = myCardFourLabelArr;
  
    this.cardFourDatasets = [{
        label: 'A. Risk Rate',
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
  
    if (this.onResizeStatus) {
    if (this.innerWidth < 992) {
      this.third1ChartOptions.legend.position = 'top';
      this.third2ChartOptions.legend.position = 'top';
    }
  
    if (this.innerWidth > 992) {
      this.third1ChartOptions.legend.position = 'bottom';
      this.third2ChartOptions.legend.position = 'bottom';
    }
    }
  
  
  }
  
  
  
  
  thirdSectionGraphsFunction() {
    this.chartsProgress = 100;


    this.third1Type = 'pie';


    let threatCatArray =  this.riskIssueArray.filter(() => true ).map(e => e.riskCategory);
    let newThreatCatArray = Array.from(new Set(threatCatArray));
  
    let newThreatRisk = this.riskIssueArray.filter(() => true ).map(e => e.risk);
    let newThreat1 = Array.from( new Set(newThreatRisk));
  
    let ThreatRiskInvolved =  newThreat1.reduce((unique, item) => {
      let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
      let item2 = item.toLowerCase().replace(/ /g,''); 
      return unique1.includes(item2) ? unique : [...unique, item]
    }, []);
  
    let ThreatRiskAndCat = []
  
    ThreatRiskInvolved.forEach((trt) => {
      let x = {
        risk: trt,
        category: ''
      }
      this.riskIssueArray.forEach((rsk) => { 
        if (rsk.risk === trt && x.category === '' && rsk.category !== '') {
          x.category = rsk.riskCategory
          ThreatRiskAndCat.push(x)
        }
      })
    })
  
  
    let mychart1Datasets = [];
    this.third1BgColors = [];
    newThreatCatArray.forEach((trtCat) => {
      let y = ThreatRiskAndCat.filter((c) => c.category === trtCat).map(e => e)
      this.third1BgColors.push(this.getRandomColor());
      mychart1Datasets.push(y.length);
    })
  
  
    this.third1Labels = newThreatCatArray;
    
  
    this.third1Datasets = [{
      label: 'Risk',
      data: mychart1Datasets,
      backgroundColor: this.third1BgColors,
      borderColor: 'white',
      borderWidth: 1.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];
  
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
  
  
   let surveysOnrisk = this.riskIssueArray.filter(() => true ).map(e => e.surveyName)
   let surveyArr = Array.from( new Set(surveysOnrisk));
   let getRisk = this.riskIssueArray.filter(() => true ).map(e => e.risk);
   let RiskInvolved1 = Array.from( new Set(getRisk));
  
   let RiskInvolved =  RiskInvolved1.reduce((unique, item) => {
     let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
     let item2 = item.toLowerCase().replace(/ /g,''); 
     return unique1.includes(item2) ? unique : [...unique, item]
   }, []);
  
  
   let mychart2Datasets = []
  
   surveyArr.forEach((surveyElem) => {
     let dataOnj = {
       sulvey: surveyElem,
       data : []
     }
     RiskInvolved.forEach((riskElm) => {
       
       let getMyRisk = this.riskIssueArray.filter((r) => r.risk.toLowerCase().replace(/ /g,'') === riskElm.toLowerCase().replace(/ /g,'') && r.surveyName === surveyElem ).map(e => e)
       let getLowRisk = getMyRisk.filter((r) => r.level === 'Low' ).map(e => e)
       let getMediumRisk = getMyRisk.filter((r) => r.level === 'Medium' ).map(e => e)
       let getHighRisk = getMyRisk.filter((r) => r.level === 'High' ).map(e => e)
  
       let totalLowRiskNum = getLowRisk.length;
       let totalMediumRiskNum = getMediumRisk.length;
       let totalHighRiskNum = getHighRisk.length;
  
       let totalPoints = ((totalLowRiskNum * 1) + (totalMediumRiskNum * 2) + (totalHighRiskNum * 3))
       let totalRiskNum = totalLowRiskNum + totalMediumRiskNum + totalHighRiskNum
       
       let finalValue = Math.round(totalPoints / totalRiskNum)
       if(!finalValue) {finalValue = 1}
  
       let riskObj = {
         risk: riskElm,
         value: finalValue
       }
  
       dataOnj.data.push(riskObj)
  
     })
  
     mychart2Datasets.push(dataOnj)
  
   })
  
  
   let unFilterednewRiskArray = []
  
   mychart2Datasets.forEach((riskData) => {
     riskData.data.forEach((e) => unFilterednewRiskArray.push(e.risk))
   })
   let newRiskArray = Array.from( new Set(unFilterednewRiskArray));
  
   this.third2BgColors = [];
   let newDatasetChart2 = [];
   newRiskArray.forEach((riskItem) => {
     let riskValuearr = []
     mychart2Datasets.forEach((riskData) => {
       riskData.data.forEach((r) => r.risk === riskItem ? riskValuearr.push(r.value) : '')
  
     })
  
     let sumRiskValue =  riskValuearr.reduce((a,b) => a + b, 0);
     let totalvalue = Math.ceil(sumRiskValue / riskValuearr.length)
       if (totalvalue === 1 ) { this.third2BgColors.push('#4dbd74'); }
       if (totalvalue === 2 ) { this.third2BgColors.push('#ffc107'); }
       if (totalvalue === 3 ) { this.third2BgColors.push('#f86c6b'); }
  
     newDatasetChart2.push(totalvalue)
   })
  
  
  
  
  
  
   this.third2Type = 'line';
  
   this.third2Labels = newRiskArray;
  
    this.third2Datasets = [{
      label: 'Risk',
      data: newDatasetChart2,
      backgroundColor: 'whitesmoke',
      borderColor: 'gray',
      borderWidth: 1.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'black',
      pointHoverBorderColor: 'gray'
   }];
  
    this.third2ChartOptions = {
     title: {
       display: false,
       text: 'Sales',
       fontSize: 25
     },
     legend: {
       display: false,
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
      enabled: true,
      callbacks: {
       label: function(tooltipItem, data) {
         if(Number(tooltipItem.yLabel) === 3) {return 'High Risk'}
         if(Number(tooltipItem.yLabel) === 2) {return 'Medium Risk'}
         if(Number(tooltipItem.yLabel) === 1) {return 'Low Risk'}
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
  
  
  
  
    this.onResizeStatus = true;
    this.onResize();
  
  } // end of thirdSectionGraphsFunction
  
  
  
  
  
  
  
  
  
  
  

  
  





  listTirdPartyToList() {
    this.listTirdPartyIsGraph = false;
  }

  listTirdPartyToGraph() {
    this.listTirdPartyIsGraph = true;
  }







  listThirdPartyCompaniesAndSurveys(num) {



  let thirdparties = this.AllUsers.filter((e) => e.userType === 'thirdparty').map(e => e);

  this.thirrdPartySurveys = this.AllSurveys.filter((surv) => surv.institutionId === thirdparties[num]._id).map(e => e);
  this.thirrdPartyCompanys = this.AllCompanies.filter((comp) => comp.institutionId === thirdparties[num]._id).map(e => e);

  this.thirrdPartyType = 'pie';
  
  this.thirrdPartyLabels = ['Surveys', 'Companies'];

  this.thirrdPartyDatasets = [
    {
      label: thirdparties[num].name,
      data: [ this.thirrdPartySurveys.length, this.thirrdPartyCompanys.length],
      backgroundColor: ['#02b0cc', 'orange' ],
      borderColor: 'white',
      borderWidth: 1.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }
  ];




  this.thirrdPartyChart = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: true,
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
}












  
  
  
  
graphChartToLine() {
  this.graphType = 'line';
  this.graphChart.legend.display = false;
  this.graphChart.scales.xAxes[0].display = true;
  this.graphDatasets[0].backgroundColor = 'rgba(2, 176, 204, .5)',
  this.graphDatasets[0].borderColor = 'rgb(2, 176, 204)',
  this.graphDatasets[0].pointBorderColor = 'rgba(2, 176, 204, .8)'
}
graphChartToBar() {
  this.graphType = 'bar';
  this.graphChart.legend.display = false;
  this.graphChart.scales.xAxes[0].display = true;
  this.graphDatasets[0].backgroundColor = this.myGraphLabelColors;
  this.graphDatasets[0].borderColor = 'white';
  this.graphDatasets[0].pointBorderColor = 'white';
}
graphChartToPie() {
  this.graphType = 'pie';
  this.graphChart.legend.display = true;
  this.graphChart.scales.xAxes[0].display = false;
  this.graphDatasets[0].backgroundColor = this.myGraphLabelColors;
  this.graphDatasets[0].borderColor = 'white';
  this.graphDatasets[0].pointBorderColor = 'white';
}








  
  
  
  
  
  
  
  graphChartFunction() {

    let graphLabelsArr = [];
    let graphDatasetDataArr = [];

    this.riskIssueArrayPerCompany.forEach((compElem) => {

      let myRiskArray = this.riskIssueArray.filter((r)=> r.company === compElem ).map(e => e);

      let LowRate = myRiskArray.filter((r)=> r.level === 'Low' ).map(e => e);
      let MediumRate = myRiskArray.filter((r)=> r.level === 'Medium' ).map(e => e);
      let HighRate = myRiskArray.filter((r)=> r.level === 'High' ).map(e => e);
      
      let totalRiskNum = this.companyRiskArray.length;
      let lowRiskNum = LowRate.length;
      let mediumRiskNum = MediumRate.length;
      let highRiskNum = HighRate.length;
  
      let lowRiskValue = lowRiskNum * 1;
      let medumRiskValue = mediumRiskNum * 2;
      let highRiskValue = highRiskNum * 3;
      let totalRiskValue = totalRiskNum * 3
  
      let myTotalRiskValue = Number(lowRiskValue) + Number(medumRiskValue) + Number(highRiskValue);
  
      graphLabelsArr.push(compElem);
      graphDatasetDataArr.push(((myTotalRiskValue * 100) / totalRiskValue).toFixed(1))
    })






    this.graphType = 'line';
  
    this.graphLabels = graphLabelsArr;
    this.myGraphLabelColors = [];
    graphDatasetDataArr.forEach((e) => {
      if(  33 > e) { this.myGraphLabelColors.push('#4dbd74') }
      if (e > 33 && 66 > e) { this.myGraphLabelColors.push('#ffc107') }
      if (e > 66) { this.myGraphLabelColors.push('#f86c6b') }
    });

    this.graphDatasets = [
      {
        label: 'Average Risk Exposure',
        data: graphDatasetDataArr,
        backgroundColor: 'rgba(2, 176, 204, .5)',
        borderColor: 'rgb(2, 176, 204)',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'rgba(2, 176, 204, .8)',
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
  
  
  
  
  
















 

  
  
  switchActiveCompany(comp) {
 
    this.activeCompany = this.riskIssueArrayPerCompany[comp];
    this.companyRiskArray = this.riskIssueArray.filter((r)=> r.company === this.activeCompany ).map(e => e);
    this.calculateActiveCompanyTotalRiskRate();

  }
  
  
  
  calculateActiveCompanyTotalRiskRate(){
    let LowRate = this.companyRiskArray.filter((r)=> r.level === 'Low' ).map(e => e);
    let MediumRate = this.companyRiskArray.filter((r)=> r.level === 'Medium' ).map(e => e);
    let HighRate = this.companyRiskArray.filter((r)=> r.level === 'High' ).map(e => e);
    
    let totalRiskNum = this.companyRiskArray.length;
    let lowRiskNum = LowRate.length;
    let mediumRiskNum = MediumRate.length;
    let highRiskNum = HighRate.length;

    let lowRiskValue = lowRiskNum * 1;
    let medumRiskValue = mediumRiskNum * 2;
    let highRiskValue = highRiskNum * 3;
    let totalRiskValue = totalRiskNum * 3

    let myTotalRiskValue = Number(lowRiskValue) + Number(medumRiskValue) + Number(highRiskValue);

    this.activeCompanyTotalRiskRate = ((myTotalRiskValue * 100) / totalRiskValue).toFixed(1)

  }
  
  
    
    
    
    
 


















  
  
  
  
  
  
  computeCompanyRiskRates() {
    this.CompnayRiskRates = [];
    this.AllCompanies.forEach( (comp) => {
  
  
      for (let surv of this.AllSurveys) {
        for (let resp of this.AllResponses) {
  
        if (resp.surveyId === surv._id && resp.companyId === comp._id) {
          let getMyRisk = this.riskIssueArray.filter((r) => r.surveyName === surv.surveyName && r.company === comp.companyName ).map(e => e)
          
          let LowRate = getMyRisk.filter((r)=> r.level === 'Low' ).map(e => e);
          let MediumRate = getMyRisk.filter((r)=> r.level === 'Medium' ).map(e => e);
          let HighRate = getMyRisk.filter((r)=> r.level === 'High' ).map(e => e);
          
          let totalRiskNum = getMyRisk.length;
          let lowRiskNum = LowRate.length;
          let mediumRiskNum = MediumRate.length;
          let highRiskNum = HighRate.length;
        
          let lowRiskValue = lowRiskNum * 1;
          let medumRiskValue = mediumRiskNum * 2;
          let highRiskValue = highRiskNum * 3;
          let totalRiskValue = totalRiskNum * 3
        
          let myTotalRiskValue = Number(lowRiskValue) + Number(medumRiskValue) + Number(highRiskValue);
        
          let total = ((myTotalRiskValue * 100) / totalRiskValue).toFixed(1)
  
          if (getMyRisk.length > 0) {
            let obj = {
              companyName: comp.companyName,
              surveyName: surv.surveyName,
              riskRate: total,
              surveyId: surv._id,
              responseId: resp._id
            }
            this.CompnayRiskRates.push(obj)
          }
        }
      }
      }
  
    });
  
  }
  
  
  
  
  
  
  
  
  riskIssuesFunction() {
    this.chartsProgress = 80;
    this.AllThreats.forEach((threat) => {
      for (let trtCategory of this.AllThreatCategorys) {
        if (trtCategory._id === threat.category) {
          this.AllCompanies.forEach( (comp) => {
            for (let response of this.AllResponses) {
              if (response.companyId === comp._id) {
                for (let survey of this.AllSurveys) {
                  if ((survey._id === response.surveyId)) {
  
                      response.answers.forEach( (respAns, idx2, array2) => {
                        if (respAns.answer[0].threatId === threat._id && respAns.answer[0].level) {
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
                          let newRiskArrayPerRisk = this.riskIssueArray.filter(() => true ).map(e => e.risk);
                          this.riskIssueArrayPerRisk = Array.from(new Set(newRiskArrayPerRisk));
                          let newRiskArrayPerCompany = this.riskIssueArray.filter(() => true ).map(e => e.company);
                          this.riskIssueArrayPerCompany = Array.from(new Set(newRiskArrayPerCompany));
                          this.activeCompany = this.riskIssueArrayPerCompany[0]
                          this.companyRiskArray = this.riskIssueArray.filter((r)=> r.company === this.activeCompany ).map(e => e);
                          this.chartsProgress = 95;
  
                          this.topCardsChartFunction();
                          this.graphChartFunction();
                          this.thirdSectionGraphsFunction();
                          this.listThirdPartyCompaniesAndSurveys(0);
                          this.calculateActiveCompanyTotalRiskRate();
                          this.computeCompanyRiskRates();
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
              wasSkipped: false,
              answers: []
            };
  
            quiz.choices.forEach((myAns, key, arr) => {
            
              ans.answer.forEach((a) => {
  
                if (a.answer) {
                  
                  if (a.answer._id){
                  
                    if (a.answer.answer === myAns.answer ) {
                      theQuestions.answers.push({picked: true, answer: myAns.answer });
      
                      if (Object.is(arr.length - 1, key)) {
                        this.QuestionsOnView.push(theQuestions);
      
                      }
                    } else {
                     
                      if (a.answer.answer === 'Not answered') {theQuestions.wasSkipped = true; }
                      
                      if (a.answer.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: true, answer: myAns.answer })}
                      if (!a.answer.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: false, answer: myAns.answer })}
                      if (Object.is(arr.length - 1, key)) {
      
                        this.QuestionsOnView.push(theQuestions);
                      }
                    }
                  }else {
                    if (a.answer === myAns.answer ) {
                      theQuestions.answers.push({picked: true, answer: myAns.answer });
      
                      if (Object.is(arr.length - 1, key)) {
                        this.QuestionsOnView.push(theQuestions);
      
                      }
                    } else {
                      if (a.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: true, answer: myAns.answer })}
                      if (!a.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: false, answer: myAns.answer })}
                      if (a.answer === 'Not answered') {theQuestions.wasSkipped = true; }
                    
                      if (Object.is(arr.length - 1, key)) {
                       
                        this.QuestionsOnView.push(theQuestions);
                      }
                    }
    
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
  
  
  







checkSurveyProgress(surveyId, responseId) {
  const myResponses = this.AllResponses.filter((resp) => resp._id === responseId ).map( e => e);
  let allQuizs = this.AllQuestions.filter((q) => q.surveyId === surveyId).map(e => e);
  let allAnswers = myResponses[0].answers;
  let allAnswersNumber = Number(allAnswers.length);

  let nextQuiz = 0;

  allQuizs.forEach((quiz, ind2, arr2) => {

    if (nextQuiz === 1) {
      let isAnswerPresent = allAnswers.filter((ans) => ans.questionId === quiz._id ).map(e => e );
      if (isAnswerPresent.length === 0) {allAnswersNumber = Number(allAnswersNumber) + 1; }
      nextQuiz = 0;
    }
    if (quiz.linked === true) {
      nextQuiz = nextQuiz + 1;
    }

    if ( ind2 === arr2.length - 1) {


      let myCompletionValue = Number((( Number(allAnswersNumber) * 100 ) / Number(allQuizs.length)).toFixed(0));

      this.surveyStatus = Number(myCompletionValue);

      }

  });

}















  trafficGraphToLine() {
    this.trafficType = 'line';
    this.trafficChartOptions.legend.display = false;
    this.trafficChartOptions.scales.xAxes[0].display = true;
    this.trafficDatasets[0].backgroundColor = 'whitesmoke';
    this.trafficDatasets[0].borderColor = 'gray';
    this.trafficDatasets[0].pointBorderColor = 'black';
  }
  trafficGraphToBar() {
    this.trafficType = 'bar';
    this.trafficChartOptions.legend.display = false;
    this.trafficChartOptions.scales.xAxes[0].display = true;
    this.trafficDatasets[0].backgroundColor = this.trafficBgColors;
    this.trafficDatasets[0].borderColor = 'white';
    this.trafficDatasets[0].pointBorderColor = 'white';
  }
  trafficGraphToPie() {
    this.trafficType = 'pie';
    this.trafficChartOptions.legend.display = true;
    this.trafficChartOptions.scales.xAxes[0].display = false;
    this.trafficDatasets[0].backgroundColor = this.trafficBgColors;
    this.trafficDatasets[0].borderColor = 'white';
    this.trafficDatasets[0].pointBorderColor = 'white';
  }
  



  trafficFunction() {

    this.trafficType = 'bar';

    let filterAllTrafics = this.AllTraffic.filter(() => true).map(e => e.source);

    this.trafficLabels = Array.from( new Set(filterAllTrafics));
    this.trafficBgColors = [];
    let trafficData = [];
    this.trafficLabels.forEach((e) => {
      this.trafficBgColors.push(this.getRandomColor());
      let myTraf = this.AllTraffic.filter((t) => t.source === e ).map(e => e);
      trafficData.push(myTraf.length);
    });
    this.trafficDatasets = [
      {
        label: ['Number Of Traffics'],
        data: trafficData,
        backgroundColor: this.trafficBgColors,
        borderColor: 'teal',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      }
    ];
  
  
  
  
    this.trafficChartOptions = {
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





  
  
  
  
  

}