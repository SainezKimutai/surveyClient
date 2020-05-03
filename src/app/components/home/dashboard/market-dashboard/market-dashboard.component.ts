import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faChartLine, faChartBar, faChartPie, faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';

import { ExchangerateService } from 'src/app/shared/services/exchangeRates.service';
import { GDPGrowthRateService } from 'src/app/shared/services/gdpGrowthRate.service';
import { InterestRateService } from 'src/app/shared/services/interetRates.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-market-dashboard',
  templateUrl: './market-dashboard.component.html',
  styleUrls: ['./market-dashboard.component.sass']
})
export class MarketDashboardComponent implements OnInit {
// tslint:disable
// tslint:disable: prefer-const





  constructor(
    private exchangerateService: ExchangerateService,
    private gdpGrowthRateService: GDPGrowthRateService,
    private interetRateService: InterestRateService
  ) { }

 

public faChartLine = faChartLine;
public faChartBar = faChartBar;
public faChartPie = faChartPie;
public faArrowAltCircleLeft = faArrowAltCircleLeft;
public faArrowAltCircleRight = faArrowAltCircleRight;


public exchangeProgress = 0;
public gdpProgress = 0;

public monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
public daysArray = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th',
                    '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st']


public currentDay = new Date();
public currentYear = this.currentDay.getFullYear();
public currentMonth = this.currentDay.getMonth();


public YearRange = [this.currentYear, (this.currentYear - 1),(this.currentYear - 2),(this.currentYear - 3)];

public ExchangeRates = [];
public GDPGrowthRates = [];
public InterestRates = [];


public gdpForm;
public countryRateObj;

public currentYearActive = this.currentYear - 1;
public FormatedGDP = [];
public MyFormatedGDP = [];
public MyFormatedGDP2 = [];
public AllCountryCode = [];
public interestInput;




// chart 
public pluginDataLabels = pluginDataLabels;

public gdpType;
public gdpLabels;
public gdpCountrys;
public gdpDatasets;
public gdpChartOptions;
public gdpBgColors = [];

public gdp2Type;
public gdp2Labels;
public gdp2Countrys;
public gdp2Datasets;
public gdp2ChartOptions;
public gdp2BgColors = [];
public gdp2ActiveCountry;


public exchangeType;
public exchangeLabels;
public exchangeDatasets;
public exchangeChartOptions;
public exchangeBgColors = []
public exchangeRatesCountryCodes = []
public activeCountryCode = 'KES';
public activeMonth = this.currentMonth;
public activeYear = this.currentYear;




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
          this.ExchangeRates = dataExch.reverse();
          this.ExchangeRates[0].countryRate.forEach((ctr) => { this.exchangeRatesCountryCodes.push(ctr.code) });
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


    this.AllCountryCode.forEach((country, ind, arr) => {

      this.YearRange.forEach((yearItem) => {
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
  
      })

      if(ind === arr.length - 1) {

        setTimeout(() => {
          this.MyFormatedGDP = this.FormatedGDP.filter((gdp) => gdp.year === this.currentYearActive).map((e) => e);
          this.MyFormatedGDP2 = this.FormatedGDP.filter((gdp) => gdp.code === 'KEN').map((e) => e);
          this.gdp2ActiveCountry = 'KEN'
          this.gdpRatesGraph();
          this.gdp2RatesGraph();         
        }, 1000);


      }

    })
  }

















  switchYear(y) {
    this.currentYearActive = y;
    this.MyFormatedGDP = this.FormatedGDP.filter((gdp) => gdp.year === this.currentYearActive).map((e) => e);
    this.gdpRatesGraph();
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
    this.gdpChartOptions.scales.yAxes[0].display = false;
    this.gdpDatasets[0].backgroundColor = 'whitesmoke'; 
    this.gdpDatasets[0].borderColor = 'gray';
    this.gdpDatasets[0].pointBorderColor = 'black';
    this.gdpChartOptions.plugins.datalabels.anchor = 'start';
    this.gdpChartOptions.plugins.datalabels.align = 'start';
  }
  gdpGraphToBar() {
    this.gdpType = 'bar';
    this.gdpChartOptions.legend.display = false;
    this.gdpChartOptions.scales.xAxes[0].display = true;
    this.gdpChartOptions.scales.yAxes[0].display = false;
    this.gdpDatasets[0].backgroundColor = ['#02b0cc','#074BFB', '#ffc107', '#f86c6b'];
    this.gdpDatasets[0].borderColor = 'transparent';
    this.gdpDatasets[0].pointBorderColor = 'white';
    this.gdpChartOptions.plugins.datalabels.anchor = 'center';
    this.gdpChartOptions.plugins.datalabels.align = 'center';
  }
  gdpGraphToPie() {
    this.gdpType = 'pie';
    this.gdpChartOptions.legend.display = true;
    this.gdpChartOptions.scales.xAxes[0].display = false;
    this.gdpChartOptions.scales.yAxes[0].display = false;
    this.gdpDatasets[0].backgroundColor = ['#02b0cc','#074BFB', '#ffc107', '#f86c6b'];
    this.gdpDatasets[0].borderColor = 'white';
    this.gdpDatasets[0].pointBorderColor = 'white';
    this.gdpChartOptions.plugins.datalabels.anchor = 'center';
    this.gdpChartOptions.plugins.datalabels.align = 'center';

  }
  


  switchGDPCountry(countryCode) {
    this.gdpDatasets[0].label = countryCode;
    let gdpData = this.MyFormatedGDP.filter((c) => c.code === countryCode).map(e => e);
    this.gdpDatasets[0].data = [gdpData[0].firstQ, gdpData[0].secondQ, gdpData[0].thirdQ, gdpData[0].fourthQ];
  }



  gdpRatesGraph() {
    this.gdpProgress = 100;
    this.gdpType = 'line';


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
        backgroundColor: 'whitesmoke',
        borderColor: 'gray',
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
          clamp: true,
          anchor: 'start',
          align: 'start',
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



    if( 1 > gdpData[0].firstQ || 1 > gdpData[0].secondQ || 1 > gdpData[0].thirdQ && 1 > gdpData[0].fourthQ) {
      this.gdpGraphToPie();
    }
  

  }








  switchGDP2Country(countryCode) {
    this.MyFormatedGDP2 = this.FormatedGDP.filter((gdp) => gdp.code === countryCode).map((e) => e);
    this.gdp2RatesGraph()
    this.gdp2ActiveCountry = countryCode;
  }



  gdp2RatesGraph() {
    this.gdpProgress = 100;
    this.gdp2Type = 'bar';

    let year3 = this.MyFormatedGDP2.filter((gd) => gd.year === this.YearRange[3]).map(e => e);
    let year2 = this.MyFormatedGDP2.filter((gd) => gd.year === this.YearRange[2]).map(e => e);
    let year1 = this.MyFormatedGDP2.filter((gd) => gd.year === this.YearRange[1]).map(e => e);
    let year0 = this.MyFormatedGDP2.filter((gd) => gd.year === this.YearRange[0]).map(e => e);


    this.gdp2Labels =  ['First Quarter', 'Second Quarter', 'Third Quarter', 'Fourth Quarter'];

    this.gdp2Datasets = [
      {
        label: `${this.YearRange[3]}`,
        data: [year3[0].firstQ, year3[0].secondQ, year3[0].thirdQ, year3[0].fourthQ],
        backgroundColor: ['#f86c6b', '#f86c6b', '#f86c6b', '#f86c6b', '#f86c6b'],
        borderColor: 'transparent',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      },
      {
        label: `${this.YearRange[2]}`,
        data: [year2[0].firstQ, year2[0].secondQ, year2[0].thirdQ, year2[0].fourthQ],
        backgroundColor: ['#ffc107', '#ffc107', '#ffc107', '#ffc107', '#ffc107'],
        borderColor: 'transparent',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      },
      {
        label: `${this.YearRange[1]}`,
        data: [year1[0].firstQ, year1[0].secondQ, year1[0].thirdQ, year1[0].fourthQ],
        backgroundColor: ['#074BFB', '#074BFB', '#074BFB', '#074BFB', '#074BFB'],
        borderColor: 'transparent',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      },
      {
        label: `${this.YearRange[0]}`,
        data: [year0[0].firstQ, year0[0].secondQ, year0[0].thirdQ, year0[0].fourthQ],
        backgroundColor: ['#02b0cc', '#02b0cc', '#02b0cc', '#02b0cc', '#02b0cc'],
        borderColor: 'transparent',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'black',
        pointHoverBorderColor: 'gray'
      }
    ];
  
  
    this.gdp2ChartOptions = {
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
          clamp: true,
          anchor: 'end',
          align: 'end',
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








































  swithToPrevMonth() {
    if( this.activeMonth === 0) {
      this.activeMonth = 11;
      this.activeYear = Number(this.activeYear) - 1;
    } else {
      this.activeMonth = Number(this.activeMonth) - 1
    }
   
    this.ExchangeRatesGraph();
  }

  swithToNextMonth() {
    if( this.activeMonth === 11) {
      this.activeMonth = 0;
      this.activeYear = Number(this.activeYear) + 1;
    } else {
      this.activeMonth = Number(this.activeMonth) + 1
    }
    this.ExchangeRatesGraph();
  }

  switchExchangeRateCountry(code) {
    this.activeCountryCode = code;
    this.ExchangeRatesGraph();
  }
  



  async ExchangeRatesGraph() {

    this.exchangeProgress = 100;
    this.exchangeType = 'line';




    this.exchangeLabels = []
    const exchangeDatasetsArr = []

    let minNumber = 1;
    let maxNum = 31; 
    this.ExchangeRates.forEach((exch) => {
      let myDate = new Date(exch.dateUpdated)
      let date = myDate.getDate();
      let month = myDate.getMonth();
      let year = myDate.getFullYear();
      if (year === this.activeYear && month === this.activeMonth) {

        let dateLabel = `${this.daysArray[date]}`;
        this.exchangeLabels.unshift(dateLabel)
        minNumber ++

         for( let ctr of exch.countryRate ) {
           if (ctr.code === this.activeCountryCode){
            exchangeDatasetsArr.unshift(ctr.value)
            break;
           }
         }
      }
    })

    this.exchangeBgColors = [];
    this.exchangeLabels.forEach((e) => {
      this.exchangeBgColors.push(this.getRandomColor());
    });
    this.exchangeDatasets = [
      {
        data: exchangeDatasetsArr,
        backgroundColor: 'rgba(2, 176, 204, .5)',
        borderColor: 'rgb(2, 176, 204)',
        borderWidth: 1.5,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: 'rgba(2, 176, 204, .8)',
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
                beginAtZero: false
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
          clamp: true,
          anchor: 'end',
          align: 'end',
          color: 'black',
          formatter: function(value, context) {
            return value.toFixed(1);
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













}
