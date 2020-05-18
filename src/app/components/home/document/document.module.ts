import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DocumentComponent } from './document.component';
import { DocumentRoutingModule } from './document-routing.module';
@NgModule({

  declarations: [
      DocumentComponent
          ],

    imports: [
      CommonModule,
      DocumentRoutingModule,
      AngularFontAwesomeModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      MatStepperModule,
      MatInputModule,
      MatFormFieldModule,
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

  export class DocumentModule {}
