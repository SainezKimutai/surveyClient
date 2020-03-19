import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';




@NgModule({

  declarations: [
      RegisterComponent
          ],

    imports: [
      CommonModule,
      RegisterRoutingModule,
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

  export class RegisterModule {}
