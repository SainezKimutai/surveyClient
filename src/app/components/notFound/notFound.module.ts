import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NotFoundComponent } from './notFound.component';
import { NotFoundRoutingModule } from './notFound-routing.module';



@NgModule({

declarations: [
    NotFoundComponent
        ],

  imports: [
    CommonModule,
    NotFoundRoutingModule,
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

export class NotFoundModule {}

