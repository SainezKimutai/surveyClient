import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faBars, faArrowLeft, faChartLine, faEdit, faUser, faUsers, faListAlt, faPowerOff,
  faProjectDiagram, faFileAlt, faBusinessTime, faNewspaper, faFolderPlus, faCrosshairs,
  faFax} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})




export class HomeComponent implements OnInit, OnDestroy {


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
public faFileAlt = faFileAlt;
public faBusinessTime = faBusinessTime;
public faNewspaper = faNewspaper;
public faFolderPlus = faFolderPlus;
public faCrosshairs = faCrosshairs;
public faFax = faFax;

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
public planNavBarActive = false;
public trackerNavBarActive = false;
public usersNavBarActive = false;
public adminNavBarActive = false;
public marketRateBarActive = false;
public documentNavBarActive = false;
public salesNavBarActive = false;

public myInterval;









  ngOnInit() {

    if (sessionStorage.getItem('permissionStatus') === 'isAdmin') {
      this.toAdmin = true;
    } else if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
        this.toCustomer = true;
    } else if (sessionStorage.getItem('permissionStatus') === 'isThirdParty') {
        this.toThirdParty = true;
    }


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
  this.planNavBarActive = false;
  this.trackerNavBarActive = false;
  this.usersNavBarActive = false;
  this.adminNavBarActive = false;
  this.marketRateBarActive = false;
  this.documentNavBarActive = false;
  this.salesNavBarActive = false;
  if (sessionStorage.getItem('ActiveNav') === 'dashboard') {this.dashboardNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'survey') {this.surveyNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'profile') {this.profileNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'editorial') {this.editorialNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'reports') {this.reportsNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'plan') {this.planNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'tracker') {this.trackerNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'users') {this.usersNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'admin') {this.adminNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'marketRates') {this.marketRateBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'document') {this.documentNavBarActive = true; }
  if (sessionStorage.getItem('ActiveNav') === 'sales') {this.salesNavBarActive = true; }

}



  // Toggle Sidebar
  toggleSideBar() {
    this.sideBarStatus = !this.sideBarStatus;
 }







  logout() {
    // sessionStorage.removeItem('loggedUserToken');
    // sessionStorage.removeItem('loggedUserName');
    // sessionStorage.removeItem('permissionStatus');
    // sessionStorage.removeItem('loggedUserID');
    // sessionStorage.removeItem('loggedCompanyId');
    // sessionStorage.removeItem('loggedUserName');
    // sessionStorage.removeItem('loggedUserEmail');
    // sessionStorage.removeItem('loggedUserInstitution');

    //consider this instead..
    sessionStorage.clear();

    this.router.navigate(['/landing_page']);
  }





  ngOnDestroy() {
    clearInterval(this.myInterval);
  }





} // End of Main Class
