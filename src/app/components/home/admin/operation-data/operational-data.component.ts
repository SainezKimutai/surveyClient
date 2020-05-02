import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
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
import * as pluginDataLabels from 'chartjs-plugin-datalabels';



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


public pluginDataLabels = [pluginDataLabels]
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
public chart3plugin: any;

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
public riskIssueArrayPerCompanyToView = [];
public riskIssueArrayPerCompanyToView1 = [];
public activeRisk;
public myGraphLabelColors = [];

public surveyStatus = 0;

// company risk

public companyRiskArray = [];
public activeCompany;
public activeThirdParty;
public activeCompanyTotalRiskRate = null;


// trafic
public trafficType;
public trafficLabels;
public trafficDatasets;
public trafficChartOptions;
public trafficBgColors = [];




// Risk CategoryChart variables
public riskCategoryChartType: string;
public riskCategoryChartLabels: Array<any>;
public riskCategoryChartDatasets: Array<any>;
public riskCategoryChartOptions: any;
public riskCategoryChartColors: any;

// Ovarall risk rating variables
public overallRiskRatingChartType: string;
public overallRiskRatingChartLabels: Array<any>;
public overallRiskRatingChartDatasets: Array<any>;
public overallRiskRatingChartOptions: any;
public overallRiskRatingChartColors: any;

// risk per industry variables
public riskPerIndustryChartType: string;
public riskPerIndustryChartLabels: Array<any>;
public riskPerIndustryChartDatasets: Array<any>;
public riskPerIndustryChartOptions: any;
public riskPerIndustryChartColors: any;


public FilterName = '';












  ngOnInit() {
    
    this.updatePage().then(() => { this.riskIssuesFunction(); this.trafficFunction(); } );

  
  }






























  updatePage() {

    return new Promise((resolve, reject) => {
  
      this.userService.getAllUsers().subscribe( datauser => {
        this.AllUsers = datauser;
        let a = this.AllUsers.filter((e) => e.userType === 'thirdparty').map(e => e);
        this.AllThirdParties = a.sort((a, b) => {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        });
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
  
  





  


riskCategoriesFunction() {
  
  this.riskCategoryChartType = 'pie';


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


  let dateSet1 = [];
  this.riskCategoryChartColors = [];
  newThreatCatArray.forEach((trtCat) => {
    let y = ThreatRiskAndCat.filter((c) => c.category === trtCat).map(e => e)
    this.riskCategoryChartColors.push(this.getRandomColor());
    dateSet1.push(y.length);
  })

  let sumDatasets1 = dateSet1.reduce((a, b) => a + b, 0)
  let dataset2 = []
  dateSet1.forEach((a) => {
    let b = ((a * 100) / sumDatasets1).toFixed(0)
    dataset2.push(b);
  })


  this.riskCategoryChartLabels = newThreatCatArray;
  

  this.riskCategoryChartDatasets = [{
    label: 'Risk',
    data: dataset2,
    backgroundColor: this.riskCategoryChartColors,
    borderColor: 'white',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'white',
    pointHoverBorderColor: 'gray'
  }];

  this.riskCategoryChartOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'bottom',
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
              let dataInx = tooltipItem.index
              let lbl = data.labels[dataInx];
              let value = data.datasets[0].data[dataInx];
              return `${lbl} : ${value}%`;
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
          clamp: false,
          anchor: 'end',
          align: 'end',
          color: 'teal',
          formatter: function(value, context) {
            return context.chart.data.labels[context.dataIndex] + ': ' + value + '%';
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

}











OverallRiskRatingFunction() {

  this.overallRiskRatingChartType = 'horizontalBar';

  let threatArray =  this.riskIssueArray.filter(() => true ).map(e => e.risk);
  let newThreatArray1 = Array.from(new Set(threatArray));
  let newThreatArray =  newThreatArray1.reduce((unique, item) => {
    let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
    let item2 = item.toLowerCase().replace(/ /g,''); 
    return unique1.includes(item2) ? unique : [...unique, item]
  }, []);


  this.third2Type = 'bar';

  let label1 = newThreatArray;
  let myDatasets = [];
  this.overallRiskRatingChartColors = [];
  let sumRisksData = 0
  label1.forEach((riskEl) => {
    this.overallRiskRatingChartColors.push(this.getRandomColor());
    let myArr2 = this.riskIssueArray.filter((rsk) => rsk.risk === riskEl ).map(e => e);
    sumRisksData = sumRisksData + myArr2.length;
    myDatasets.push({label: riskEl, data: myArr2.length});
  });


  let myDatasets1 = []
 
  myDatasets.forEach((d) => {

    let x = ((Number(d.data) * 100) / Number(sumRisksData)).toFixed(1)
    d.data = Number(x);

    myDatasets1.push(d);
  })

  let myDatasets2 = myDatasets1.sort((a, b) => b.data - a.data)


  this.overallRiskRatingChartLabels = myDatasets2.filter(() => true).map(e => e.label)

  this.overallRiskRatingChartDatasets = [{
    label: 'Risk',
    data: myDatasets2.filter(() => true).map(e => e.data),
    backgroundColor: this.overallRiskRatingChartColors,
    borderColor: 'white',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'white',
    pointHoverBorderColor: 'gray'
  }];

  this.overallRiskRatingChartOptions = {
    legend: {
      display: false,
      position: 'bottom',
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
              let dataInx = tooltipItem.index
              let lbl = data.labels[dataInx];
              let value = data.datasets[0].data[dataInx];
              return `${lbl} : ${value}%`;
            },
        }
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
          clamp: true,
          anchor: 'center',
          align: 'center',
          color: 'black',
          formatter: function(value, context) {
            return value + '%';
          },
          font: { weight: 'bold', size: 12 },
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

}





RiskPerIndustryChartfunction() {
  this.riskPerIndustryChartType = 'horizontalBar';

  let myLabels = [];


  let myCompanyArr = []
  this.riskIssueArrayPerCompany.forEach((compElem) => {

    let myRiskArray = this.riskIssueArray.filter((r)=> r.company === compElem ).map(e => e);
  
    let LowRate = myRiskArray.filter((r)=> r.level === 'Low' ).map(e => e);
    let MediumRate = myRiskArray.filter((r)=> r.level === 'Medium' ).map(e => e);
    let HighRate = myRiskArray.filter((r)=> r.level === 'High' ).map(e => e);
    
    let totalRiskNum = myRiskArray.length;
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
   
    myCompanyArr.push(compObj)

  })


  let allIndustryTypes = this.AllCompanies.filter((r) => true).map(e => e.companyType);
  myLabels = Array.from(new Set(allIndustryTypes));

  this.riskPerIndustryChartColors = []
  let myDataSet1 = [];

  myLabels.forEach((ind) => {
    let value = 0;
    let num = 0;
    myCompanyArr.forEach((dataElm) => {
      this.AllCompanies.forEach((comp) => {
        if(dataElm.companyName === comp.companyName && ind === comp.companyType){
          value = value + Number(dataElm.averageRiskrate)
          num++
        } 
      })
    })
    this.riskPerIndustryChartColors.push(this.getRandomColor())

    if(num !== 0 && value !== 0) {
      let x = Number(Number(value) / Number(num)).toFixed(0)
      let obj = {
        label: ind,
        data: Number(x)
      }
   
      myDataSet1.push(obj)
    } else {
      let obj = {
        label: ind,
        data: 0
      }
      myDataSet1.push(obj)
    }
  
  });

  let sumArr = myDataSet1.filter(r => true).map(e => e.data);
  let sumDataset = sumArr.reduce((a, b) => Number(a) + Number(b), 0)

  let myDatasets2 = []
 
  myDataSet1.forEach((d) => {

    let x = ((Number(d.data) * 100) / Number(sumDataset)).toFixed(1)
    d.data = Number(x);

    myDatasets2.push(d);
  })

  let myDatasets3 = myDatasets2.sort((a, b) => b.data - a.data)

  this.riskPerIndustryChartLabels = myDatasets3.filter(() => true).map(e => e.label)
 
  
  this.riskPerIndustryChartDatasets = [{
    label: 'Risk rate',
    data: myDatasets3.filter(() => true).map(e => e.data),
    backgroundColor: this.riskPerIndustryChartColors,
    borderColor: 'white',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'white',
    pointHoverBorderColor: 'gray'
  }];

  this.riskPerIndustryChartOptions = {
    legend: {
      display: false,
      position: 'bottom',
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
              let dataInx = tooltipItem.index
              let lbl = data.labels[dataInx];
              let value = data.datasets[0].data[dataInx];
              return `${lbl} : ${value}%`;
            },
        }
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
          clamp: true,
          anchor: 'center',
          align: 'center',
          color: 'black',
          formatter: function(value, context) {
            return value + '%';
          },
          font: { weight: 'bold', size: 12 },
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


}





































  async topCardsChartFunction() {
  
    
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
  
  
  
  
  
  
  
  
  
  
    let threatArray =  this.riskIssueArray.filter(() => true ).map(e => e.risk);
    let newThreatArray = Array.from(new Set(threatArray));

    this.third2Type = 'bar';

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
      enabled: true
    //   callbacks: {
    //    label: function(tooltipItem, data) {
    //      if(Number(tooltipItem.yLabel) === 3) {return 'High Risk'}
    //      if(Number(tooltipItem.yLabel) === 2) {return 'Medium Risk'}
    //      if(Number(tooltipItem.yLabel) === 1) {return 'Low Risk'}
    //      if(Number(tooltipItem.yLabel) === 0) {return 'Not Assessed'}
    //    },
    // }
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


  this.chart3plugin = [pluginDataLabels];

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
        enabled: true,
        intersect: true
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
            anchor: 'center',
            align: 'top',
            formatter: Math.round,
            font: { weight: 'bold', size: 18 }
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
  
  
  
  
  










  filterCompany() {
    if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
      this.riskIssueArrayPerCompanyToView1 = this.riskIssueArrayPerCompanyToView;
    } else {

      this.riskIssueArrayPerCompanyToView1 = this.riskIssueArrayPerCompanyToView.filter(v => v.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);

    }

  }





 
  switchActiveThirdCompany(idParam) {

    if(idParam === 1) {
          this.activeThirdParty = this.AllThirdParties[0]._id;
          this.riskIssueArrayPerCompanyToView = [];
          this.riskIssueArrayPerCompany.forEach((riskComp) => {
            let myComp = this.AllCompanies.filter((cpm) => riskComp === cpm.companyName && this.activeThirdParty === cpm.institutionId ).map(e => e);
            if (myComp.length > 0) { this.riskIssueArrayPerCompanyToView.push(riskComp); }
          })
          
          this.riskIssueArrayPerCompanyToView1 = this.riskIssueArrayPerCompanyToView
          this.activeCompany = this.riskIssueArrayPerCompanyToView1[0];
          this.companyRiskArray = this.riskIssueArray.filter((r)=> r.company === this.activeCompany ).map(e => e);
          this.calculateActiveCompanyTotalRiskRate();

    } else {
        this.activeThirdParty = idParam;
        this.riskIssueArrayPerCompanyToView = [];
        this.riskIssueArrayPerCompany.forEach((riskComp) => {
          let myComp = this.AllCompanies.filter((cpm) => riskComp === cpm.companyName && this.activeThirdParty === cpm.institutionId ).map(e => e);
          if (myComp.length > 0) { this.riskIssueArrayPerCompanyToView.push(riskComp); }
        })

        this.riskIssueArrayPerCompanyToView1 = this.riskIssueArrayPerCompanyToView
          this.activeCompany = this.riskIssueArrayPerCompanyToView1[0];
        this.companyRiskArray = this.riskIssueArray.filter((r)=> r.company === this.activeCompany ).map(e => e);
        this.calculateActiveCompanyTotalRiskRate();
      }

  }
  
  
  switchActiveCompany(comp) {
 
    this.activeCompany = this.riskIssueArrayPerCompanyToView1[comp];
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
                          let riskIssueArrayPerCompany1 = Array.from(new Set(newRiskArrayPerCompany));
                          riskIssueArrayPerCompany1 = riskIssueArrayPerCompany1.sort((a, b) => { if(a < b) { return -1; } if(a > b) { return 1; } return 0; });
                          this.riskIssueArrayPerCompany =  riskIssueArrayPerCompany1.reduce((unique, item) => {
                            let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
                            let item2 = item.toLowerCase().replace(/ /g,''); 
                            return unique1.includes(item2) ? unique : [...unique, item]
                          }, []);
                        
                          this.chartsProgress = 95;
  
                          this.topCardsChartFunction();
                          this.graphChartFunction();
                          this.thirdSectionGraphsFunction();
                          this.listThirdPartyCompaniesAndSurveys(0);
                          this.calculateActiveCompanyTotalRiskRate();
                          this.computeCompanyRiskRates();

                          this.riskCategoriesFunction(); 
                          this.OverallRiskRatingFunction()
                          this.RiskPerIndustryChartfunction();
                          this.switchActiveThirdCompany(1);
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
    this.QuestionsOnView = []
    return new Promise((resolve, reject) => {
  
          this.AllResponses.forEach((responseObj, ind1, arr1) => {
            if(responseObj._id === responseId ) {
  
                 responseObj.answers.forEach((answr , ind2, arr2) => {
                  const question = {};
              
                    let quizArr = this.AllQuestions.filter((q) => q._id === answr.questionId).map(e => e)
                    let questions = quizArr[0];
  
                    if (questions) {
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
                                  // Here was chnaged from 
                                  
                                  // question['answer'] = answr.answer.answer;
                                  // question['recom'] = answr.answer.recom;
                                  // question['level'] = answr.answer.level;
                                  // question['threat'] = answr.answer.threatId ?  answr.answer.threat : '';
                                   // Here was chnaged from 
  
                                  // to 
                                  question['answer'] = answr.answer ? answr.answer.answer: answr.answer;
                                  question['recom'] = answr.recom;
                                  question['level'] = answr.level;
                                  question['threat'] = answr.threatId ?  answr.threat : '';
                                  
                                 }
                                });
  
                                this.QuestionsOnView.push(question)
                                 
                              
                            
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
                                      this.QuestionsOnView.push(question);
                                      }
                                    }
                    
                              }
                            // check for last loop
                            if ((ind1 === arr1.length - 1) && (ind2 === arr2.length - 1)){
                            
                              resolve();
                              this.viewAnswersModal.show();
                         
                            }
                    }
                }); // responseObj.answers.forEach(answr => {
  
                  resolve();
                  this.viewAnswersModal.show();
  
            }
          });   // data.forEach(responseObj => {
        
    
  
  
  });
  }
  
  
  














































  checkSurveyProgress(surveyId, responseId) {
    const myResponses = this.AllResponses.filter((resp) => resp._id === responseId ).map( e => e);
    let allQuizs = this.AllQuestions.filter((q) => q.surveyId === surveyId).map(e => e);
    let allQuizs2 = allQuizs.sort((a, b) =>  b.position - a.position);
    let allQuizs3 = allQuizs2.reverse();
    let allAnswers = myResponses[0].answers;
    let allAnswersNumber = Number(allAnswers.length);
  
    let nextQuiz = 0;
  
    allQuizs3.forEach((quiz, ind2, arr2) => {
  
      if (nextQuiz === 1) {
        let isAnswerPresent = allAnswers.filter((ans) => ans.questionId === quiz._id ).map(e => e );
        if (isAnswerPresent.length === 0) {allAnswersNumber = Number(allAnswersNumber) + 1; }
        nextQuiz = 0;
      }
      if (quiz.linked === true) {
        nextQuiz = nextQuiz + 1;
      }
  
      if ( ind2 === arr2.length - 1) {
  
  
        let myCompletionValue = Number((( Number(allAnswersNumber) * 100 ) / Number(allQuizs3.length)).toFixed(0));
  
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