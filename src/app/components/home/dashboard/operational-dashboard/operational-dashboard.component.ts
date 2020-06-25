import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { faChartLine, faChartBar, faChartPie, faListAlt, faBuilding, faLink, faFire, faShare } from '@fortawesome/free-solid-svg-icons';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { MixedColors } from 'src/app/shared/colors/color';



@Component({
  selector: 'app-operational-dashboard',
  templateUrl: './operational-dashboard.component.html',
  styleUrls: ['./operational-dashboard.component.sass']
})
export class OperationalDashboardComponent implements OnInit {
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
    private industriesServices: IndustryService,
    private notification: NotificationService
  ) { }

  @ViewChild('viewAnswersModal', {static: true }) viewAnswersModal: ModalDirective;
  @ViewChild('shareModal', {static: true } ) shareModal: ModalDirective;


  public NoDataOnDasboard = false;

  public faListAlt = faListAlt;
  public faBuilding = faBuilding;
  public faFire = faFire;
  public faLink = faLink;
  
  
  
  public AllUsers = [];
  public AllCompanies = [];
  public AllSurveys = [];
  public AllQuestions = [];
  public AllResponses = [];
  public AllThreats = [];
  public AllThreatCategorys = [];
  public AllTraffic = [];
  public AllIndustries = [];
  
  // Icons
  public faChartLine = faChartLine;
  public faChartBar = faChartBar;
  public faChartPie = faChartPie;
  
  
  public pluginDataLabels = [pluginDataLabels]
  // Top Cards variables
  public AllThirdParties = [];
  
  
  
  
  public CompanyRiskRates = [];
  public CompanyRiskRatesSurvey = [];
  public CompanyRiskRatesDataList = [];
  public CompanyRiskRatesDataListView = [];
  
  
  public chartsProgress = 0;
  
  
  
  
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
  public Filter2Name = '';
  
  
  
  
  

  // 
  public shareLink;















  ngOnInit() {

    this.updatePage().then(() => { this.riskIssuesFunction(); } );
    this.shareLink = `https://bcp.tactive.consulting/register?institution=${sessionStorage.getItem('loggedUserInstitution')}`


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

      this.companyProfileService.getAllCompaniesByInstitutionId().subscribe( dataCompanies => {

        this.AllCompanies = dataCompanies;
        this.chartsProgress = 20

        // console.log(this.AllCompanies);

        this.surveyService.getAllInstitutionSurveys().subscribe( dataSurvey => {

           
          // this.AllSurveys = dataSurvey;
          // Get only Bcp Final Survey
          const id = dataSurvey[0]._id;
          this.AllSurveys.push(dataSurvey[0])
          

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


                this.threatCategoryService.getAllThreatCategorys().subscribe ( dataThreatCat => {
                  this.AllThreatCategorys = dataThreatCat; 
                  this.chartsProgress = 65
                  
                 
                  this.industriesServices.getAllIndustrys().subscribe(
                    dataInd => {
                      this.AllIndustries = dataInd;
                      this.chartsProgress = 70
                      resolve();
                    },error => console.log('Error getting all industries')
                  )
  

                }, error => console.log('Error getting all threat Categories'));


              }, error => console.log('Error getting all responses'));


            }, error => console.log('Error getting all threats') );

          }, error => console.log('Error getting all questions'));


        }, error => console.log('Error getting all surveys'));


      }, error => console.log('Error getting all companies'));

    }, error => console.log('Error getting all users'));


  });
}









copyShareLink(inputElement) {
  inputElement.select();  
  document.execCommand('copy');  
  inputElement.setSelectionRange(0, 0);    
  this.notification.showInfo(inputElement.value, 'Text Copied !');
}




getRandomColor(i: number) {
  let maxIndex = MixedColors.length;
  if (maxIndex > i) {
    return MixedColors[i];
  } else {
    let remainder = i % maxIndex;
    return MixedColors[remainder];
  }
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
newThreatCatArray.forEach((trtCat, i, arr) => {
  let y = ThreatRiskAndCat.filter((c) => c.category === trtCat).map(e => e)
  this.riskCategoryChartColors.push(this.getRandomColor(i));
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
        display: false,
        clamp: false,
        anchor: 'top',
        align: 'end',
        color: 'black',
        formatter: function(value, context) {
          return context.chart.data.labels[context.dataIndex] + ': ' + value + '%';
        },
        font: { weight: 400, size: 12 },
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


let label1 = newThreatArray;
let myDatasets = [];
this.overallRiskRatingChartColors = [];
let sumRisksData = 0
label1.forEach((riskEl, i, arr) => {
  this.overallRiskRatingChartColors.push(this.getRandomColor(i));
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
  backgroundColor: '#2980B9',
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
        anchor: 'end',
        align: 'right',
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

myLabels.forEach((ind, i, arr) => {
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
  this.riskPerIndustryChartColors.push(this.getRandomColor(i))

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
    // myDataSet1.push(obj)
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
  backgroundColor: '#2980B9',
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
          beginAtZero: true
        }
    }]
  },
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
      datalabels: {
        clamp: true,
        anchor: 'end',
        align: 'right',
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

















filterCompany() {
  if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
    this.riskIssueArrayPerCompanyToView1 = this.riskIssueArrayPerCompanyToView;
  } else {

    this.riskIssueArrayPerCompanyToView1 = this.riskIssueArrayPerCompanyToView.filter(v => v.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);

  }

}






switchActiveThirdCompany(idParam) {

  if(idParam === 1) {
        let getTactive = this.AllThirdParties.filter((r) => r._id === sessionStorage.getItem('loggedUserInstitution')).map(e => e)
        if(getTactive.length === 0) { this.activeThirdParty = this.AllThirdParties[0]._id;}
        if(getTactive.length !== 0) { this.activeThirdParty = getTactive[0]._id;}
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


  
  
  
  




















filterCompanySurvey() {
  if (!this.Filter2Name || this.Filter2Name === null || this.Filter2Name === '' || this.Filter2Name.length  < 1) {
    this.CompanyRiskRatesDataListView = this.CompanyRiskRatesDataList;
  } else {
    this.CompanyRiskRatesDataListView = this.CompanyRiskRatesDataList.filter(v => v.companyName.toLowerCase().indexOf(this.Filter2Name.toLowerCase()) > -1).slice(0, 10);
  }

}




computeCompanyRiskRates() {
  this.CompanyRiskRates = [];
  let CompanyRiskRatesSurveyArr = []
  let CompanyList = []
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
          this.CompanyRiskRates.push(obj)
          CompanyList.push(comp.companyName)
          CompanyRiskRatesSurveyArr.push(surv.surveyName)
        }
      }
    }
    }

  });

  this.CompanyRiskRatesSurvey = Array.from( new Set(CompanyRiskRatesSurveyArr))

  let newArr = Array.from( new Set(CompanyList))

  this.CompanyRiskRatesDataList = []
  newArr.forEach((c) => {
    let mainObj = {
      companyName:c,
      data: [] 
    }
    this.CompanyRiskRatesSurvey.forEach((surv) => {
      let getMyComp = this.CompanyRiskRates.filter((cmpRisk) => cmpRisk.companyName === c && cmpRisk.surveyName === surv).map(e => e);

      if (getMyComp.length === 0) {
        let dataObj = {
          surveyName: surv,
          riskRate: 0,
          surveyId: 0,
          responseId: 0
        }
        mainObj.data.push(dataObj)
      } else {
        let dataObj = {
          surveyName: getMyComp[0].surveyName,
          riskRate: getMyComp[0].riskRate,
          surveyId: getMyComp[0].surveyId,
          responseId: getMyComp[0].responseId
        }
        mainObj.data.push(dataObj)
      
      }
     
    })


    this.CompanyRiskRatesDataList.push(mainObj)
    
  })

  this.CompanyRiskRatesDataList = this.CompanyRiskRatesDataList.sort((a, b) => {
    if(a.companyName < b.companyName) { return -1; }
    if(a.companyName > b.companyName) { return 1; }
    return 0;
  });

  this.CompanyRiskRatesDataListView = this.CompanyRiskRatesDataList

}








riskIssuesFunction() {
  this.chartsProgress = 80;
  this.AllThreats.forEach((threat,idx1, arr1 ) => {
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
                      
                        this.chartsProgress = 100;

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


    if(idx1 === arr1.length - 1 && this.chartsProgress === 80) {
      this.NoDataOnDasboard = true;
    }


  });


}











openAnswersModal(companyName, surveyName, responseId) {

  if(responseId === 0) {return}

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
                            this.QuestionsOnView = this.QuestionsOnView.filter((q) =>  q.answer !== 'Not answered').map(e => e);
                            this.viewAnswersModal.show();
                       
                          }
                  }
              }); // responseObj.answers.forEach(answr => {

                resolve();
                this.QuestionsOnView = this.QuestionsOnView.filter((q) =>  q.answer !== 'Not answered').map(e => e);
                this.viewAnswersModal.show();

          }
        });   // data.forEach(responseObj => {
      
  


});
}

















































checkSurveyProgress(surveyId, responseId) {
  if(responseId === 0) {return}
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
  this.trafficLabels.forEach((e, i, arr) => {
    this.trafficBgColors.push(this.getRandomColor(i));
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