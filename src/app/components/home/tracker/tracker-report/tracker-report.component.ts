import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { faArrowLeft, faPlus, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TrackerComponent } from '../tracker.component';

@Component({
  selector: 'app-tracker-report',
  templateUrl: './tracker-report.component.html',
  styleUrls: ['./tracker-report.component.sass']
})
export class TrackerReportComponent implements OnInit, OnDestroy {
 // tslint:disable

    constructor(
      private notifyService: NotificationService,
      private plansService: PlansService,
      private userService: UserService,
      private trackerComponent: TrackerComponent
    ) {  }



public PlanOnReport: any;
public ActivePlanEdit: any;

public ActiveModel = 'edit';

// icons
public faArrowLeft = faArrowLeft;
public faPlus = faPlus;
public faTrash = faTrash;
public faTimes = faTimes;




    ngOnInit() {
      this.PlanOnReport = JSON.parse(localStorage.getItem('planOnReport'));
      this.getUnEdittedThreatPlan();
    }






getUnEdittedThreatPlan() {
  let iterations = this.PlanOnReport.plan.length;
  for(let trtPlan of this.PlanOnReport.plan) {
    iterations--
    if (trtPlan.tasks.length === 0) {
      this.ActivePlanEdit = trtPlan; 
      break;
    }
    if (iterations === 0) {
      this.ActivePlanEdit = trtPlan; 
    }
  }

}


switchPlanActionable(threatPlanId: any) {
  for(let trtPlan of this.PlanOnReport.plan) {
    if (trtPlan._id === threatPlanId) {
     this.ActivePlanEdit = trtPlan; 
     break;
    }
  }
}


back() {
  this.trackerComponent.toListsPage();
}



ngOnDestroy() {
  localStorage.removeItem('planOnReport')
}




} // End of main class
