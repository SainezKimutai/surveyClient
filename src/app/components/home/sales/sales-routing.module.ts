import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesBoardComponent } from './sales-board/sales-board.component';

// tslint:disable: max-line-length
const routes: Routes = [

    { path: '', component: SalesBoardComponent },
    { path: 'crm_edit', loadChildren: 'src/app/components/home/sales/sales-edit/sales-edit.module#SalesEditModule', data: { preload: true }},
    { path: 'crm_config', loadChildren: 'src/app/components/home/sales/sales-config/sales-config.module#SalesConfigModule', data: { preload: true }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
