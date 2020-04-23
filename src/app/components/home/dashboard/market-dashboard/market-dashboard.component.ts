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
import { ExchangerateService } from 'src/app/shared/services/exchangeRates.service';
import { GDPGrowthRateService } from 'src/app/shared/services/gdpGrowthRate.service';
import { InterestRateService } from 'src/app/shared/services/interetRates.service';

@Component({
  selector: 'app-market-dashboard',
  templateUrl: './market-dashboard.component.html',
  styleUrls: ['./market-dashboard.component.sass']
})
export class MarketDashboardComponent implements OnInit {
// tslint:disable
// tslint:disable: prefer-const

public faChartLine = faChartLine;
public faChartBar = faChartBar;
public faChartPie = faChartPie;




  constructor(
    private exchangerateService: ExchangerateService,
    private gdpGrowthRateService: GDPGrowthRateService,
    private interetRateService: InterestRateService
  ) { }

 


  public NoDataOnDasboard = false;
  
public exchangeProgress = 0;
public gdpProgress = 0;













  public currentDay = new Date();
  public currentYear = this.currentDay.getFullYear();


  public YearRange = [this.currentYear, (this.currentYear - 1),(this.currentYear - 2),];

  public ExchangeRates = [];
  public GDPGrowthRates = [];
  public InterestRates = [];


  public gdpForm;
  public countryRateObj;

  public currentYearActive = this.currentYear;
  public FormatedGDP = [];
  public MyFormatedGDP = [];
  public AllCountryCode = [];
  public interestInput;




  // chart 

  public gdpType;
  public gdpLabels;
  public gdpCountrys;
  public gdpDatasets;
  public gdpChartOptions;
  public gdpBgColors = [];


  public exchangeType;
  public exchangeLabels;
  public exchangeDatasets;
  public exchangeChartOptions;
  public exchangeBgColors = []




  ngOnInit() {

    this.gdpForm = {
      dateUpdated: Date,
      meta:{quarter: null, year: null},
      countryRate: []
    }

    this.countryRateObj = { code: '', value: null   }

    this.interestInput = '';


    this.updatePage().then(() => {})


  }




  updatePage() {
    this.exchangeProgress = 40;
    this.gdpProgress = 40; 
    return new Promise((resolve, reject) => {
      this.gdpGrowthRateService.getAllGDP().subscribe(
        data => {
          this.gdpProgress = 80;
          this.GDPGrowthRates = data;
          this.formartCounrtyCode();
        },
        error => console.log('Error geting gdp')
      )

      this.interetRateService.getAllInterestRate().subscribe(
        data => {
          this.InterestRates = data;

        },
        error => console.log('Error getting Interest')
      )

      this.exchangerateService.getAllExchangerates().subscribe(
        dataExch => {
          this.exchangeProgress = 80;
          this.ExchangeRates = dataExch;
          this.ExchangeRatesGraph();
          resolve();
        },
        error => console.log('Error getting exchange rate')
      )
      
    })

  }



  async formartCounrtyCode() {
    let unsortedCountries = []
 
    this.GDPGrowthRates.forEach((elm) => {
      elm.countryRate.forEach((cntry)=> {
        unsortedCountries.push(cntry.code);
      })

    })

    this.AllCountryCode = Array.from(new Set(unsortedCountries));
    if(this.AllCountryCode.length === 0) {this.gdpProgress = 100}

    this.forMartGDP()
  }




  async forMartGDP() {
    this.FormatedGDP = [];


    this.AllCountryCode.forEach((country) => {

      this.YearRange.forEach((yearItem, ind, arr) => {
        let myData = {
          year: yearItem,
          code: country,
          firstQ: null,
          secondQ: null,
          thirdQ: null,
          fourthQ: null
        }
        this.GDPGrowthRates.forEach((gdpElement) => {
          if(yearItem === gdpElement.meta.year ) {
       
            if( gdpElement.meta.quarter === 1){
             
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.firstQ = contryItem.value
                 
                }
              });
  
            }
  
            if( gdpElement.meta.quarter === 2){
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.secondQ = contryItem.value
                }
              });
  
            }
  
            if( gdpElement.meta.quarter === 3){
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.thirdQ = contryItem.value
                }
              });            
            }
  
            if( gdpElement.meta.quarter === 4){
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.fourthQ = contryItem.value
                }
              });          
            }
  
  
  
          }
        })
  

        this.FormatedGDP.push(myData);
        this.MyFormatedGDP = this.FormatedGDP.filter((gdp) => gdp.year === this.currentYearActive).map((e) => e);
        this.gdpRatesGraph();
  
      })

    })
  }

















  switchYear(y) {
    this.currentYearActive = y;
    this.MyFormatedGDP = this.FormatedGDP.filter((gdp) => gdp.year === this.currentYearActive).map((e) => e);
  }



  getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {color += letters[Math.floor(Math.random() * 16)]; }
    return color;
  }








  gdpGraphToLine() {
    this.gdpType = 'line';
    this.gdpChartOptions.legend.display = false;
    this.gdpChartOptions.scales.xAxes[0].display = true;
    this.gdpDatasets[0].backgroundColor = 'whitesmoke'; 
    this.gdpDatasets[0].borderColor = 'gray';
    this.gdpDatasets[0].pointBorderColor = 'black';
  }
  gdpGraphToBar() {
    this.gdpType = 'bar';
    this.gdpChartOptions.legend.display = false;
    this.gdpChartOptions.scales.xAxes[0].display = true;
    this.gdpDatasets[0].backgroundColor = ['#02b0cc','#074BFB', '#ffc107', '#f86c6b'];
    this.gdpDatasets[0].borderColor = 'transparent';
    this.gdpDatasets[0].pointBorderColor = 'white';
  }
  gdpGraphToPie() {
    this.gdpType = 'pie';
    this.gdpChartOptions.legend.display = true;
    this.gdpChartOptions.scales.xAxes[0].display = false;
    this.gdpDatasets[0].backgroundColor = ['#02b0cc','#074BFB', '#ffc107', '#f86c6b'];
    this.gdpDatasets[0].borderColor = 'white';
    this.gdpDatasets[0].pointBorderColor = 'white';

  }
  


  switchGDPCountry(countryCode) {
    this.gdpDatasets[0].label = countryCode;
    let gdpData = this.MyFormatedGDP.filter((c) => c.code === countryCode).map(e => e);
    this.gdpDatasets[0].data = [gdpData[0].firstQ, gdpData[0].secondQ, gdpData[0].thirdQ, gdpData[0].fourthQ];
  }



  gdpRatesGraph() {
    this.gdpProgress = 100;
    this.gdpType = 'bar';


    this.gdpCountrys = this.MyFormatedGDP.filter(() => true).map(e => e.code);
    this.gdpLabels =  ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];
    let gdpData = this.MyFormatedGDP.filter((c) => c.code === 'KEN').map(e => e);
    this.gdpLabels.forEach((e) => {
      this.gdpBgColors.push(this.getRandomColor());
    });
    this.gdpDatasets = [
      {
        label: 'KEN',
        data: [gdpData[0].firstQ, gdpData[0].secondQ, gdpData[0].thirdQ, gdpData[0].fourthQ],
        backgroundColor: ['#02b0cc','#074BFB', '#ffc107', '#f86c6b'],
        borderColor: 'transparent',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      }
    ];
  
  
  
  
    this.gdpChartOptions = {
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
























  exchangeGraphToLine() {
    this.exchangeType = 'line';
    this.exchangeChartOptions.legend.display = false;
    this.exchangeChartOptions.scales.xAxes[0].display = true;
    this.exchangeDatasets[0].backgroundColor = 'whitesmoke';
    this.exchangeDatasets[0].borderColor = 'gray';
    this.exchangeDatasets[0].pointBorderColor = 'black';
  }
  exchangeGraphToBar() {
    this.exchangeType = 'bar';
    this.exchangeChartOptions.legend.display = false;
    this.exchangeChartOptions.scales.xAxes[0].display = true;
    this.exchangeDatasets[0].backgroundColor = this.exchangeBgColors;
    this.exchangeDatasets[0].borderColor = 'white';
    this.exchangeDatasets[0].pointBorderColor = 'white';
  }
  exchangeGraphToPie() {
    this.exchangeType = 'pie';
    this.exchangeChartOptions.legend.display = true;
    this.exchangeChartOptions.scales.xAxes[0].display = false;
    this.exchangeDatasets[0].backgroundColor = this.exchangeBgColors;
    this.exchangeDatasets[0].borderColor = 'white';
    this.exchangeDatasets[0].pointBorderColor = 'white';
  }
  



  ExchangeRatesGraph() {

    this.exchangeProgress = 100;
    this.exchangeType = 'bar';

    this.exchangeLabels = this.ExchangeRates[0].countryRate.filter((ctr) => 
      ((ctr.code === 'KES') || (ctr.code === 'TZS') || (ctr.code === 'UGX') || (ctr.code === 'ZMW') ||
      (ctr.code === 'AED') || (ctr.code === 'EGP') || (ctr.code === 'EUR') || (ctr.code === 'NZD'))
    ).map(e => e.code);
    this.exchangeBgColors = [];
    this.exchangeLabels.forEach((e) => {
      this.exchangeBgColors.push(this.getRandomColor());
    });
    this.exchangeDatasets = [
      {
        label: ['Exchange Rates'],
        data: this.ExchangeRates[0].countryRate.filter((ctr) => 
        ((ctr.code === 'KES') || (ctr.code === 'TZS') || (ctr.code === 'UGX') || (ctr.code === 'ZMW') ||
        (ctr.code === 'AED') || (ctr.code === 'EGP') || (ctr.code === 'EUR') || (ctr.code === 'NZD'))
        ).map(e => e.value),
        backgroundColor: this.exchangeBgColors,
        borderColor: 'teal',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      }
    ];
  
  
  
  
    this.exchangeChartOptions = {
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
