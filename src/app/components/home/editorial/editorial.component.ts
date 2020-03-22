import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { faPlus, faSearch, faListAlt, faBackward, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ModalDirective, ModalOptions, ModalModule } from 'ngx-bootstrap';


@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.sass']
})
export class EditorialComponent implements OnInit {


  constructor(
    private notifyService: NotificationService,
    private surveyService: SurveyService,
    private questionService: QuestionService
  ) {  }

// Modals
@ViewChild('editModal', {static: true, }) editModal: ModalDirective;
@ViewChild('addQuizModal', {static: true, }) addQuizModal: ModalDirective;

  // loader
  public ImprintLoader = false;


// Icons
  public faPlus = faPlus;
  public faSearch = faSearch;
  public faListAlt = faListAlt;
  public faBackward = faBackward;
  public faEdit = faEdit;
  public faTrash = faTrash;


  //
  public AllSurveys = [];
  public AllQuestions = [];

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

  public openQuestionInput = 'true';
  public multipleChoiceInput = 'true';
  public choiceTypeInput = 'string';
  public positionInput = 1;

  public EditSurveyInput = '';
  public EditChoicesArr = [];
  public EditQuestionArray = [];
  public EditQuestionInput = '';
  public EditChoiceInput = '';

  public EditopenQuestionInput = 'true';
  public EditmultipleChoiceInput = 'true';
  public EditchoiceTypeInput = 'string';
  public EditpositionInput = 1;


  public AddedQuestionsArray = [];

  // status
    public FormSectionStatus = false;
    public TemeplateViewSectionStatus = true;
    public QuestionsViewStatus = false;
    public SurveyFormStatus = true;
    public QuestionFormStatus = false;






  ngOnInit() {
    localStorage.setItem('ActiveNav', 'editorial');
    this.updatePage();


  }
  updatePage() {
    return new Promise((resolve, reject) => {

      this.surveyService.getAllSurveys().subscribe(
        dataS => {this.AllSurveys = dataS;

                  this.questionService.getAllQuestions().subscribe(
            dataQ => {this.AllQuestions = dataQ; resolve(); },
            error => console.log('Error getting all question')
          );

        },
        error => console.log('Error getting all surveys')
        );
       });
      }


  // updatePage() {

  //   this.surveyService.getAllSurveys().subscribe(
  //     data => this.AllSurveys = data,
  //     error => console.log('Error getting all surveys')
  //   );

  //   this.questionService.getAllQuestions().subscribe(
  //     data => this.AllQuestions = data,
  //     error => console.log('Error getting all question')
  //   );

  // }



  createNewSurveyTemplate() {
    this.FormSectionStatus = true;
    this.TemeplateViewSectionStatus = false;
    this.QuestionsViewStatus = false;
  }

  viewSurveyTemplates() {
    this.FormSectionStatus = false;
    this.TemeplateViewSectionStatus = true;
    this.QuestionsViewStatus = false;
  }



  viewSurvey(name, id) {
    this.TemplateQuestions = [];
    this.TemplateNameOnView = name;
    // for use later in rerender..
    this.surveyIdOnView = id;
    this.surveyNameOnView = name;

    this.TemplateQuestions = this.AllQuestions.filter(( quiz) => quiz.surveyId === id ).map(e => e);
    this.FormSectionStatus = false;
    this.TemeplateViewSectionStatus = false;
    this.QuestionsViewStatus = true;

  }




  swithToQuestionForm() {
    this.SurveyFormStatus = false;
    this.QuestionFormStatus = true;
  }

  swithToSurveyForm() {
    this.SurveyFormStatus = true;
    this.QuestionFormStatus = false;
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
    }
    if (type === 'false') {
      this.ChoicesStatus = true;
      this.openQuestionInput = 'false';
      this.multipleChoiceInput = 'true';
      this.choiceTypeInput = 'string';
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



  nextQuestion() {
    if (this.CurrentQuestionInput === '') {
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      const quizData = {
        question: this.CurrentQuestionInput,
        open_question: this.openQuestionInput,
        multiple_choice: this.multipleChoiceInput,
        choice_type: this.choiceTypeInput,
        position: this.positionInput,
        choices: this.CurrentChoicesArr,

      };
      this.CurrentQuestionArray.push(quizData);
      this.CurrentQuestionInput = '';
      this.openQuestionInput = '';
      this.multipleChoiceInput = '';
      this.choiceTypeInput = '';
      this.CurrentChoicesArr = [];
      this.positionInput++;
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
            this.openQuestionInput = '';
            this.multipleChoiceInput = '';
            this.choiceTypeInput = '';
            this.CurrentChoicesArr = [];
            this.positionInput++;
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
    this.editModal.show();
    this.EditQuestionInput = item.question;
    this.EditpositionInput = item.position;
    this.QuestionIdOnEdit = item._id;
  }
  deleteQuestion(item) {
    this.questionService.deleteQuestion(item._id).subscribe(data => {this.notifyService.showWarning('Deleted Question', 'Deleted!');
                                                                     // tslint:disable-next-line: max-line-length
                                                                     this.updatePage().then(e => this.viewSurvey(this.surveyNameOnView, this.surveyIdOnView));
    },
      err => this.notifyService.showWarning('Question was not delete', 'Failed!'));
  }
  EditaddChoice() {
    if (this.EditChoiceInput === '') {
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      this.EditChoicesArr.push({ answer: this.EditChoiceInput});
      this.EditChoiceInput = '';
    }
  }

  saveEditQuestion() {
    this.editModal.hide();
    const Question = {
      surveyId: this.surveyIdOnView,
      question: this.EditQuestionInput,
      open_question: (this.EditopenQuestionInput === 'true' ? true : false),
      multiple_choice: (this.EditmultipleChoiceInput === 'true' ? true : false),
      choice_type: this.EditchoiceTypeInput,
      position: this.EditpositionInput,
      choices: this.EditChoicesArr
    };
    this.questionService.updateQuestion(this.QuestionIdOnEdit, Question).subscribe(
      data => {this.notifyService.showSuccess('Question Successfully Editted', 'Success!');
               this.updatePage().then(() => this.viewSurvey(this.surveyNameOnView, this.surveyIdOnView));
    },
      err => this.notifyService.showError('Question was not editted', 'Failed')
    );
  }





  closeAddQuizModal() {
    this.addQuizModal.hide();
    this.updatePage().then(() => this.viewSurvey(this.surveyNameOnView, this.surveyIdOnView));
  }


  addMoreQuestions() {
    const myAddedQuiz = {
      surveyId: this.surveyIdOnView,
      question: this.EditQuestionInput,
      open_question: (this.EditopenQuestionInput === 'true' ? true : false),
      multiple_choice: (this.EditmultipleChoiceInput === 'true' ? true : false),
      choice_type: this.EditchoiceTypeInput,
      position: this.EditpositionInput,
      choices: this.EditChoicesArr
    };


    this.AddedQuestionsArray.push(myAddedQuiz);
    this.TemplateQuestions.push(myAddedQuiz);
    this.EditQuestionInput = '';
    this.EditopenQuestionInput = 'true';
    this.EditmultipleChoiceInput = 'true';
    this.EditchoiceTypeInput = 'string';
    this.EditpositionInput = (this.TemplateQuestions.length + 1 );
    this.EditChoicesArr = [];

  }




  addQuestionToExistingTemplate() {
    this.ImprintLoader = true;
    this.AddedQuestionsArray.forEach( (quiz, idx, array) => {

      this.questionService.createQuestion(quiz).subscribe(
        data => {



          if (idx === array.length - 1) {
            this.EditQuestionInput = '';
            this.EditopenQuestionInput = 'true';
            this.EditmultipleChoiceInput = 'true';
            this.EditchoiceTypeInput = 'string';
            this.EditpositionInput = (this.TemplateQuestions.length + 1 );
            this.EditChoicesArr = [];
            this.ImprintLoader = false;
            this.updatePage().then(() => this.viewSurvey(this.surveyNameOnView, this.surveyIdOnView));
            this.notifyService.showSuccess('Questions Added', 'Success');
            this.addQuizModal.hide();
          }

        },
        error => {this.notifyService.showError('Could not create Survey', 'Failed'); this.ImprintLoader = false; }
      );
    });
  }











}
