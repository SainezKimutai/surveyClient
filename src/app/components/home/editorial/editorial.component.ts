import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { faPlus, faSearch, faListAlt, faTrashAlt, faExclamationTriangle, faEye,
  faBackward, faEdit, faTrash, faBuilding, faComments, faFire} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ModalDirective, ModalOptions, ModalModule } from 'ngx-bootstrap';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { IndustryService } from 'src/app/shared/services/industry.service';
import { TrackerReasonService } from 'src/app/shared/services/trackerReasons.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.sass']
})
export class EditorialComponent implements OnInit {
// tslint:disable

  constructor(
    private notifyService: NotificationService,
    private surveyService: SurveyService,
    private questionService: QuestionService,
    private threatService: ThreatService,
    private industryService: IndustryService,
    private _formBuilder: FormBuilder,
    private trackerReasonService: TrackerReasonService
  ) {  }

// Modals

@ViewChild('addThreatModal', {static: true}) addThreatModal: ModalDirective;
@ViewChild('deletePromptModal', {static: true}) deletePromptModal: ModalDirective;


  // loader
  public ImprintLoader = false;


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


  //
  public AllSurveys = [];
  public AllQuestions = [];
  public AllThreats = [];
  public AllTrackerReasons = [];
  public AllIndustrys = [];

  public TemplateNameOnView = [];
  public TemplateQuestions = [];
  public surveyIdOnView = '';
  public surveyNameOnView = '';
  public QuestionIdOnEdit = '';
  public ChoicesStatus = false;

  public CurrentSurveyInput = '';
  public CurrentChoicesArr = [];
  public CurrentQuestionArray = [];
  public CurrentQuestionInput = '';
  public CurrentChoiceInput = '';
  public CurrentChoiceInputThreat = '';

  public openQuestionInput = 'true';
  public multipleChoiceInput = 'false';
  public choiceTypeInput = 'string';
  public positionInput = 1;

  public EditSurveyInput = '';
  public EditChoicesArr = [];
  public EditQuestionArray = [];
  public EditQuestionInput = '';
  public EditChoiceInput = '';
  public EditChoiceInputThreat = '';

  public EditopenQuestionInput = 'true';
  public EditmultipleChoiceInput = 'false';
  public EditchoiceTypeInput = 'string';
  public EditpositionInput = 1;


  public AddedQuestionsArray = [];

// status
  public FormSectionStatus = false;
  public ThreatSectionStatus = false;
  public TemeplateViewSectionStatus = true;
  public QuestionsViewStatus = false;
  public SurveyFormStatus = true;
  public QuestionFormStatus = false;
  public ThreatsViewSectionStatus = false;

  public threatName = '';
  public threatType = '';
  public threatLevels = [];
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











  ngOnInit() {
    localStorage.setItem('ActiveNav', 'editorial');
    this.updatePage();

  }












  updatePage() {
    return new Promise((resolve, reject) => {
        this.surveyService.getAllSurveys().subscribe(
          data => this.AllSurveys = data,
          error => console.log('Error getting all surveys')
        );
        this.questionService.getAllQuestions().subscribe(
          data => this.AllQuestions = data,
          error => console.log('Error getting all question')
        );
        this.industryService.getAllIndustrys().subscribe(
          data => this.AllIndustrys = data,
          error => console.log('Error getting all industries')
        );
        this.trackerReasonService.getAllTrackerReasons().subscribe(
          data => this.AllTrackerReasons = data,
          error => console.log('Error getting all tracker reasons')
        );
        this.threatService.getAllThreats().subscribe(
          data => {this.AllThreats = data; resolve(); },
          error => console.log('Error getting all threats')
        );
    });
  }




  createNewSurveyTemplate() {
    this.FormSectionStatus = true;
    this.TemeplateViewSectionStatus = false;
    this.ThreatSectionStatus = false;
    this.QuestionsViewStatus = false;
    this.ThreatsViewSectionStatus = false;
    this.newSurveyStatus = true;
    this.editSurveyQuestionStatus = false;
    this.addSurveyQuestionsSatus = false;
  }

  viewSurveyTemplates() {
    this.FormSectionStatus = false;
    this.TemeplateViewSectionStatus = true;
    this.ThreatSectionStatus = false;
    this.QuestionsViewStatus = false;
    this.ThreatsViewSectionStatus = false;
    this.newSurveyStatus = false;
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
    this.TemeplateViewSectionStatus = false;
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
          this.CurrentChoicesArr.push({ answer: inf.classifier[0]});
        })
      }else{
        threat.categorization_inferences.forEach( (inf) => {
          this.CurrentChoicesArr.push({ answer: inf.classifier[0].toString() + " to " + inf.classifier[1].toString()});
        })
      }
      }
    }
  }


  addChoice() {
    if (this.CurrentChoiceInput === '') {
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      this.CurrentChoicesArr.push({ answer: this.CurrentChoiceInput});
      this.CurrentChoiceInput = '';
    }

  }

  removeAns(x) {
    this.CurrentChoicesArr.splice(x, 1);
  }


  nextQuestion() {
    if (this.CurrentQuestionInput === '') {
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      const quizData = {
        question: this.CurrentQuestionInput,
        open_question: this.openQuestionInput,
        threat: this.CurrentChoiceInputThreat,
        multiple_choice: this.multipleChoiceInput,
        choice_type: this.choiceTypeInput,
        position: this.positionInput,
        choices: this.CurrentChoicesArr,
      };


      this.CurrentQuestionArray.push(quizData);
      this.CurrentQuestionInput = '';
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
    this.surveyService.createSurvey({surveyName: this.CurrentSurveyInput}).subscribe(
      dataSurvey => {
        this.createQuestions(dataSurvey);
      },
      error => {this.notifyService.showError('Could not create Survey', 'Failed'); this.ImprintLoader = false; }
    );
  }


  createQuestions(survey) {
    this.CurrentQuestionArray.forEach( (quiz, idx, array) => {
      const myQuizData = {
        surveyId: survey._id,
        question: quiz.question,
        threat: quiz.threat,
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
    this.FormSectionStatus = true;
    this.TemeplateViewSectionStatus = false;
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
    this.positionInput = this.TemplateQuestions.length + 1;
    this.FormSectionStatus = true;
    this.TemeplateViewSectionStatus = false;
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
    this.TemeplateViewSectionStatus = false;
    this.ThreatsViewSectionStatus = true;
    this.ThreatsViewSectionStatus = true;
    this.FormSectionStatus = false;
  }

  clearThreat() {
    this.ThreatSectionStatus = true;
    this.FormSectionStatus = false;
    this.TemeplateViewSectionStatus = false;
    this.ThreatsViewSectionStatus = true;
    this.threatName = '';
    this.threatRecom = '';
    this.threatLevel = '';
    this.threatType = '';
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
    this.trackerReasonService.createTrackerReason({reason: this.trackerReasonInput}).subscribe(
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
    this.industryService.createIndustry({industryName: this.industryInput}).subscribe(
      data => {
        this.updatePage().then(() => {
          this.notifyService.showSuccess('industry added', 'Success');
          this.industryInput = '';
        });
      },
      error => this.notifyService.showError('could not add industry', 'Failed')
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


















} // End of main class
