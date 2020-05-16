import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { faArrowLeft, faPlus, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import { PlanComponent } from '../plan.component';
import { UserService } from 'src/app/shared/services/user.service';
import { TaskPlanService } from 'src/app/shared/services/taskPlan.service';
import { ActivityPlanService } from 'src/app/shared/services/activityPlan.service';


// tslint:disable

@Component({
  selector: 'app-plan-edit',
  templateUrl: './plan-edit.component.html',
  styleUrls: ['./plan-edit.component.sass']
})
export class PlanEditComponent implements OnInit, OnDestroy {


    constructor(
        private notifyService: NotificationService,
        private plansService: PlansService,
        private userService: UserService,
        private planComponent: PlanComponent,
        private taskPlanService: TaskPlanService,
        private activityPlanService: ActivityPlanService
      ) {  }




public ImprintLoader = false;
public ListStatus = false;
public TaskFormStatus = true;
public ActiveModel = 'edit';

public CompanyUsers = [];
public ActivityPlan = [];
public TaskPlan = [];

public faArrowLeft = faArrowLeft;
public faPlus = faPlus;
public faTrash = faTrash;
public faTimes = faTimes;

public PlanOnEdit: any;
public ActivePlanEdit: any;
    


public task: any;
public kpiCalendar = 'kpi';








ngOnInit() {
    this.PlanOnEdit = JSON.parse(localStorage.getItem('planOnEdit'))
    this.task = {
      activityId: '',
      priority: '',
      kpi: null,
      recurring: false,
      recurringWeekTarget: {
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0
      },
      forecast: null,
      startDate: '',
      frequency: 'monthly',
      endDate: '',
      approval: false,
      reportingUser: '',
      actionable: '',
      reports: []
    }

    this.updatePage().then(() => {
      this.formatTask().then(() => {
        this.formartReport().then(() => { this.getUnEdittedThreatPlan(); })
      })
    })
}   




updatePage() {

  return new Promise((resolve, reject) => {
    this.userService.getAllUsers().subscribe(
      data => {
        this.CompanyUsers = data.filter((user) => user.companyId === localStorage.getItem('loggedCompanyId')).map(e => e);

        this.activityPlanService.getAllActivityPlanByInstitutionId().subscribe(
          dataActivity => {
            this.ActivityPlan = dataActivity;
            
            this.taskPlanService.getAllTaskPlan().subscribe(
              dataTask => {
                this.TaskPlan = dataTask;
                // this.TaskPlan.forEach((r) => {
                //   this.taskPlanService.deleteTaskPlan(r._id).subscribe( () => this.notifyService.showSuccess('cleared', 'Cleared'))
                // })
                            
                this.formatAtivity().then(() => resolve())
              }, error => console.log('Error getting task plan')
            )

          }, error => console.log('Error getting activity plan')
        )

      },
      error => { console.log('Error In getting all Users'); }
    );
  })
}




switchModel(param: any) {
  this.ActiveModel = param;
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
  this.PlanOnEdit.plan.forEach((planElement: any, index, array) => {
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





formartReport() {
  return new Promise((resolve, reject) => {
    this.PlanOnEdit.plan.forEach((planElement, index, arr) => {
      planElement.tasksArray.forEach(taskElement => {
        if(taskElement.kpi === null) {
          if(taskElement.reports.length === 0) {
            taskElement.reportStatus = false;
          } else {
            let reverseReport = taskElement.reports.reverse();
            taskElement.reportStatus = reverseReport[0].value;
          }
        } else {

          if( taskElement.reports.length === 0) {
            taskElement.reportStatus = 0;
          } else {
            let totalSum: Number;
            if (taskElement.reports.length === 1) {
              totalSum = taskElement.reports[0].value;
            } else {
              totalSum = taskElement.reports.reduce((a, b) => Number(a.value) + Number(b.value), 0)
            }
            taskElement.reportStatus = totalSum;
          }
        }
      });

      if(index === arr.length - 1){resolve()}
    });
  })
}






getUnEdittedThreatPlan() {
  this.ActivePlanEdit = this.PlanOnEdit.plan[0];
}


switchPlanThreat(threatPlanId: any) {
  for(let trtPlan of this.PlanOnEdit.plan) {
    if (trtPlan._id === threatPlanId) {
     this.ActivePlanEdit = trtPlan; 
     break;
    }
  }
}


openAddTaskModal() {
  this.task.priority = this.ActivePlanEdit.threat.level.toLowerCase();
  this.ActiveModel = 'taskForm';
}


closeTaskForm() {
  this.ActiveModel = 'edit';
  this.task = {
    activityId: '',
    priority: '',
    kpi: null,
    recurring: false,
    recurringWeekTarget: {
      week1: 0,
      week2: 0,
      week3: 0,
      week4: 0
    },
    forecast: null,
    startDate: '',
    frequency: 'monthly',
    endDate: '',
    approval: false,
    actionable: '',
    reportingUser: '',
    reports: []
  }
}


getWeekelyTargets() {
  if (this.task.kpi > 3) {
    this.task.recurringWeekTarget.week1 = this.task.kpi / 4
    this.task.recurringWeekTarget.week2 = this.task.kpi / 4
    this.task.recurringWeekTarget.week3 = this.task.kpi / 4
    this.task.recurringWeekTarget.week4 = this.task.kpi / 4
  }
}


checkRecurring() {
  if (this.task.recurring) {
    this.task.frequency = 'monthly';
  }
}

calculateEndDate() {
  if (this.task.frequency === 'weekly'){
    let d = new Date(this.task.startDate);
    d.setDate(d.getDate()+7);
    this.task.endDate = new Date(d)
  }
  if (this.task.frequency === 'monthly'){
    let d = new Date(this.task.startDate);
    d.setDate(d.getDate()+30);
    this.task.endDate = new Date(d)
  }
  if (this.task.frequency === 'quarterly'){
    let d = new Date(this.task.startDate);
    d.setDate(d.getDate()+90);
    this.task.endDate = new Date(d)
  }
}





addTask() {
  if(this.task.activityId === '') {
    this.notifyService.showWarning('Please add Activity', 'No Activity')
  } else if(this.task.kpi === null && this.kpiCalendar === 'kpi' ) {
    this.notifyService.showWarning('Please add kpi', 'No KPI')
  } else if(this.task.recurring && !this.task.recurringWeekTarget.week1 ) {
    this.notifyService.showWarning('Please set weekly target', 'Week 1')
  } else if(this.task.recurring && !this.task.recurringWeekTarget.week2 ) {
    this.notifyService.showWarning('Please set weekly target', 'Week 2')
  } else if(this.task.recurring && !this.task.recurringWeekTarget.week4 ) {
    this.notifyService.showWarning('Please set weekly target', 'Week 3')
  } else if(this.task.recurring && !this.task.recurringWeekTarget.week4 ) {
    this.notifyService.showWarning('Please set weekly target', 'Week 4')
  } else if(this.task.endDate === '') {
    this.notifyService.showWarning('Please set end date', 'No end date')
  } else if(this.task.actionable === '') {
    this.notifyService.showWarning('Please type actionable', 'No Actionable')
  } else if(this.task.reportingUser === '') {
    this.notifyService.showWarning('Please add atleast one reporting user', 'No reporting user selected')
  } else {
    if (this.task.frequency === 'weekly'){
      this.task.forecast = this.task.kpi;
    }
    if (this.task.frequency === 'monthly'){
      this.task.forecast = (this.task.kpi * 4)
    }
    if (this.task.frequency === 'quarterly'){
      this.task.forecast = (this.task.kpi * 12)
    }
    this.task.startDate = new Date();
    this.submitTaskPlan();
  }


}





submitTaskPlan() {
  this.taskPlanService.createTaskPlan(this.task).subscribe(
    data => {
      this.ActivePlanEdit.tasks.push(data._id)
      this.saveThePlan();
    }, 
    error => this.notifyService.showError('Could not create Plan', 'Failed')
  )
}













removeTask(x: any) {
  this.ActivePlanEdit.tasks.splice(x, 1);
}



saveThePlan() {
  this.ImprintLoader = true;
  for(let trtPlan of this.PlanOnEdit.plan) {
    if (trtPlan._id === this.ActivePlanEdit._id) {
      trtPlan = this.ActivePlanEdit; 
      this.plansService.updatePlan(this.PlanOnEdit._id, this.PlanOnEdit).subscribe(
        data => {
          this.PlanOnEdit = data;
          this.updatePage().then(() => {
            this.formatTask().then(() => {
              this.formartReport().then(() => { 
                for(let trtPlan of this.PlanOnEdit.plan) {
                  if (trtPlan._id === this.ActivePlanEdit._id) {
                   this.ActivePlanEdit = trtPlan; 

                     this.ActiveModel = 'edit';
                    this.task = {
                      activityId: '',
                      priority: '',
                      kpi: null,
                      recurring: false,
                      recurringWeekTarget: {
                        week1: 0,
                        week2: 0,
                        week3: 0,
                        week4: 0
                      },
                      forecast: null,
                      startDate: '',
                      frequency: 'monthly',
                      endDate: '',
                      approval: false,
                      actionable: '',
                      reportingUser: '',
                      reports: []
                    }
                    this.ImprintLoader = false;
                    this.notifyService.showSuccess('Plan update', 'Success')
                   break;
                  }
                }
              })
            })
          })


        },
        error => { this.ImprintLoader = false; this.notifyService.showError('Could not update plan', 'Error') }
      )
     break;
    }
  }
}







back() {
  this.planComponent.toListsPage();
}









ngOnDestroy() {
    localStorage.removeItem('planOnEdit')
}










}