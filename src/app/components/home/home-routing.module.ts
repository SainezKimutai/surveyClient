import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminGuard } from 'src/app/shared/route-guards/admin.guard';
import { CustomerGuard } from 'src/app/shared/route-guards/customer.guard';
// Plugins




// tslint:disable: max-line-length
const routes: Routes = [

    { path: '', component: HomeComponent,
      children: [

        { path: '', redirectTo: '/landing_page', pathMatch: 'full' },

        { path: 'dashboard', loadChildren: 'src/app/components/home/dashboard/dashboard.module#DashboardModule', canActivate: [AdminGuard], data: {preload: true}},
        { path: 'survey', loadChildren: 'src/app/components/home/survey/survey.module#SurveyModule', data: {preload: true}},
        { path: 'reports', loadChildren: 'src/app/components/home/reports/reports.module#ReportsModule', canActivate: [CustomerGuard], data: {preload: true}},
        { path: 'tracker', loadChildren: 'src/app/components/home/tracker/tracker.module#TrackerModule', canActivate: [CustomerGuard], data: {preload: true}},
        { path: 'profile', loadChildren: 'src/app/components/home/profile/profile.module#ProfileModule', canActivate: [CustomerGuard],  data: {preload: true}},
        { path: 'editorial', loadChildren: 'src/app/components/home/editorial/editorial.module#EditorialModule', canActivate: [AdminGuard], data: {preload: true}},
        { path: 'users', loadChildren: 'src/app/components/home/users/users.module#UsersModule', data: {preload: true}},
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }









