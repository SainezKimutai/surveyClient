import { Component, OnInit } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.sass']
})
export class SurveyComponent implements OnInit {
  AllSurveys: any;
  ImprintLoader: boolean = false;

  constructor(private surveyService: SurveyService, private router: Router) { }

  ngOnInit() {
    localStorage.setItem('ActiveNav', 'survey');
    this.updatePage();
  }

  updatePage() {
    console.log("Called");
    this.surveyService.getAllSurveys().subscribe(
      data => {console.log(data);this.AllSurveys = data},
      error => console.log('Error getting all surveys')
    );
  }
  async takeSurvey(survey){
    // Navigate to /results?page=1
    this.router.navigate(['/answer'], { queryParams: { surveyId: survey._id, surveyName: survey.surveyName} });
  }
}
