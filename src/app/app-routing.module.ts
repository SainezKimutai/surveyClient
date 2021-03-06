import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppCustomPreloader } from './app-preload.module';
import { TokenGuard } from './shared/route-guards/token.guard';
  // tslint:disable: max-line-length

const routes: Routes = [
  { path: '', redirectTo: 'landing_page', pathMatch: 'full' },

  { path: 'landing_page', loadChildren: 'src/app/components/landing-page/landing-page.module#LandingPageModule',  data: {preload: true}},

  // { path: 'invitation/:institutionId/:companyId/:userType/:userRole/:deptId/:email/:token', loadChildren: 'src/app/components/invitation/invitation.module#InvitationModule',  data: {preload: false}},

  { path: 'invitation', loadChildren: 'src/app/components/invitation/invitation.module#InvitationModule',  data: {preload: false}},

  { path: 'register', loadChildren: 'src/app/components/register/register.module#RegisterModule', data: {preload: true}},

  {path: 'passwordreset', loadChildren: 'src/app/components/passwordreset/passwordreset.module#PasswordResetModule'},

  { path: 'traffic', loadChildren: 'src/app/components/traffic/traffic.module#TrafficModule'},

  { path: 'answer', loadChildren: 'src/app/components/answer/answer.module#AnswerModule', canActivate: [TokenGuard]  },

  { path: 'terms-and-conditions', loadChildren: 'src/app/components/terms-and-conditions/terms-and-conditions.module#TermsAndConditionsModule' },

  { path: 'home', loadChildren: 'src/app/components/home/home.module#HomeModule', canActivate: [TokenGuard], data: { preload: false } },

  { path: 'faq', loadChildren: 'src/app/components/faq/faq.module#FaqModule', canActivate: [TokenGuard], data: {preload: false} },

  { path: '**', loadChildren: 'src/app/components/notFound/notFound.module#NotFoundModule', }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloader }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
