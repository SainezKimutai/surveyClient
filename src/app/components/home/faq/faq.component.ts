import { Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { TrackerReasonService } from 'src/app/shared/services/trackerReasons.service';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import {ActivityPlanService } from 'src/app/shared/services/activityPlan.service';
import { HomeComponent } from '../home.component';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass']
})
export class FaqComponent implements OnInit {
// tslint:disable

  constructor(
    private notifyService: NotificationService,
    private homeComponent: HomeComponent,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private threatService: ThreatService,
    private industryService: IndustryService,
    private trackerReasonService: TrackerReasonService,
    private threatCategoryService: ThreatCategoryService,
    private activityPlanService: ActivityPlanService
  ) {  }

ngOnInit() {
  sessionStorage.setItem('ActiveNav', 'faq');

}


public faPowerOff = faPowerOff;
public faSearch = faSearch;





logOut() {
  this.homeComponent.logout();
}



}