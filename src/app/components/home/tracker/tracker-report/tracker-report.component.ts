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
import { ResponseService } from 'src/app/shared/services/responses.service';


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
      private activityPlanService: ActivityPlanService,
      private responseService: ResponseService
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

public AllPlans = [];
public ActivityPlan = [];
public TaskPlan = [];
public TaskPlanOnView = [];

public ActiveActivityPlan: any;


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
      // console.log(this.PlanOnReport._id)
      this.AllPlans = this.PlanOnReport.plan.filter((p) => p.tasks.length > 0 ).map((e) => e)
     
      this.ImprintLoader = true;
      this.updatePage().then(() => {
        this.formatPlan().then(() => { 
           
          this.mergeWithTreats().then(() => {
            this.TaskPlan =  this.TaskPlan.filter((tP) => tP.threatArr.length !== 0).map((e) => e);
            this.TaskPlanOnView = this.TaskPlan;
            this.ImprintLoader = false;  
          })
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
                this.TaskPlan.forEach((tsk) => { delete tsk.__v})
                 this.formatAtivity().then(() => { resolve(); })
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
  if(this.TaskPlan.length === 0) { resolve(); console.log('Here')}
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
                this.updatePage().then(() => { 
                  this.formatPlan().then(() => {
                    this.mergeWithTreats()
                  })
                 })
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
                    this.updatePage().then(() => { 
                      this.formatPlan().then(() => {
                        this.mergeWithTreats()
                      })
                     })
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
                    this.updatePage().then(() => { 
                      this.formatPlan().then(() => {
                        this.mergeWithTreats()
                      })
                     })
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
                    this.updatePage().then(() => { 
                      this.formatPlan().then(() => {
                        this.mergeWithTreats()
                      })
                     })
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










mergeWithTreats() {
  return new Promise((resolve, reject) => {
    this.TaskPlan.forEach((t, ind, arr) => {
      t.threatArr = []
      this.AllPlans.forEach(p => {
        let x = p.tasks.includes(t._id);
        if (x) {
          t.threatArr.push(p.threat.threat);
        }
      })
      if (ind === arr.length - 1) {
         resolve(); 
      }
    })
    if(this.TaskPlan.length === 0) { resolve() }
  })
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
            this.mergeWithTreats().then(() => { 
            for(let tskPlan of this.TaskPlan) {
              if (tskPlan._id === data._id) {
               this.TaskOnEdit = tskPlan;
               let reverseReport = this.TaskOnEdit.reports.reverse();
               this.ReportOnEdit = reverseReport[0]._id;
               
                this.calculateReportProgrress();
  
            
               this.reportModel.hide();
               this.notifyService.showSuccess('Report Updated', 'Success')
               break;
              }
            }
          });
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
              this.mergeWithTreats().then(() => { 
              this.planDescriptionModal.hide();
              this.ImprintLoader = false; 
              this.notifyService.showSuccess('Description Updated', 'Success')
              });
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
                this.mergeWithTreats().then(() => { 
                  this.TaskOnEdit = data;
                  this.saveReport();
                  this.planDocsModal.hide();
                });
            })
          })
        }, error => { this.ImprintLoader = true; this.notifyService.showError('could not update report', 'Failed') }
      )
      }, error => { this.ImprintLoader = true; this.notifyService.showInfo('Document was not uploaded', 'Failed'); }
  );


}









calculateReportProgrress() {

  

 this.TaskPlan.forEach((taskPlan, ind, arr) => {
  let totalReportValue = taskPlan.reports.reduce((a, b) => a + b.value, 0);
  let totalKpi = taskPlan.kpi;


  let currentProgress = (( totalReportValue * 100 ) / totalKpi).toFixed(0)

   

  taskPlan.reportProgress = (totalReportValue/ totalKpi)*100;

  

  this.taskPlanService.updateTaskPlan(taskPlan._id, taskPlan).subscribe((data) => {
    console.log(data);
   
  if (ind === arr.length - 1) { 

    this.taskPlanService.getAllTaskPlanByCompanyId().subscribe(
      dataTask => {

        // console.log(dataTask);

        this.TaskPlan = dataTask.filter((task) => task.reportingUser === localStorage.getItem('loggedUserEmail')).map(e => e);
        this.TaskPlan.forEach((tsk) => { delete tsk.__v});
        this.formatAtivity().then(() => {

          this.formatPlan().then(() => {
            this.mergeWithTreats().then(() => {
              this.TaskPlan =  this.TaskPlan.filter((tP) => tP.threatArr.length !== 0).map((e) => e);
              this.updatedPlanThreats();   
            })
          });

        })
      }, error => console.log('Error'))
   
  }
}, error => console.log('Error updating taskplan progress'))
  
 }) 
}






updatedPlanThreats(){

  this.AllPlans.forEach((plan, ind, arr) => {
    let planIndex = this.PlanOnReport.plan.indexOf(plan);
    let averageTask = []
    plan.tasks.forEach(taskId => {
      this.TaskPlan.forEach((taskPlan) => {
        if (taskPlan._id === taskId) {
          averageTask.push(taskPlan.reportProgress)
        }
      })
    })

    let getTheAverage = (averageTask.reduce((a, b) => a + b, 0) / averageTask.length)

    if (getTheAverage < 30) { 
      plan.threat.level = 'High'
    };
    if (getTheAverage > 29 && getTheAverage < 61 ) { 
      plan.threat.level = 'Medium'
    };
    if (getTheAverage > 60) { 
      plan.threat.level = 'Low'
    };

 
    this.PlanOnReport.plan[planIndex] = plan;
  
    if (ind === arr.length - 1) {
      // this.PlanOnReport.plan = this.AllPlans;
      this.plansService.updatePlan(this.PlanOnReport._id, this.PlanOnReport).subscribe((data) => {
        this.PlanOnReport === data;
        this.updateThreatLevels();
      }, error => {console.log('Error updating Plans')} )
    }


  })
}






updateThreatLevels() {
  this.responseService.getOneResponse(this.PlanOnReport.responseId).subscribe(
    passData=> {
      this.checkForAnyThreatChanges(passData).then((respData) => {
        // console.log(respData)
        
        this.responseService.updateThreatLevel(respData).subscribe( data => {this.ImprintLoader = false; this.notifyService.showSuccess('Level Change', 'Success')})
      },err=> this.ImprintLoader = false);
    }, error => console.log('Error')
    )

}




checkForAnyThreatChanges(dataResp) {
  return new Promise((resolve, reject) => {
        let newResponse = dataResp;
        // console.log(newResponse.answers)
        this.PlanOnReport.plan.forEach((planParam: any, planIndex:any, planArray: any) => {
          newResponse.answers  = newResponse.answers.filter((ansObj: any, ind: any, arr: any) => {
            if (ansObj._id === planParam.threat.answerId) {
              ansObj.answer = ansObj.answer.filter((ans2Obj: any) => {
                  ans2Obj.level = planParam.threat.level;
                  return true;
                }).map(e => e);
            }
            if ((planIndex === planArray.length - 1) && (ind === arr.length - 1)) {
              resolve(newResponse);
            }
            return true
          }).map(e => e)

      })

  }) 
}









ngOnDestroy() {
  localStorage.removeItem('planOnReport')
}




} // End of main class
