import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ResponseService } from 'src/app/shared/services/responses.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.sass']
})
export class SurveyComponent implements OnInit {






  constructor(
    private notifyService: NotificationService,
    private companyProfileService: CompanyProfileService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private responseService: ResponseService
  ) { }





  public AllSurveys = [];
  public AllQuestions = [];
  public AllCompanies = [];
  public AllResponses = [];

  public TemeplateViewSectionStatus = true;

  public faCheck = faCheck;




  ngOnInit() {
    localStorage.setItem('ActiveNav', 'survey');

    this.updatePage();
  }









  updatePage() {
    this.surveyService.getAllSurveys().subscribe(
      data => this.AllSurveys = data,
      error => console.log('Error getting all surveys')
    );

    this.companyProfileService.getAllCompanyProfiles().subscribe(
      data => this.AllCompanies = data,
      error => console.log('Error getting all companies')
    );

    this.questionService.getAllQuestions().subscribe(
      data => this.AllQuestions = data,
      error => console.log('Error getting all questions')
    );

    this.responseService.getAllResponses().subscribe(
      data => this.AllResponses = data,
      error => console.log('Error getting all companies')
    );

    this.filterSurveys();

  }







  // 

  filterSurveys() {

    const CompanyId = localStorage.getItem('loggedCompanyId');

  }








}
