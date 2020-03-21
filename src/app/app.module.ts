import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserService } from './shared/services/user.service';
import { AppCustomPreloader } from './app-preload.module';
import { NotificationService } from './shared/services/notification.service';
import { CompanyProfileService } from './shared/services/companyProfile.service';
import { SurveyService } from './shared/services/survey.service';
import { QuestionService } from './shared/services/questions.service';
import { ResponseService } from './shared/services/responses.service';
import { FileUploadService } from 'src/app/shared/services/fileUpload.service';

 // tslint:disable: max-line-length
@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
    }),
  ],

  providers: [AppCustomPreloader, NotificationService, UserService, CompanyProfileService, SurveyService, QuestionService, ResponseService, FileUploadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
