import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft, faArrowRight, faSave, faFilePdf, faBookOpen, faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-survey-completed',
  templateUrl: './survey-completed.component.html',
  styleUrls: ['./survey-completed.component.sass']
})
export class SurveyCompletedComponent implements OnInit {

  constructor(
    private router: Router
  ) { }
public faArrowLeft = faArrowLeft;
public faArrowRight = faArrowRight;
public faSave = faSave;
public faFilePdf = faFilePdf;
public faBookOpen = faBookOpen;
public faDownload = faDownload;
  ngOnInit() {
  }


back() {
   this.router.navigate(['/home/survey']);
}


}
