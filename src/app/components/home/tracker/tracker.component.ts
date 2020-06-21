import { Component, OnInit } from '@angular/core';
import { faListAlt, faCheck, faSpinner, faBusinessTime, faPowerOff, faSearch } from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.sass']
})
export class TrackerComponent implements OnInit {
 // tslint:disable

    constructor(
      private plansService: PlansService,
      private homeComponent: HomeComponent
    ) {  }


  public ImprintLoader = false;
  public pageProgress = 0

  public PlanStatus = true;
  public ReportStatus = false;

  public faCheck = faCheck;
  public faListAlt = faListAlt;
  public faSpinner = faSpinner;
  public faBusinessTime = faBusinessTime;
  public faPowerOff = faPowerOff;
  public faSearch = faSearch;
  
  public AllPlans = [];
  public ViewAllPlans = [];
  public FilterName = '';






    ngOnInit() {
      sessionStorage.setItem('ActiveNav', 'tracker');
      this.updatePage().then(() => this.ViewAllPlans = this.AllPlans)
      
    }



  updatePage() {
    this.pageProgress = 50
    return new Promise((resolve, reject) => {
      this.plansService.getAllCompanyPlans().subscribe(
        dataPlans => {
          this.AllPlans = dataPlans;
          this.AllPlans.forEach((pln) => { delete pln.__v});
          this.pageProgress = 100
          resolve();
        },
        error => console.log('Error')
      )
    })
  }





  filterPlans() {
    if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
      this.ViewAllPlans = this.AllPlans;
      } else {
        this.ViewAllPlans = this.AllPlans.filter(v => v.name.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
      }
  }
  


  editReport(plan: any) {
    sessionStorage.setItem('planOnReport', JSON.stringify(plan))
    this.PlanStatus = false;
    this.ReportStatus = true;
  }
  
  
  toListsPage() {
    this.PlanStatus = true;
    this.ReportStatus = false;
    this.updatePage().then(() => {this.ViewAllPlans = this.AllPlans});
  }

  
  
logOut() {
  this.homeComponent.logout();
}

  

} // End of main class
