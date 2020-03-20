import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.sass']
})
export class EditorialComponent implements OnInit {




  constructor(
    private notifyService: NotificationService
  ) { }




  public faPlus = faPlus;

  public ChoicesStatus = false;

  public CurrentSurveyInput = '';
  public CurrentChoicesArr = [];
  public CurrentQuestionArray = [];
  public CurrentQuestionInput = '';
  public CurrentChoiceInput = '';
  
  public openQuestionInput = '';
  public multipleChoiceInput = '';
  public choiceTypeInput = '';
  public positionInput = null;



  // status
    public SurveyFormStatus = true;
    public QuestionFormStatus = false;






  ngOnInit() {
    localStorage.setItem('ActiveNav', 'editorial');
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
    if (type === 'open') {
      this.ChoicesStatus = false;
    }
    if (type === 'closed'){
      this.ChoicesStatus = true;
    }
  }


  addChoice() {
    if (this.CurrentChoiceInput === ''){
      this.notifyService.showWarning('Input answer', 'Empty Array');
    } else {
      this.CurrentChoicesArr.push(this.CurrentChoiceInput);
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

      }
      this.CurrentQuestionArray.push(quizData);
      this.CurrentQuestionInput = '';
    }
  }









}
