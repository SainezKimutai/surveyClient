import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { TermsAndConditionsRoutingModule } from './terms-and-condtions-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({

  declarations: [
    TermsAndConditionsComponent
          ],

    imports: [
      CommonModule,
      TermsAndConditionsRoutingModule,
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
      })


    ]

  })

  export class TermsAndConditionsModule {}
