import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesEditComponent } from './sales-edit.component';


const routes: Routes = [

    { path: '', component: SalesEditComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesEditRoutingModule { }
