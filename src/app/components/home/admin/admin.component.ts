import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

import { HomeComponent } from '../home.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
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
  sessionStorage.setItem('ActiveNav', 'admin');
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
