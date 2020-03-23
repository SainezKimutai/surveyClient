import { Component, OnInit } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ResponseService } from 'src/app/shared/services/responses.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.sass']
})
export class SurveyComponent implements OnInit {

// tslint:disable: max-line-length



  constructor(private surveyService: SurveyService, private responseService: ResponseService, private router: Router) { }



  AllSurveys = [];
  AllResponses = [];
  ImprintLoader = false;
  public faCheck = faCheck;




  ngOnInit() {
    localStorage.setItem('ActiveNav', 'survey');
    this.updatePage().then(() => { this.checkForCompletedSurveys(); });
  }






  updatePage() {
    return new Promise((resolve, reject) => {

    this.surveyService.getAllSurveys().subscribe(
      data => {this.AllSurveys = data; },
      error => console.log('Error getting all surveys')
    );
    this.responseService.getAllResponses().subscribe(
      data => {this.AllResponses = data; resolve(); },
      error => console.log('Error geting all Responses')
    );

  });
  }



  checkForCompletedSurveys() {
    if (localStorage.getItem('permissionStatus') ===  'isCustomer') {
     this.AllSurveys =  this.AllSurveys.filter((surv) => {
        const myResponses = this.AllResponses.filter((resp) => (resp.companyId === localStorage.getItem('loggedCompanyId') && resp.surveyId === surv._id)).map( e => e);
        if (myResponses.length > 0) { surv.done = true; }
        return true;
      }).map( e => e);
    }

  }




  async takeSurvey(survey) {
    // Navigate to /results?page=1
    this.router.navigate(['/answer'], { queryParams: { surveyId: survey._id, surveyName: survey.surveyName} });
  }





}
