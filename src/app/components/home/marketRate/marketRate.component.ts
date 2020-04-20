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

  @ViewChild('addGDPModal', {static: true}) addGDPModal: ModalDirective;


  public currentDay = new Date();
  public currentYear = this.currentDay.getFullYear();


  public YearRange = [this.currentYear, (this.currentYear - 1),(this.currentYear - 2),];

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

    localStorage.setItem('ActiveNav', 'marketRates');

    this.gdpForm = {
      dateUpdated: Date,
      meta:{quarter: null, year: null},
      countryRate: []
    }

    this.countryRateObj = { code: '', value: null   }

    this.interestInput = '';


    this.updatePage().then(() => {
      this.checkExchangeRate();
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
          this.ExchangeRates = dataExch;

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
  
      })

    })
  }





  checkExchangeRate() {
    if(this.ExchangeRates.length === 0) {
      this.fetchExchangeRate();
    }
    else {
      let today = new Date();
      let HasBeenUpdated = (today.toDateString() === new Date(this.ExchangeRates[0].dateUpdated).toDateString());

      if(!HasBeenUpdated){
        this.fetchExchangeRate()
      }
      
    }
  }










  fetchExchangeRate() {


    this.exchangerateService.fetchExchangeRates().subscribe(
      data => {
        let myDataToSent = {
          dateUpdated: new Date,
          baseCurrency: data.base,
          countryRate: []
        }

        let convertToArr =  Object.entries(data.rates)
        convertToArr.forEach((rateItem, ind, arr) => {
          myDataToSent.countryRate.push(
            { code: rateItem[0], 
              value: rateItem[1]   
            } 
          )


          if(ind === arr.length - 1){
            this.updateExchangeRate(myDataToSent)
          }
    
        })
        
      },
      error => console.log('Error getting exchange Rates')
    )

  }



  updateExchangeRate(data) {

    if(this.ExchangeRates.length === 0) {
      // create new Exchange rates
      this.exchangerateService.createExchangerate(data).subscribe(
        data => {
          this.updatePage();
          this.notifyService.showSuccess('Create', 'New')
        },
        error => console.log('Error Creating Rates')
      )
    }

    if(this.ExchangeRates.length > 0) {
      // Update existing Exchange rates
      this.exchangerateService.updateExchangerate( this.ExchangeRates[0]._id, data).subscribe(
        data => {
          this.updatePage();
          this.notifyService.showInfo('Updated', 'Update')
        },
        error => console.log('Error updating Rates')
      )
    }
  }



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
    // console.log(this.GDPGrowthRates);
    this.gdpGrowthRateService.createGDP(this.gdpForm).subscribe(
      data => {
        this.updatePage();
        this.addGDPModal.hide();
        this.notifyService.showSuccess('GDP Addedd', 'Success')
      },
      error => this.notifyService.showError('Could Not add GDP', 'Failed')
    )
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