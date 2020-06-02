import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SalesService } from 'src/app/shared/services/sales.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { ModalDirective } from 'ngx-bootstrap';
import { HomeComponent } from 'src/app/components/home/home.component';
import { faEdit, faTrash, faArrowLeft, faPlus} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-sales-edit',
  templateUrl: './sales-edit.component.html',
  styleUrls: ['./sales-edit.component.sass'],
})
export class SalesEditComponent implements OnInit, OnDestroy {


  // Constructor
  constructor(
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private salesService: SalesService,
    private notifyService: NotificationService,
    private clientService: ClientService
  ) {}
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand
// tslint:disable: max-line-length

// Modal
@ViewChild('dangerModal', {static: true }) public dangerModal: ModalDirective;
@ViewChild('editProjectModal', {static: true }) editProjectModal: ModalDirective;
@ViewChild('taskModal', {static: true }) taskModal: ModalDirective;
@ViewChild('deleteModal', {static: true }) deleteModal: ModalDirective;


// Variables
public projectManagerForm: FormGroup;


@ViewChild('taskDefineInput', {static: true }) taskDefineInputField: ElementRef;
public addTaskForm: FormGroup;


public ImprintLoader = false;

// Status
public listClickedStatus;
public taskDetailsStatus;
public taskClickedTeamStatus;


// icon
public faEdit = faEdit;
public faTrash = faTrash;
public faArrowLeft = faArrowLeft;
public faPlus = faPlus;

// Binded Variables

public OpennedProject: any;
public OpennedProjectTasks: any = [];
public TaskNumber: number;
public projPriority: string;
public totalTasks: number;
public totalSelectedTasks: number;
public totalTeams: number;
public totalSelectedTeams: number;
public Users: any = [];
public Teams: any = [];
public totalProjectAssignedUsers: number;


// Calender Variable
public projectDuration: number;
public projectHoveredDate: NgbDate;
public projectFromDate: NgbDate;
public projectToDate: NgbDate;
public projectMinDate = this.calendar.getToday();


public taskDuration: number;
public taskHoveredDate: NgbDate;
public taskFromDate: NgbDate;
public taskToDate: NgbDate;
public taskMinDate;
public taskMaxDate;


// form

public ModalState = '';
public projectMangerInput = '';
public projectRevenueInput = null;
public projectPriority = null;
public taskOnEditId = '';








ngOnInit() {
  this.ImprintLoader = true;
  // ckeck if project exists
  if (window.localStorage.getItem('salesEditItemId')) {

    localStorage.setItem('ActiveNav', 'sales');

        // Get The project For Editing
    this.salesService.getOppProject(localStorage.getItem('salesEditItemId')).subscribe(

          data => {
            this.setData(data).then(() => {
              this.convertDatesToNgbDates(data).then( () => {
                let clientName = data.clientName.toUpperCase();
                let projectName = data.projectName.toUpperCase();
                this.ImprintLoader = false;
                this.notifyService.showInfo(`${clientName} ${projectName} project is opened`, 'Info...');
              });
            });
          },
          error => {
            this.ImprintLoader = false;
          }
        );

      } else {
        this.router.navigate(['home/sales']);
      }

  this.addTaskForm = this.formBuilder.group({
            taskName: ['', Validators.required],
            assignedTeam: ['', Validators.required],
            assignedUser: ['', Validators.required],
            taskStatus: ['checked'],
            taskDuration: [null],
            taskStartDate: [null],
            taskEndDate: [null],
          });

  // this.teamsService.getAllTeams().subscribe(
  //   data => {
  //     this.Teams = data;
  //     this.userService.getAllUsers().subscribe(
  //       dataUser => {
  //           this.Users = dataUser;
  //           this.Users = this.Users.filter((user) => {
  //             for (let team of this.Teams) {
  //               if (user.department === team._id) {
  //                   user.departmentName = team.name;
  //               }
  //             }
  //             return true;
  //           });
  //       },
  //       error => {
  //           console.log('Error in getting Users');
  //       }
  //     );
  //   },
  //   error => console.log('Error, getting teams')
  // );

  //
}
//


 // conveniently get the values from the form fields
 get formProjectManager() {return this.projectManagerForm.controls; }
 get formAddTask() { return this.addTaskForm.controls; }



 toDetails() {
   this.router.navigate(['home/projects/project_detail']);
 }

 toTeams() {
  this.router.navigate(['home/projects/project_update']);
}








openEditModal(param: string) {
  this.ModalState = param;
  this.editProjectModal.show();

  if ( param === 'priority') {
    this.projectPriority  = this.OpennedProject.priority;
  }
}








openTaskModal() {
  this.addTaskForm = this.formBuilder.group({
    taskName: ['', Validators.required],
    assignedTeam: ['', Validators.required],
    assignedUser: ['', Validators.required],
    taskStatus: ['checked'],
    taskDuration: [null],
    taskStartDate: [null],
    taskEndDate: [null],
  });
  this.taskModal.show();
}


editTask(taskParam: any) {
  this.taskOnEditId = taskParam._id;
  this.addTaskForm = this.formBuilder.group({
    taskName: [taskParam.taskName, Validators.required],
    assignedTeam: [taskParam.assignedTeam, Validators.required],
    assignedUser: [taskParam.assignedUser, Validators.required],
    taskStatus: taskParam.taskStatus,
    taskDuration: [null],
    taskStartDate: [null],
    taskEndDate: [null],
  });
  this.taskDuration = taskParam.taskDuration;
  this.taskFromDate = taskParam.taskStartDate;
  this.taskToDate = taskParam.taskEndDate;


  this.taskModal.show();
}

// Toogle calender
taskDetailsToggle(id: any) {
  this.listClickedStatus = id;
  this.taskDetailsStatus = !this.taskDetailsStatus;

  this.OpennedProject.task.forEach(task => {
    return this.listClickedStatus === task._id ? this.taskClickedTeamStatus = task.assignedTeam : '';
  });
}






setData(data: any) {
  return new Promise((resolve, reject) => {

  this.OpennedProject = data;
  this.OpennedProject.task = this.OpennedProject.task.filter((tsk) => {
    for (let team of this.Teams) {
      if (tsk.assignedTeam === team._id) {
        tsk.assignedTeamName = team.name;
      }
    }
    return true;
  }).map(e => e);
  this.projPriority = data.priority;

  this.totalTasks = data.task.length;


  let getInvolvedTeam =  data.task.filter(task => true).map(task => task.assignedTeam);
  this.totalTeams = Array.from(new Set(getInvolvedTeam)).length;

  let getInvolvedUsers =  data.task.filter(task => task.assignedUser === '' ? false : true).map(task => task.assignedUser);

  this.totalProjectAssignedUsers = Array.from(new Set(getInvolvedUsers)).length;
  resolve();
 });
}

convertDatesToNgbDates(data) {
  return new Promise((resolve, reject) => {

    // set Dates
    if (data.projectDuration === null) {
      this.projectFromDate = this.calendar.getToday();
      this.taskMinDate = this.projectFromDate;
      this.taskMaxDate = this.calendar.getNext(this.taskMinDate, 'd', 7);
      this.projectToDate = null;
    } else {
      // converting project date to NgbDate
      let startdates = new Date(data.projectStartDate);
      this.projectFromDate = new NgbDate(startdates.getUTCFullYear(), startdates.getUTCMonth() + 1, startdates.getUTCDate());
      this.projectToDate = this.calendar.getNext(this.projectFromDate, 'd', data.projectDuration);
      this.OpennedProject.projectStartDate = this.projectFromDate;
      this.OpennedProject.projectEndDate = this.projectToDate;
      this.taskMinDate = this.projectFromDate;
      this.taskMaxDate = this.projectToDate;

      // converting task date to NgbDate
      this.OpennedProject.task.forEach((task) => {
        if (task.taskDuration) {
        let taskStartDates = new Date(task.taskStartDate);
        task.taskStartDate = new NgbDate(taskStartDates.getUTCFullYear(), taskStartDates.getUTCMonth() + 1, taskStartDates.getUTCDate());
        task.taskEndDate = this.calendar.getNext(task.taskStartDate, 'd', task.taskDuration);
        }
      });

    }

    resolve();
  });
}





// Projects Dates Seclection functions
onProjectDateSelection(date: NgbDate) {

  this.projectFromDate = date;
  this.projectToDate = this.calendar.getNext(this.projectFromDate, 'd', this.projectDuration);

}

isProjectDateHovered(date: NgbDate) {
return this.projectFromDate && !this.projectToDate && this.projectHoveredDate &&
 date.after(this.projectFromDate) && date.before(this.projectHoveredDate);
}

isProjectDateInside(date: NgbDate) {
return date.after(this.projectFromDate) && date.before(this.projectToDate);
}

isProjectDateRange(date: NgbDate) {
return date.equals(this.projectFromDate) || date.equals(this.projectToDate) ||
 this.isProjectDateInside(date) || this.isProjectDateHovered(date);
}

isProjectDateBeforeMinDate(date: NgbDate) {
  return date.before(this.projectMinDate);
}






// Save Project dates and Duration


saveProjectDurationDates() {
  this.ImprintLoader = true;
  let dataToBeSent = {
    projectDuration: this.projectDuration,
    projectStartDate: new Date(this.projectFromDate.year, this.projectFromDate.month - 1, this.projectFromDate.day + 1),
    projectEndDate: new Date(this.projectToDate.year, this.projectToDate.month - 1, this.projectToDate.day + 1)
  };

  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), dataToBeSent).subscribe(
    data => {

      this.setData(data).then(() => {
        this.convertDatesToNgbDates(data).then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Dates Changes Saved', 'Success');
        });
      });

    },
    error => {
      this.ImprintLoader = false;
      this.notifyService.showError('No Changes are Saved', 'Error');

    }
  );
}







submitProjectManager() {
  this.ImprintLoader = true;

  if (this.projectMangerInput === '') { this.ImprintLoader = false; this.notifyService.showWarning('Please select project manger', 'Blank field'); return; }
  this.salesService.updateOppProject(localStorage.getItem('salesEditItemId'), { projectManager:  this.projectMangerInput}).subscribe(
    data => {
      this.OpennedProject = data;

      this.setData(data).then(() => {
        this.convertDatesToNgbDates(data).then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Changes Saved', 'Success');
        });
      });

    },
    error => {
      this.ImprintLoader = false;
      this.notifyService.showError('Changes Not saved', 'Failed !');
    }
  );

}



submitProjectRevenue() {
  this.ImprintLoader = true;

  if (this.projectRevenueInput === null) { this.ImprintLoader = false; this.notifyService.showWarning('Please type Revenue', 'Blank field'); return; }
  this.salesService.updateOppProject(localStorage.getItem('salesEditItemId'), { revenue:  this.projectRevenueInput}).subscribe(
    data => {
      this.OpennedProject = data;

      this.setData(data).then(() => {
        this.convertDatesToNgbDates(data).then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Changes Saved', 'Success');
        });
      });

    },
    error => {
      this.ImprintLoader = false;
      this.notifyService.showError('Changes Not saved', 'Failed !');
    }
  );
}






// Set priority
selectPriority(num) {
  this.projectPriority = num;
}





  // Save Changes

saveprojectPriority() {
  this.ImprintLoader = true;
  this.salesService.updateOppProject(localStorage.getItem('salesEditItemId'), {priority: this.projectPriority} ).subscribe(
    data => {
      this.OpennedProject = data;
      this.setData(data).then(() => {
        this.convertDatesToNgbDates(data).then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Changes Saved', 'Success');
        });
      });

    },
    error => {
      this.ImprintLoader = false;
      this.notifyService.showError('Changes Not saved', 'Failed !');
    }
  );


  }
















// Tasks Dates Seclection functions

onTaskDateSelection(date: NgbDate) {

  this.taskFromDate = date;
  this.taskToDate = this.calendar.getNext(this.taskFromDate, 'd', this.taskDuration);

}

isTaskDateHovered(date: NgbDate) {
return this.taskFromDate && !this.taskToDate && this.taskHoveredDate && date.after(this.taskFromDate) && date.before(this.taskHoveredDate);
}

isTaskDateInside(date: NgbDate) {
return date.after(this.taskFromDate) && date.before(this.taskToDate);
}

isTaskDateRange(date: NgbDate) {
return date.equals(this.taskFromDate) || date.equals(this.taskToDate) || this.isTaskDateInside(date) || this.isTaskDateHovered(date);
}

isTaskDateOutSide(date: NgbDate) {
return date.before(this.taskMinDate) || date.after(this.taskMaxDate);
}













addTask() {
  this.ImprintLoader = true;
  this.addTaskForm.value.taskDuration = this.taskDuration;
  this.addTaskForm.value.taskStartDate = this.taskFromDate;
  this.addTaskForm.value.taskEndDate = this.taskToDate;

  this.OpennedProject.task.push(this.addTaskForm.value);

  let dataToBeUpdated = this.OpennedProject.task.filter(t => {
    t.taskStartDate = new Date(t.taskStartDate.year, t.taskStartDate.month - 1, t.taskStartDate.day + 1);
    t.taskEndDate = new Date(t.taskEndDate.year, t.taskEndDate.month - 1, t.taskEndDate.day + 1);

    return true;
  }).map(e => e);

  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), {task: dataToBeUpdated}).subscribe(
    data => {
      this.setData(data).then(() => {
        this.convertDatesToNgbDates(data).then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Task Added', 'Success');
        });
      });
    },
    error => {
      this.ImprintLoader = false;
      this.notifyService.showError('Could Not Add Task', 'Error !!');
    }
  );

}



saveEditTask() {
  this.ImprintLoader = true;
  this.addTaskForm.value.taskDuration = this.taskDuration;
  this.addTaskForm.value.taskStartDate = this.taskFromDate;
  this.addTaskForm.value.taskEndDate = this.taskToDate;
  this.OpennedProject.task.forEach(task => {
    if (task._id === this.taskOnEditId) {
      task.taskName = this.addTaskForm.value.taskName;
      task.assignedTeam = this.addTaskForm.value.assignedTeam;
      task.assignedUser = this.addTaskForm.value.assignedUser;
      task.taskStatus = this.addTaskForm.value.taskStatus;
      task.taskDuration = this.addTaskForm.value.taskDuration;
      task.taskStartDate = this.addTaskForm.value.taskStartDate;
      task.taskEndDate = this.addTaskForm.value.taskEndDate;
    }
  });

  let dataToBeUpdated = this.OpennedProject.task.filter(t => {
    t.taskStartDate = new Date(t.taskStartDate.year, t.taskStartDate.month - 1, t.taskStartDate.day + 1);
    t.taskEndDate = new Date(t.taskEndDate.year, t.taskEndDate.month - 1, t.taskEndDate.day + 1);

    return true;
  }).map(e => e);

  this.salesService.updateOppProject(localStorage.getItem('salesEditItemId'), {task: dataToBeUpdated}).subscribe(
    data => {
      this.setData(data).then(() => {
        this.convertDatesToNgbDates(data).then(() => {
          this.taskOnEditId = '';
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Task Updated', 'Success');
        });
      });
    },
    error => {
      this.ImprintLoader = false;
      this.taskOnEditId = '';
      this.notifyService.showError('Could Not Update Task', 'Error !!');
    }
  );

}



removeProjectTask(i) {
  this.ImprintLoader = true;
  this.OpennedProject.task.splice(i, 1);

  let dataToBeUpdated = this.OpennedProject.task.filter(t => {
    t.taskStartDate = new Date(t.taskStartDate.year, t.taskStartDate.month - 1, t.taskStartDate.day + 1);
    t.taskEndDate = new Date(t.taskEndDate.year, t.taskEndDate.month - 1, t.taskEndDate.day + 1);
    return true;
  }).map(e => e);

  this.salesService.updateOppProject(window.localStorage.getItem('salesEditItemId'), {task: dataToBeUpdated}).subscribe(
    data => {
      this.setData(data).then(() => {
        this.convertDatesToNgbDates(data).then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Task Deleted', 'Success');
        });
      });
    },
    error => {
      this.ImprintLoader = false;
      this.notifyService.showError('Could Not Delete Task', 'Failed !!');
    }
  );
}







// // Loanchproject
// lauchProject() {
//   this.ImprintLoader = true;
//   this.salesService.getOppProject(localStorage.getItem('salesEditItemId')).subscribe(
//     data => {

//       let newProject = {
//         companyId: localStorage.getItem('loggedCompanyId'),
//         clientName : data.clientName,
//         projectName: data.projectName,
//         projectManager: data.projectManager,
//         task: [] as any,
//         revenue: data.revenue,
//         priority: data.priority,
//         projectStatus : 'active',
//         progress: 0,
//         projectDuration: data.projectDuration,
//         projectStartDate: data.projectStartDate,
//         projectEndDate: data.projectEndDate,
//         createdOn: new Date(),
//       };


//       // create Projects
//       this.projectService.addProject(newProject).subscribe(
//         dataAddProj => {
//             this.ImprintLoader = false;
//             this.notifyService.showSuccess('Projects Launched', 'Success');
//             setTimeout(() => {
//                   this.router.navigate(['home/projects']);
//                 }, 3000);

//         },
//         error => {
//           this.ImprintLoader = false;
//           this.notifyService.showError('Projects Did not Launch', 'Failed');
//         }
//       );

//     },
//     error => {
//       this.ImprintLoader = false;
//       this.notifyService.showError('Projects Did not Launch', 'Failed');
//     }
//   );



// }


deleteProject() {

  this.deleteModal.show();

}




submitDeleted() {
  this.ImprintLoader = true;
  let clientChecked = this.OpennedProject.clientName;
  this.salesService.deleteOppProject(window.localStorage.getItem('salesEditItemId')).subscribe(
    data => {
      this.cleanUpTheClient(clientChecked);

    },
    error => {
      this.notifyService.showError('Projects Not Deleted', 'Failled');
    }

  );

}

cleanUpTheClient(clientChecked) {

  this.salesService.getAllOppProject().subscribe(
    data => {
      let notThere = true;
      data.forEach((opp) => {
        if (opp.clientName === clientChecked) { notThere = false; }
      });
      if (notThere) {
        this.clientService.getAllClients().subscribe(
          cliData => {
            cliData.forEach((cli) => {
              if (cli.companyName === clientChecked ) {
                this.clientService.deleteClient(cli._id).subscribe(
                  resData => {
                    this.ImprintLoader = false;
                    this.notifyService.showSuccess('Projects Deleted', 'Success');
                    this.notifyService.showInfo('Client Removed From Your Database', 'Info');
                    setTimeout(() => {
                      this.router.navigate(['home/sales']);
                    }, 2000);
                  },
                  error => {
                    console.log('Error');
                  }
                );
              }
            });
          },
          error => {console.log('Error'); }
        );
      }
      if (!notThere) {
        this.notifyService.showSuccess('Projects Deleted', 'Success');
        this.ImprintLoader = false;
        setTimeout(() => {
                this.router.navigate(['home/sales']);
          }, 2000);
      }
    }
  );

}










ngOnDestroy() {
  window.localStorage.removeItem('salesEditItemId');
}



// === end ===
}
