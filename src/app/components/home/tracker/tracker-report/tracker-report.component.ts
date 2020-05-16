import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { faArrowLeft, faPlus, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TrackerComponent } from '../tracker.component';
import { ModalDirective } from 'ngx-bootstrap';
import { TaskPlanService } from 'src/app/shared/services/taskPlan.service';
import { ActivityPlanService } from 'src/app/shared/services/activityPlan.service';

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
      private trackerComponent: TrackerComponent,
      private taskPlanService: TaskPlanService,
      private activityPlanService: ActivityPlanService
    ) {  }

@ViewChild('reportModel', {static: true}) reportModel: ModalDirective;

public ImprintLoader = false;

public PlanOnReport: any;
public ActivePlanEdit: any;

public ActiveModel = 'edit';

// icons
public faArrowLeft = faArrowLeft;
public faPlus = faPlus;
public faTrash = faTrash;
public faTimes = faTimes;

public reportValueInput = null;
public reportEventInput = false;
public reportInputIsBoolean = false;
public TaskOnEdit: any;
public ReportOnEdit: any;

public ActivityPlan = [];
public TaskPlan = [];



















    ngOnInit() {
      this.PlanOnReport = JSON.parse(localStorage.getItem('planOnReport'));
     
      this.updatePage().then(() => {
        this.formatTask().then(() => {
          this.formatPlan().then(() => {   this.ActivePlanEdit = this.PlanOnReport.plan[0]; });
        })
      })
    }









updatePage() {
  return new Promise((resolve, reject) => {
        this.activityPlanService.getAllActivityPlanByInstitutionId().subscribe(
          dataActivity => {
            this.ActivityPlan = dataActivity;
            
            this.taskPlanService.getAllTaskPlan().subscribe(
              dataTask => {
                this.TaskPlan = dataTask;

                this.formatAtivity().then(() => resolve())
              }, error => console.log('Error getting task plan')
            )

          }, error => console.log('Error getting activity plan')
        )
  })
}





formatAtivity () {
  return new Promise((resolve, reject) => {
  this.TaskPlan.forEach((task, ind, arr) => {
    let getActivity = this.ActivityPlan.filter((a) => a._id === task.activityId).map((e) => e);
    task.activityName = getActivity[0].activityPlan;
    if (ind === arr.length - 1){ resolve() }
  })
  if(this.TaskPlan.length === 0) { resolve() }
})
}




formatTask() {
  return new Promise((resolve, reject) => {
  this.PlanOnReport.plan.forEach((planElement: any, index, array) => {
    planElement.tasksArray = [];
    planElement.tasks.forEach((taskId) => {
      let myTaskPlan = this.TaskPlan.filter((t) => t._id === taskId).map((e) => e);
      planElement.tasksArray.push(myTaskPlan[0]);
    })

    if( index === array.length - 1) {
      resolve()
    }
  })
});
}
    







formatPlan() {
  return new Promise((resolve, reject) => {
    this.PlanOnReport.plan = this.PlanOnReport.plan.filter((plan) => {
      plan.tasksArray = plan.tasksArray.filter((task) => task.reportingUser === localStorage.getItem('loggedUserEmail')).map(e => e);
      return true;
    } ).map(e => e);

  this.PlanOnReport.plan.forEach((planElement, ind, arr) => {

    planElement.tasksArray.forEach(taskElement => {
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
      if (timeTo > 0 ) {
        taskElement.timeline = 'due';
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

        // if the numver of week does not exceed a month
        if (week < 5) {
          if (taskElement.reports.length === week - 1 ) {
              taskElement.reportingStatus = 'pending';
          }
          if (taskElement.reports.length === week) {
            taskElement.reportingStatus = 'done';
          }
        }

        // if there is report skipped
        if (taskElement.reports.length < 4) {
          if ((week - taskElement.reports.length ) > 1 ) {
            let reportObj = {
              value: taskElement.kpi === null ? false : 0,
              reportingDate: new Date()
            }
            taskElement.reports.push(reportObj);
            this.plansService.updatePlan(this.PlanOnReport._id, this.PlanOnReport).subscribe(
              data => {
                this.PlanOnReport = data;
                this.formatPlan();
              },
              error => { console.log('Error updating skipped weeek') }
            )
          }
        }
      }

    });
    if (ind === arr.length - 1){ 
      resolve();
    }   
  });
  
});
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




actionClicked(item: any) {
  // create new report 
  if(item.reportingStatus === 'pending' && item.timeline === 'active') {
    if (item.kpi === null) {
      this.reportEventInput = false;
      this.reportValueInput = null;
      this.reportInputIsBoolean = true;
    } else {
      this.reportEventInput = false;
      this.reportValueInput = null;
      this.reportInputIsBoolean = false;
    }
    this.TaskOnEdit = item._id;
    this.ReportOnEdit = '';
    this.reportModel.show();
  }

  // update existing report 
  if(item.reportingStatus === 'done' && item.timeline === 'active') {
    let reverseReport = item.reports.reverse();
    this.ReportOnEdit = reverseReport[0]._id;
    if (item.kpi === null) {
      this.reportEventInput = reverseReport[0].value;
      this.reportValueInput = null;
      this.reportInputIsBoolean = true;
    } else {
      this.reportValueInput = reverseReport[0].value;
      this.reportEventInput = false;
      this.reportInputIsBoolean = false;
    }

    this.TaskOnEdit = item._id;
    this.reportModel.show();
  }

  // awaiting Task 
  if(item.timeline === 'awaiting') {
    this.notifyService.showInfo('Please wait till start date', 'Future task');
  }

  // due Task 
  if(item.timeline === 'due') {
    this.notifyService.showInfo('You cannot report on the task', 'Due Date Passed');
  }


}







saveReport() {

  if(!this.reportInputIsBoolean && this.reportValueInput === null) {
    this.notifyService.showWarning('Please input a value', 'Empty Input')
    return;
  }

  this.ImprintLoader = true;
  this.reportModel.hide();
  if (this.ReportOnEdit){
 
    for(let taskElm of this.ActivePlanEdit.tasks ) {
      if (this.TaskOnEdit === taskElm._id) {
        for(let taskReport of taskElm.reports) {
          if (taskReport._id === this.ReportOnEdit ) {
            taskReport.value = this.reportInputIsBoolean ? this.reportEventInput : this.reportValueInput;
            this.saveThePlan()
            break;
          }
        }
        break;
      }
    }
   
  } else {
    
    for(let taskElm of this.ActivePlanEdit.tasks ) {
      if (this.TaskOnEdit === taskElm._id) {
  
        let reportObj = {
          value: this.reportInputIsBoolean ? this.reportEventInput : this.reportValueInput,
          reportingDate: new Date()
        }
        taskElm.reports.push(reportObj);
        this.saveThePlan();
        break;
      }
    }
  }
}















saveThePlan() {
  for(let Plan of this.PlanOnReport.plan) {
    if (Plan._id === this.ActivePlanEdit._id){

      Plan = this.ActivePlanEdit
      this.plansService.updatePlan(this.PlanOnReport._id, this.PlanOnReport).subscribe(
        data => {
          this.PlanOnReport = data;

          for(let planData of this.PlanOnReport.plan) {
            if (planData._id === this.ActivePlanEdit._id){
              this.ActivePlanEdit = planData;
              break;
            }
          }

          this.ImprintLoader = false;
          this.formatPlan();
          this.notifyService.showSuccess('Report update', 'Success')
        },
        error => { this.ImprintLoader = false; this.notifyService.showError('Could not update report', 'Error') }
      )
      break;
    }
  }
}
















ngOnDestroy() {
  localStorage.removeItem('planOnReport')
}




} // End of main class
