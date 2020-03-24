import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { Router } from '@angular/router';
import { faPlus, faListAlt, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TrackerService } from 'src/app/shared/services/tracker.service';

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
public faListAlt = faListAlt;
public faSearch = faSearch;


//
public AllTrackers = [];

// status
public formSectionStatus = false;
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
    week: null
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


editTracker() {
  this.trackerFormId = this.trackerOnView._id;
  this.bcpFunctionInput = {
    name: this.trackerOnView.name,
    kpiTarget: this.trackerOnView.kpiTarget,
    kpiUnit: this.trackerOnView.kpiUnit,
    kpiMeasureCats: this.trackerOnView.kpiMeasureCats,
    kpiActual: this.trackerOnView.kpiActual,
    monthly: this.trackerOnView.monthly,
    weekly: this.trackerOnView.weekly,
    weeklyActual: this.trackerOnView.weeklyActual,
    reason: this.trackerOnView.reason,
    comment: this.trackerOnView.comment
  };

  this.kpiMeasureCatInput = {
    cat: '',
    category: '',
    threat: ''
  };

  this.weeklyInput = {
    value: null,
    week: null
  };
  this.weeklyArray = this.trackerOnView.weekly;
  this.kpiMeasureCatsArray = this.trackerOnView.kpiMeasureCats;

  this.formSectionStatus = true;
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
  this.weeklyInput = {
    value: null,
    week: null
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


  } else if (this.kpiMeasureCatsArray.length === 0) {
    this.cat.nativeElement.focus(); this.cat.nativeElement.className = 'inputEror';
    setTimeout(() => { this.cat.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input kpi Measure Categories', 'Empty Field');


  } else if (this.bcpFunctionInput.kpiActual === null) {
    this.kpiActual.nativeElement.focus(); this.kpiActual.nativeElement.className = 'inputEror';
    setTimeout(() => { this.kpiActual.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input kpi Actual', 'Empty Field');


  } else if (this.bcpFunctionInput.monthly === null ) {
    this.monthly.nativeElement.focus(); this.monthly.nativeElement.className = 'inputEror';
    setTimeout(() => { this.monthly.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input monthly', 'Empty Field');


  } else if (this.weeklyArray.length === 0) {
    this.value.nativeElement.focus(); this.value.nativeElement.className = 'inputEror';
    setTimeout(() => { this.value.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input weekly', 'Empty Field');


  } else if (this.bcpFunctionInput.weeklyActual === null ) {
    this.weeklyActual.nativeElement.focus(); this.weeklyActual.nativeElement.className = 'inputEror';
    setTimeout(() => { this.weeklyActual.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input weekly Actual', 'Empty Field');


  } else if (this.bcpFunctionInput.reason === '') {
    this.reason.nativeElement.focus(); this.reason.nativeElement.className = 'inputEror';
    setTimeout(() => { this.reason.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input reason', 'Empty Field');


  } else if (this.bcpFunctionInput.comment === '') {
    this.comment.nativeElement.focus(); this.comment.nativeElement.className = 'inputEror';
    setTimeout(() => { this.comment.nativeElement.className = ''; }, 4000);
    this.notifyService.showWarning('... input comment', 'Empty Field');


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
    kpiMeasureCats: this.kpiMeasureCatsArray,
    kpiActual: this.bcpFunctionInput.kpiActual,
    monthly: this.bcpFunctionInput.monthly,
    weekly: this.weeklyArray,
    weeklyActual: this.bcpFunctionInput.weeklyActual,
    reason: this.bcpFunctionInput.reason,
    comment: this.bcpFunctionInput.comment
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





updateBcpTracker() {
  const myBCPdata = {
    _id: this.trackerOnView._id,
    companyId: localStorage.getItem('loggedCompanyId'),
    name: this.bcpFunctionInput.name,
    kpiTarget: this.bcpFunctionInput.kpiTarget,
    kpiUnit: this.bcpFunctionInput.kpiUnit,
    kpiMeasureCats: this.kpiMeasureCatsArray,
    kpiActual: this.bcpFunctionInput.kpiActual,
    monthly: this.bcpFunctionInput.monthly,
    weekly: this.weeklyArray,
    weeklyActual: this.bcpFunctionInput.weeklyActual,
    reason: this.bcpFunctionInput.reason,
    comment: this.bcpFunctionInput.comment
  };


  this.trackerService.updateTracker(myBCPdata._id, myBCPdata).subscribe(
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



}
