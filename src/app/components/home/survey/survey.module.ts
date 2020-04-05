import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { SurveyComponent } from './survey.component';
import { SurveyRoutingModule } from './survey-routing.module';
import { ModalModule } from 'ngx-bootstrap';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgCircleProgressModule } from 'ng-circle-progress';



@NgModule({

  declarations: [
      SurveyComponent
          ],

    imports: [
      CommonModule,
      SurveyRoutingModule,
      AngularFontAwesomeModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      FormsModule,
      NgbModule,
      NgbModalModule,
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
      })


    ]

  })

export class SurveyModule {}
