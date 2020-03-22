import { Component, OnInit } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.sass']
})
export class SurveyComponent implements OnInit {





  constructor(private surveyService: SurveyService, private router: Router) { }



  AllSurveys: any;
  ImprintLoader = false;




  ngOnInit() {
    localStorage.setItem('ActiveNav', 'survey');
    this.updatePage();
  }






  updatePage() {

    this.surveyService.getAllSurveys().subscribe(
      data => {this.AllSurveys = data; },
      error => console.log('Error getting all surveys')
    );
  }





  async takeSurvey(survey) {
    // Navigate to /results?page=1
    this.router.navigate(['/answer'], { queryParams: { surveyId: survey._id, surveyName: survey.surveyName} });
  }





}
