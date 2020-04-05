import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faBuilding, faFire, faComment, faEnvelope, faKey , faGlobe , faAddressBook,
  faEdit, faCheck, faListAlt, faBookReader, faTrash, faChartLine, faChartBar, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { CompanyProfileService } from 'src/app/shared/services/companyProfile.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { FileUploadService } from 'src/app/shared/services/fileUpload.service';
import { dev } from 'src/app/shared/dev/dev';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
 // tslint:disable: max-line-length
// tslint:disable: prefer-const

  constructor(
    private notifyService: NotificationService,
    private userService: UserService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private companyProfileService: CompanyProfileService,
    private responseService: ResponseService,
    private fileUploadServcie: FileUploadService,
    private threatService: ThreatService,
    private threatCategoryService: ThreatCategoryService

  ) { }
  @ViewChild('viewAnswersModal', {static: true, }) viewAnswersModal: ModalDirective;
  @ViewChild('departmentModal', {static: true}) departmentModal: ModalDirective;
  @ViewChild('departmentFormModal', {static: true}) departmentFormModal: ModalDirective;



  public ImprintLoader = false;


  // icon
    public faEnvelope = faEnvelope;
    public faKey = faKey;
    public faGlobe = faGlobe;
    public faAddressBook = faAddressBook;
    public faEdit = faEdit;
    public faCheck = faCheck;
    public faBuilding = faBuilding;
    public faFire = faFire;
    public faComment = faComment;
    public faListAlt = faListAlt;
    public faBookReader = faBookReader;
    public faTrash = faTrash;
    // Icons
    public faChartLine = faChartLine;
    public faChartBar = faChartBar;
    public faChartPie = faChartPie;

    public AllUsers = [];
    public AllCompanies = [];
    public AllSurveys = [];
    public AllQuestions = [];
    public AllResponses = [];
    public AllThreats = [];
    public AllThreatCategorys = [];

    public riskIssueArray = [];
    public riskIssueArrayUnsorted = [];

    public loggedUserEmail = '';
    public myCompany;


    public companyNameInputStatus = false;
    public companyNameInput = '';
    public companyAboutInputStatus = false;
    public companyAboutInput = '';
    public companyEmailInputStatus = false;
    public companyEmailInput = '';
    public companyWebsiteInputStatus = false;
    public companyWebsiteInput = '';
    public companyAddressInputStatus = false;
    public companyAddressInput = '';
    public userPasswordInputStatus = false;
    public userPasswordInput = '';
    public previewCompLogo = null;
    public myCompLogo;



    public QuestionsOnView = [];
    public companyNameOnView = '';
    public surveyNameOnView = '';

    public CompanyRiskRates = [];




    public editProfileSwitch = false;
    public editDepartmentSwitch = false;
    public departmentInput = '';
    public departmentInputId = '';





    // chart
    public chart1Type;
    public chart1Labels;
    public chart1Datasets;
    public chart1ChartOptions;
    public chart1BgColors = [];
    public chart2Labels;
    public chart2Type;
    public chart2Datasets;
    public chart2ChartOptions;
    public chart2BgColors = [];
    public chart3Labels;
    public chart3Type;
    public chart3Datasets;
    public chart3ChartOptions;
    public chart3BgColors = [];

    public innerWidth: any;
















  ngOnInit() {
    localStorage.setItem('ActiveNav', 'profile');
    this.loggedUserEmail = localStorage.getItem('loggedUserEmail');

    this.updatePage().then(() => {this.computeCompanyRiskRates();  this.riskIssuesFunction(); });

  }



















  async updatePage() {
    return new Promise((resolve, reject) => {
    this.userService.getAllUsers().subscribe(
      dataUser => {
        this.AllUsers = dataUser;

        this.companyProfileService.getAllCompanyProfiles().subscribe(
          dataComp => {
            this.AllCompanies = dataComp;
            for (const comp of this.AllCompanies) { if (comp._id === localStorage.getItem('loggedCompanyId')) { this.myCompany = comp; break; }}

            this.surveyService.getAllSurveys().subscribe(
              dataSurvey => {
                this.AllSurveys = dataSurvey;

                this.questionService.getAllQuestions().subscribe(
                  dataQuiz => {
                    this.AllQuestions = dataQuiz;

                    this.threatService.getAllThreats().subscribe(
                      dataTrt => {
                      this.AllThreats = dataTrt;

                      this.threatCategoryService.getAllThreatCategorys().subscribe(
                        dataTrtCat => {
                          this.AllThreatCategorys = dataTrtCat;

                          this.responseService.getUsersResponses(localStorage.getItem('loggedUserID')).subscribe(
                            data => {this.AllResponses = data; resolve(); },
                            error => console.log('Error geting all Responses')
                          );

                        },
                        error => console.log('Error geting all threats')
                      );
                    },
                      error => console.log('Error geting all threats')
                    );
                  },
                  error => console.log('Error geting all Questions')
                );

              },
              error => console.log('Error geting all Surveys')
            );

          },
          error => console.log('Error geting all Companies')
        );

      },
      error => console.log('Error geting all Users')
    );


  });
  }



  changeCompanyName() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyName: this.companyNameInput}).subscribe(
      data => {
        this.updatePage();
        this.companyNameInput = '';
        this.companyNameInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }

  changeCompanyAbout() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyAbout: this.companyAboutInput}).subscribe(
      data => {
        this.updatePage();
        this.companyAboutInput = '';
        this.companyAboutInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }


  uploadLogo(fileInputOne) {
    this.myCompLogo =  fileInputOne.target.files[0] as File;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.previewCompLogo = fileReader.result;
    },
    fileReader.readAsDataURL(this.myCompLogo);
  }

  saveCompanyProfile() {
    // tslint:disable-next-line: new-parens
    this.ImprintLoader = true;
    const formData = new FormData;
    formData.append('fileUploaded', this.myCompLogo, this.myCompLogo.name);

    this.fileUploadServcie.uploadCompanyLogo(formData).subscribe(
      data => {
        const logoData = {
          url: `${dev.connect}static/images/companyProfileImages/${data.imageName}`,
          name: data.imageName
        };
        this.ImprintLoader = false;
        if (this.myCompany.logo.url !== '' ) { this.removeLogo(this.myCompany.logo.name ); }

        this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {logo: logoData}).subscribe(
          dataU => {
            this.updatePage();
            this.previewCompLogo = null;
            this.notifyService.showSuccess('Saved', 'Success');
            this.ImprintLoader = false;
          },
          error => {this.notifyService.showError('Could not save', 'Failed'); this.ImprintLoader = false;}
        );



      },
      error => {
        this.notifyService.showError('Could not upload Picture', 'Failed');
        this.ImprintLoader = false;
      }
    );

  }


  removeLogo(name) {
    this.fileUploadServcie.removeCompanyLogo(name).subscribe(data => '', error => 'Erro deleting log');
  }

  changeCompanyEmail() {

    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyEmail: this.companyEmailInput}).subscribe(
      data => {
        this.updatePage();
        this.companyEmailInput = '';
        this.companyEmailInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }



  changeCompanyWebsite() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyWebsite: this.companyWebsiteInput}).subscribe(
      data => {
        this.updatePage();
        this.companyWebsiteInput = '';
        this.companyWebsiteInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }


  changeCompanyAddress() {
    this.companyProfileService.updateCompanyProfile( localStorage.getItem('loggedCompanyId'), {companyAddress: this.companyAddressInput}).subscribe(
      data => {
        this.updatePage();
        this.companyAddressInput = '';
        this.companyAddressInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
  }


  changeUserPasswordInput() {

    if ( this.userPasswordInput.toString().length < 4 ) {this.notifyService.showWarning('Should be more than 4 characters', 'Week Password'); } else {

    this.userService.updateUsers( localStorage.getItem('loggedUserID'), {password: this.userPasswordInput}).subscribe(
      data => {
        this.userPasswordInput = '';
        this.userPasswordInputStatus = false;
        this.notifyService.showSuccess('Saved', 'Success');
      },
      error => this.notifyService.showError('Could not save', 'Failed')
    );
    }
  }



  computeCompanyRiskRates() {

      this.AllResponses.forEach((resp) => {
        if (this.myCompany._id === resp.companyId) {

          for (const surv of this.AllSurveys) {
            if (resp.surveyId === surv._id) {

              const data = {
                companyId: this.myCompany._id,
                surveyId: surv._id,
                responseId: resp._id,
                companyName: this.myCompany.companyName,
                surveyName: surv.surveyName,
                riskRate: 'To be determined',
                recommendation: 'Awaiting...'
              };

              this.CompanyRiskRates.push(data);

            }
          }
        }
      });

  }






  openAnswersModal(companyName, surveyName, surveyId, responseId) {
    this.companyNameOnView = companyName;
    this.surveyNameOnView = surveyName;
    this.QuestionsOnView = [];

    for (const resp of this.AllResponses) {
     if ( resp._id === responseId) {

      resp.answers.forEach((ans) => {

        for (const quiz of this.AllQuestions) {
          if (ans.questionId === quiz._id) {
            const theQuestions = {
              question: quiz.question,
              answers: []
            };

            quiz.choices.forEach((myAns, key, arr) => {
              if (ans.answer.includes(myAns.answer)) {
                theQuestions.answers.push({picked: true, answer: myAns.answer });
                if (Object.is(arr.length - 1, key)) {
                  this.QuestionsOnView.push(theQuestions);
                }
              } else {
                theQuestions.answers.push({picked: false, answer: myAns.answer });
                if (Object.is(arr.length - 1, key)) {
                  this.QuestionsOnView.push(theQuestions);
                }
              }
            });

            // break;
          }
        }

      });
      // break;
     }
   }


    this.viewAnswersModal.show();
  }




  showDepartmentFormModal() {
    this.departmentInput = '';
    this.departmentInputId = '';
    this.departmentFormModal.show();
  }


  editProfile(item) {
    this.departmentInput = item.departmentName;
    this.departmentInputId = item._id;
    this.departmentFormModal.show();
  }





  saveDepartment() {
    if (this.myCompany.department) {

      if (this.departmentInputId === '') {
        this.myCompany.department.push({departmentName: this.departmentInput});

        this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: this.myCompany.department}).subscribe(
          data => {
            this.updatePage().then(() => {
              this.departmentInput = '';
              this.departmentInputId = '';
              this.notifyService.showSuccess('Department Created', 'Success');
              this.departmentFormModal.hide();
            });
          },
          error => this.notifyService.showError('Could not create department', 'Failed')
        );
      } else {
        for (const dept of this.myCompany.department) {
          if (dept._id === this.departmentInputId) {
            dept.departmentName = this.departmentInput;

            this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: this.myCompany.department}).subscribe(
              data => {
                this.updatePage().then(() => {
                  this.departmentInput = '';
                  this.departmentInputId = '';
                  this.notifyService.showSuccess('Department Created', 'Success');
                  this.departmentFormModal.hide();
                });
              },
              error => this.notifyService.showError('Could not create department', 'Failed')
            );
            break;
          }
        }


      }





    } else {
      const newDepartment = [{departmentName: this.departmentInput}];
      this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: newDepartment}).subscribe(
        data => {
          this.updatePage().then(() => {
            this.departmentInput = '';
            this.departmentInputId = '';
            this.notifyService.showSuccess('Department Created', 'Success');
            this.departmentFormModal.hide();
          });
        },
        error => this.notifyService.showError('Could not create department', 'Failed')
      );
    }



  }








  deleteDepartment(id) {

    const findUser = this.AllUsers.filter((user) => (user.departmentId === id && user.companyId === this.myCompany._id)).map(e => e);

    if (findUser.length > 0) {
      this.notifyService.showWarning('re assign user under this department', 'Department Has Users !!');
    }
    if (findUser.length === 0) {

      const filterDepartment = this.myCompany.department.filter((dept) => dept._id !== id).map(e => e);

      this.companyProfileService.updateCompanyProfile(this.myCompany._id, {department: filterDepartment}).subscribe(
        data => {
          this.updatePage().then(() => {
            this.departmentInput = '';
            this.departmentInputId = '';
            this.notifyService.showSuccess('Department deleted', 'Success');
            this.departmentFormModal.hide();
          });
        },
        error => this.notifyService.showError('Could not delete department', 'Failed')
      );
    }

  }

















  riskIssuesFunction() {

    this.AllThreats.forEach((threat) => {


      for (let trtCategory of this.AllThreatCategorys) {

        if (trtCategory._id === threat.category) {

            for (let response of this.AllResponses) {

              if (response.companyId === this.myCompany._id) {

                for (let survey of this.AllSurveys) {

                  if ((survey._id === response.surveyId)) {

                      response.answers.forEach( (respAns, idx2, array2) => {
                        if (respAns.answer[0].threatId === threat._id) {
                          let myRiskIssueObject = {
                            risk: threat.name,
                            riskCategory: trtCategory.threatCategoryName,
                            level: respAns.answer[0].level,
                            recom: respAns.answer[0].recom,
                            surveyName: survey.surveyName

                          };

                          this.riskIssueArrayUnsorted.push(myRiskIssueObject);
                          this.riskIssueArray = this.riskIssueArrayUnsorted.sort((a, b) => a.risk.localeCompare(b.risk));
                          this.chartSectionGraphsFunction();
                        }

                      });


                  }
                }


              }
            }

        }
      }

    });


  }














  chart1graphToLine() {
    this.chart1Type = 'line';
    this.chart1ChartOptions.legend.display = false;
    this.chart1ChartOptions.scales.xAxes[0].display = true;
    this.chart1Datasets[0].backgroundColor = 'whitesmoke';
    this.chart1Datasets[0].borderColor = 'gray';
    this.chart1Datasets[0].pointBorderColor = 'black';
  }
  chart1graphToBar() {
    this.chart1Type = 'bar';
    this.chart1ChartOptions.legend.display = false;
    this.chart1ChartOptions.scales.xAxes[0].display = true;
    this.chart1Datasets[0].backgroundColor = this.chart1BgColors;
    this.chart1Datasets[0].borderColor = 'white';
    this.chart1Datasets[0].pointBorderColor = 'white';
  }
  chart1graphToPie() {
    this.chart1Type = 'pie';
    this.chart1ChartOptions.legend.display = true;
    this.chart1ChartOptions.scales.xAxes[0].display = false;
    this.chart1Datasets[0].backgroundColor = this.chart1BgColors;
    this.chart1Datasets[0].borderColor = 'white';
    this.chart1Datasets[0].pointBorderColor = 'white';
  }

  chart2graphToLine() {
    this.chart2Type = 'line';
    this.chart2ChartOptions.legend.display = false;
    this.chart2ChartOptions.scales.xAxes[0].display = true;
    this.chart2Datasets[0].backgroundColor = 'whitesmoke';
    this.chart2Datasets[0].borderColor = 'gray';
    this.chart2Datasets[0].pointBorderColor = 'black';
  }
  chart2graphToBar() {
    this.chart2Type = 'bar';
    this.chart2ChartOptions.legend.display = false;
    this.chart2ChartOptions.scales.xAxes[0].display = true;
    this.chart2Datasets[0].backgroundColor = this.chart2BgColors;
    this.chart2Datasets[0].borderColor = 'white';
    this.chart2Datasets[0].pointBorderColor = 'white';
  }
  chart2graphToPie() {
    this.chart2Type = 'pie';
    this.chart2ChartOptions.legend.display = true;
    this.chart2ChartOptions.scales.xAxes[0].display = false;
    this.chart2Datasets[0].backgroundColor = this.chart2BgColors;
    this.chart2Datasets[0].borderColor = 'white';
    this.chart2Datasets[0].pointBorderColor = 'white';
  }

  chart3graphToLine() {
    this.chart3Type = 'line';
    this.chart3ChartOptions.legend.display = false;
    this.chart3ChartOptions.scales.xAxes[0].display = true;
    this.chart3Datasets[0].backgroundColor = 'whitesmoke';
    this.chart3Datasets[0].borderColor = 'gray';
    this.chart3Datasets[0].pointBorderColor = 'black';
  }
  chart3graphToBar() {
    this.chart3Type = 'bar';
    this.chart3ChartOptions.legend.display = false;
    this.chart3ChartOptions.scales.xAxes[0].display = true;
    this.chart3Datasets[0].backgroundColor = this.chart3BgColors;
    this.chart3Datasets[0].borderColor = 'white';
    this.chart3Datasets[0].pointBorderColor = 'white';
  }
  chart3graphToPie() {
    this.chart3Type = 'pie';
    this.chart3ChartOptions.legend.display = true;
    this.chart3ChartOptions.scales.xAxes[0].display = false;
    this.chart3Datasets[0].backgroundColor = this.chart3BgColors;
    this.chart3Datasets[0].borderColor = 'white';
    this.chart3Datasets[0].pointBorderColor = 'white';
  }



  @HostListener('window:resize', []) onResize() {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 992) {
      this.chart1ChartOptions.legend.position = 'top';
      this.chart2ChartOptions.legend.position = 'top';
      this.chart3ChartOptions.legend.position = 'top';
    }

    if (this.innerWidth > 992) {
      this.chart1ChartOptions.legend.position = 'right';
      this.chart2ChartOptions.legend.position = 'right';
      this.chart3ChartOptions.legend.position = 'right';
    }


  }


  getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {color += letters[Math.floor(Math.random() * 16)]; }
    return color;
  }






  chartSectionGraphsFunction() {

    // on the left
    this.chart1Type = 'pie';

    let threatCatArray =  this.riskIssueArray.filter(() => true ).map(e => e.riskCategory);
    let newThreatCatArray = Array.from(new Set(threatCatArray));
    this.chart1Labels = newThreatCatArray;
    let mychart1Datasets = [];
    this.chart1BgColors = [];

    this.chart1Labels.forEach((riskCatEl) => {
      this.chart1BgColors.push(this.getRandomColor());
      let myArr = this.riskIssueArray.filter((rsk) => rsk.riskCategory === riskCatEl ).map(e => e);
      mychart1Datasets.push(myArr.length);


      });

    this.chart1Datasets = [{
      label: 'Risk',
      data: mychart1Datasets,
      backgroundColor: this.chart1BgColors,
      borderColor: 'white',
      borderWidth: 1.5,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'transparent',
      pointBorderColor: 'white',
      pointHoverBorderColor: 'gray'
    }];

    this.chart1ChartOptions = {
      title: {
        display: false,
        text: 'Sales',
        fontSize: 25
      },
      legend: {
        display: true,
        position: 'right',
        labels: {
              fontColor: '#73818f'
            }
      },
      layout: {
        padding: 10
      },
      tooltips: {
          enabled: true
      },
      scales: {
        yAxes: [{
            display: false,
            gridLines: {
                drawBorder: false,
                display: false
            },
            stacked: false,
            ticks: {
                beginAtZero: true
            }
        }],
        xAxes: [{
            barPercentage: 0.4,
            display: false,
            stacked: false,
            gridLines: {
                drawBorder: true,
                display: false
            },
            ticks: {
              beginAtZero: false
            }
        }]
      },
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
          datalabels: {
              anchor: 'end',
              align: 'top',
              formatter: Math.round,
              font: { weight: 'bold'}
          }
      }
    };









   // on the right
    let threatArray =  this.riskIssueArray.filter(() => true ).map(e => e.risk);
    let newThreatArray = Array.from(new Set(threatArray));

    this.chart2Type = 'pie';

    this.chart2Labels = newThreatArray;
    let mychart2Datasets = [];
    this.chart2BgColors = [];

    this.chart2Labels.forEach((riskEl) => {
      this.chart2BgColors.push(this.getRandomColor());
      let myArr2 = this.riskIssueArray.filter((rsk) => rsk.risk === riskEl ).map(e => e);
      mychart2Datasets.push(myArr2.length);
     });

    this.chart2Datasets = [{
     label: 'Risk',
     data: mychart2Datasets,
     backgroundColor: this.chart2BgColors,
     borderColor: 'white',
     borderWidth: 1.5,
     pointBackgroundColor: 'transparent',
     pointHoverBackgroundColor: 'transparent',
     pointBorderColor: 'white',
     pointHoverBorderColor: 'gray'
   }];

    this.chart2ChartOptions = {
     title: {
       display: false,
       text: 'Sales',
       fontSize: 25
     },
     legend: {
       display: true,
       position: 'right',
       labels: {
             fontColor: '#73818f'
           }
     },
     layout: {
       padding: 10
     },
     tooltips: {
         enabled: true
     },
     scales: {
       yAxes: [{
           display: false,
           gridLines: {
               drawBorder: false,
               display: false
           },
           stacked: false,
           ticks: {
               beginAtZero: true
           }
       }],
       xAxes: [{
           barPercentage: 0.4,
           display: false,
           stacked: false,
           gridLines: {
               drawBorder: true,
               display: false
           },
           ticks: {
             beginAtZero: false
           }
       }]
     },
     maintainAspectRatio: false,
     responsive: true,
     plugins: {
         datalabels: {
             anchor: 'end',
             align: 'top',
             formatter: Math.round,
             font: { weight: 'bold'}
         }
     }
   };












   // on the bottom
    let threatArray3 =  this.riskIssueArray.filter(() => true ).map(e => e.risk);
    let newThreatArray3 = Array.from(new Set(threatArray3));

    this.chart3Type = 'bar';

    this.chart3Labels = newThreatArray3;
    let mychart3Datasets = [];
    this.chart3BgColors = [];

    this.chart3Labels.forEach((riskEl) => {
    //  this.chart3BgColors.push(this.getRandomColor());
    //  let myArr3 = this.riskIssueArray.filter((rsk) => rsk.risk === riskEl ).map(e => e);
    //  mychart3Datasets.push(myArr3.length);
    for (let rsk of this.riskIssueArray) {
      if (rsk.risk === riskEl) {
        if (rsk.level === 'Low') { mychart3Datasets.push(1); this.chart3BgColors.push('#4dbd74'); }
        if (rsk.level === 'Medium') { mychart3Datasets.push(2); this.chart3BgColors.push('#ffc107'); }
        if (rsk.level === 'High') { mychart3Datasets.push(3); this.chart3BgColors.push('#f86c6b'); }
        break;
      }
    }



    });

    this.chart3Datasets = [{
    label: 'Risk',
    data: mychart3Datasets,
    backgroundColor: this.chart3BgColors,
    borderColor: 'white',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'white',
    pointHoverBorderColor: 'gray'
  }];

    this.chart3ChartOptions = {
    title: {
      display: false,
      text: 'Sales',
      fontSize: 25
    },
    legend: {
      display: false,
      position: 'right',
      labels: {
            fontColor: '#73818f'
          }
    },
    layout: {
      padding: 10
    },
    tooltips: {
        enabled: true,
        callbacks: {
          label(tooltipItem, data) {

            if (tooltipItem.yLabel === 1 ) { return 'Low'; }
            if (tooltipItem.yLabel === 2 ) { return 'Medium'; }
            if (tooltipItem.yLabel === 3 ) { return 'High'; }
          },
      }
    },
    scales: {
      yAxes: [{
          display: false,
          gridLines: {
              drawBorder: false,
              display: false
          },
          stacked: false,
          ticks: {
              beginAtZero: true
          }
      }],
      xAxes: [{
          barPercentage: 0.4,
          display: true,
          stacked: false,
          gridLines: {
              drawBorder: true,
              display: false
          },
          ticks: {
            beginAtZero: false
          }
      }]
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: Math.round,
            font: { weight: 'bold'}
        }
    }
  };






















    this.onResize();

  } // end of chartSectionGraphsFunction















} // end of main class
