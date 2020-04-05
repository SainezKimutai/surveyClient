import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { ChartsModule } from 'ng2-charts';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({

  declarations: [
      ReportsComponent
          ],

    imports: [
      CommonModule,
      ReportsRoutingModule,
      AngularFontAwesomeModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      FormsModule,
      ChartsModule,
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

  export class ReportsModule {}
