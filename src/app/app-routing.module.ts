import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppCustomPreloader } from './app-preload.module';


const routes: Routes = [
  { path: '', redirectTo: 'landing_page', pathMatch: 'full' },
  { path: 'landing_page', loadChildren: 'src/app/components/landing-page/landing-page.module#LandingPageModule', data: {preload: true}},

  { path: 'register', loadChildren: 'src/app/components/register/register.module#RegisterModule', data: {preload: true}},

  { path: 'answer', loadChildren: 'src/app/components/answer/answer.module#AnswerModule'},

  { path: 'home', loadChildren: 'src/app/components/home/home.module#HomeModule',  data: { preload: false } },

  { path: '**', loadChildren: 'src/app/components/notFound/notFound.module#NotFoundModule' }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloader }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
