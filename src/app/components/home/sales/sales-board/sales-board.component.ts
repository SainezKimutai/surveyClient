import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from 'src/app/shared/services/sales.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SalesCategoryService } from 'src/app/shared/services/sales-category.service';
import { faLayerGroup, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import { ClientService } from 'src/app/shared/services/client.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { SalesNoteService } from 'src/app/shared/services/sales-note.service';
import { SalesSentEmailService } from 'src/app/shared/services/sales-sent-email.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HomeComponent } from 'src/app/components/home/home.component';





@Component({
  selector: 'app-sales-board',
  templateUrl: './sales-board.component.html',
  styleUrls: ['./sales-board.component.sass']
})
export class SalesBoardComponent implements OnInit, OnDestroy {

  // Constructor
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private homeComponent: HomeComponent,
    private salesService: SalesService,
    private userService: UserService,
    private notifyService: NotificationService,
    private salesCategoryService: SalesCategoryService,
    private salesNoteService: SalesNoteService,
    private salesSentEmailService: SalesSentEmailService,
    private clientService: ClientService,
    public sanitize: DomSanitizer,
    public companyProfileService: CompanyProfileService
  ) { }
// tslint:disable: prefer-const
// tslint:disable: object-literal-shorthand
// tslint:disable: max-line-length


  // Modal
  @ViewChild('addNewOppModal', {static: true}) public addNewOppModal: ModalDirective;
  @ViewChild('mailToClientModal', {static: true}) public mailToClientModal: ModalDirective;
  @ViewChild('writeNoteModal', {static: true}) public writeNoteModal: ModalDirective;
  @ViewChild('detailNoteModal', {static: true}) public detailNoteModal: ModalDirective;
  @ViewChild('detailSentEmailModal', {static: true}) public detailSentEmailModal: ModalDirective;
  @ViewChild('listNoteModal', {static: true}) public listNoteModal: ModalDirective;
  @ViewChild('listSentEmailModal', {static: true}) public listSentEmailModal: ModalDirective;


  // Variables
  @ViewChild('myNewOppForm', {static: true}) myNewOppFormValues;
  @ViewChild('clientInput', {static: true}) clientInput: ElementRef;

  public ImprintLoader = true;
  public toCustomer = false;

  public newOppForm: FormGroup;
  public newStageForm: FormGroup;
  public changeStageNameForm: FormGroup;
  public managerNameForm: FormGroup;
  public phoneForm: FormGroup;
  public altPhoneForm: FormGroup;
  public emailForm: FormGroup;
  public websiteForm: FormGroup;
  public sendMailForm: FormGroup;
  public writeNoteForm: FormGroup;

  @Input() listIndex: number;
  @Input() cardIndex: number;


  // Icons
  public faLayerGroup = faLayerGroup;
  public faPowerOff = faPowerOff;

  // Status
  public FormStatus: boolean;
  public salesCatHoveredOnDrag: any;
  public cardHoveredOnDrag: any;
  public cardBeingDraged: any;

  // --
  public salesMenuActionStatus = true;
  public listSectionStatus;
  public reportSectionStatus;
  public managerNameInput;
  public phoneInput;
  public altPhoneInput;
  public emailInput;
  public websiteInput;

  public projPriority: number;


  // Binded Variables
  public Teams = [];
  public SalesCategorys: any = [];
  public MySalesCategorys: any = [];
  public Opportunitys: any = [];
  public MyOpportunitys: any = [];
  public OpportunitysToDisplay: any = [];
  public SalesCategorysToDisplay: any = [];
  public genaralPipelineActive;
  public pipelineAction;
  public myPipelineActive;
  public Projects: any = [];
  public Events: any = [];
  public OurClientNames: any = [];
  public ProjectStatusToNewOpp: string;
  public idStageToBeEdited: any;
  public Tasks: any = [];
  public SalesNotes: any = [];
  public Users: any = [];
  public SentEmails: any = [];

  public AllCompanies = [];

  public ClientOppened: any = [];
  public mailData: any = [];
  public myInterval: any;
  public myUpdateInterval: any;
  public kanbanSectionStatus: boolean;
  public noteWriten: any;
  public noteOpened: any;
  public sentEmailOpened: any;
  public files;



  public SearchByClientStatus = true;
  public SearchByServiceStatus = false;
  public FilterName;

  public SalesPiplineFullyUpdate = false;
  public SalesPiplineFullySwitched = false;



  public ActiveCompanyId = '';
  public NoCompanies = false;
  public CompanyHaveNotUsedCrm = false;







  ngOnInit() {
    this.ImprintLoader = true;
    if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
      this.toCustomer = true;
      this.salesCategoryService.getAllSalesCategories().subscribe( data => {

        if (data.length === 0 ) { this.router.navigate(['/home/crm/crm_config/']); }
        this.SalesCategorys = data;
        this.salesService.getAllOppProject().subscribe( dataOpps => {
          this.Opportunitys = dataOpps.reverse();
          this.renderBeforeOtherFunctions();
        } );
        });

    } else {

        this.companyProfileService.getAllCompaniesByInstitutionId().subscribe( dataCompanies => {
          this.AllCompanies = dataCompanies;
          if (this.AllCompanies.length === 0) {
            this.ImprintLoader = false;
            this.NoCompanies = true;
            this.notifyService.showInfo('You have no companies within the system', 'No Companies');
          } else {
            this.ActiveCompanyId = this.AllCompanies[0]._id;
            this.salesCategoryService.getAllSalesCategoriesByCompany(this.ActiveCompanyId).subscribe( data => {
              this.SalesCategorys = data;
              if (this.SalesCategorys.length === 0) { this.CompanyHaveNotUsedCrm = true; }
              this.pipelineAction = 'Gen';
              this.salesService.getAllOppProjectByCompany(this.ActiveCompanyId).subscribe( dataOpps => {
                this.Opportunitys = dataOpps.reverse();
                this.renderBeforeOtherFunctions();
              } );
              });
          }


        }, error => console.log('cannot get Companies')
        );


    }

    // setTimeout(() => {
    //   this.ImprintLoader = true;
    // }, 5);

    sessionStorage.setItem('ActiveNav', 'sales');


    this.userService.getAllUsers().subscribe(
      data => {
        this.Users = data;
        this.Users = this.Users.filter((user) => {
          for (let team of this.Teams) {
            if (user.department === team._id) {
              user.departmentName = team.name;
            }
          }
          return true;
        });
      },
      error => {
        console.log('Error In getting all Users');
      }
    ); // get all users

    // this.calendarEventService.getAllCalendarEvent().subscribe(
    //   data => {
    //     this.Events = data;
    //   },
    //   error => { console.log('cannot get all calendar events on init'); }
    // ); // getAllCalendarEvent

    this.salesNoteService.getAllNotes().subscribe(
      noteData => {
        noteData.forEach((note) => {
          this.Opportunitys.forEach((opp) => {
            if ( note.projectId === opp._id ) {
            note = {...note, noteProjectName: `${opp.clientName} - ${opp.projectName}`};

            if ( sessionStorage.getItem('permissionStatus') === 'isAdmin') {
              this.Users.forEach((user) => {
                if ( note.createdBy === user.email) {
                  note = {...note, createdByUsername: user.name};
                  this.SalesNotes.unshift(note);
                }
              });
            }

            if ( sessionStorage.getItem('permissionStatus') !== 'isAdmin') {

              this.Users.forEach((user) => {
                if ( note.createdBy === user.email) {
                  if (user.role === 'admin') {
                    // Dont push
                  }
                  if (user.role !== 'admin') {
                    note = {...note, createdByUsername: user.name};
                    this.SalesNotes.unshift(note);
                  }
                }
              });
            }

            }
          });
        });
      },
      error => { console.log('cannot get calendar Sales Notes on init'); }
    ); // Get all Sales Note


    this.clientService.getAllClients().subscribe(
      data => {
        this.OurClientNames = data.filter(() => true).map((e) => e.companyName);
      },
      error => { console.log('Cannot get all clients'); }
    );

    this.salesSentEmailService.getAll().subscribe(
      data => {
        if ( sessionStorage.getItem('permissionStatus') === 'isAdmin') {
          this.SentEmails = data.reverse();
        }
        if ( sessionStorage.getItem('permissionStatus') !== 'isAdmin') {

          data.forEach((sentMail) => {
          this.Users.forEach((user) => {
            if (sentMail.sender === user.email) {
              if (user.role === 'admin') {
                // Dont push
              }
              if (user.role !== 'admin') {

                this.SentEmails.unshift(sentMail);
              }
            }
          });
        });
        }
      },
      error => { console.log('Cannot get all sent emails'); }
    );


    // Pass form values
    this.newOppForm = this.formBuilder.group({
      projectName: ['', Validators.required],
      clientName: ['', Validators.required],
      projectManager: [''],
      task: [],
      revenue: [null, Validators.required],
      priority: null,
      projectStatus: [''],
      projectDuration: null,
      projectStartDate: null,
      projectEndDate: null
    });

    this.changeStageNameForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.newStageForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.managerNameForm = this.formBuilder.group({
      managerName: ['', Validators.required]
    });

    this.phoneForm = this.formBuilder.group({
      primaryTelNumber: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.altPhoneForm = this.formBuilder.group({
      secondaryTelNumber: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.websiteForm = this.formBuilder.group({
      website: ['', Validators.required]
    });

    this.sendMailForm = this.formBuilder.group({
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.writeNoteForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      createdAt: [null],
      createdBy: [sessionStorage.getItem('loggedUserEmail')],

    });


    this.myInterval = setInterval(() => {
      this.eventReminder();
    }, 300000); // 5 minutes



    // setTimeout(() => {
    //   this.removePastEvent();
    // }, 10000);



  }// ngOnInit -end





  // conveniently get the values from the form fields
  get formNewOpp() { return this.newOppForm.controls; }
  get formChangeStageName() { return this.changeStageNameForm.controls; }
  get formNewStage() { return this.newStageForm.controls; }
  get formManagerName() { return this.managerNameForm.controls; }
  get formPhone() { return this.phoneForm.controls; }
  get formAltPhone() { return this.altPhoneForm.controls; }
  get formEmail() { return this.emailForm.controls; }
  get formWebsite() { return this.websiteForm.controls; }
  get formSendMail() { return this.sendMailForm.controls; }
  get formWriteNote() { return this.writeNoteForm.controls; }



























  renderBeforeOtherFunctions() {

    return new Promise((resolve, reject) => {

    this.MySalesCategorys = this.SalesCategorys.filter((category) => {
      let OppInThisCategory = this.Opportunitys.filter((opp) => {
        return opp.projectStatus === category._id && opp.createdBy === sessionStorage.getItem('loggedUserEmail') ? true : false;
      }).map((e) => e );

      category.totalLeads = OppInThisCategory.length;
      category.totalRevenue = OppInThisCategory.reduce( (previous, current) => previous + current.revenue, 0);

      return true;
    }).map((e) => e );
    this.switchPipeline();
    this.MyOpportunitys = this.Opportunitys.filter((e) => e.createdBy === sessionStorage.getItem('loggedUserEmail') ? true : false).map(r => r);

    if (this.toCustomer) {
      this.UpdateSalesCategories().then(() => {this.updatePage(); } );
    }
    if (!this.toCustomer) {
      this.UpdateSalesCategories2().then(() => { resolve(); } );
    }
   });
  }







 async updatePage() {

    if (this.toCustomer) {

    this.salesCategoryService.getAllSalesCategories().subscribe(
      data => {
        this.SalesCategorys = data;
      },
      error => {
        console.log('Cannot get Sales Categories');
      }
    ); // list sales Cat -end


    this.salesService.getAllOppProject().subscribe(
      data => {
        this.Opportunitys = data.reverse();
        this.MyOpportunitys = data.filter((e) => e.createdBy === sessionStorage.getItem('loggedUserEmail') ? true : false).map(r => r);
        this.SalesPiplineFullyUpdate = true;
        this.switchPipeline();
      },
      error => {
        console.log('Cannot get Opp projects');
      }
    ); // list opp Cat -end


    this.userService.getAllUsers().subscribe(
      data => {
        this.Users = data;
        this.Users = this.Users.filter((user) => {
          for (let team of this.Teams) {
            if (user.department === team._id) {
              user.departmentName = team.name;
            }
          }
          return true;
        });
      },
      error => {
        console.log('Error In getting Users');
      }
    ); // listUsers()

    // this.calendarEventService.getAllCalendarEvent().subscribe(
    //   data => {
    //     this.Events = data;
    //   },
    //   error => { console.log('cannot get calendar events on init'); }
    // ); // listCalendarEvent

    this.salesNoteService.getAllNotes().subscribe(
      noteData => {
        this.SalesNotes = [];
        noteData.forEach((note) => {
          this.Opportunitys.forEach((opp) => {
            if ( note.projectId === opp._id ) {
            note = {...note, noteProjectName: `${opp.clientName} - ${opp.projectName}`};

            if ( sessionStorage.getItem('permissionStatus') === 'isAdmin') {
              this.Users.forEach((user) => {
                if ( note.createdBy === user.email) {
                  note = {...note, createdByUsername: user.name};
                  this.SalesNotes.unshift(note);
                }
              });
            }

            if ( sessionStorage.getItem('permissionStatus') !== 'isAdmin') {

              this.Users.forEach((user) => {
                if ( note.createdBy === user.email) {
                  if (user.role === 'admin') {
                    // Dont push
                  }
                  if (user.role !== 'admin') {
                    note = {...note, createdByUsername: user.name};
                    this.SalesNotes.unshift(note);
                  }
                }
              });
            }

            }
          });
        });
      },
      error => { console.log('cannot get calendar Sales Notes on init'); }
    ); // list Sales Note

    this.clientService.getAllClients().subscribe(
      data => {
        this.OurClientNames = data.filter(() => true).map((e) => e.companyName);
      },
      error => { console.log('Cannot get all clients'); }
    );

    this.salesSentEmailService.getAll().subscribe(
      data => {
        if ( sessionStorage.getItem('permissionStatus') === 'isAdmin') {
          this.SentEmails = data.reverse();
        }
        if ( sessionStorage.getItem('permissionStatus') !== 'isAdmin') {

          data.forEach((sentMail) => {
          this.Users.forEach((user) => {
            if (sentMail.sender === user.email) {
              if (user.role === 'admin') {
                // Dont push
              }
              if (user.role !== 'admin') {

                this.SentEmails.unshift(sentMail);
              }
            }
          });
        });
        }
      },
      error => { console.log('Cannot get all sent emails'); }
    );

    } else {
      this.salesCategoryService.getAllSalesCategoriesByCompany(this.ActiveCompanyId).subscribe(
        data => {
          this.SalesCategorys = data;

        },
        error => {
          console.log('Cannot get Sales Categories');
        }
      ); // list sales Cat -end


      this.salesService.getAllOppProjectByCompany(this.ActiveCompanyId).subscribe(
        data => {
          this.Opportunitys = data.reverse();
          // this.MyOpportunitys = data.filter((e) => e.createdBy === sessionStorage.getItem('loggedUserEmail') ? true : false).map(r => r);
          this.SalesPiplineFullyUpdate = true;
          this.switchPipeline();
        },
        error => {
          console.log('Cannot get Opp projects');
        }
      ); // list opp Cat -end


    }

  } // update Page














  switchCompanyData() {
    this.salesCategoryService.getAllSalesCategoriesByCompany(this.ActiveCompanyId).subscribe( data => {
        this.SalesCategorys = data;
        if (this.SalesCategorys.length === 0) { this.CompanyHaveNotUsedCrm = true; } else { this.CompanyHaveNotUsedCrm = false; }
        this.salesService.getAllOppProjectByCompany(this.ActiveCompanyId).subscribe( dataOpps => {
          this.Opportunitys = dataOpps;
          this.renderBeforeOtherFunctions().then(() => {
            this.SalesPiplineFullyUpdate = true;
            this.switchPipelineToGen();
          });

        } );
    });
  }














  switchPipelineToGen() {
    this.ImprintLoader = true;
    this.pipelineAction = 'Gen';
    this.switchPipeline();
  }

  switchPipelineToMine() {
    this.ImprintLoader = true;
    this.pipelineAction = 'Mine';
    this.switchPipeline();
  }


  switchPipeline() {

      switch (this.pipelineAction) {
        case 'Gen': this.OpportunitysToDisplay = this.Opportunitys; this.SalesCategorysToDisplay = this.SalesCategorys; this.genaralPipelineActive = true;  this.myPipelineActive = false; this.ImprintLoader = false; break;
        case 'Mine': this.OpportunitysToDisplay = this.MyOpportunitys; this.SalesCategorysToDisplay = this.MySalesCategorys;  this.myPipelineActive = true;  this.genaralPipelineActive = false; this.ImprintLoader = false;  break;
        default: this.OpportunitysToDisplay = this.MyOpportunitys; this.SalesCategorysToDisplay = this.MySalesCategorys; this.myPipelineActive = true;  this.genaralPipelineActive = false; this.ImprintLoader = false; break;
      }
      if (this.SalesPiplineFullyUpdate) {this.SalesPiplineFullySwitched = true; }

  }


























  setClickedStage(clickedStage) {
    this.ProjectStatusToNewOpp = clickedStage;
  }













  UpdateSalesCategories() {
    return new Promise((resolve, reject) => {
    this.salesCategoryService.getAllSalesCategories().subscribe(
      dataCategoryArr => {

        this.salesService.getAllOppProject().subscribe(
          dataOppArr => {
                    this.Opportunitys = dataOppArr;
                    // tslint:disable-next-line: no-shadowed-variable
                    dataCategoryArr.forEach((category, ind, dataCategoryArr) => {

                      let OppInThisCategory = this.Opportunitys.filter((opp) => {
                        return opp.projectStatus === category._id ? true : false;
                      }).map((e) => e );

                      let dataToBeUpdated = {
                        totalLeads: OppInThisCategory.length,
                        totalRevenue: OppInThisCategory.reduce( (previous, current) => previous + current.revenue, 0)
                      };


                      this.salesCategoryService.updateSaleCategory(category._id, dataToBeUpdated).subscribe(
                        salesCatData => {
                          this.SalesCategorys = salesCatData;
                          if (Object.is(dataCategoryArr.length - 1, ind)) {
                            this.UpdateMyPipeLineSalesCategories().then(() => { resolve();  });
                          }
                        }
                      );

              });
          }
        );

      }
    );

  });

  }




  UpdateSalesCategories2() {
    return new Promise((resolve, reject) => {
    this.SalesCategorys.forEach((category, ind, dataCategoryArr) => {

        let OppInThisCategory = this.Opportunitys.filter((opp) => {
          return opp.projectStatus === category._id ? true : false;
        }).map((e) => e );

        category.totalLeads = OppInThisCategory.length,
        category.totalRevenue = OppInThisCategory.reduce( (previous, current) => previous + current.revenue, 0);
        if (ind === dataCategoryArr.length - 1) { resolve(); }

    });

  });

  }



  UpdateMyPipeLineSalesCategories() {

    return new Promise((resolve, reject) => {
    this.MySalesCategorys = this.SalesCategorys.filter((category) => {
      let OppInThisCategory = this.Opportunitys.filter((opp) => {
        return opp.projectStatus === category._id && opp.createdBy === sessionStorage.getItem('loggedUserEmail') ? true : false;
      }).map((e) => e );

      category.totalLeads = OppInThisCategory.length;
      category.totalRevenue = OppInThisCategory.reduce( (previous, current) => previous + current.revenue, 0);

      return true;
    }).map((e) => e );

    resolve();


    });

  }







  // Set priority
selectPriority(num) {
  this.projPriority = num;
}






  submitNewOppForm() {

    // Adding abjects to task array
    // this.Projects.forEach((proj) => {
    //   return proj.serviceName === this.newOppForm.value.projectName ?

    //     this.Tasks = proj.task.filter((a) => {
    //       a.assignedUser = '';
    //       a.taskStatus = 'unChecked';
    //       a.taskDuration = null;
    //       a.taskStartDate = null;
    //       a.taskEndDate = null;
    //       return true;
    //     }).map(a => a ) :

    //     '';

    // });

    let structuredData = {
      companyId:  this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
      projectName: this.newOppForm.value.projectName,
      clientName: this.newOppForm.value.clientName,
      projectManager: '',
      task: this.Tasks,
      revenue: this.newOppForm.value.revenue,
      priority: this.projPriority,
      projectStatus: this.ProjectStatusToNewOpp,
      projectDuration: null,
      projectStartDate: null,
      projectEndDate: null,
      createdBy: sessionStorage.getItem('loggedUserEmail'),
      createdOn: new Date()
    };
    this.ImprintLoader = true;
    this.salesService.addOppProject(structuredData).subscribe(
      data => {
        this.createNewClient(data);
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess(`Client ${data.clientName} has been added`, 'Success');
        this.FormStatus = !this.FormStatus;
        this.clientInput.nativeElement.value = '';


        this.UpdateSalesCategories();


      },
      error => { this.notifyService.showError(error, 'Failed...'); }
    );
  }






  clientAutoComplete = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.OurClientNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )




  createNewClient(client) {
    let newClient = {
      companyId:  this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
      companyName: client.clientName,
      managerName: '',
      primaryTelNumber: null,
      secondaryTelNumber: null,
      email: '',
      website: '',
      twitter: '',
      facebook: '',
      instagram: '',
      createdOn: new Date()
    };

    this.clientService.createClient(newClient).subscribe(

      data => {
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.ImprintLoader = false;
        this.notifyService.showSuccess(data.message, 'Success');
      },
      error => {
        this.notifyService.showWarning('Something is wrong, Client was not captured', 'Warning');
      }

    );

  }






  seeClient(client) {

    this.clientService.getOneByName(client).subscribe(
      data => {
        this.ClientOppened = data;
      }
    );
  }


  saveManagerName() {
    this.clientService.updateClient(this.ClientOppened._id, this.managerNameForm.value).subscribe(
      data => {
        this.ClientOppened = data;
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Changes Saved', 'Success');
      },
      error => {
        this.notifyService.showError('Not Saved', 'Error');
      }
    );
  }

  savePhoneNumber() {
    this.clientService.updateClient(this.ClientOppened._id, this.phoneForm.value).subscribe(
      data => {
        this.ClientOppened = data;
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Changes Saved', 'Success');
      },
      error => {
        this.notifyService.showError('Not Saved', 'Error');
      }
    );
  }


  saveAlternativePhoneNumber() {
    this.clientService.updateClient(this.ClientOppened._id, this.altPhoneForm.value).subscribe(
      data => {
        this.ClientOppened = data;
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Changes Saved', 'Success');
      },
      error => {
        this.notifyService.showError('Not Saved', 'Error');
      }
    );
  }

  saveEmail() {
    this.clientService.updateClient(this.ClientOppened._id, this.emailForm.value).subscribe(
      data => {
        this.ClientOppened = data;
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Changes Saved', 'Success');
      },
      error => {
        this.notifyService.showError('Not Saved', 'Error');
      }
    );
  }

  saveWebsite() {
    this.clientService.updateClient(this.ClientOppened._id, this.websiteForm.value).subscribe(
      data => {
        this.ClientOppened = data;
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Changes Saved', 'Success');
      },
      error => {
        this.notifyService.showError('Not Saved', 'Error');
      }
    );
  }


  openEmailModal() {
    this.listSentEmailModal.show();
  }



  mailFunction(client) {

    this.ImprintLoader = true;
    this.clientService.getAllClients().subscribe(
      clientData => {

        for ( let cliData of clientData ) {
            if (cliData.companyName === client) {

              if (cliData.email === '') {
                // this.mailToClientModal.hide();
                this.ImprintLoader = false;
                this.notifyService.showWarning('Client has no mail', 'Warning!');
                setTimeout(() => {
                  this.notifyService.showInfo('You might want to assign an email', 'Info...');
                }, 3000);
              } else {
                // let to = clientData.email;
                // window.location.href = "mailto:?to="+to;
                this.ImprintLoader = false;
                this.mailToClientModal.show();
                this.mailData = {
                  sender: sessionStorage.getItem('loggedUserEmail'),
                  reciever: cliData.email,
                  client: cliData.companyName
                };
              }


              break;
            }
        }


      }
    );
  }


  sendMailToClient() {
    this.ImprintLoader = true;
    let dataToBeSent = {
      companyId: this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
      sender: this.mailData.sender,
      reciever: this.mailData.reciever,
      subject: this.sendMailForm.value.subject,
      message: this.sendMailForm.value.message
    };

    this.clientService.sendMail(dataToBeSent).subscribe(
      data => {
        this.saveSentEmail(dataToBeSent);
      },
      error => {
        this.ImprintLoader = false;
        this.notifyService.showError('Mail not sent', 'Error');
      }
    );

  }


  saveSentEmail(dataToBeSent) {
    dataToBeSent = {...dataToBeSent, sentOn: new Date()};


    this.salesSentEmailService.createEmail(dataToBeSent).subscribe(
      data => {
        this.ImprintLoader = false;
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Mail Sent', 'Success');
        this.mailToClientModal.hide();
      },
      error => {
        console.log('Error saving email');
      }
    );
  }



  openSentEmail(id) {
    this.SentEmails.forEach((SentEmailData) => {
      if (SentEmailData._id === id) {
        this.sentEmailOpened = SentEmailData;
        this.detailSentEmailModal.show();
      }
    });
  }

  deleteSentMail(id) {
    this.salesSentEmailService.deleteEmail(id).subscribe(
      data => {
        this.detailSentEmailModal.hide();
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Email Deleted', 'Success');
      },
      error => {
        this.notifyService.showError('could not delete email', 'Failed');
      }
    );

  }


  phoneCall() {
    this.ImprintLoader = true;
    setTimeout(() => {
    this.notifyService.showSuccess(`it's coming soon.`, 'And');
    this.notifyService.showInfo('a phone calling function', 'Is');
    this.notifyService.showWarning('function icon you just clicked', 'That');
    this.ImprintLoader = false;
    }, 3000);
  }




  toScheduleActivity(id) {
    sessionStorage.setItem('eventProjectId', id);
    this.router.navigate(['home/ngCalendar']);
  }






  clearNewClientForm() {
    this.clientInput.nativeElement.value = '';
    this.FormStatus = !this.FormStatus;
  }


  toSalesEdit(id) {
    this.router.navigate(['home/crm/crm_edit']);
    window.sessionStorage.setItem('salesEditItemId', id);

  }

  // Drag and Drop Functions
  highlightcategory(e) {
    if (this.toCustomer) {
    this.salesCatHoveredOnDrag = e.target.id;
    }
  }


  allowDrop(e) {
    e.preventDefault();
  }


  drag(e) {
    if (this.toCustomer) {
    e.dataTransfer.setData('text', e.target.id);
    this.cardBeingDraged = e.target.id;
    }
  }


  dragenter(e) {
    if (this.toCustomer) {
    this.cardHoveredOnDrag = e.target.id;
    }
  }


  dragleave(e) {
    // this.cardHoveredOnDrag = null;
  }


  drop(e) {
    if (this.toCustomer) {
    e.preventDefault();
    this.cardHoveredOnDrag = null;
    this.salesCatHoveredOnDrag = null;
    let CardId = e.dataTransfer.getData('text');
    let TargetId = e.target.id;

    this.SalesCategorys.forEach((stage) => {
      return stage._id === TargetId ? (this.ImprintLoader = true, this.switchStage(CardId, stage)) : '';
    });
  }
  }



  switchStage(CardId, data) {
    this.Opportunitys.forEach(opp => {
      if (opp._id === CardId) {

        if (opp.projectStatus !== data._id) {

          let updateData = {
            projectStatus: data._id
          };

          // Update
          this.salesService.updateOppProject(CardId, updateData).subscribe(
            updatedOppdata => {


              this.cardBeingDraged = null;


              this.UpdateSalesCategories().then(() => {  this.updatePage(); });

              this.notifyService.showSuccess('Card Moved', 'Success');

            },
            error => {
              this.cardBeingDraged = null;
              this.notifyService.showError('Card did not move', 'Error !');
            }
          );

        }

      }

    });

  }











  setSearchStatus(param) {
    return param === 'cli' ? (this.SearchByClientStatus = true, this.SearchByServiceStatus = false) :
                              (this.SearchByClientStatus = false, this.SearchByServiceStatus = true);
  }


  filterProducts() {
    switch (this.pipelineAction) {
      case 'Gen': this.filterAllProducts(); break;
      case 'Mine': this.filterMyProducts(); break;
      default: break;
    }

  }


  filterMyProducts() {
    if ( this.SearchByClientStatus === true ) {
      if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
        this.OpportunitysToDisplay = this.MyOpportunitys;
        } else {
          this.OpportunitysToDisplay = this.MyOpportunitys.filter(v => v.clientName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
        }
    } else {
      if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
        this.OpportunitysToDisplay = this.MyOpportunitys;
        } else {
          this.OpportunitysToDisplay = this.MyOpportunitys.filter(v => v.projectName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
        }
    }
  }

  filterAllProducts() {
    if ( this.SearchByClientStatus === true ) {
      if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
        this.OpportunitysToDisplay = this.Opportunitys;
        } else {
          this.OpportunitysToDisplay = this.Opportunitys.filter(v => v.clientName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
        }
    } else {
      if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
        this.OpportunitysToDisplay = this.Opportunitys;
        } else {
          this.OpportunitysToDisplay = this.Opportunitys.filter(v => v.projectName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
        }
    }
  }



  async eventReminder() {

    this.ImprintLoader = true;
    let noFutureEvents = true;
    this.Events.forEach((eventElement, index) => {

      setTimeout(() => {

        this.Opportunitys.forEach((oppElement) => {

          if (eventElement.projectId === oppElement._id) {

            let now = new Date();
            let then = new Date(eventElement.start);

            let diffInMS = (then.getTime() - now.getTime());

            let diffInHours = Math.ceil(diffInMS / (1000 * 3600));

            if (diffInHours === 1) {
              this.ImprintLoader = false;
              this.notifyService.showWarning(eventElement.title + ' : ' + oppElement.clientName, 'This Hour Event');
              noFutureEvents = false;
            }

            if (diffInHours === 2) {
              this.ImprintLoader = false;
              this.notifyService.showWarning(eventElement.title + ' : ' + oppElement.clientName, 'Next Hour Event');
              noFutureEvents = false;
            }

            if (diffInHours === 3) {
              this.ImprintLoader = false;
              this.notifyService.showWarning(eventElement.title + ' : ' + oppElement.clientName, '3 Hours To Event');
              noFutureEvents = false;
            }

            if (19 > diffInHours && diffInHours > 3) {
              this.ImprintLoader = false;
              this.notifyService.showInfo(eventElement.title + ' : ' + oppElement.clientName, 'Up coming Event');
              noFutureEvents = false;
            }
            if (41 > diffInHours && diffInHours > 18) {
              this.ImprintLoader = false;
              this.notifyService.showInfo(eventElement.title + ' : ' + oppElement.clientName, '1 Day To Event');
              noFutureEvents = false;
            }
            if (diffInHours > 40) {
              this.ImprintLoader = false;
              this.notifyService.showInfo(eventElement.title + ' : ' + oppElement.clientName, 'Future Event');
              noFutureEvents = false;
            }
          }

        });

      }, 6000 * index);

    });


    if ( this.Events.length > 0) {
    setTimeout(() => {
        if (noFutureEvents) {
          this.ImprintLoader = false;
          this.notifyService.showInfo('None of your clients have a scheduled activity on the calendar', 'No Events');
        }
      }, 7000 * this.Events.length);
    }
    if ( this.Events.length === 0) {
      this.ImprintLoader = false;
      this.notifyService.showInfo('None of your clients have a scheduled activity on the calendar', 'No Events');
    }
  }


  writeAnote(id, name) {
    this.noteWriten = {
      id : id,
      name: name
    };
    this.writeNoteModal.show();

  }




  submitNote() {
    let dataToBeSent = {
      companyId:  this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
      title: this.writeNoteForm.value.title,
      content: this.writeNoteForm.value.content,
      projectId: this.noteWriten.id,
      createdAt: new Date(),
      createdBy: this.writeNoteForm.value.createdBy,
    };

    this.salesNoteService.createNote(dataToBeSent).subscribe(
      data => {
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Note Saved', 'Success');
        this.writeNoteModal.hide();
      },
      error => {
        this.notifyService.showError('Did Not Save', 'Error');
      }
    );
  }

  openNote(id) {
    this.SalesNotes.forEach((noteData) => {
      if (noteData._id === id) {
        this.noteOpened = noteData;
        this.detailNoteModal.show();
      }
    });
  }


  deleteNote(id) {
    this.salesNoteService.deleteNote(id).subscribe(
      data => {
        this.detailNoteModal.hide();
        this.UpdateSalesCategories().then(() => this.updatePage());
        this.notifyService.showSuccess('Note Deleted', 'Success');
      },
      error => {
        this.notifyService.showError('No changed', 'error');
      }
    );

  }


  openNoteModal() {
    this.listNoteModal.show();
  }



  openActivity(id, ttl) {
    sessionStorage.setItem('eventProjectId', id);
    sessionStorage.setItem('eventProjectTitle', ttl);
    this.router.navigate(['home/ngCalendar']);
  }


  // removePastEvent() {

  //   this.Events.forEach(eventElement => {
  //     let now = new Date();
  //     let then = new Date(eventElement.end);

  //     let diffInMS = (now.getTime() - then.getTime());

  //     let diffInHours = Math.ceil(diffInMS / (1000 * 3600));

  //     if (diffInHours > 24) {
  //       this.deleteEvent(eventElement);
  //     }

  //   });

  // }

  // deleteEvent(eventToDelete) {
  //   this.Events = this.Events.filter(event => event !== eventToDelete);
  //   this.calendarEventService.deleteCalendarEvent(eventToDelete._id).subscribe(
  //     data => {},
  //     error => {}
  //   );
  // }




  logOut() {
    this.homeComponent.logout();
  }




  ngOnDestroy() {
    clearInterval(this.myInterval);
    clearInterval(this.myUpdateInterval);
  }





}// Class -end
