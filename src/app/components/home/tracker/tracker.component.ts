import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { faListAlt, faCheck, faSpinner, faBusinessTime } from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.sass']
})
export class TrackerComponent implements OnInit {
 // tslint:disable

    constructor(
      private notifyService: NotificationService,
      private plansService: PlansService,
      private userService: UserService
    ) {  }


  public ImprintLoader = false;
  public pageProgress = 0

  public PlanStatus = true;
  public ReportStatus = false;

  public faCheck = faCheck;
  public faListAlt = faListAlt;
  public faSpinner = faSpinner;
  public faBusinessTime = faBusinessTime;
  
  public AllPlans = [];







    ngOnInit() {
      localStorage.setItem('ActiveNav', 'tracker');
      this.updatePage()
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



  editReport(plan: any) {
    localStorage.setItem('planOnReport', JSON.stringify(plan))
    this.PlanStatus = false;
    this.ReportStatus = true;
  }
  
  
  toListsPage() {
    this.PlanStatus = true;
    this.ReportStatus = false;
    this.updatePage().then(() => {});
  }
  



} // End of main class
