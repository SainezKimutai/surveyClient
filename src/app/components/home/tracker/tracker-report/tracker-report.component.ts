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

      if (!taskElement.recurring){
        let doneSecond = today - start;
        let days = Math.ceil(doneSecond / (1000*60*60*24));
        let totalSeconds = end - start;
        let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
        let week = Math.ceil(days / 7)
        let totalWeeks = Math.ceil(totalDays / 7) 

        // if the number of week does not exceed a month
        if (week < totalWeeks || week === totalWeeks) {
          if (taskElement.reports.length === week - 1 ) {
              taskElement.reportingStatus = 'pending';
          }
          if (taskElement.reports.length === week) {
            taskElement.reportingStatus = 'done';
          }
        }

        // if there is report skipped
        if (taskElement.reports.length < totalWeeks) {
          if ((week - taskElement.reports.length ) > 1 ) {
            let reportObj = {
              value: taskElement.kpi === null ? false : 0,
              reportingDate: new Date()
            }
            taskElement.reports.push(reportObj);
            this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
              data => {
                this.updatePage().then(() => {
                  this.formatTask().then(() => {
                    this.formatPlan().then(() => {   this.ActivePlanEdit = this.PlanOnReport.plan[0]; });
                  })
                })
              },
              error => { console.log('Error updating skipped week') }
            )
          }
        }
      }
      if (taskElement.recurring){

        if (taskElement.frequency === 'weekly') {
          let doneSecond = today - start;
          let days = Math.ceil(doneSecond / (1000*60*60*24));
          let totalSeconds = end - start;
          let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
          let week = Math.ceil(days / 7)
          let totalWeeks = Math.ceil(totalDays / 7) 

                 // if the number of week does not exceed end date
            if (week < totalWeeks || week === totalWeeks) {
              if (taskElement.reports.length === week - 1 ) {
                  taskElement.reportingStatus = 'pending';
              }
              if (taskElement.reports.length === week) {
                taskElement.reportingStatus = 'done';
              }
            }

            // if there is report skipped
            if (taskElement.reports.length < totalWeeks) {
              if ((week - taskElement.reports.length ) > 1 ) {
                let reportObj = {
                  value: taskElement.kpi === null ? false : 0,
                  reportingDate: new Date()
                }
                taskElement.reports.push(reportObj);
                this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
                  data => {
                    this.updatePage().then(() => {
                      this.formatTask().then(() => {
                        this.formatPlan().then(() => {   this.ActivePlanEdit = this.PlanOnReport.plan[0]; });
                      })
                    })
                  },
                  error => { console.log('Error updating skipped week') }
                )
              }
            }


        }
        if (taskElement.frequency === 'monthly') {
          let doneSecond = today - start;
          let days = Math.ceil(doneSecond / (1000*60*60*24));
          let totalSeconds = end - start;
          let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
          let month = Math.ceil(days / 30)
          let totalMonths = Math.ceil(totalDays / 30) 

                 // if the number of months does not exceed end date
            if (month < totalMonths || month === totalMonths) {
              if (taskElement.reports.length === month - 1 ) {
                  taskElement.reportingStatus = 'pending';
              }
              if (taskElement.reports.length === month) {
                taskElement.reportingStatus = 'done';
              }
            }

            // if there is report skipped
            if (taskElement.reports.length < totalMonths) {
              if ((month - taskElement.reports.length ) > 1 ) {
                let reportObj = {
                  value: taskElement.kpi === null ? false : 0,
                  reportingDate: new Date()
                }
                taskElement.reports.push(reportObj);
                this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
                  data => {
                    this.updatePage().then(() => {
                      this.formatTask().then(() => {
                        this.formatPlan().then(() => {   this.ActivePlanEdit = this.PlanOnReport.plan[0]; });
                      })
                    })
                  },
                  error => { console.log('Error updating skipped week') }
                )
              }
            }

        }
        if (taskElement.frequency === 'quarterly') {
          let doneSecond = today - start;
          let days = Math.ceil(doneSecond / (1000*60*60*24));
          let totalSeconds = end - start;
          let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
          let quarter = Math.ceil(days / 90)
          let totalQuarter = Math.ceil(totalDays / 90) 

                 // if the number of months does not exceed end date
            if (quarter < totalQuarter || quarter === totalQuarter) {
              if (taskElement.reports.length === quarter - 1 ) {
                  taskElement.reportingStatus = 'pending';
              }
              if (taskElement.reports.length === quarter) {
                taskElement.reportingStatus = 'done';
              }
            }

            // if there is report skipped
            if (taskElement.reports.length < totalQuarter) {
              if ((quarter - taskElement.reports.length ) > 1 ) {
                let reportObj = {
                  value: taskElement.kpi === null ? false : 0,
                  reportingDate: new Date()
                }
                taskElement.reports.push(reportObj);
                this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
                  data => {
                    this.updatePage().then(() => {
                      this.formatTask().then(() => {
                        this.formatPlan().then(() => {   this.ActivePlanEdit = this.PlanOnReport.plan[0]; });
                      })
                    })
                  },
                  error => { console.log('Error updating skipped week') }
                )
              }
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
    this.TaskOnEdit = item;
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

    this.TaskOnEdit = item;
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
 
    for(let taskReport of this.TaskOnEdit.reports) {
      if (taskReport._id === this.ReportOnEdit ) {
        taskReport.value = this.reportInputIsBoolean ? this.reportEventInput : this.reportValueInput;
        this.saveTaskPlan();
        break;
      }
    }
   
  } else {
    

        let reportObj = {
          value: this.reportInputIsBoolean ? this.reportEventInput : this.reportValueInput,
          reportingDate: new Date()
        }
        this.TaskOnEdit.reports.push(reportObj)
        this.saveTaskPlan();
  }
}







saveTaskPlan() {
  this.taskPlanService.updateTaskPlan(this.TaskOnEdit._id, this.TaskOnEdit).subscribe(
    data => {
      this.updatePage().then(() => {
        this.formatTask().then(() => {
          this.formatPlan().then(() => {  
             for(let trtPlan of this.PlanOnReport.plan) {
              if (trtPlan._id === this.ActivePlanEdit._id) {
               this.ActivePlanEdit = trtPlan; 
               this.reportModel.hide();
               this.reportEventInput = false;
                this.reportValueInput = null
                this.ImprintLoader = false;
               break;
              }
            }  
          });
        })
      })
    },
    error => { console.log('Error updating skipped week') }
  )
}






















ngOnDestroy() {
  localStorage.removeItem('planOnReport')
}




} // End of main class
