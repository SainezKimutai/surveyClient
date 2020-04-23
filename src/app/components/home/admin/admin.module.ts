import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {AdminMarketRateComponent } from './market-rates/market-rates.component';

@NgModule({

  declarations: [
      AdminComponent, AdminMarketRateComponent
          ],

    imports: [
      CommonModule,
      AdminRoutingModule,
      AngularFontAwesomeModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      FormsModule,
      ChartsModule,
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

  export class AdminModule {}
