import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faArrowLeft, faChartLine, faEdit, faUser, faUsers, faListAlt, faPowerOff,
  faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})




export class HomeComponent implements OnInit, OnDestroy {

  salesNavBarActive = false;
  ImprintLoader = false;

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
public faPowerOff = faPowerOff;
public faEdit = faEdit;
public faProjectDiagram = faProjectDiagram;
public faUsers = faUsers;


// permisions
public toAdmin = false;
public toCustomer = false;
public toThirdParty = false;



public sideBarStatus = true;

// Active Nav bars
public dashboardNavBarActive = false;
public surveyNavBarActive = false;
public profileNavBarActive = false;
public editorialNavBarActive = false;
public reportsNavBarActive = false;
public trackerNavBarActive = false;
public usersNavBarActive = false;

public myInterval;









  ngOnInit() {

    if (localStorage.getItem('permissionStatus') === 'isAdmin') {
      this.toAdmin = true;
    } else if (localStorage.getItem('permissionStatus') === 'isCustomer') {
        this.toCustomer = true;
    } else if (localStorage.getItem('permissionStatus') === 'isThirdParty') {
        this.toThirdParty = true;
    }
    console.log(this.toThirdParty);


    this.myInterval = setInterval(() => {
      this.CheckActiveNavBar();
    }, 50);


  } //








CheckActiveNavBar() {
  this.dashboardNavBarActive = false;
  this.surveyNavBarActive = false;
  this.profileNavBarActive = false;
  this.editorialNavBarActive = false;
  this.reportsNavBarActive = false;
  this.trackerNavBarActive = false;
  this.usersNavBarActive = false;
  if (localStorage.getItem('ActiveNav') === 'dashboard') {this.dashboardNavBarActive = true; }
  if (localStorage.getItem('ActiveNav') === 'survey') {this.surveyNavBarActive = true; }
  if (localStorage.getItem('ActiveNav') === 'profile') {this.profileNavBarActive = true; }
  if (localStorage.getItem('ActiveNav') === 'editorial') {this.editorialNavBarActive = true; }
  if (localStorage.getItem('ActiveNav') === 'reports') {this.reportsNavBarActive = true; }
  if (localStorage.getItem('ActiveNav') === 'tracker') {this.trackerNavBarActive = true; }
  if (localStorage.getItem('ActiveNav') === 'users') {this.usersNavBarActive = true; }
}



  // Toggle Sidebar
  toggleSideBar() {
    this.sideBarStatus = !this.sideBarStatus;
 }







  logout() {
    localStorage.removeItem('loggedUserToken');
    localStorage.removeItem('loggedUserName');
    localStorage.removeItem('permissionStatus');
    localStorage.removeItem('loggedUserID');
    localStorage.removeItem('loggedCompanyId');
    this.router.navigate(['/landing_page']);
  }





  ngOnDestroy() {
    clearInterval(this.myInterval);
  }





} // End of Main Class
