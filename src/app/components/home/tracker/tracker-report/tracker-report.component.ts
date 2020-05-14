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
      this.PlanOnReport.plan = this.PlanOnReport.plan.filter((plan) => {
        plan.tasks = plan.tasks.filter((task) => task.reportingUser === localStorage.getItem('loggedUserEmail')).map(e => e);
        return true;
      } ).map(e => e);
      this.formartTasks().then(() => {  this.getUnEdittedThreatPlan(); });
    }




formartTasks() {
  return new Promise((resolve, reject) => {
  this.PlanOnReport.plan.forEach((planElement, ind, arr) => {

    planElement.tasks.forEach(taskElement => {
      let start: any = new Date(taskElement.startDate);
      let end: any = new Date(taskElement.endDate);
      let today: any = new Date();
      let timeTo = today - end
      let timeFrom = today - start
      if (timeFrom < 0) {
        taskElement.timeline = 'awaiting';
      }
      if (timeFrom > 0 && timeTo < 0 ) {
        taskElement.timeline = 'active';
      }
      if (timeTo > 0 && !taskElement.recurring ) {
        taskElement.timeline = 'due';
      }
      if (timeTo > 0 && taskElement.recurring ) {
        taskElement.timeline = 'active';
      }
      if (!taskElement.recurring && taskElement.reports.length === 0){
        taskElement.reportingStatus = 'pending';
      }
      if (!taskElement.recurring && taskElement.reports.length !== 0){
        taskElement.reportingStatus = 'done';
      }
      if (taskElement.recurring){
        let diff = today - start;
        let days = Math.ceil(diff / (1000*60*60*24));
        let week = Math.ceil(days / 7)
        
        if (taskElement.reports.length === week - 1) {
            taskElement.reportingStatus = 'pending';
        }
        if (taskElement.reports.length === week) {
          taskElement.reportingStatus = 'done';
        }
        if ((week - taskElement.reports.length ) > 1 ) {
          this.addEmptyReport();
        }
      }

    });
    if (ind === arr.length - 1){ 
      resolve();
    }   
  });
  
});
}




addEmptyReport() {

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
