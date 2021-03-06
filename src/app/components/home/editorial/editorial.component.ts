import { Component, OnInit, ViewChild } from '@angular/core';
import { faPlus, faSearch, faListAlt, faTrashAlt, faExclamationTriangle, faEye,
  faBackward, faEdit, faTrash, faBuilding, faComments, faFire,
  faBusinessTime, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { TrackerReasonService } from 'src/app/shared/services/trackerReasons.service';
import { ThreatCategoryService } from 'src/app/shared/services/threatCategory.service';
import {ActivityPlanService } from 'src/app/shared/services/activityPlan.service';
import { HomeComponent } from '../home.component';
@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.sass']
})
export class EditorialComponent implements OnInit {
// tslint:disable

  constructor(
    private notifyService: NotificationService,
    private homeComponent: HomeComponent,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private threatService: ThreatService,
    private industryService: IndustryService,
    private trackerReasonService: TrackerReasonService,
    private threatCategoryService: ThreatCategoryService,
    private activityPlanService: ActivityPlanService
  ) {  }

// Modals

@ViewChild('addThreatModal', {static: true}) addThreatModal: ModalDirective;
@ViewChild('deletePromptModal', {static: true}) deletePromptModal: ModalDirective;
@ViewChild('addPlanModal', {static: true}) addPlanModal: ModalDirective;



  // loader
  public ImprintLoader = false;
  public pageProgress = 0;


// Icons
  public faPlus = faPlus;
  public faSearch = faSearch;
  public faListAlt = faListAlt;
  public faBackward = faBackward;
  public faEdit = faEdit;
  public faTrash = faTrash;
  public faFire = faFire;
  public faBuilding = faBuilding;
  public faComments = faComments;
  public faDelete = faTrashAlt;
  public faEye = faEye;
  public faWarning = faExclamationTriangle;
  public faBusinessTime = faBusinessTime;
  public faPowerOff = faPowerOff;


  //
  public AllSurveys = [];
  public ViewAllSurvey = [];
  public AllQuestions = [];
  public AllThreats = [];
  public ViewAllThreats = [];
  public AllTrackerReasons = [];
  public AllIndustrys = [];
  public AllThreatCategories = [];
  public AllActivityPlans = [];

  public TemplateNameOnView = [];
  public TemplateQuestions = [];
  public surveyIdOnView = '';
  public surveyNameOnView = '';
  public QuestionIdOnEdit = '';
  public ChoicesStatus = false;

  public CurrentSurveyInput = '';
  public CurrentChoicesArr = [];
  public skipNext = false;
  public CurrentQuestionArray = [];
  public CurrentQuestionInput = '';
  public CurrentChoiceInput = '';
  public CurrentChoiceInputThreat = '';
  public skipInput = false;
  public linkedInput = false;

  public openQuestionInput = 'true';
  public multipleChoiceInput = 'false';
  public choiceTypeInput = 'string';
  public positionInput = 1;

  public EditSurveyInput = '';
  public EditChoicesArr = [];
  public EditQuestionArray = [];
  public EditskipNext = false;
  public EditQuestionInput = '';
  public EditChoiceInput = '';
  public EditChoiceInputThreat = '';
  public EditskipInput = false;
  public EditlinkedInput = false;


  public EditopenQuestionInput = 'true';
  public EditmultipleChoiceInput = 'false';
  public EditchoiceTypeInput = 'string';
  public EditpositionInput = 1;


  public AddedQuestionsArray = [];

// status
  public FormSectionStatus = false;
  public ThreatSectionStatus = false;
  public TemplateViewSectionStatus = true;
  public QuestionsViewStatus = false;
  public SurveyFormStatus = true;
  public QuestionFormStatus = false;
  public ThreatsViewSectionStatus = false;

  public threatName = '';
  public threatType = '';
  public threatLevels = [];
  public threatCategory = '';
  public threatValue1 = '';
  public threatValue2 = '';
  public threatLevel = '';
  public threatRecom = '';
  public openThreat: any;
  public openThreatName = '';
  public isEditThreatModal = false;

  public trackerReasonInput = '';
  public industryInput = '';

  // Delete Modal
  public warningMessage = '';
  public itemIdToDelete = '';
  public modalName = '';


  public CurrentQuestionOnEdit;




  public formOneStatus = true;
  public formTwoStatus = false;
  public formThreeStatus = false;
  public formFourStatus = false;


  public newSurveyStatus = false;
  public editSurveyQuestionStatus = false;
  public addSurveyQuestionsSatus = false;






  // threat Categories
  public threatCategoryInput = '';

public activityPlan = '';
public activityPlanThreatId = ''

public FilterName = '';
public FilterThreatInput = '';






  ngOnInit() {
    sessionStorage.setItem('ActiveNav', 'editorial');
    this.updatePage().then(() => { this.ViewAllSurvey = this.AllSurveys});

    // this.updater(); - updates threats to set an id
    // this.duplicateQuestionsForThirdParty(); -- duplicates all questions in one survey on another
    // this.clearAllQuestionsInASurvey(); -- clears all questions in a survey
  }












  updatePage() {
    return new Promise((resolve, reject) => {
        
        this.surveyService.getAllInstitutionSurveysAdmin().subscribe(
          dataSurvey => {
            
            this.AllSurveys = dataSurvey;
            this.ViewAllSurvey = this.AllSurveys
            this.pageProgress = 10;

            this.questionService.getAllQuestions().subscribe(
              dataQuiz => {
                this.AllQuestions = dataQuiz;
                this.pageProgress = 20;

                this.industryService.getAllInstitutionIndustrys().subscribe(
                  dataInd => {
                    this.AllIndustrys = dataInd;
                    this.pageProgress = 40;

                    this.threatCategoryService.getAllByInstitutions().subscribe(
                      dataTrtCat => {
                        this.AllThreatCategories = dataTrtCat;
                        this.pageProgress = 60;

                        this.trackerReasonService.getAllInstitutionTrackerReasons().subscribe(
                          dataTrtResn => {
                            this.AllTrackerReasons = dataTrtResn;
                            this.pageProgress = 80;

                            this.threatService.getAllInstitutionThreats().subscribe(
                              dataTrt=> {
                                this.AllThreats = dataTrt;
                                this.ViewAllThreats = this.AllThreats;
                                this.pageProgress = 90;
                                this.activityPlanService.getAllActivityPlanByInstitutionId().subscribe(
                                  dataPlanAct => {
                                    this.AllActivityPlans = dataPlanAct;
                                    this.pageProgress = 100;
                                    
                                    resolve();
                                  },
                                  error => console.log('Error getting plan Activities')
                                )
                               },
                              error => console.log('Error getting threats')
                            );
                          
                          },
                          error => console.log('Error getting all tracker reasons')
                        );

                      },
                      error => console.log('Error getting all threat categories')
                    );
                  
                  },
                  error => console.log('Error getting all industries')
                );
              },
              error => console.log('Error getting all question')
            );
          
          },
          error => console.log('Error getting all surveys')
        );



         

        

        

    });
  }




  createNewSurveyTemplate() {
    this.CurrentQuestionInput = '';
    this.openQuestionInput = 'true';
    this.multipleChoiceInput = 'false';
    this.choiceTypeInput = 'string';
    this.skipInput = false;
    this.linkedInput = false;
    this.CurrentChoicesArr = [];
    this.positionInput = 1;
    this.CurrentSurveyInput = '';
    this.CurrentQuestionArray = [];

    this.FormSectionStatus = true;
    this.TemplateViewSectionStatus = false;
    this.ThreatSectionStatus = false;
    this.QuestionsViewStatus = false;
    this.ThreatsViewSectionStatus = false;
    this.newSurveyStatus = true;
    this.editSurveyQuestionStatus = false;
    this.addSurveyQuestionsSatus = false;
  }

  viewSurveyTemplates() {
    this.FormSectionStatus = false;
    this.TemplateViewSectionStatus = true;
    this.ThreatSectionStatus = false;
    this.QuestionsViewStatus = false;
    this.ThreatsViewSectionStatus = false;
    this.newSurveyStatus = false;
  }



  filterSurveys() {

    if (!this.FilterName || this.FilterName === null || this.FilterName === '' || this.FilterName.length  < 1) {
      this.ViewAllSurvey = this.AllSurveys;
      } else {
        this.ViewAllSurvey = this.AllSurveys.filter(v => v.surveyName.toLowerCase().indexOf(this.FilterName.toLowerCase()) > -1).slice(0, 10);
      }

}


filterThreats() {

  if (!this.FilterThreatInput || this.FilterThreatInput === null || this.FilterThreatInput === '' || this.FilterThreatInput.length  < 1) {
    this.ViewAllSurvey = this.AllSurveys;
    } else {
      this.ViewAllThreats = this.AllThreats.filter(v => v.name.toLowerCase().indexOf(this.FilterThreatInput.toLowerCase()) > -1).slice(0, 10);
    }

}


  viewSurvey(name, id) {
    this.newSurveyStatus = false;
    this.TemplateQuestions = [];
    this.TemplateNameOnView = name;
    // for use later in rerender..
    this.surveyIdOnView = id;
    this.surveyNameOnView = name;
    let unSortedQuestions = this.AllQuestions.filter(( quiz) => quiz.surveyId === id ).map(e => e);
    this.TemplateQuestions = unSortedQuestions.sort((a, b) =>  a.position - b.position);
    this.FormSectionStatus = false;
    this.TemplateViewSectionStatus = false;
    this.QuestionsViewStatus = true;

  }

  prompSurveyDelete(id) {
    this.warningMessage = 'This operation will delete the survey, the questions associated with the survey and their responses';
    this.itemIdToDelete = id;
    this.modalName = 'survey';
    this.deletePromptModal.show();
  }

  closeDeleteModal() {
    this.warningMessage = '';
    this.itemIdToDelete = '';
    this.modalName = '';
    this.deletePromptModal.hide();
  }
  delete() {
    if (this.modalName === 'survey') {
      this.surveyService.deleteSurvey(this.itemIdToDelete).subscribe(data => {
        this.warningMessage = '';
        this.itemIdToDelete = '';
        this.modalName = '';
        this.deletePromptModal.hide();
        this.updatePage();
      },
      error => this.notifyService.showError('Survey was not deleted', 'Failed'));
    }
    if (this.modalName === 'threat') {
      this.threatService.deleteThreat(this.itemIdToDelete).subscribe(data => {
        this.warningMessage = '';
        this.itemIdToDelete = '';
        this.modalName = '';
        this.deletePromptModal.hide();
        this.updatePage();
      },
      error => this.notifyService.showError('Threat was not deleted', 'Failed'));
    }
  }

  prompThreatDelete(id) {
    this.warningMessage = 'This operation will delete the threat object';
    this.itemIdToDelete = id;
    this.modalName = 'threat';
    this.deletePromptModal.show();
  }



  viewThreat(item) {

    this.openThreat = item;
    this.threatName = item.name;
    this.threatType = item.type;
    this.threatCategory = item.category;
    this.threatLevels = item.categorization_inferences;
    this.threatLevel = item.level;
    this.threatRecom = item.recom;

    this.isEditThreatModal = true;
    this.addThreatModal.show();

  }


  swithToQuestionForm() {
    this.SurveyFormStatus = false;
    this.QuestionFormStatus = true;
  }

  swithToSurveyForm() {
    this.SurveyFormStatus = true;
    this.QuestionFormStatus = false;
  }








  toFormOne() {
    this.formOneStatus = true;
    this.formTwoStatus = false; 
    this.formThreeStatus = false;
    this.formFourStatus = false; 
  }

  toFormTwo() {
    this.formOneStatus = false;
    this.formTwoStatus = true; 
    this.formThreeStatus = false;
    this.formFourStatus = false; 
  }

  toFormThree() {
    this.formOneStatus = false;
    this.formTwoStatus = false; 
    this.formThreeStatus = true;
    this.formFourStatus = false;  
  }

  toFormFour() {
    this.formOneStatus = false;
    this.formTwoStatus = false; 
    this.formThreeStatus = false;
    this.formFourStatus = true; 
  }








  nextToQuestion() {
    if (this.CurrentSurveyInput === '') {
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      this.swithToQuestionForm();
    }
  }










  checkQuestioType(type) {
    if (type === 'true') {
      this.ChoicesStatus = false;
      this.openQuestionInput = 'true';
      this.multipleChoiceInput = 'false';
      this.choiceTypeInput = 'string';
      console.log(this.openQuestionInput);
    }
    if (type === 'false') {
      this.ChoicesStatus = true;
      this.openQuestionInput = 'false';
      this.multipleChoiceInput = 'false';
      this.choiceTypeInput = 'string';
      console.log(this.openQuestionInput);
    }
  }

  fetchLinkedAnswers() {
    this.CurrentChoicesArr =[];
    for(let threat of this.AllThreats){
      if (threat._id === this.CurrentChoiceInputThreat) {
        console.log(threat);
        if(threat.type == 0){
          console.log("Zero");
        threat.categorization_inferences.forEach( (inf) => {
          this.CurrentChoicesArr.push({ answer: inf.classifier[0], skipNext:false});
        })
      }else{
        threat.categorization_inferences.forEach( (inf) => {
          if(inf.classifier.length>1){
          this.CurrentChoicesArr.push({ answer: inf.classifier[0].toString() + " to " + inf.classifier[1].toString(), skipNext:false});
          }else{
            this.CurrentChoicesArr.push({answer: inf.classifier[0].toString() + " and above", skipNext:false});
          }
        })
      }
      }
    }
  }


  addChoice() {
    if (this.CurrentChoiceInput === '') {
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      this.CurrentChoicesArr.push({ answer: this.CurrentChoiceInput, skipNext:false});
      this.CurrentChoiceInput = '';
    }

  }

  removeAns(x) {
    this.CurrentChoicesArr.splice(x, 1);
  }
  setSkipNext(x){

    const checker = <HTMLInputElement> document.getElementById(x);
    if(checker.checked === true){
    
    this.CurrentChoicesArr[x].skipNext = true;
    console.log(this.CurrentChoicesArr);
    }else{
    this.CurrentChoicesArr[x].skipNext = false;
    console.log(this.CurrentChoicesArr);
    }
  }


  nextQuestion() {

    if (this.CurrentQuestionInput === '') {
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      const quizData = {
        question: this.CurrentQuestionInput,
        open_question: this.openQuestionInput,
        threat: this.CurrentChoiceInputThreat,
        skip: this.skipInput,
        linked: this.linkedInput,
        multiple_choice: this.multipleChoiceInput,
        choice_type: this.choiceTypeInput,
        position: this.positionInput,
        choices: this.CurrentChoicesArr,
      };


      this.CurrentQuestionArray.push(quizData);
      this.CurrentQuestionInput = '';
      this.linkedInput = false;
      this.skipInput = false;
      this.openQuestionInput = 'true';
      this.multipleChoiceInput = 'false';
      this.choiceTypeInput = 'string';
      this.CurrentChoicesArr = [];
      this.positionInput++;
      this.CurrentChoiceInputThreat = '';
      this.toFormTwo();

    }

  }


  saveSurveyTemplate() {
    this.ImprintLoader = true;
    this.surveyService.createSurvey({surveyName: this.CurrentSurveyInput, institutionId: sessionStorage.getItem('loggedUserID')}).subscribe(
      dataSurvey => {
        this.createQuestions(dataSurvey);
      },
      error => {this.notifyService.showError('Could not create Survey', 'Failed'); this.ImprintLoader = false; }
    );
  }

  optionsOnchange(){
    console.log(this.skipInput);
    console.log(this.linkedInput);
  }

  createQuestions(survey) {

    this.CurrentQuestionArray.forEach( (quiz, idx, array) => {
      const myQuizData = {
        surveyId: survey._id,
        question: quiz.question,
        threat: quiz.threat,
        skip : quiz.skip,
        linked : quiz.linked,
        open_question: (quiz.open_question === 'true' ? true : false),
        multiple_choice: (quiz.multiple_choice === 'true' ? true : false),
        choice_type: quiz.choice_type,
        position: quiz.position,
        choices: quiz.choices,
      };

      this.questionService.createQuestion(myQuizData).subscribe(
        data => {


          if (idx === array.length - 1) {

            this.CurrentQuestionInput = '';
            this.openQuestionInput = 'true';
            this.multipleChoiceInput = 'false';
            this.choiceTypeInput = 'string';
            this.skipInput = false;
            this.linkedInput = false;
            this.CurrentChoicesArr = [];
            this.positionInput = 1;
            this.CurrentSurveyInput = '';
            this.CurrentQuestionArray = [];
            this.swithToSurveyForm();

            this.updatePage();
            this.viewSurveyTemplates();
            this.ImprintLoader = false;
            this.notifyService.showSuccess('Survey Template Created', 'Success');
          }


        },
        error => {this.notifyService.showError('Could not create Survey', 'Failed'); this.ImprintLoader = false; }
      );
    });
  }






  editQuestion(item) {

    this.CurrentQuestionOnEdit = item;
    this.CurrentQuestionInput = item.question;
    this.openQuestionInput = String(item.open_question);
    this.multipleChoiceInput = String(item.multiple_choice);
    this.choiceTypeInput = item.choice_type;
    this.CurrentChoicesArr = item.choices;
    this.positionInput = item.position;
    this.skipInput = item.skip,
    this.linkedInput = item.linked,
    this.FormSectionStatus = true;
    this.TemplateViewSectionStatus = false;
    this.ThreatSectionStatus = false;
    this.QuestionsViewStatus = false;
    this.ThreatsViewSectionStatus = false;
    this.toFormTwo();
    this.editSurveyQuestionStatus = true;
    this.addSurveyQuestionsSatus = false;

  }

  editedQuestionSave() {
    const quizData = {
      question: this.CurrentQuestionInput,
      open_question:  (this.openQuestionInput === 'true' ? true : false),
      threat: this.CurrentChoiceInputThreat,
      skip: this.skipInput,
      linked: this.linkedInput,
      multiple_choice: (this.multipleChoiceInput === 'true' ? true : false),
      choice_type: this.choiceTypeInput,
      position: this.positionInput,
      choices: this.CurrentChoicesArr,
    };

    this.questionService.updateQuestion(this.CurrentQuestionOnEdit._id, quizData).subscribe(
      data => {
        this.notifyService.showSuccess('question updated', 'Success')
        this.updatePage().then(e => this.viewSurvey(this.surveyNameOnView, this.surveyIdOnView));
      },
      error => this.notifyService.showError('could not edit question ', 'Failed')
    )

  }






  deleteQuestion(item) {
    this.questionService.deleteQuestion(item._id).subscribe(data => {this.notifyService.showWarning('Deleted Question', 'Deleted!');
                                                                     // tslint:disable-next-line: max-line-length
                                                                     this.updatePage().then(e => this.viewSurvey(this.surveyNameOnView, this.surveyIdOnView));
    },
      err => this.notifyService.showWarning('Question was not delete', 'Failed!'));
  }





  addQuiz() {

   
    this.CurrentQuestionInput = '';
    this.openQuestionInput = 'true';
    this.multipleChoiceInput = 'false';
    this.choiceTypeInput = 'string';
    this.CurrentChoicesArr = [];
    this.skipInput = false;
    this.linkedInput = false;
    this.positionInput = this.TemplateQuestions.length + 1;
    this.FormSectionStatus = true;
    this.TemplateViewSectionStatus = false;
    this.ThreatSectionStatus = false;
    this.QuestionsViewStatus = false;
    this.ThreatsViewSectionStatus = false;
    this.toFormTwo();
    this.editSurveyQuestionStatus = false;
    this.addSurveyQuestionsSatus = true;
  }





  saveAddedQuiz() {

    const quizData = {
      surveyId: this.surveyIdOnView,
      question: this.CurrentQuestionInput,
      open_question:  (this.openQuestionInput === 'true' ? true : false),
      threat: this.CurrentChoiceInputThreat,
      skip: this.skipInput ,
      linked: this.linkedInput,
      multiple_choice: (this.multipleChoiceInput === 'true' ? true : false),
      choice_type: this.choiceTypeInput,
      position: this.positionInput,
      choices: this.CurrentChoicesArr,
    };
    this.questionService.createQuestion(quizData).subscribe(
      data => {
        this.notifyService.showSuccess('question created', 'Success')
        this.updatePage().then(e => this.viewSurvey(this.surveyNameOnView, this.surveyIdOnView));
      },
      error => this.notifyService.showError('could not create question ', 'Failed')
    )

  }
















 

  closeaddThreatModal() {
    this.addThreatModal.hide();
    this.isEditThreatModal = false;
    this.ThreatSectionStatus = false;
  }




 






  getThreats() {
    this.TemplateViewSectionStatus = false;
    this.ThreatsViewSectionStatus = true;
    this.ThreatsViewSectionStatus = true;
    this.FormSectionStatus = false;
  }

  clearThreat() {
    this.ThreatSectionStatus = true;
    this.FormSectionStatus = false;
    this.TemplateViewSectionStatus = false;
    this.ThreatsViewSectionStatus = true;
    this.threatName = '';
    this.threatRecom = '';
    this.threatLevel = '';
    this.threatType = '';
    this.threatCategory = '';
    this.threatValue1 = '';
    this.threatValue2 = '';
    this.threatLevels = [];
  }





  checkType() {
    // console.log(this.threatType);
  }




  addThreatTypes() {
    let classifier = [];
    if (this.threatValue1 && this.threatValue2) {
      classifier.push(parseInt(this.threatValue1));
      classifier.push(parseInt(this.threatValue2));
    } else {
      classifier.push(this.threatValue1);
    }
    const threat = {
      category: this.threatLevel,
      inference: this.threatRecom,
      classifier
    };
    this.threatLevels.push(threat);
    this.notifyService.showSuccess('Threat type', 'Success!');
    this.threatValue1 = '';
    this.threatValue2 = '';
    this.threatLevel = '';
    this.threatRecom = '';
        // console.log(this.threatLevels);
  }






  removeFromThreatLevels(index) {
    this.threatLevels.splice(index, 1);
  }




  addThreat() {
    let myData = {

      name: this.threatName,
      type: this.threatType,
      category: this.threatCategory,
      institutionId: sessionStorage.getItem('loggedUserID'),
      categorization_inferences: this.threatLevels,
      level: this.threatLevel,
      recom: this.threatRecom,
      alias: ''
    };

    this.threatService.createThreat(myData).subscribe(
      data => {this.updatePage().then(() => { this.notifyService.showSuccess('Threat added', 'Success'); this.addThreatModal.hide(); } ); },
      error => this.notifyService.showError('could not create threat', 'Failed')
    );
  }

  editThreat() {
    let myData = {
      name: this.threatName,
      type: this.threatType,
      category: this.threatCategory,
      categorization_inferences : this.threatLevels,
      level: this.threatLevel,
      recom: this.threatRecom,
      alias: ''
    };

    this.threatService.updateThreat(this.openThreat._id, myData).subscribe(
      data => {this.updatePage().then(() => { this.notifyService.showSuccess('Threat Edited', 'Success'); this.addThreatModal.hide(); } ); },
      error => this.notifyService.showError('could not create threat', 'Failed')
    );

  }


  addTrackerReason() {
    let dataResn: any = {reason: this.trackerReasonInput, institutionId: sessionStorage.getItem('loggedUserID')};
    this.trackerReasonService.createTrackerReason(dataResn).subscribe(
      data => {
        this.updatePage().then(() => {
          this.notifyService.showSuccess('reason added', 'Success');
          this.trackerReasonInput = '';
        });
      },
      error => this.notifyService.showError('could not add reason', 'Failed')
    );
  }

  deleteTrackerReason(id) {
    this.trackerReasonService.deleteTrackerReason(id).subscribe(
      data => {
        this.updatePage().then(() => {
          this.notifyService.showSuccess('reason deleted', 'Success');
          this.trackerReasonInput = '';
        });
      },
      error => this.notifyService.showError('could not delete reason', 'Failed')
    );
  }


  addIndustries() {
    this.ImprintLoader = true;
    this.industryService.createIndustry({industryName: this.industryInput, institutionId: sessionStorage.getItem('loggedUserID')}).subscribe(
      data => {
        this.updatePage().then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('industry added', 'Success');
          this.industryInput = '';
        });
      },
      error => { this.ImprintLoader = false; this.notifyService.showError('could not add industry', 'Failed') }
    );
  }

  deleteIndustry(id) {
    this.industryService.deleteIndustry(id).subscribe(
      data => {
        this.updatePage().then(() => {
          this.notifyService.showSuccess('industry deleted', 'Success');
          this.industryInput = '';
        });
      },
      error => this.notifyService.showError('could not delete industry', 'Failed')
    );
  }


  addActivityPlan() {
    this.ImprintLoader = true;
    this.activityPlanService.createActivityPlan({
      activityPlan: this.activityPlan, 
      institutionId: sessionStorage.getItem('loggedUserID'),
      threatId: this.activityPlanThreatId
    }).subscribe(
      data => {
        this.updatePage().then(() => {
          this.notifyService.showSuccess('Activity Plan added', 'Success');
          this.activityPlan = '';
          this.activityPlanThreatId = '';
          this.ImprintLoader = false;
        });
      },
      error => { this.ImprintLoader = false; this.notifyService.showError('could not add industry', 'Failed') }
    );
  }

  deleteActivityPlan(id) {
    this.ImprintLoader = true;
    this.activityPlanService.deleteActivityPlan(id).subscribe(
      data => {
        this.updatePage().then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Activity Plan deleted', 'Success');
          this.activityPlan = '';
          this.activityPlanThreatId = '';
        });
      },
      error => {this.ImprintLoader = false; this.notifyService.showError('could not delete industry', 'Failed') }
    );
  }







  async updater(){
    this.industryService.getAllIndustrys().subscribe(
      data =>{
        let allThreats = data;
        allThreats.forEach(threat=> {
          threat['institutionId']="5e7531b76879a6354e179ddf";
            this.industryService.updateIndustry(threat._id, threat).subscribe(data=>{
            console.log("updated")
          })
        })
      }
    )
  }


  addThreatCategory() {
    this.ImprintLoader = true;
    this.threatCategoryService.createThreatCategory({threatCategoryName: this.threatCategoryInput, institutionId: sessionStorage.getItem('loggedUserID')}).subscribe(
      data => {
        this.updatePage().then(() => {
          this.ImprintLoader = false;
          this.notifyService.showSuccess('Threat Category added', 'Success');
          this.threatCategoryInput = '';
        });
      },
      error => {this.notifyService.showError('Could not add threat category', 'Failed'); this.ImprintLoader = false;}
    );
  }

  deleteThreatCategory(id) {
    this.threatCategoryService.deleteThreatCategory(id).subscribe(
      data => {
        this.updatePage().then(() => {
          this.notifyService.showSuccess('Threat category deleted', 'Success');
          this.threatCategoryInput = '';
        });
      },
      error => this.notifyService.showError('Could not delete threat category', 'Failed')
    );
  }






  logOut() {
    this.homeComponent.logout();
  }

















  //Do not remove, may be needed in future

  // async duplicateQuestionsForThirdParty(){
    
  //   await this.questionService.getQuestionsInASurvey("{SurveyToDuplicateId}").subscribe(data=>
  //     { 
  //      data.forEach(question=>{
  //        delete question._id;
  //        question['surveyId'] = '{newSurveyId}';
  //        if(question['choices'].length>0){
  //          for(var i =0; i<question['choices'].length; i++){
  //            delete question['choices'][i]._id
  //          }
  //        }
  //        if(question['surveyId'] === '{newSurveyId}'){
  //          this.questionService.createQuestion(question).subscribe(data=>{
  //            console.log(data);
  //          }, err=>console.log(err))
  //        }
  //      })
  //      console.log("Done");
  //     }, err=>console.log(err))
  // }

  // async clearAllQuestionsInASurvey(){
  //   await this.questionService.getQuestionsInASurvey('{surveyIdToDelete}').subscribe(data =>{
      
  //     data.forEach(question =>{
  //       // console.log(question._id);
  //       this.questionService.deleteQuestion(question._id).subscribe(response=>{
  //         console.log(response); //keep this line..
  //       });
  //     })
  //   })
  
  // }
} 





// End of main class
