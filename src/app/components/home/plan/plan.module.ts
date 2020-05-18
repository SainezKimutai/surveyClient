import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PlanComponent } from './plan.component';
import { PlanRoutingModule } from './plan-routing.module';
import { ModalModule, BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { PlanEditComponent } from './plan-edit/plan-edit.component';
import { SanitizeHtmlPipe } from 'src/app/shared/pipe/safePipe';

@NgModule({

  declarations: [
      PlanComponent, PlanEditComponent, SanitizeHtmlPipe
          ],

  imports: [
    CommonModule,
    PlanRoutingModule,
    AngularFontAwesomeModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
    NgCircleProgressModule.forRoot({
      radius: 50,
      outerStrokeWidth: 8,
      innerStrokeWidth: 8,
      outerStrokeColor: '#acb4bc',
      innerStrokeColor: '#e4e7ea',
      animation: false,
      animationDuration: 300
    }),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    AngularEditorModule
  ]

  })

  export class PlanModule {}
