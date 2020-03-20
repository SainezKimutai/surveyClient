import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
// Plugins




// tslint:disable: max-line-length
const routes: Routes = [

    { path: '', component: HomeComponent,
      children: [

        { path: '', redirectTo: '/landing_page', pathMatch: 'full' },

        { path: 'dashboard', loadChildren: 'src/app/components/home/dashboard/dashboard.module#DashboardModule', data: {preload: true}},
        { path: 'survey', loadChildren: 'src/app/components/home/survey/survey.module#SurveyModule', data: {preload: true}},
        { path: 'profile', loadChildren: 'src/app/components/home/profile/profile.module#ProfileModule', data: {preload: true}},
        { path: 'editorial', loadChildren: 'src/app/components/home/editorial/editorial.module#EditorialModule', data: {preload: true}},

      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }









