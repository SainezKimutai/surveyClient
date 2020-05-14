import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { faArrowLeft, faPlus, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import { PlanComponent } from '../plan.component';
import { UserService } from 'src/app/shared/services/user.service';


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
        private planComponent: PlanComponent
      ) {  }




public ImprintLoader = false;
public ListStatus = false;
public TaskFormStatus = true;
public ActiveModel = 'edit';

public CompanyUsers = [];

public faArrowLeft = faArrowLeft;
public faPlus = faPlus;
public faTrash = faTrash;
public faTimes = faTimes;

public PlanOnEdit: any;
public ActivePlanEdit: any;
    


public task: any;
public kpiCalendar = 'kpi';
public ReportingUsers = [];









ngOnInit() {
    this.PlanOnEdit = JSON.parse(localStorage.getItem('planOnEdit'))

    this.userService.getAllUsers().subscribe(
      data => {
        this.CompanyUsers = data.filter((user) => user.companyId === localStorage.getItem('loggedCompanyId')).map(e => e);
      },
      error => {
        console.log('Error In getting all Users');
      }
    ); // get all users

    this.task = {
      task: '',
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
      period: 'weekly',
      endDate: '',
      approval: false,
      reportingUser: ''
    }

    this.getUnEdittedThreatPlan();
}   






switchModel(param: any) {
  this.ActiveModel = param;
}










getUnEdittedThreatPlan() {
  let iterations = this.PlanOnEdit.plan.length;
  for(let trtPlan of this.PlanOnEdit.plan) {
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
    task: '',
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
    period: 'weekly',
    endDate: '',
    approval: false,
    reportingUser: ''
  }
}

checkRecurring() {
  if (this.task.recurring) {
    this.task.period = 'monthly';
  }
}

calculateEndDate() {
  if (this.task.period === 'weekly'){

  }
  if (this.task.period === 'monthly'){
    
  }
  if (this.task.period === 'quarterly'){
    
  }
}

getReportingUsers(id) {
  if(this.ReportingUsers.indexOf(id) > -1){
    this.ReportingUsers.splice(this.ReportingUsers.indexOf(id), 1);
  }else{
    this.ReportingUsers.push(id);
  }
}



addTask() {
  if(this.task.task === '') {
    this.notifyService.showWarning('Please add task', 'No task name')
  } else if(this.task.kpi === null && this.kpiCalendar === 'kpi' ) {
    this.notifyService.showWarning('Please add kpi', 'No KPI')
  } else if(this.task.recurring && !(this.task.recurringWeekTarget.week1 > 0 && 100 > this.task.recurringWeekTarget.week1) ) {
    this.notifyService.showWarning('Should be a value between 1 and 99', 'Invalid input in week 1')
  } else if(this.task.recurring && !(this.task.recurringWeekTarget.week2 > 0 && 100 > this.task.recurringWeekTarget.week2) ) {
    this.notifyService.showWarning('Should be a value between 1 and 99', 'Invalid input in week 2')
  } else if(this.task.recurring && !(this.task.recurringWeekTarget.week3 > 0 && 100 > this.task.recurringWeekTarget.week3) ) {
    this.notifyService.showWarning('Should be a value between 1 and 99', 'Invalid input in week 3')
  } else if(this.task.recurring && !(this.task.recurringWeekTarget.week4 > 0 && 100 > this.task.recurringWeekTarget.week4) ) {
    this.notifyService.showWarning('Should be a value between 1 and 99', 'Invalid input in week 4')
  }  else if(this.task.startDate === '') {
    this.notifyService.showWarning('Please set start date', 'No start date')
  } else if(this.ReportingUsers.length === 0) {
    this.notifyService.showWarning('Please add atleast one reporting user', 'No reporting user selected')
  } else {
    this.task.reporters = this.ReportingUsers;
    this.ActivePlanEdit.tasks.push(this.task)
    this.ActiveModel = 'edit';
    this.task = {
      task: '',
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
      period: 'weekly',
      endDate: '',
      approval: false,
      reportingUser: ''
    }
    this.ReportingUsers = [];
  }


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
          this.ImprintLoader = false;
          this.getUnEdittedThreatPlan();
          this.notifyService.showSuccess('Plan update', 'Success')
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