import { Component, OnInit } from '@angular/core';
import { faPlus, faSearch, faListAlt, faBackward } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SurveyService } from 'src/app/shared/services/survey.service';
import { QuestionService } from 'src/app/shared/services/questions.service';


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
  ) { }



  // loader
  public ImprintLoader = false;


// Icons
  public faPlus = faPlus;
  public faSearch = faSearch;
  public faListAlt = faListAlt;
  public faBackward = faBackward;


  //
  public AllSurveys = [];
  public AllQuestions = [];

  public TemplateNameOnView = [];
  public TemplateQuestions = [];

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

    this.surveyService.getAllSurveys().subscribe(
      data => this.AllSurveys = data,
      error => console.log('Error getting all surveys')
    );

    this.questionService.getAllQuestions().subscribe(
      data => this.AllQuestions = data,
      error => console.log('Error getting all question')
    );

  }



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
    this.CurrentQuestionArray.forEach( quiz => {
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

        },
        error => {this.notifyService.showError('Could not create Survey', 'Failed'); this.ImprintLoader = false; }
      );
    });
  }

  editQuestion(item){
    document.getElementById(item._id).style.display="block";
  }
  deleteQuestion(item){
    console.log(item);
  }






}
