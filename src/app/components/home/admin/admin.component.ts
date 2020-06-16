import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faChartLine, faChartBar, faChartPie, faListAlt, faBuilding, faFire } from '@fortawesome/free-solid-svg-icons';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
// tslint:disable
// tslint:disable: prefer-const


// status
public OperationDashboardStatus = true;
public MarketDashboardStatus = false;

public today = new Date();
public thisYear = this.today.getFullYear();




  constructor(
    private userService: UserService,
    private companyProfileService: CompanyProfileService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private responseService: ResponseService,
    private threatService: ThreatService,
    private threatCategoryService: ThreatCategoryService,
    private notification: NotificationService
  ) { }

 ngOnInit() {
  sessionStorage.setItem('ActiveNav', 'admin');
 }



 toOperationDashboard() {
  this.OperationDashboardStatus = true;
  this.MarketDashboardStatus = false;
 }

 toMarketDashboard() {
  this.OperationDashboardStatus = false;
  this.MarketDashboardStatus = true;
 }


}
