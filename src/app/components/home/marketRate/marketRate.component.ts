import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';

import { ExchangerateService } from 'src/app/shared/services/exchangeRates.service';
import { GDPGrowthRateService } from 'src/app/shared/services/gdpGrowthRate.service';
import { InterestRateService } from 'src/app/shared/services/interetRates.service';
import { ModalDirective } from 'ngx-bootstrap';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-market-rate',
  templateUrl: './marketRate.component.html',
  styleUrls: ['./marketRate.component.sass']
})
export class MarketRateComponent implements OnInit {
 // tslint:disable
// tslint:disable: prefer-const

  constructor(
    private notifyService: NotificationService,
    private exchangerateService: ExchangerateService,
    private gdpGrowthRateService: GDPGrowthRateService,
    private interetRateService: InterestRateService
  ) { }


  public ImprintLoader = false;

  @ViewChild('addGDPModal', {static: true}) addGDPModal: ModalDirective;


  public currentDay = new Date();
  public currentYear = this.currentDay.getFullYear();


  // incase of need for gdp for previous years
  public YearRange = [this.currentYear, (this.currentYear - 1),(this.currentYear - 2),(this.currentYear - 3)];
  // public YearRange = [this.currentYear];

  public ExchangeRates = [];
  public GDPGrowthRates = [];
  public InterestRates = [];

  public faPlus = faPlus;
  public faTrash = faTrash;

  public gdpForm;
  public countryRateObj;

  public currentYearActive = this.currentYear;
  public FormatedGDP = [];
  public MyFormatedGDP = [];
  public AllCountryCode = [];
  public interestInput;









  ngOnInit() {

    sessionStorage.setItem('ActiveNav', 'marketRates');

    this.gdpForm = {
      dateUpdated: Date,
      meta:{quarter: null, year: null},
      countryRate: []
    }

    this.countryRateObj = { code: '', value: null   }

    this.interestInput = '';


    this.updatePage().then(() => {
      // this.fetchExchangeRate();
    })


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
          this.ExchangeRates = dataExch.reverse();
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
    this.MyFormatedGDP = [];


    this.AllCountryCode.forEach((country) => {

      this.YearRange.forEach((yearItem, ind, arr) => {
        let myData = {
          year: yearItem,
          code: country,
          firstQ: {id: '', value: null},
          secondQ: {id: '', value: null},
          thirdQ: {id: '', value: null},
          fourthQ: {id: '', value: null},
        }
        this.GDPGrowthRates.forEach((gdpElement) => {
          if(yearItem === gdpElement.meta.year ) {
       
            if( gdpElement.meta.quarter === 1){
             
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.firstQ.id = contryItem._id;
                  myData.firstQ.value = contryItem.value;
                 
                }
              });
  
            }
  
            if( gdpElement.meta.quarter === 2){
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.secondQ.id = contryItem._id;
                  myData.secondQ.value = contryItem.value;
                }
              });
  
            }
  
            if( gdpElement.meta.quarter === 3){
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.thirdQ.id = contryItem._id;
                  myData.thirdQ.value = contryItem.value;
                }
              });            
            }
  
            if( gdpElement.meta.quarter === 4){
              gdpElement.countryRate.forEach((contryItem) => {
                
                if (contryItem.code === country){
                  myData.fourthQ.id = contryItem._id;
                  myData.fourthQ.value = contryItem.value;
                }
              });          
            }
  
  
  
          }
        })
  

        this.FormatedGDP.push(myData);
        this.MyFormatedGDP = this.FormatedGDP.filter((gdp) => gdp.year === this.currentYearActive).map((e) => e);
  
      })

    })
  }
















  // fetchExchangeRate() {

  //   // let myDate = '2020-04-23'

  //   // this.exchangerateService.fetchPastExchangeRates(myDate).subscribe(
  //   //   data => {
  //   //     let myDataToSent = {
  //   //       dateUpdated: new Date(myDate),
  //   //       baseCurrency: data.base,
  //   //       countryRate: []
  //   //     }

  //   //     let convertToArr =  Object.entries(data.rates)
  //   //     convertToArr.forEach((rateItem, ind, arr) => {
  //   //       myDataToSent.countryRate.push(
  //   //         { code: rateItem[0], 
  //   //           value: rateItem[1]   
  //   //         } 
  //   //       )


  //   //       if(ind === arr.length - 1){
  //   //         this.updateExchangeRate(myDataToSent)
  //   //       }
    
  //   //     })
        
  //   //   },
  //   //   error => console.log('Error getting exchange Rates')
  //   // )


  //  this.exchangerateService.fetchExchangeRates().subscribe(
  //     data => {
  //       let myDataToSent = {
  //         dateUpdated: new Date(),
  //         baseCurrency: data.base,
  //         countryRate: []
  //       }

  //       let convertToArr =  Object.entries(data.rates)
  //       convertToArr.forEach((rateItem, ind, arr) => {
  //         myDataToSent.countryRate.push(
  //           { code: rateItem[0], 
  //             value: rateItem[1]   
  //           } 
  //         )


  //         if(ind === arr.length - 1){
  //           this.updateExchangeRate(myDataToSent)
  //         }
    
  //       })
        
  //     },
  //     error => console.log('Error getting exchange Rates')
  //   )

  // }



  // updateExchangeRate(data) {
  //   this.exchangerateService.createExchangerate(data).subscribe(
  //     data => {
  //       console.log(data.dateUpdated)
  //       this.notifyService.showSuccess('Create', 'Sucess')
  //     },
  //     error => this.notifyService.showError('Not created', 'Failed')
  //   )
  // }



  switchYear(y) {
    this.currentYearActive = y;
    this.MyFormatedGDP = this.FormatedGDP.filter((gdp) => gdp.year === this.currentYearActive).map((e) => e);
  }



  removeCountry(x) {
    this.gdpForm.countryRate.splice(x, 1);
  }

  pushGDP() {
    this.gdpForm.countryRate.push(this.countryRateObj);
    this.countryRateObj = { code: '', value: null };
  }






  addGDP() {
    this.addGDPModal.hide();
    this.ImprintLoader = true;
    this.gdpGrowthRateService.createGDP(this.gdpForm).subscribe(
      data => {
        this.updatePage().then(()=> {
          this.gdpForm = {
            dateUpdated: Date,
            meta:{quarter: null, year: null},
            countryRate: []
          }
          this.ImprintLoader = false;
          this.notifyService.showSuccess('GDP Addedd', 'Success')
        });

      },
      error => {  this.ImprintLoader = false; this.notifyService.showError('Could Not add GDP', 'Failed');}
    )
  }




  async romoveGDPRatio(id) {
    this.ImprintLoader = true;

    for(let gdp of this.GDPGrowthRates) {
   
      let idPresent = gdp.countryRate.map((e) =>  e._id ).indexOf(id);

      if (idPresent !== -1){
        
        gdp.countryRate = gdp.countryRate.filter((e)=> e._id !== id).map(e => e);

        if(gdp.countryRate.length === 0){
          this.gdpGrowthRateService.deleteGDP(gdp._id).subscribe(
            data => {
              this.updatePage().then(() => {
                this.ImprintLoader = false;
                this.notifyService.showSuccess('GDP rate deleted', 'Success');
              })
            },
            error => {this.ImprintLoader = false; this.notifyService.showError('Could not delete gdp rate', 'Failed')}        
          )
        } else {
        this.gdpGrowthRateService.updateGDP(gdp._id, gdp).subscribe(
          data => {
    
            this.updatePage().then(() => {
              this.ImprintLoader = false;
              this.notifyService.showSuccess('GDP rate deleted', 'Success');
            })
          },
          error => {this.ImprintLoader = false; this.notifyService.showError('Could not delete gdp rate', 'Failed')}
        )
        }


        break;
      }
    } 
  }




  createInterestRate(){
    let data = {
      dateUpdated: new Date(),
      rate: this.interestInput
    }
    this.interetRateService.createInterestRate(data).subscribe(
      data => {
        this.updatePage();
        this.interestInput = '';
        this.notifyService.showSuccess('Created', 'Success')
      },
      error => this.notifyService.showError('Could Not Update', 'Failed')
    )
  }






  deteInterest(id){
    this.interetRateService.deleteInterestRate(id).subscribe(
      data => {
        this.updatePage();
        this.notifyService.showSuccess('Interest Deleted', 'Success')
      },
      error => this.notifyService.showError('could not delete', 'Failed')
    )
  }







}