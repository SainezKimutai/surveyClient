import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';
import { faPlus, faListAlt, faTrash, faEyeSlash, faEye, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TrackerService } from 'src/app/shared/services/tracker.service';
import { ModalDirective } from 'ngx-bootstrap';
import { TrackerReasonService } from 'src/app/shared/services/trackerReasons.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
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
      private trackerService: TrackerService,
      private userService: UserService,
      private trackerReasonService: TrackerReasonService,
      private companyProfileService: CompanyProfileService,
    ) {}


@ViewChild('deleteModal', {static: true}) deleteModal: ModalDirective;
@ViewChild('addReportModal', {static: true}) addReportModal: ModalDirective;
@ViewChild('viewUserReportModal', {static: true}) viewUserReportModal: ModalDirective;

@ViewChild('name', {static: false}) name: ElementRef;
@ViewChild('kpiTarget', {static: false}) kpiTarget: ElementRef;
@ViewChild('kpiUnit', {static: false}) kpiUnit: ElementRef;
@ViewChild('kpiActual', {static: false}) kpiActual: ElementRef;
@ViewChild('monthly', {static: false}) monthly: ElementRef;
@ViewChild('reportingUser', {static: false}) reportingUser: ElementRef;
@ViewChild('departmentId', {static: false}) departmentId: ElementRef;
// @ViewChild('reason', {static: false}) reason: ElementRef;
// @ViewChild('comment', {static: false}) comment: ElementRef;

// Loader
public ImprintLoader = false;

// icons
public faPlus = faPlus;
public faTrash = faTrash;
public faEye = faEye;
public faEmpty = faEyeSlash;
public faListAlt = faListAlt;
public faSearch = faSearch;
public faCheck = faCheck;



//
public AllCompanies = [];
public myCompany: any;
public AllTrackers = [];
public AllTrackerReasons = [];
public Users = [];

// status
public formSectionStatus = false;
public editformSectionStatus = false;
public bcpFunctionDefaults = false;
public listSectionStatus = true;
public viewSectionStatus = false;

public trackerOnView: any;
public trackerOnEdit: any;



// input letiables
public bcpFunctionsArray = [];
public bcpFunctionInput;
public kpiMeasureCatsArray = [];
public kpiMeasureCatInput;
public weeklyArray = [];
public weeklyInput;

public trackerFormId = '';

// modal data holders
public weeklyReportReason: any;
public weeklyReportComments: any;
public observation: any;
public recommendation: any;


public reportingUserArray =[];

public MyUser = ['amon', 'goefrey', 'kim', 'muinde'];
public formOneStatus = true;




// Report Variables

public monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
public today = new Date();
public thisYear = this.today.getFullYear();
public thisMonth = this.monthsArray[this.today.getMonth()];
public thisWeek: any;
public thisDay = this.today.getDay()
public reportInputForm: any;
public MyReports = [];
public reportsWeeklyStatus = false;
public lastUpdateDay = null;
public reportSubmitedStatus = false;
public reportOnView;



// permisions
public loggedInUserId = localStorage.getItem('loggedUserID');
public toAdminCustomer = false;
public toManagerCustomer = false;














    ngOnInit() {
      localStorage.setItem('ActiveNav', 'tracker');
      this.thisWeek = this.getWeek();
      this.updatePage().then(() => {

        for(let user of this.Users) {
          if (localStorage.getItem('loggedUserID') === user._id){
            if (user.userRole === 'admin'){
              this.toAdminCustomer = true;
            }
            if (user.userRole === 'manager'){
              this.toManagerCustomer = true;
            }
            if (user.userRole === 'normal') {
              this.AllTrackers = this.AllTrackers.filter(trck => trck.departmentId  === user.departmentId).map(e => e);
            }
            break;
          }
        }

      } );
      this.creatNewForm();

      this.reportInputForm = {
        userId: localStorage.getItem('loggedUserID'), 
        value: null,
        week: this.getWeek(),
        reason : '',
        comment: '',
        date_submitted: new Date()
      }
      


    }







getWeek() {
  let date = new Date();
  let todaysDate = date.getDate()
  if (todaysDate > 0 && todaysDate < 8 ) { return 1 }
  if (todaysDate > 7 && todaysDate < 15 ) { return 2 }
  if (todaysDate > 14 && todaysDate < 22 ) { return 3 }
  if (todaysDate > 21 && todaysDate < 32 ) { return 4 } 
}











updatePage() {
  return new Promise((resolve, reject) => {
    this.trackerReasonService.getAllTrackerReasons().subscribe(
      data => this.AllTrackerReasons = data,
      error => console.log('Error getting all tracker reasons')
    );
    this.companyProfileService.getAllCompanyProfiles().subscribe(
      data => {
        this.AllCompanies = data;
        for (const comp of this.AllCompanies) { if (comp._id === localStorage.getItem('loggedCompanyId')) { this.myCompany = comp; break; }}
      },
      error => console.log('Error geting all Companies')
    );
    this.userService.getAllUsers().subscribe(
      data => {
        this.Users = data;
      },
      error => {
        console.log('Error In listing Users');
      }
    ); 
    this.trackerService.getAllTrackers().subscribe(
      data => {
        this.AllTrackers = data.filter((e) => e.companyId === localStorage.getItem('loggedCompanyId')).map(e => e); resolve();
      },
      error => console.log('Error getting all trackers')
    );
  });

}



creatNewForm() {
  this.trackerFormId = '';
  this.bcpFunctionInput = {
    name: '',
    kpiTarget: null,
    kpiUnit: '',
    kpiMeasureCats: [],
    kpiActual: null,
    monthly: null,
    departmentId: '',
    allInDepartment: true,
    reportingUsers: [],
    reporting_schedule: 'weekly',
    last_reporting_day: '5',
    reports: []
  };

  this.kpiMeasureCatInput = {
    cat: '',
    category: '',
    threat: ''
  };

  this.weeklyInput = {
    value: null,
    week: this.getWeek(),
    reason: null,
    comment: null
  };
  this.weeklyArray = [];
  this.kpiMeasureCatsArray = [];
  this.formOneStatus = true;
}









backToFormTwo() {
  this.formOneStatus = true;
}







createNewTracker() {
  this.formSectionStatus = true;
  this.listSectionStatus = false;
  this.viewSectionStatus = false;
  this.creatNewForm();
}






listTracker() {
  this.formSectionStatus = false;
  this.editformSectionStatus = false;
  this.listSectionStatus = true;
  this.viewSectionStatus = false;
}



openTracker(id) {
  for (const trck of this.AllTrackers) {
    if (trck._id === id) {
      this.trackerOnView = trck;
      this.formSectionStatus = false;
      this.listSectionStatus = false;
      this.viewSectionStatus = true;
      this.formatReports(this.trackerOnView.reports)
      break;
    }
  }
}


formatReports(reports) {
  this.MyReports = [];
  let decDay = this.thisDay
  let constDay = this.thisDay - 1;
  let x;
  for(x = 0; x <= constDay; x++) {
    reports.forEach((rep , key, arr) => {
      let d = new Date();
      d.setDate(d.getDate()-x);
      let bool = (d.toDateString() === new Date(rep.date_submitted).toDateString());

      if (bool){

        for(let user of this.Users){
          if (rep.userId === user._id) {
            rep.userEmail = user.email
            rep.position = decDay;
            this.MyReports.push(rep)
            decDay--


            if (Object.is(arr.length - 1, key)) {
              this.checkTrackerType(this.trackerOnView);
              this.viewWeeklyReportRecommendations();
            }


          }
        }

      }

    })

  }

}



checkTrackerType(trck) {
  this.reportsWeeklyStatus = trck.reporting_schedule === 'weekly' ? true : false;
  this.lastUpdateDay = Number(trck.last_reporting_day)
 
  if (!this.reportsWeeklyStatus) {
  let filterReports = trck.reports.filter((rep) => {
    let d = new Date();
    let bool = (d.toDateString() === new Date(rep.date_submitted).toDateString());
    if (bool && rep.userId === localStorage.getItem('loggedUserID')) {
      return true;
    }
  }).map(e => e)
  this.reportSubmitedStatus = filterReports.length > 0 ? true : false;
  }

  if(this.reportsWeeklyStatus) {
    let filterReports = this.MyReports.filter((rep) => rep.userId === localStorage.getItem('loggedUserID')).map(e => e)
    this.reportSubmitedStatus = filterReports.length > 0 ? true : false;
  }


}







reportSubmitedAlert() { this.notifyService.showInfo('You have submited your report', 'Already Submited')}



openViewUserReportModal(report) {
  this.viewUserReportModal.show()
  this.reportOnView = report;
}




editReport(){
  this.reportInputForm = this.reportOnView;
  this.addReportModal.show()
}








captureReportingUsers(ans) {

  if (this.reportingUserArray.includes(ans)) {
    this.reportingUserArray = this.reportingUserArray.filter(a => a !== ans ).map( e => e );
  } else {
    this.reportingUserArray.push(ans);

  }

}











editTracker() {
  this.trackerFormId = this.trackerOnView._id;
  this.bcpFunctionInput = this.trackerOnView;
  this.bcpFunctionInput.last_reporting_day = this.bcpFunctionInput.last_reporting_day.toString(),
  this.formSectionStatus = true;
  this.listSectionStatus = false;
  this.viewSectionStatus = false;
}












validateForm1() {
  if (this.bcpFunctionInput.name === '') {
    this.name.nativeElement.focus(); this.name.nativeElement.className = 'inputEror';
    setTimeout(() => { this.name.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input Name', 'Empty Field');


  } else if (this.bcpFunctionInput.kpiTarget === null) {
    this.kpiTarget.nativeElement.focus(); this.kpiTarget.nativeElement.className = 'inputEror';
    setTimeout(() => { this.kpiTarget.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input KPI Target', 'Empty Field');


  } else if (this.bcpFunctionInput.kpiUnit === '') {
    this.kpiUnit.nativeElement.focus(); this.kpiUnit.nativeElement.className = 'inputEror';
    setTimeout(() => { this.kpiUnit.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input kpiUnit', 'Empty Field');

  }
  else if (this.bcpFunctionInput.kpiActual === null) {
    this.kpiActual.nativeElement.focus(); this.kpiActual.nativeElement.className = 'inputEror';
    setTimeout(() => { this.kpiActual.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input kpiActual', 'Empty Field');

  } 
  else if (this.bcpFunctionInput.monthly === null ) {
    this.monthly.nativeElement.focus(); this.monthly.nativeElement.className = 'inputEror';
    setTimeout(() => { this.monthly.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input monthly', 'Empty Field');

  } else {
    this.formOneStatus = false;
  }


}



validateForm2() {
  
  if (this.bcpFunctionInput.departmentId === '') {
    this.departmentId.nativeElement.focus(); this.departmentId.nativeElement.className = 'inputEror';
    setTimeout(() => { this.departmentId.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... select a department', 'Unselected Field');

  } else if (!this.bcpFunctionInput.allInDepartment && this.reportingUserArray.length === 0) {
    this.reportingUser.nativeElement.focus(); this.reportingUser.nativeElement.className = 'inputEror';
    setTimeout(() => { this.reportingUser.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... select atleast one reporting user', 'Unselected Field');

  }
  else {
    this.AddBcpTracker()
   }
 
}






AddBcpTracker() {
  this.ImprintLoader = true;
 

  if(this.trackerFormId === '') {

    const myBCPdata = {
      companyId: localStorage.getItem('loggedCompanyId'),
      name: this.bcpFunctionInput.name,
      kpiTarget: this.bcpFunctionInput.kpiTarget,
      kpiUnit: this.bcpFunctionInput.kpiActual,
      kpiActual: this.bcpFunctionInput.kpiActual,
      monthly: this.bcpFunctionInput.monthly,
      departmentId: this.bcpFunctionInput.departmentId,
      allInDepartment: this.bcpFunctionInput.allInDepartment,
      reportingUsers: this.reportingUserArray,
      reporting_schedule: this.bcpFunctionInput.reporting_schedule,
      last_reporting_day: Number(this.bcpFunctionInput.last_reporting_day),
      created_at: new Date(),
      updated_at: new Date(),
      reports:[]
    };
  

    this.trackerService.createTracker(myBCPdata).subscribe(
      data => {
        this.updatePage().then(() => {
        this.creatNewForm();
        this.ImprintLoader = false;
        this.notifyService.showSuccess('Tracker created', 'Success');
        this.listTracker();
        });
      },
      error => { this.ImprintLoader = false; this.notifyService.showError('could not create tracker', 'Failed'); }
    );
  }

  if (this.trackerFormId !== '') {

    const myUpdateData = this.bcpFunctionInput
    myUpdateData.last_reporting_day = Number(this.bcpFunctionInput.last_reporting_day);
    this.trackerService.updateTracker(this.trackerFormId, myUpdateData).subscribe(
      data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.notifyService.showSuccess('Tracker Updated', 'Success');
        this.openTracker(this.trackerOnView._id);
        });
      },
      error => { this.ImprintLoader = false; this.notifyService.showError('could not update tracker', 'Failed'); }
    );

  }


}






// async updateBcpTracker() {
//   let actual = 0;
//   await this.weeklyArray.forEach(week => {
//     actual = actual + week.value;
//   });
//   const myBCPdata = {
//     _id: this.trackerOnView._id,
//     companyId: localStorage.getItem('loggedCompanyId'),
//     name: this.bcpFunctionInput.name,
//     kpiTarget: this.bcpFunctionInput.kpiTarget,
//     kpiUnit: this.bcpFunctionInput.kpiUnit,
//     kpiActual: actual,
//     monthly: this.bcpFunctionInput.monthly,
//     weekly: this.weeklyArray,
//   };
//   console.log(myBCPdata);

//   this.trackerService.updateTracker(myBCPdata._id, myBCPdata).subscribe(
//     data => {
//       this.updatePage().then(() => {
//       this.ImprintLoader = false;
//       this.notifyService.showSuccess('Tracker Updated', 'Success');
//       this.editformSectionStatus = false;
//       this.openTracker(this.trackerOnView._id);
//       });
//     },
//     error => { this.ImprintLoader = false; this.notifyService.showError('could not update tracker', 'Failed'); }
//   );

// }




deleteTracker(id) {
  this.ImprintLoader = true;
  this.trackerService.deleteTracker(id).subscribe(
    data => {
      this.updatePage().then(() => {
      this.ImprintLoader = false;
      this.deleteModal.hide();
      this.notifyService.showSuccess('Tracker Deleted', 'Success');
      this.listTracker();
      });
    },
    error => { this.ImprintLoader = false; this.notifyService.showError('could not delete tracker', 'Failed'); }
  );
}













saveReport() {

  if(this.reportInputForm._id){
    this.ImprintLoader = true;
    for (let rep of this.trackerOnView.reports) {
      if (rep._id === this.reportInputForm._id) {
        rep = this.reportInputForm
        break;
      }
    }

    this.trackerService.updateTracker(this.trackerOnView._id, this.trackerOnView).subscribe(
      data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.notifyService.showSuccess('Report Updated', 'Success');
        this.addReportModal.hide();
        this.viewUserReportModal.show();
        this.openTracker(this.trackerOnView._id)
        });
      },
      error => { this.ImprintLoader = false; this.notifyService.showError('could not update report', 'Failed'); }
    );
  }
  if(!this.reportInputForm._id){
    this.ImprintLoader = true;
    this.reportInputForm.date_submitted = new Date();
    this.trackerOnView.reports.push(this.reportInputForm)
  
    this.trackerService.updateTracker(this.trackerOnView._id, this.trackerOnView).subscribe(
      data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.notifyService.showSuccess('Report Created', 'Success');
        this.addReportModal.hide();
        this.openTracker(this.trackerOnView._id)
        });
      },
      error => { this.ImprintLoader = false; this.notifyService.showError('could not create report', 'Failed'); }
    );
  }



}







deleteReport() {
  this.ImprintLoader = true;
  this.trackerOnView.reports = this.trackerOnView.reports.filter((r) => r.userId !== this.reportOnView.userId ).map(e => e);

  this.trackerService.updateTracker(this.trackerOnView._id, this.trackerOnView).subscribe(
    data => {
    this.updatePage().then(() => {
      this.ImprintLoader = false;
      this.notifyService.showSuccess('Report Deleted', 'Success');
      this.viewUserReportModal.hide();
      this.openTracker(this.trackerOnView._id)
      });
    },
    error => { this.ImprintLoader = false; this.notifyService.showError('could not delete report', 'Failed'); }
  );
}










// viewWeeklyReportResponse(reason, comments) {
//   this.weeklyReportReason = reason;
//   this.weeklyReportComments = comments;
//   this.viewCommentsModal.show();
// }

viewWeeklyReportRecommendations() {
  const value = this.MyReports.reduce( (previous, current) => previous + current.value, 0);
  const target = this.trackerOnView.kpiTarget
  const expected_capacity = target / 4;
  const attained_capacity = value / expected_capacity * 100;
  if (attained_capacity < 50) {
    this.observation = 'Mapped risk is high due to low productivity('+ attained_capacity +'%)';
    this.recommendation = 'Escalate to management.';
  } else if (49 < attained_capacity && attained_capacity < 70) {
    this.observation = 'Mapped risk is Medium due to average productivity('+ attained_capacity +'%)';
    this.recommendation = 'Improve on implementation.';
  } else if (attained_capacity > 69) {
    this.observation = 'Mapped risk is low due to good productivity('+ attained_capacity +'%)';
    this.recommendation = 'You are on the right track, improve on any week points.';
  }
  // this.viewRecomModal.show();

}










} // End of main class
