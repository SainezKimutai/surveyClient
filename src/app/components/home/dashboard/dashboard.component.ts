import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faPowerOff} from '@fortawesome/free-solid-svg-icons';

import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
// tslint:disable
// tslint:disable: prefer-const


// status
public OperationDashboardStatus = true;
public MarketDashboardStatus = false;

public today = new Date();
public thisYear = this.today.getFullYear();




  constructor(
    private homeComponent: HomeComponent
  ) { }



  public faPowerOff = faPowerOff;

 ngOnInit() {
  sessionStorage.setItem('ActiveNav', 'dashboard');
 }



 toOperationDashboard() {
  this.OperationDashboardStatus = true;
  this.MarketDashboardStatus = false;
 }

 toMarketDashboard() {
  this.OperationDashboardStatus = false;
  this.MarketDashboardStatus = true;
 }



 logOut() {
  this.homeComponent.logout();
}



}
