import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AnswerComponent } from './answer.component';
import { AnswerRoutingModule } from './answer-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({

  declarations: [
      AnswerComponent
          ],

    imports: [
      CommonModule,
      AnswerRoutingModule,
      AngularFontAwesomeModule,
      FontAwesomeModule,
      ReactiveFormsModule,
      FormsModule,
      ModalModule.forRoot(),
      ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
      })

    ]

  })

  export class AnswerModule {}
