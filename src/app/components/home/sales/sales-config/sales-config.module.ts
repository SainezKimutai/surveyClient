import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { ChartsModule } from 'ng2-charts';
import { ModalModule, BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { SalesConfigComponent } from './sales-config.component';
import { SalesConfigRoutingModule } from './sales-config-routing.module';






@NgModule({

declarations: [
    SalesConfigComponent
        ],

  imports: [
    CommonModule,
    SalesConfigRoutingModule,
    AngularFontAwesomeModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ChartsModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
    NgbModalModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),

  ]

})

export class SalesConfigModule {}

