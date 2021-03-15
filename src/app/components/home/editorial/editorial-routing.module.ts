import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorialComponent } from './editorial.component';

const routes: Routes = [

    { path: '', component: EditorialComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorialRoutingModule { }
