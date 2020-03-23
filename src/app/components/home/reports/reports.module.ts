import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';

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
      ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
      })

    ]

  })

  export class ReportsModule {}
