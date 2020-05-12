import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import { PlansService } from 'src/app/shared/services/plan.service';
import { ModalDirective } from 'ngx-bootstrap';
import { PlanComponent } from '../plan.component';


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
        private surveyService: SurveyService,
        private responseService: ResponseService,
        private questionService: QuestionService,
        private planComponent: PlanComponent
        
      ) {  }



@ViewChild('addTaskModal', {static: true}) addTaskModal: ModalDirective;


public ImprintLoader = false;
public ActiveModel = 'edit';

public faArrowLeft = faArrowLeft;
public faPlus = faPlus;
public faTrash = faTrash;

public PlanOnEdit: any;
public ActivePlanEdit: any;
    


public task: any;









ngOnInit() {
    this.PlanOnEdit = JSON.parse(localStorage.getItem('planOnEdit'))
    this.task = {
      task: '',
      kpi: null,
      forecast: '',
      priority: 'medium',
      approval: false,
      escalated: false,
      reporters: []
    }

    this.getUnEdittedThreatPlan();
}   






switchModel(param: any) {
  this.ActiveModel = param;
}










getUnEdittedThreatPlan() {
  for(let trtPlan of this.PlanOnEdit.plan) {
    if (trtPlan.actionable === '') {
     this.ActivePlanEdit = trtPlan; 
     break;
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




addTask() {
  if(this.task.task === '') {
    this.notifyService.showWarning('Please add task', 'Empty Field')
  } else if(this.task.kpi === null) {
    this.notifyService.showWarning('Please add kpi', 'Empty Field')
  } else if(this.task.forecast === '') {
    this.notifyService.showWarning('Please set forecast', 'Empty Field')
  } else {
    this.ActivePlanEdit.tasks.push(this.task)
    this.addTaskModal.hide();
    this.task = {
      task: '',
      kpi: null,
      forecast: '',
      priority: 'medium',
      approval: false,
      escalated: false,
      reporters: []
    }
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