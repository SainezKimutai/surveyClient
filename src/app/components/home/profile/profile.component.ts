import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { faBuilding, faFire, faComment, faEnvelope, faKey , faGlobe , faAddressBook,
  faEdit, faCheck, faListAlt, faBookReader, faTrash, faChartLine, faChartBar, faChartPie,
  faArrowCircleRight, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
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
 // tslint:disable
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
  public ZeroSurveyDone = false;
  public noteOne = ''
  public noteTwo = '';

  public profileMinimized = false;


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
    public faArrowCircleRight = faArrowCircleRight;
    public faArrowCircleLeft = faArrowCircleLeft;
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
    public chartsProgress = 0;
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
    public onResizeStatus = false;



    // 
    public comparisonChartType;
    public comparisonChartLabels;
    public comparisonChartDatasets;
    public comparisonChartOptions;
    public comparisonChartBGColors = [];
    public MyComparisonDataSet = [];













  async ngOnInit() {
    localStorage.setItem('ActiveNav', 'profile');
    this.loggedUserEmail = localStorage.getItem('loggedUserEmail');

    this.updatePage().then(() => { this.riskIssuesFunction();  this.checkIfNoSuverysHaveBeenDone()});

  }



















  async updatePage() {
    return new Promise((resolve, reject) => {
    this.userService.getAllUsers().subscribe(
      dataUser => {
        this.AllUsers = dataUser;
        this.chartsProgress = 10;

        this.companyProfileService.getAllCompanyProfiles().subscribe(
          dataComp => {
            this.AllCompanies = dataComp;
            for (const comp of this.AllCompanies) { if (comp._id === localStorage.getItem('loggedCompanyId')) { this.myCompany = comp; break; }}
            this.chartsProgress = 20;

            this.surveyService.getAllSurveys().subscribe(
              dataSurvey => {
                this.AllSurveys = dataSurvey;
                this.chartsProgress = 30;

                this.questionService.getAllQuestions().subscribe(
                  dataQuiz => {
                    this.AllQuestions = dataQuiz;
                    this.chartsProgress = 40;

                    this.threatService.getAllThreats().subscribe(
                      dataTrt => {
                      this.AllThreats = dataTrt;
                      this.chartsProgress = 50;

                      this.threatCategoryService.getAllThreatCategorys().subscribe(
                        dataTrtCat => {
                          this.AllThreatCategorys = dataTrtCat;
                          this.chartsProgress = 60;

                          this.responseService.getUsersResponses(localStorage.getItem('loggedUserID')).subscribe(
                            data => {this.AllResponses = data; resolve(); this.chartsProgress = 70; },
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







  minimizeProfile() {
    // this.profileMinimized = !this.profileMinimized;
  }












  checkIfNoSuverysHaveBeenDone() {
    let doneSurvey = this.AllResponses.filter((rsp) => rsp.companyId === this.myCompany._id).map(e => e)
    if (doneSurvey.length === 0 ) {
      this.ZeroSurveyDone = true;
      this.noteOne ="No Surveys Done"
      this.noteTwo = 'You have taken no survey yet, please proceed to survey to be able to see your reports'
    }
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
              wasSkipped: false,
              answers: []
            };

            quiz.choices.forEach((myAns, key, arr) => {
              ans.answer.forEach((a) => {

                if (a.answer) {
                  
                  if (a.answer._id){
                  
                    if (a.answer.answer === myAns.answer ) {
                      theQuestions.answers.push({picked: true, answer: myAns.answer });
      
                      if (Object.is(arr.length - 1, key)) {
                        this.QuestionsOnView.push(theQuestions);
      
                      }
                    } else {
                     
                      if (a.answer.answer === 'Not answered') {theQuestions.wasSkipped = true; }
                      
                      if (a.answer.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: true, answer: myAns.answer })}
                      if (!a.answer.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: false, answer: myAns.answer })}
                      if (Object.is(arr.length - 1, key)) {
      
                        this.QuestionsOnView.push(theQuestions);
                      }
                    }
                  }else {
                    if (a.answer === myAns.answer ) {
                      theQuestions.answers.push({picked: true, answer: myAns.answer });
      
                      if (Object.is(arr.length - 1, key)) {
                        this.QuestionsOnView.push(theQuestions);
      
                      }
                    } else {
                      if (a.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: true, answer: myAns.answer })}
                      if (!a.answer.includes(myAns.answer)) {  theQuestions.answers.push({picked: false, answer: myAns.answer })}
                      if (a.answer === 'Not answered') {theQuestions.wasSkipped = true; }
                    
                      if (Object.is(arr.length - 1, key)) {
                       
                        this.QuestionsOnView.push(theQuestions);
                      }
                    }
    
                  }
                }
  
  
  
  
              });
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
    this.chartsProgress = 80;
    this.AllThreats.forEach((threat, idx1, arr1) => {

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
                          this.chartsProgress = 90;
                          this.chartSectionGraphsFunction();
                          this.comparisonChartFunction();
                        }

                      });


                  }
                }


              }
            }

        }
      }

      if(idx1 === arr1.length - 1 && this.chartsProgress === 80) {
        let doneSurvey = this.AllResponses.filter((rsp) => rsp.companyId === this.myCompany._id).map(e => e)
        if (doneSurvey.length > 0 ) {
          this.ZeroSurveyDone = true;
          this.noteOne = 'No Threat associated with surveys / Questions done'
          this.noteTwo = 'Sorry the suveys you might have done does not contain any threat paramenters.'
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
    this.chart3ChartOptions.legend.display = true;
    this.chart3ChartOptions.scales.yAxes[0].display = true;
    this.chart3ChartOptions.scales.xAxes[0].display = true;
    this.chart3ChartOptions.scales.yAxes[0].stacked = true;
    this.chart3ChartOptions.scales.xAxes[0].stacked = true;
    this.chart3Datasets[0].backgroundColor = 'rgba(248, 108, 107, .7)';
    this.chart3Datasets[0].borderColor = 'white';
    this.chart3Datasets[0].pointBorderColor = 'white';
    this.chart3Datasets[1].backgroundColor = 'rgba(77, 189, 116, .4)';
    this.chart3Datasets[1].borderColor = 'white';
    this.chart3Datasets[1].pointBorderColor = 'white';
  }
  chart3graphToBar() {
    this.chart3Type = 'bar';
    this.chart3ChartOptions.legend.display = true;
    this.chart3ChartOptions.scales.yAxes[0].display = true;
    this.chart3ChartOptions.scales.xAxes[0].display = true;
    this.chart3ChartOptions.scales.yAxes[0].stacked = false;
    this.chart3ChartOptions.scales.xAxes[0].stacked = false;
    this.chart3Datasets[0].backgroundColor = this.chart3BgColors[0];
    this.chart3Datasets[0].borderColor = 'white';
    this.chart3Datasets[0].pointBorderColor = 'white';
    this.chart3Datasets[1].backgroundColor = this.chart3BgColors[1];
    this.chart3Datasets[1].borderColor = 'white';
    this.chart3Datasets[1].pointBorderColor = 'white';
  }
  chart3graphToPie() {
    this.chart3Type = 'pie';
    this.chart3ChartOptions.legend.display = true;
    this.chart3ChartOptions.scales.yAxes[0].display = false;
    this.chart3ChartOptions.scales.xAxes[0].display = false;
    this.chart3ChartOptions.scales.yAxes[0].stacked = true;
    this.chart3ChartOptions.scales.xAxes[0].stacked = true;
    this.chart3Datasets[0].backgroundColor = this.chart3BgColors[0];
    this.chart3Datasets[0].borderColor = 'white';
    this.chart3Datasets[0].pointBorderColor = 'white';
    this.chart3Datasets[1].backgroundColor = this.chart3BgColors[1];
    this.chart3Datasets[1].borderColor = 'white';
    this.chart3Datasets[1].pointBorderColor = 'white';
  }



  @HostListener('window:resize', []) onResize() {
    this.innerWidth = window.innerWidth;

    if(this.onResizeStatus) {
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


  }


  getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {color += letters[Math.floor(Math.random() * 16)]; }
    return color;
  }






  chartSectionGraphsFunction() {
    this.chartsProgress = 100;
    // on the left
    this.chart1Type = 'pie';


    let threatCatArray =  this.riskIssueArray.filter(() => true ).map(e => e.riskCategory);
    let newThreatCatArray = Array.from(new Set(threatCatArray));

    let newThreatRisk = this.riskIssueArray.filter(() => true ).map(e => e.risk);
    let newThreat1 = Array.from( new Set(newThreatRisk));

    let ThreatRiskInvolved =  newThreat1.reduce((unique, item) => {
      let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
      let item2 = item.toLowerCase().replace(/ /g,''); 
      return unique1.includes(item2) ? unique : [...unique, item]
    }, []);

    let ThreatRiskAndCat = []

    ThreatRiskInvolved.forEach((trt) => {
      let x = {
        risk: trt,
        category: ''
      }
      this.riskIssueArray.forEach((rsk) => { 
        if (rsk.risk === trt && x.category === '' && rsk.category !== '') {
          x.category = rsk.riskCategory
          ThreatRiskAndCat.push(x)
        }
      })
    })


    let mychart1Datasets = [];
    this.chart1BgColors = [];
    newThreatCatArray.forEach((trtCat) => {
      let y = ThreatRiskAndCat.filter((c) => c.category === trtCat).map(e => e)
      this.chart1BgColors.push(this.getRandomColor());
      mychart1Datasets.push(y.length);
    })


    this.chart1Labels = newThreatCatArray;


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
        text: 'Risk',
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


    let surveysOnrisk = this.riskIssueArray.filter(() => true ).map(e => e.surveyName)
    let surveyArr = Array.from( new Set(surveysOnrisk));
    let getRisk = this.riskIssueArray.filter(() => true ).map(e => e.risk);
    let RiskInvolved1 = Array.from( new Set(getRisk));

    let RiskInvolved =  RiskInvolved1.reduce((unique, item) => {
      let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
      let item2 = item.toLowerCase().replace(/ /g,''); 
      return unique1.includes(item2) ? unique : [...unique, item]
    }, []);


    let mychart2Datasets = []

    surveyArr.forEach((surveyElem) => {
      let dataOnj = {
        sulvey: surveyElem,
        data : []
      }
      RiskInvolved.forEach((riskElm) => {
        
        let getMyRisk = this.riskIssueArray.filter((r) => r.risk.toLowerCase().replace(/ /g,'') === riskElm.toLowerCase().replace(/ /g,'') && r.surveyName === surveyElem ).map(e => e)
        let getLowRisk = getMyRisk.filter((r) => r.level === 'Low' ).map(e => e)
        let getMediumRisk = getMyRisk.filter((r) => r.level === 'Medium' ).map(e => e)
        let getHighRisk = getMyRisk.filter((r) => r.level === 'High' ).map(e => e)

        let totalLowRiskNum = getLowRisk.length;
        let totalMediumRiskNum = getMediumRisk.length;
        let totalHighRiskNum = getHighRisk.length;

        let totalPoints = ((totalLowRiskNum * 1) + (totalMediumRiskNum * 2) + (totalHighRiskNum * 3))
        let totalRiskNum = totalLowRiskNum + totalMediumRiskNum + totalHighRiskNum
        
        let finalValue = Math.round(totalPoints / totalRiskNum)
        // console.log(finalValue)
        if(!finalValue) { finalValue = 1}

        let riskObj = {
          risk: riskElm,
          value: finalValue
        }

        dataOnj.data.push(riskObj)

      })

      mychart2Datasets.push(dataOnj)

    })


    let unFilterednewRiskArray = []

    mychart2Datasets.forEach((riskData) => {
      riskData.data.forEach((e) => unFilterednewRiskArray.push(e.risk))
    })
    let newRiskArray = Array.from( new Set(unFilterednewRiskArray));

    this.chart2BgColors = [];
    let newDatasetChart2 = [];
    newRiskArray.forEach((riskItem) => {
      let riskValuearr = []
      mychart2Datasets.forEach((riskData) => {
        riskData.data.forEach((r) => r.risk === riskItem ? riskValuearr.push(r.value) : '')

      })

      let sumRiskValue =  riskValuearr.reduce((a,b) => a + b, 0);
      let totalvalue = Math.ceil(sumRiskValue / riskValuearr.length)
        if (totalvalue === 1 ) { this.chart2BgColors.push('#4dbd74'); }
        if (totalvalue === 2 ) { this.chart2BgColors.push('#ffc107'); }
        if (totalvalue === 3 ) { this.chart2BgColors.push('#f86c6b'); }

      newDatasetChart2.push(totalvalue)
    })






    this.chart2Type = 'line';

    this.chart2Labels = newRiskArray;



    this.chart2Datasets = [{
     label: 'Risk',
     data: newDatasetChart2,
     backgroundColor: 'whitesmoke',
     borderColor: 'gray',
     borderWidth: 1.5,
     pointBackgroundColor: 'transparent',
     pointHoverBackgroundColor: 'transparent',
     pointBorderColor: 'black',
     pointHoverBorderColor: 'gray'
   }];

    this.chart2ChartOptions = {
     title: {
       display: false,
       text: 'Risk',
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
          label: function(tooltipItem, data) {
            if(Number(tooltipItem.yLabel) === 3) {return 'High Risk'}
            if(Number(tooltipItem.yLabel) === 2) {return 'Medium Risk'}
            if(Number(tooltipItem.yLabel) === 1) {return 'Low Risk'}
            if(Number(tooltipItem.yLabel) === 0) {return 'Not Assessed'}
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












    let getSurveys = this.riskIssueArray.filter(() => true ).map(e => e.surveyName)
    let SurveyInvolve = Array.from( new Set(getSurveys));
    let mychart3Datasets1 = [];
    let mychart3Datasets2 = [];
    this.CompanyRiskRates = [];
    SurveyInvolve.forEach((surveyElem) => {
        
        let getMyRisk = this.riskIssueArray.filter((r) => r.surveyName === surveyElem ).map(e => e)
        let LowRate = getMyRisk.filter((r)=> r.level === 'Low' ).map(e => e);
        let MediumRate = getMyRisk.filter((r)=> r.level === 'Medium' ).map(e => e);
        let HighRate = getMyRisk.filter((r)=> r.level === 'High' ).map(e => e);
        
        let totalRiskNum = getMyRisk.length;
        let lowRiskNum = LowRate.length;
        let mediumRiskNum = MediumRate.length;
        let highRiskNum = HighRate.length;
      
        let lowRiskValue = lowRiskNum * 1;
        let medumRiskValue = mediumRiskNum * 2;
        let highRiskValue = highRiskNum * 3;
        let totalRiskValue = totalRiskNum * 3
      
        let myTotalRiskValue = Number(lowRiskValue) + Number(medumRiskValue) + Number(highRiskValue);
      
        let total = ((myTotalRiskValue * 100) / totalRiskValue).toFixed(1)



        mychart3Datasets1.push(myTotalRiskValue)
        mychart3Datasets2.push(totalRiskValue)

        let obj = {
          surveyName: surveyElem,
          riskRate: total
        }
        this.CompanyRiskRates.push(obj)

    })

    this.chart3Type = 'bar';

    this.chart3Labels = SurveyInvolve;
   
    this.chart3BgColors = ['#f86c6b', '#4dbd74' ];

    this.chart3Datasets = [{
    label: 'Your Risk level',
    data: mychart3Datasets1,
    backgroundColor: this.chart3BgColors[0],
    borderColor: 'white',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'white',
    pointHoverBorderColor: 'gray'
  },
  {
    label: 'Highest Possible Risk level',
    data: mychart3Datasets2,
    backgroundColor: this.chart3BgColors[1],
    borderColor: 'white',
    borderWidth: 1.5,
    pointBackgroundColor: 'transparent',
    pointHoverBackgroundColor: 'transparent',
    pointBorderColor: 'white',
    pointHoverBorderColor: 'gray'
  }
];

    this.chart3ChartOptions = {
    title: {
      display: false,
      text: 'Risk',
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
      enabled: true,
      callbacks: {
        label: function(tooltipItem, data) {
          let myValue = tooltipItem.yLabel
          let myDataSet = tooltipItem.label
          let myPosition = data.labels.indexOf(myDataSet)
          let myHighValue = data.datasets[1].data[myPosition]
          let mySetCat = (myHighValue / 3)
          let lowCatOff = mySetCat;
          let mediumCatOff = mySetCat * 2;

          if (myValue < lowCatOff || myValue === lowCatOff ) { return 'Low Risk'}
          if ((myValue > lowCatOff && myValue < mediumCatOff) || myValue === mediumCatOff ) { return 'Medium Risk'}
          if (myValue > mediumCatOff) { return 'High Risk'}
        },
    }
    },
    scales: {
      yAxes: [{
          display: true,
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






















    this.onResizeStatus = true;
    this.onResize();

  } // end of chartSectionGraphsFunction








  
  comparisonChartToLine() {
    this.comparisonChartType = 'line';
    this.comparisonChartOptions.legend.display = false;
    this.comparisonChartOptions.scales.xAxes[0].display = true;
    this.comparisonChartFunction()
  }


  comparisonChartToBar() {
    this.comparisonChartType = 'bar';
    this.comparisonChartOptions.legend.display = true;
    this.comparisonChartOptions.scales.xAxes[0].display = true;
    this.comparisonChartDatasets.forEach((dataSet) => {
      dataSet.backgroundColor = [];
      dataSet.borderColor = 'white';
      dataSet.pointBorderColor = 'white';
      dataSet.data.forEach((d) => {
        if (d === 1) { dataSet.backgroundColor.push('#4dbd74'); }
        if (d === 2) { dataSet.backgroundColor.push('#ffc107'); }
        if (d === 3) { dataSet.backgroundColor.push('#f86c6b'); }
      })
    })



    
  }



  comparisonChartToPie() {
    this.comparisonChartType = 'pie';
    this.comparisonChartOptions.legend.display = true;
    this.comparisonChartOptions.scales.xAxes[0].display = false;
    this.comparisonChartDatasets.forEach((dataSet) => {
      dataSet.backgroundColor = [];
      dataSet.borderColor = 'white';
      dataSet.pointBorderColor = 'white';
      dataSet.data.forEach((d) => {
        if (d === 1) { dataSet.backgroundColor.push('#4dbd74'); }
        if (d === 2) { dataSet.backgroundColor.push('#ffc107'); }
        if (d === 3) { dataSet.backgroundColor.push('#f86c6b'); }
      })
    })


  }





  random_rgba() {
      let o = Math.round, r = Math.random, s = 255;
      let p = o(r()*s);
      let pp = o(r()*s);
      let ppp = o(r()*s);
      let color = {
        light:  'rgba(' + p + ',' + pp + ',' + ppp + ',' + .3 + ')',
        mild:  'rgba(' + p + ',' + pp + ',' + ppp + ',' + .7 + ')',
        dark:  'rgba(' + p + ',' + pp + ',' + ppp + ',' + 1 + ')'
      }
      
     
      return color
  }
  





  async comparisonChartFunction() {

    let getSurveys = this.riskIssueArray.filter(() => true ).map(e => e.surveyName)
    let SurveyInvolve = Array.from( new Set(getSurveys));
    let getRisk = this.riskIssueArray.filter(() => true ).map(e => e.risk);
    let RiskInvolved1 = Array.from( new Set(getRisk));

    let RiskInvolved =  RiskInvolved1.reduce((unique, item) => {
      let unique1 =  unique.filter(() => true).map(e => e.toLowerCase().replace(/ /g,''))
      let item2 = item.toLowerCase().replace(/ /g,''); 
      return unique1.includes(item2) ? unique : [...unique, item]
    }, []);


    this.MyComparisonDataSet = []

    SurveyInvolve.forEach((surveyElem) => {
      let dataOnj = {
        label: surveyElem,
        data : []
      }
      RiskInvolved.forEach((riskElm) => {
        
        let getMyRisk = this.riskIssueArray.filter((r) => r.risk.toLowerCase().replace(/ /g,'') === riskElm.toLowerCase().replace(/ /g,'') && r.surveyName === surveyElem ).map(e => e)
        let getLowRisk = getMyRisk.filter((r) => r.level === 'Low' ).map(e => e)
        let getMediumRisk = getMyRisk.filter((r) => r.level === 'Medium' ).map(e => e)
        let getHighRisk = getMyRisk.filter((r) => r.level === 'High' ).map(e => e)

        let totalLowRiskNum = getLowRisk.length;
        let totalMediumRiskNum = getMediumRisk.length;
        let totalHighRiskNum = getHighRisk.length;

        let totalPoints = ((totalLowRiskNum * 1) + (totalMediumRiskNum * 2) + (totalHighRiskNum * 3))
        let totalRiskNum = totalLowRiskNum + totalMediumRiskNum + totalHighRiskNum
        
        let finalValue = Math.round(totalPoints / totalRiskNum)
        if(!finalValue) {finalValue = 0}
        dataOnj.data.push(finalValue)



      })

      this.MyComparisonDataSet.push(dataOnj)

    })



    this.comparisonChartType = 'line';

    this.comparisonChartLabels = RiskInvolved;


    this.comparisonChartDatasets = [];


    this.MyComparisonDataSet.forEach((dataElem) => {

      this.comparisonChartBGColors = []

      dataElem.data.forEach((d) => {
        if (d === 1) { this.comparisonChartBGColors.push('#4dbd74'); }
        if (d === 2) { this.comparisonChartBGColors.push('#ffc107'); }
        if (d === 3) { this.comparisonChartBGColors.push('#f86c6b'); }
      })

      let bgColors = []
      let color = this.random_rgba();

        bgColors.push(color.light);

        let dataSet = {
          label: dataElem.label,
          data: dataElem.data,
          backgroundColor: bgColors,
          borderColor: color.mild,
          borderWidth: 1.5,
          pointBackgroundColor: 'transparent',
          pointHoverBackgroundColor: 'transparent',
          pointBorderColor: color.dark,
          pointHoverBorderColor: 'black'
        }
        this.comparisonChartDatasets.push(dataSet)

    })

    this.comparisonChartOptions = {
      title: {
        display: false,
        text: 'Risks',
        fontSize: 25
      },
      legend: {
        display: true,
        position: 'top',
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
            label: function(tooltipItem, data) {
              if(Number(tooltipItem.yLabel) === 3) {return 'High Risk'}
              if(Number(tooltipItem.yLabel) === 2) {return 'Medium Risk'}
              if(Number(tooltipItem.yLabel) === 1) {return 'Low Risk'}
              if(Number(tooltipItem.yLabel) === 0) {return 'Not Assessed'}
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














  }










} // end of main class
