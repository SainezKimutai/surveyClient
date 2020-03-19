import { Component, OnInit } from '@angular/core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {

  constructor(
  ) { }


  // icon
  public faEnvelope = faEnvelope;
  public faKey = faKey;




  ngOnInit() {



  }

}
