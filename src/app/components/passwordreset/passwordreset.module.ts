import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { PasswordResetComponent } from './passwordreset.component';
import { PasswordResetRoutingModule } from './passwordreset-routing.module';


@NgModule({

  declarations: [
    PasswordResetComponent
          ],

    imports: [
      CommonModule,
      PasswordResetRoutingModule,
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

  export class PasswordResetModule {}
