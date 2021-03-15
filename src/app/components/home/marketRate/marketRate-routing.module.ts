import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketRateComponent } from './marketRate.component';

const routes: Routes = [

    { path: '', component: MarketRateComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketRateRoutingModule { }
