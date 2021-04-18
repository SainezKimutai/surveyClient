import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminGuard } from 'src/app/shared/route-guards/admin.guard';
import { CustomerGuard } from 'src/app/shared/route-guards/customer.guard';
import { ThirdPartyGuard } from 'src/app/shared/route-guards/thirdParty.guard';
import { CustomerAdminGuard } from 'src/app/shared/route-guards/customerAdmin.guard';
import { CustomerThirdPartyGuard } from 'src/app/shared/route-guards/customerThirdParty.guard';

// Plugins




// tslint:disable: max-line-length
const routes: Routes = [

    { path: '', component: HomeComponent,
      children: [

        { path: '', redirectTo: '/landing_page', pathMatch: 'full' },

        { path: 'dashboard', loadChildren: 'src/app/components/home/dashboard/dashboard.module#DashboardModule', data: {preload: true}},
        { path: 'survey', loadChildren: 'src/app/components/home/survey/survey.module#SurveyModule', data: {preload: true}},
        { path: 'reports', loadChildren: 'src/app/components/home/reports/reports.module#ReportsModule', data: {preload: true}},
        { path: 'document', loadChildren: 'src/app/components/home/document/document.module#DocumentModule', canActivate: [CustomerGuard],  data: {preload: true}},
        { path: 'plan', loadChildren: 'src/app/components/home/plan/plan.module#PlanModule', canActivate: [CustomerGuard],  data: {preload: true}},
        { path: 'tracker', loadChildren: 'src/app/components/home/tracker/tracker.module#TrackerModule', canActivate: [CustomerGuard], data: {preload: true}},
        { path: 'profile', loadChildren: 'src/app/components/home/profile/profile.module#ProfileModule', canActivate: [CustomerGuard],  data: {preload: true}},
        { path: 'market_rate', loadChildren: 'src/app/components/home/marketRate/marketRate.module#MarketRateModule', canActivate: [AdminGuard],  data: {preload: true}},
        { path: 'editorial', loadChildren: 'src/app/components/home/editorial/editorial.module#EditorialModule', canActivate: [ThirdPartyGuard], data: {preload: true}},
        { path: 'users', loadChildren: 'src/app/components/home/users/users.module#UsersModule', canActivate: [CustomerAdminGuard], data: {preload: true}},
        { path: 'crm', loadChildren: 'src/app/components/home/sales/sales.module#SalesModule', canActivate: [CustomerThirdPartyGuard], data: {preload: true}}
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }









