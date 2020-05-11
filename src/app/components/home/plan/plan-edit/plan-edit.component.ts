import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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

public faArrowLeft = faArrowLeft;

public PlanOnEdit: any;
    
ngOnInit() {
    this.PlanOnEdit = JSON.parse(localStorage.getItem('planOnEdit'))
    console.log(this.PlanOnEdit.name)
}   





back() {
  this.planComponent.toListsPage();
}


ngOnDestroy() {
    localStorage.removeItem('planOnEdit')
}

}