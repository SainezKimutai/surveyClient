import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TrafficService } from 'src/app/shared/services/traffic.service';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.sass']
})
export class TrafficComponent implements OnInit {

 source: String;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private trafficService: TrafficService
  ) { }

   
  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
        this.source = params.source;
        this.saveTrafficandRedirect();
    });

     

  }
  saveTrafficandRedirect(){
        const payload = {
            source : this.source
        }
        this.trafficService.createTraffic(payload).subscribe(response=>{
            this.router.navigateByUrl('/landing_page');
        }, err=>{
            this.router.navigateByUrl('/landing_page');
        })
  }
  
}