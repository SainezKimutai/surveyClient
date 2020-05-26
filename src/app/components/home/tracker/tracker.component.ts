import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { faListAlt, faCheck, faSpinner, faBusinessTime } from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import {ResponseService} from 'src/app/shared/services/responses.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.sass']
})
export class TrackerComponent implements OnInit {
 // tslint:disable

    constructor(
      private notifyService: NotificationService,
      private plansService: PlansService,
      private responseService : ResponseService,
      private userService: UserService
    ) {  }


  public ImprintLoader = false;
  public pageProgress = 0

  public PlanStatus = true;
  public ReportStatus = false;

  public faCheck = faCheck;
  public faListAlt = faListAlt;
  public faSpinner = faSpinner;
  public faBusinessTime = faBusinessTime;
  
  public AllPlans = [];







    ngOnInit() {
      localStorage.setItem('ActiveNav', 'tracker');
      this.updatePage()
      this.getAResponseObjectForUser();
    }



  updatePage() {
    this.pageProgress = 50
    return new Promise((resolve, reject) => {
      this.plansService.getAllCompanyPlans().subscribe(
        dataPlans => {
          this.AllPlans = dataPlans;
          this.pageProgress = 100
          resolve();
        },
        error => console.log('Error')
      )
    })
  }



  editReport(plan: any) {
    localStorage.setItem('planOnReport', JSON.stringify(plan))
    this.PlanStatus = false;
    this.ReportStatus = true;
  }
  
  
  toListsPage() {
    this.PlanStatus = true;
    this.ReportStatus = false;
    this.updatePage().then(() => {});
  }

  getAResponseObjectForUser(){
    const payload = {
      surveyId : '5e819470d729c17ebc232ad6',
      userId : '5e76b1d501cbaf3e26ba4e16',
      companyId: '5e76b1d401cbaf3e26ba4e15'
    }
    var survey;
    this.responseService.getByUserIdCompanyIdSurveyId(payload).subscribe((data)=>{
      
       survey = data[0];
       survey.answers.forEach(answers => {
         answers.answer.forEach(element => {
           if(element.level === "High"){
              element.level = "Medium";
           }
         });
       });

       console.log(survey);


       this.responseService.updateThreatLevel(survey).subscribe((data)=>{
         console.log(data);
       });
       
    },err=>console.log("Err"));

  }
  



} // End of main class
