import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { faArrowLeft, faPlus, faTrash, faTimes, faFileAlt, faCommentAlt,
  faImage, faVideo, faFileWord, faFileExcel, faFilePowerpoint, faFilePdf, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { PlansService } from 'src/app/shared/services/plan.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TrackerComponent } from '../tracker.component';
import { ModalDirective } from 'ngx-bootstrap';
import { TaskPlanService } from 'src/app/shared/services/taskPlan.service';
import { ActivityPlanService } from 'src/app/shared/services/activityPlan.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { dev } from 'src/app/shared/dev/dev';


@Component({
  selector: 'app-tracker-report',
  templateUrl: './tracker-report.component.html',
  styleUrls: ['./tracker-report.component.sass']
})
export class TrackerReportComponent implements OnInit, OnDestroy {
 // tslint:disable

    constructor(
      private notifyService: NotificationService,
      private plansService: PlansService,
      private trackerComponent: TrackerComponent,
      private taskPlanService: TaskPlanService,
      private activityPlanService: ActivityPlanService
    ) {  }

@ViewChild('reportModel', {static: true}) reportModel: ModalDirective;
@ViewChild('planDescriptionModal', {static: true}) planDescriptionModal: ModalDirective;
@ViewChild('planDocsModal', {static: true}) planDocsModal: ModalDirective;

public ImprintLoader = false;

public PlanOnReport: any;
public ActivePlanEdit: any;


// icons
public faArrowLeft = faArrowLeft;
public faPlus = faPlus;
public faTrash = faTrash;
public faTimes = faTimes;
public faFileAlt = faFileAlt;
public faCommentAlt = faCommentAlt;
public faImage = faImage;
public faVideo = faVideo;
public faFileWord = faFileWord;
public faFileExcel = faFileExcel;
public faFilePowerpoint = faFilePowerpoint;
public faFilePdf = faFilePdf;
public faCrosshairs = faCrosshairs


public reportValueInput = null;
public reportEventInput = false;
public reportInputIsBoolean = false;
public TaskOnEdit: any;
public ReportOnEdit: any;

public ActivityPlan = [];
public TaskPlan = [];

public ActiveActivityPlan: any;
public TaskPlansOnView = [];



public descriptionInput = {
  title: '',
  body: '',
};

planDescriptionEditorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '200px',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '2',
  fonts: [ {class: 'georgia', name: 'Georgia'}, {class: 'arial', name: 'Arial'}, {class: 'times-new-roman', name: 'Times New Roman'}, {class: 'calibri', name: 'Calibri'}, {class: 'comic-sans-ms', name: 'Comic Sans MS'}],
  customClasses: [{name: 'quote', class: 'quote', }, {name: 'redText', class: 'redText'}, {name: 'titleText', class: 'titleText', tag: 'h1', }, ],
  uploadUrl: 'v1/image',
  sanitize: true,
  toolbarPosition: 'top',
};












    ngOnInit() {
      this.PlanOnReport = JSON.parse(localStorage.getItem('planOnReport'));
      this.ImprintLoader = true;
      this.updatePage().then(() => {
        this.formatPlan().then(() => {  this.ImprintLoader = false;  
  
          this.ActiveActivityPlan = this.ActivityPlan[0];
          this.TaskPlansOnView = this.TaskPlan.filter((task) => task.activityId === this.ActiveActivityPlan._id).map(e => e);
         
        });

      })
    }









updatePage() {
  return new Promise((resolve, reject) => {
        this.activityPlanService.getAllActivityPlan().subscribe(
          dataActivity => {
            this.ActivityPlan = dataActivity;
            
            this.taskPlanService.getAllTaskPlanByCompanyId().subscribe(
              dataTask => {
                this.TaskPlan = dataTask.filter((task) => task.reportingUser === localStorage.getItem('loggedUserEmail')).map(e => e);;

                this.formatAtivity().then(() => resolve())
              }, error => console.log('Error getting task plan')
            )

          }, error => console.log('Error getting activity plan')
        )
  })
}





formatAtivity () {
  return new Promise((resolve, reject) => {
  this.TaskPlan.forEach((task, ind, arr) => {
    let getActivity = this.ActivityPlan.filter((a) => a._id === task.activityId).map((e) => e);
    task.activityName = getActivity[0].activityPlan;
    if (ind === arr.length - 1){ resolve() }
  })
  if(this.TaskPlan.length === 0) { resolve() }
})
}





    







formatPlan() {
  return new Promise((resolve, reject) => {

    this.TaskPlan.forEach((taskElement, ind, arr) => {
      let start: any = new Date(taskElement.startDate);
      let end: any = new Date(taskElement.endDate);
      let today: any = new Date();
      let timeTo = today - end
      let timeFrom = today - start
      if (timeFrom < 0) {
        taskElement.timeline = 'awaiting';
      }
      if (timeFrom > 0 && timeTo < 0 ) {
        taskElement.timeline = 'active';
      }
      if (timeTo > 0 ) {
        taskElement.timeline = 'due';
      }

      if (!taskElement.recurring){
        let doneSecond = today - start;
        let days = Math.ceil(doneSecond / (1000*60*60*24));
        let totalSeconds = end - start;
        let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
        let week = Math.ceil(days / 7)
        let totalWeeks = Math.ceil(totalDays / 7) 

        // if the number of week does not exceed a month
        if (week < totalWeeks || week === totalWeeks) {
          if (taskElement.reports.length === week - 1 ) {
              taskElement.reportingStatus = 'pending';
          }
          if (taskElement.reports.length === week) {
            taskElement.reportingStatus = 'done';
          }
        }

        // if there is report skipped
        if (taskElement.reports.length < totalWeeks) {
          if ((week - taskElement.reports.length ) > 1 ) {
            let reportObj = {
              value: taskElement.kpi === null ? false : 0,
              reportingDate: new Date()
            }
            taskElement.reports.push(reportObj);
            this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
              data => {
                this.updatePage().then(() => { this.formatPlan() })
              },
              error => { console.log('Error updating skipped week') }
            )
          }
        }
      }
      if (taskElement.recurring){

        if (taskElement.frequency === 'weekly') {
          let doneSecond = today - start;
          let days = Math.ceil(doneSecond / (1000*60*60*24));
          let totalSeconds = end - start;
          let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
          let week = Math.ceil(days / 7)
          let totalWeeks = Math.ceil(totalDays / 7) 

                 // if the number of week does not exceed end date
            if (week < totalWeeks || week === totalWeeks) {
              if (taskElement.reports.length === week - 1 ) {
                  taskElement.reportingStatus = 'pending';
              }
              if (taskElement.reports.length === week) {
                taskElement.reportingStatus = 'done';
              }
            }

            // if there is report skipped
            if (taskElement.reports.length < totalWeeks) {
              if ((week - taskElement.reports.length ) > 1 ) {
                let reportObj = {
                  value: taskElement.kpi === null ? false : 0,
                  reportingDate: new Date()
                }
                taskElement.reports.push(reportObj);
                this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
                  data => {
                    this.updatePage().then(() => { this.formatPlan() })
                  },
                  error => { console.log('Error updating skipped week') }
                )
              }
            }


        }
        if (taskElement.frequency === 'monthly') {
          let doneSecond = today - start;
          let days = Math.ceil(doneSecond / (1000*60*60*24));
          let totalSeconds = end - start;
          let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
          let month = Math.ceil(days / 30)
          let totalMonths = Math.ceil(totalDays / 30) 

                 // if the number of months does not exceed end date
            if (month < totalMonths || month === totalMonths) {
              if (taskElement.reports.length === month - 1 ) {
                  taskElement.reportingStatus = 'pending';
              }
              if (taskElement.reports.length === month) {
                taskElement.reportingStatus = 'done';
              }
            }

            // if there is report skipped
            if (taskElement.reports.length < totalMonths) {
              if ((month - taskElement.reports.length ) > 1 ) {
                let reportObj = {
                  value: taskElement.kpi === null ? false : 0,
                  reportingDate: new Date()
                }
                taskElement.reports.push(reportObj);
                this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
                  data => {
                    this.updatePage().then(() => { this.formatPlan() })
                  },
                  error => { console.log('Error updating skipped week') }
                )
              }
            }

        }
        if (taskElement.frequency === 'quarterly') {
          let doneSecond = today - start;
          let days = Math.ceil(doneSecond / (1000*60*60*24));
          let totalSeconds = end - start;
          let totalDays = Math.ceil(totalSeconds / (1000*60*60*24)); 
          let quarter = Math.ceil(days / 90)
          let totalQuarter = Math.ceil(totalDays / 90) 
      
                 // if the number of months does not exceed end date
            if (quarter < totalQuarter || quarter === totalQuarter) {
              if (taskElement.reports.length === quarter - 1 ) {
               
                  taskElement.reportingStatus = 'pending';
              }
              if (taskElement.reports.length === quarter) {
                taskElement.reportingStatus = 'done';
              }
            }

            // if there is report skipped
            if (taskElement.reports.length < totalQuarter) {
              if ((quarter - taskElement.reports.length ) > 1 ) {
                let reportObj = {
                  value: taskElement.kpi === null ? false : 0,
                  reportingDate: new Date()
                }
                taskElement.reports.push(reportObj);
                this.taskPlanService.updateTaskPlan(taskElement._id, taskElement).subscribe(
                  data => {
                    this.updatePage().then(() => { this.formatPlan() })
                  },
                  error => { console.log('Error updating skipped week') }
                )
              }
            }       
        }

    

 
      }
      if (ind === arr.length - 1){ 
        resolve();
      }   
    });

    if(this.TaskPlan.length === 0) { resolve() }
  
});
}







switchActivityPlan(activityPlanId: any) {
  for(let actPlan of this.ActivityPlan) {
    if (actPlan._id === activityPlanId) {
     this.ActiveActivityPlan = actPlan;
     this.TaskPlansOnView = this.TaskPlan.filter((task) => task.activityId === this.ActiveActivityPlan._id).map(e => e);
     break;
    }
  }
}


back() {
  this.trackerComponent.toListsPage();
}




actionClicked(item: any) {
  // create new report 
  if(item.reportingStatus === 'pending' && item.timeline === 'active') {
    if (item.kpi === null) {
      this.reportEventInput = false;
      this.reportValueInput = null;
      this.reportInputIsBoolean = true;
    } else {
      this.reportEventInput = false;
      this.reportValueInput = null;
      this.reportInputIsBoolean = false;
    }
    this.TaskOnEdit = item;
    this.ReportOnEdit = '';
    this.reportModel.show();
  }

  // update existing report 
  if(item.reportingStatus === 'done' && item.timeline === 'active') {
    let reverseReport = item.reports.reverse();
    this.ReportOnEdit = reverseReport[0]._id;
    if (item.kpi === null) {
      this.reportEventInput = reverseReport[0].value;
      this.reportValueInput = null;
      this.reportInputIsBoolean = true;
    } else {
      this.reportValueInput = reverseReport[0].value;
      this.reportEventInput = false;
      this.reportInputIsBoolean = false;
    }

    this.TaskOnEdit = item;
    this.reportModel.show();
  }

  // awaiting Task 
  if(item.timeline === 'awaiting') {
    this.notifyService.showInfo('Please wait till start date', 'Future task');
  }

  // due Task 
  if(item.timeline === 'due') {
    this.notifyService.showInfo('You cannot report on the task', 'Due Date Passed');
  }


}







saveReport() {

  if(!this.reportInputIsBoolean && this.reportValueInput === null) {
    this.notifyService.showWarning('Please input a value', 'Empty Input')
    return;
  }

  this.ImprintLoader = true;
  // this.reportModel.hide();
  if (this.ReportOnEdit){
 
    for(let taskReport of this.TaskOnEdit.reports) {
      if (taskReport._id === this.ReportOnEdit ) {
        taskReport.value = this.reportInputIsBoolean ? this.reportEventInput : this.reportValueInput;
        this.saveTaskPlan();
        break;
      }
    }
   
  } else {
        let reportObj = {
          value: this.reportInputIsBoolean ? this.reportEventInput : this.reportValueInput,
          reportingDate: new Date()
        }
        this.TaskOnEdit.reports.push(reportObj)
        this.saveTaskPlan();
  }
}







saveTaskPlan() {
  this.taskPlanService.updateTaskPlan(this.TaskOnEdit._id, this.TaskOnEdit).subscribe(
    data => {

      this.updatePage().then(() => {
          this.formatPlan().then(() => {   
            for(let tskPlan of this.TaskPlan) {
              if (tskPlan._id === data._id) {
               this.TaskOnEdit = tskPlan;
               this.TaskPlansOnView = this.TaskPlan.filter((task) => task.activityId === this.ActiveActivityPlan._id).map(e => e);
               let reverseReport = this.TaskOnEdit.reports.reverse();
               this.ReportOnEdit = reverseReport[0]._id;
               this.ImprintLoader = false;
               this.notifyService.showSuccess('Report Updated', 'Success')
               break;
              }
            }
        })
      })
    },
    error => { this.ImprintLoader = false; this.notifyService.showError('Could not update Report', 'Failed') }
  )
}








openPlanDescriptionModal(taskPlan: any) {
  this.TaskOnEdit = taskPlan;
  if (this.TaskOnEdit.description.title ) { this.descriptionInput.title = this.TaskOnEdit.description.title };
  if (!this.TaskOnEdit.description.title ) { this.descriptionInput.title = this.TaskOnEdit.activityName };
  if (this.TaskOnEdit.description.body ) { this.descriptionInput.body = this.TaskOnEdit.description.body };
  if (!this.TaskOnEdit.description.body ) { this.descriptionInput.body = ''};
  this.planDescriptionModal.show();
}




addDescription() {
  if (this.descriptionInput.title === '') {
    this.notifyService.showWarning('Please add title', 'No Title')
  } else if (this.descriptionInput.body === '') {
    this.notifyService.showWarning('Please add body', 'No body content')
  } else {
    this.ImprintLoader = true;
    this.TaskOnEdit.description = {
      title: this.descriptionInput.title,
      body: this.descriptionInput.body ,
    }
    this.taskPlanService.updateTaskPlan(this.TaskOnEdit._id, this.TaskOnEdit).subscribe(
      data => {
        this.updatePage().then(() => {
            this.formatPlan().then(() => {  
              this.planDescriptionModal.hide();
              this.ImprintLoader = false; 
              this.notifyService.showSuccess('Description Updated', 'Success')
          })
        })
      }, error => { this.ImprintLoader = true; this.notifyService.showError('could not add description', 'Failed') }
    )
  }
}





openPlanDocsModal(taskPlan: any) {
  this.TaskOnEdit = taskPlan;
  this.planDocsModal.show();
}


uploadDoc(docFile) {
  this.ImprintLoader = true;
  const myDoc =  docFile.target.files[0] as File;
  // tslint:disable-next-line: new-parens
  const formData = new FormData;
  formData.append('fileUploaded', myDoc, myDoc.name);
  let MyDocType = myDoc.type.toLocaleLowerCase();
  let myDocTypeName = '';
  if (MyDocType.includes('image')) { myDocTypeName = 'image'}
  if (MyDocType.includes('video')) { myDocTypeName = 'video'}
  if (MyDocType.includes('pdf')) { myDocTypeName = 'pdf' }
  if (MyDocType.includes('word')) { myDocTypeName = 'word' }
  if (MyDocType.includes('sheet') || MyDocType.includes('excel')) { myDocTypeName = 'sheet' }
  if (MyDocType.includes('presentation')) { myDocTypeName = 'presentation' }

  // this.notifyService.showInfo(myDocTypeName, myDocTypeName);

  this.taskPlanService.uploadPlanDocument(formData).subscribe(
    data => {

      let myDocObj = {
        docType: myDocTypeName,
        docOriginalName: myDoc.name,
        name: data.name,
        url: `${dev.connect}${data.url}`,
      }
      this.TaskOnEdit.documents.push(myDocObj);
      this.taskPlanService.updateTaskPlan(this.TaskOnEdit._id, this.TaskOnEdit).subscribe(
        data => {
          this.updatePage().then(() => {
            
              this.formatPlan().then(() => {  
                this.TaskOnEdit = data;
                this.saveReport();
                this.planDocsModal.hide();
          
            })
          })
        }, error => { this.ImprintLoader = true; this.notifyService.showError('could not update report', 'Failed') }
      )
      }, error => { this.ImprintLoader = true; this.notifyService.showInfo('Document was not uploaded', 'Failed'); }
  );


}















ngOnDestroy() {
  localStorage.removeItem('planOnReport')
}




} // End of main class
