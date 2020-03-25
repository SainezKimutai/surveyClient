import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';
import { faPlus, faListAlt, faTrash, faEyeSlash, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TrackerService } from 'src/app/shared/services/tracker.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.sass']
})
export class TrackerComponent implements OnInit {


    constructor(
      private notifyService: NotificationService,
      private trackerService: TrackerService
    ) {}

@ViewChild('viewCommentsModal', {static: true, }) viewCommentsModal: ModalDirective;
@ViewChild('viewRecomModal', {static: true, }) viewRecomModal: ModalDirective;

@ViewChild('name', {static: false}) name: ElementRef;
@ViewChild('kpiTarget', {static: false}) kpiTarget: ElementRef;
@ViewChild('kpiUnit', {static: false}) kpiUnit: ElementRef;
@ViewChild('cat', {static: false}) cat: ElementRef;
@ViewChild('kpiActual', {static: false}) kpiActual: ElementRef;
@ViewChild('monthly', {static: false}) monthly: ElementRef;
@ViewChild('value', {static: false}) value: ElementRef;
@ViewChild('weeklyActual', {static: false}) weeklyActual: ElementRef;
@ViewChild('reason', {static: false}) reason: ElementRef;
@ViewChild('comment', {static: false}) comment: ElementRef;

// Loader
public ImprintLoader = false;

// icons
public faPlus = faPlus;
public faTrash = faTrash;
public faEye = faEye;
public faEmpty = faEyeSlash;
public faListAlt = faListAlt;
public faSearch = faSearch;



//
public AllTrackers = [];

// status
public formSectionStatus = false;
public editformSectionStatus = false;
public bcpFunctionDefaults = false;
public listSectionStatus = true;
public viewSectionStatus = false;

public trackerOnView: any;
public trackerOnEdit: any;



// input variables
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





    ngOnInit() {
      localStorage.setItem('ActiveNav', 'tracker');
      this.updatePage();
      this.creatNewForm();
    }


updatePage() {
  return new Promise((resolve, reject) => {
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
    weekly: [],
    weeklyActual: null,
    reason: '',
    comment: ''
  };

  this.kpiMeasureCatInput = {
    cat: '',
    category: '',
    threat: ''
  };

  this.weeklyInput = {
    value: null,
    week: null,
    reason: null,
    comment: null
  };
  this.weeklyArray = [];
  this.kpiMeasureCatsArray = [];
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
      break;
    }
  }


}

viewBcpFunctionDefaults(){
  this.bcpFunctionDefaults = true;
}
hideBcpFunctionDefaults(){
  this.bcpFunctionDefaults = false;
}


editTracker() {
  this.trackerFormId = this.trackerOnView._id;
  this.bcpFunctionInput = {
    name: this.trackerOnView.name,
    kpiTarget: this.trackerOnView.kpiTarget,
    kpiUnit: this.trackerOnView.kpiUnit,
    // kpiMeasureCats: this.trackerOnView.kpiMeasureCats,
    kpiActual: this.trackerOnView.kpiActual,
    monthly: this.trackerOnView.monthly,
    weekly: this.trackerOnView.weekly,
    // weeklyActual: this.trackerOnView.weeklyActual,
    // reason: this.trackerOnView.reason,
    // comment: this.trackerOnView.comment
  };

  this.kpiMeasureCatInput = {
    cat: '',
    category: '',
    threat: ''
  };

  this.weeklyInput = {
    value: null,
    week: null,
    reason: null,
    comment: null
  };
  this.weeklyArray = this.trackerOnView.weekly;
  this.kpiMeasureCatsArray = this.trackerOnView.kpiMeasureCats;

  this.editformSectionStatus = true;
  this.listSectionStatus = false;
  this.viewSectionStatus = false;
}


addKpiMeasureCatInput() {
  this.kpiMeasureCatsArray.push(this.kpiMeasureCatInput);
  this.kpiMeasureCatInput = {
    cat: '',
    category: '',
    threat: ''
  };
}

removeKpiMeasureCatInput(x) {
  this.kpiMeasureCatsArray.splice(x, 1);
}


addWeeklyInput() {
  this.weeklyArray.push(this.weeklyInput);
  console.log(this.weeklyArray);
  this.weeklyInput = {
    value: null,
    week: null,
    reason: null,
    comment: null
  };
}

removeWeeklyInput(r) {
  this.weeklyArray.splice(r, 1);
}






validateForm() {
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

  } else {
    this.ImprintLoader = true;

    if (this.trackerFormId === '') {
      this.AddBcpTracker();
    }
    if ( this.trackerFormId !== '') {
      this.updateBcpTracker();
    }

  }

}



AddBcpTracker() {
  const myBCPdata = {
    companyId: localStorage.getItem('loggedCompanyId'),
    name: this.bcpFunctionInput.name,
    kpiTarget: this.bcpFunctionInput.kpiTarget,
    kpiUnit: this.bcpFunctionInput.kpiUnit,
    kpiActual: 0,
    monthly: this.bcpFunctionInput.kpiTarget,
  };

  this.bcpFunctionsArray.push(myBCPdata);

  this.creatNewForm();
  this.trackerService.createTracker(myBCPdata).subscribe(
    data => {
      this.updatePage().then(() => {
      this.ImprintLoader = false;
      this.notifyService.showSuccess('Tracker created', 'Success');
      this.listTracker();
      });
    },
    error => { this.ImprintLoader = false; this.notifyService.showError('could not create tracker', 'Failed'); }
  );
}





async updateBcpTracker() {
  let actual =0;
  await this.weeklyArray.forEach(week => {
    actual = actual + week.value;
  });
  const myBCPdata = {
    _id: this.trackerOnView._id,
    companyId: localStorage.getItem('loggedCompanyId'),
    name: this.bcpFunctionInput.name,
    kpiTarget: this.bcpFunctionInput.kpiTarget,
    kpiUnit: this.bcpFunctionInput.kpiUnit,
    kpiActual: actual,
    monthly: this.bcpFunctionInput.monthly,
    weekly: this.weeklyArray,
  };
  console.log(myBCPdata);

  this.trackerService.updateTracker(myBCPdata._id, myBCPdata).subscribe(
    data => {
      this.updatePage().then(() => {
      this.ImprintLoader = false;
      this.notifyService.showSuccess('Tracker Updated', 'Success');
      this.editformSectionStatus = false;
      this.openTracker(this.trackerOnView._id);
      });
    },
    error => { this.ImprintLoader = false; this.notifyService.showError('could not update tracker', 'Failed'); }
  );

}




deleteTracker(id) {
  this.ImprintLoader = true;
  this.trackerService.deleteTracker(id).subscribe(
    data => {
      this.updatePage().then(() => {
      this.ImprintLoader = false;
      this.notifyService.showSuccess('Tracker Deleted', 'Success');
      this.listTracker();
      });
    },
    error => { this.ImprintLoader = false; this.notifyService.showError('could not delete tracker', 'Failed'); }
  );
}

viewWeeklyReportResponse(reason, comments){
  this.weeklyReportReason = reason;
  this.weeklyReportComments = comments;
  this.viewCommentsModal.show();
}

viewWeeklyReportRecommendations(value, target, unit){
  const expected_capacity = target/4;
  const attained_capacity = value/expected_capacity*100;
  if(attained_capacity<50){
    this.observation = "Mapped risk is high due to low productivity("+attained_capacity+"%)";
    this.recommendation = "Escalate to management.";
  }else if(49<attained_capacity && attained_capacity<70){
    this.observation = "Mapped risk is Medium due to average productivity("+attained_capacity+"%)";
    this.recommendation = "Improve on implementation.";
  }else if(attained_capacity>69){
    this.observation = "Mapped risk is low due to good productivity("+attained_capacity+"%)";
    this.recommendation = "You are on the right track, improve on any week points.";
  }
  this.viewRecomModal.show();

}



}
