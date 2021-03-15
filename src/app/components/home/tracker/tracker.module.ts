import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule, BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { TrackerRoutingModule } from './tracker-routing.module';
import { TrackerComponent } from './tracker.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TrackerReportComponent } from './tracker-report/tracker-report.component';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({

  declarations: [
      TrackerComponent, TrackerReportComponent
          ],

    imports: [
      CommonModule,
      TrackerRoutingModule,
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
        outerStrokeColor: '#074BFB',
        innerStrokeColor: '#f7b307',
        animation: false,
        animationDuration: 300
      }),
      BsDatepickerModule.forRoot(),
      DatepickerModule.forRoot(),
      AngularEditorModule

    ]

  })

export class TrackerModule {}
