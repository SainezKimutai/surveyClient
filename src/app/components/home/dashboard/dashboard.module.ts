import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap';


@NgModule({

  declarations: [
      DashboardComponent
          ],

    imports: [
      CommonModule,
      DashboardRoutingModule,
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
      })

    ]

  })

  export class DashboardModule {}
