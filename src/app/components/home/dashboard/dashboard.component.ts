import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  // icons
  public faSearch = faSearch

  ngOnInit() {
    localStorage.setItem('ActiveNav', 'profile');
  }

}
