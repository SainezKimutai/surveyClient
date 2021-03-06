import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { EditorialComponent } from './editorial.component';
import { EditorialRoutingModule } from './editorial-routing.module';
import { ModalModule } from 'ngx-bootstrap';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({

  declarations: [
      EditorialComponent
          ],

    imports: [
      CommonModule,
      EditorialRoutingModule,
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
        outerStrokeColor: '#074BFB',
        innerStrokeColor: '#f7b307',
        animation: false,
        animationDuration: 300
      })

    ]

  })

  export class EditorialModule {}
