import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.sass']
})
export class TermsAndConditionsComponent implements OnInit {
  // tslint:disable
  // tslint:disable: prefer-const

  constructor(
              private router: Router,
              private notification: NotificationService
              ) { }

public ImprintLoader = false;         
public today = new Date();
public thisYear = this.today.getFullYear();


public faArrowLeft = faArrowLeft

  ngOnInit() {

  }


  // goBack() {
  //   if(sessionStorage.getItem('loggedUserToken')) {
  //     this.router.navigate(['/home/survey']);
  //   }
  //   if(!sessionStorage.getItem('loggedUserToken')) {
  //     this.router.navigate(['/register']);
  //   }
  // }






} // end of main class
