import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faArrowLeft, faChartLine, faUser, faListAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})




export class HomeComponent implements OnInit, OnDestroy {

  salesNavBarActive:boolean=false;
  ImprintLoader: boolean=false;
  
  constructor(
    private router: Router
  ) {  }

// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand


public faBars = faBars;
public faArrowLeft = faArrowLeft;
public faChartLine = faChartLine;
public faUser = faUser;
public faListAlt = faListAlt;





public sideBarStatus = true;

public dashboardNavBarActive = false;
public surveyNavBarActive = false;
public profileNavBarActive = false;
public editorialNavBarActive = false;

public myInterval;









  ngOnInit() {




    this.myInterval = setInterval(() => {
      this.CheckActiveNavBar();
    }, 700);


  } //








CheckActiveNavBar() {
  this.dashboardNavBarActive = false;
  this.surveyNavBarActive = false;
  this.profileNavBarActive = false;
  this.editorialNavBarActive = false;
  if (window.localStorage.getItem('ActiveNav') === 'dashboard') {this.dashboardNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'survey') {this.surveyNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'profile') {this.profileNavBarActive = true; }
  if (window.localStorage.getItem('ActiveNav') === 'editorial') {this.editorialNavBarActive = true; }
}



  // Toggle Sidebar
  toggleSideBar() {
    this.sideBarStatus = !this.sideBarStatus;
 }









  logout() {

    this.router.navigate(['/landing_page']);
  }





  ngOnDestroy() {
    clearInterval(this.myInterval);

  }





} // End of Main Class
