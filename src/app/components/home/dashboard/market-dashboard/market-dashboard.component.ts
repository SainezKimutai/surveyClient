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
  public gdpDatasets;
  public gdpChartOptions;


  public exchangeType;
  public exchangeLabels;
  public exchangeDatasets;
  public exchangeChartOptions;






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
    return new Promise((resolve, reject) => {
      this.gdpGrowthRateService.getAllGDP().subscribe(
        data => {
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











  gdpRatesGraph() {

    this.gdpType = 'bar';

    this.gdpLabels = this.MyFormatedGDP.filter(() => true).map(e => e.code);
    let myGraphLabelColors = [];
    this.gdpLabels.forEach((e) => {
      myGraphLabelColors.push(this.getRandomColor());
    });
    this.gdpDatasets = [
      {
        label: ['First Quarter'],
        data: this.MyFormatedGDP.filter(() => true).map(e => e.firstQ),
        backgroundColor: myGraphLabelColors,
        borderColor: 'teal',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      },
      {
        label: ['Second Quarter'],
        data: this.MyFormatedGDP.filter(() => true).map(e => e.secondQ),
        backgroundColor: myGraphLabelColors,
        borderColor: 'teal',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      },
      {
        label: ['Third Quarter'],
        data: this.MyFormatedGDP.filter(() => true).map(e => e.thirdQ),
        backgroundColor: myGraphLabelColors,
        borderColor: 'teal',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      },
      {
        label: ['Fourth Quarter'],
        data: this.MyFormatedGDP.filter(() => true).map(e => e.fourthQ),
        backgroundColor: myGraphLabelColors,
        borderColor: 'teal',
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
            display: true,
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



















  ExchangeRatesGraph() {

    this.exchangeType = 'bar';

    this.exchangeLabels = this.ExchangeRates[0].countryRate.filter((ctr) => 
      ((ctr.code === 'KES') || (ctr.code === 'TZS') || (ctr.code === 'UGX') || (ctr.code === 'ZMW') ||
      (ctr.code === 'AED') || (ctr.code === 'EGP') || (ctr.code === 'EUR') || (ctr.code === 'NZD'))
    ).map(e => e.code);
    let myGraphLabelColors = [];
    this.exchangeLabels.forEach((e) => {
      myGraphLabelColors.push(this.getRandomColor());
    });
    this.exchangeDatasets = [
      {
        label: ['Exchange Rates'],
        data: this.ExchangeRates[0].countryRate.filter((ctr) => 
        ((ctr.code === 'KES') || (ctr.code === 'TZS') || (ctr.code === 'UGX') || (ctr.code === 'ZMW') ||
        (ctr.code === 'AED') || (ctr.code === 'EGP') || (ctr.code === 'EUR') || (ctr.code === 'NZD'))
        ).map(e => e.value),
        backgroundColor: myGraphLabelColors,
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
