import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { TrafficRoutingModule } from './traffic-routing.module';
import { TrafficComponent } from './traffic.component';




@NgModule({

  declarations: [
      TrafficComponent
          ],

    imports: [
      CommonModule,
      TrafficRoutingModule,
      ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
      })

    ]

  })

  export class TrafficModule {}
