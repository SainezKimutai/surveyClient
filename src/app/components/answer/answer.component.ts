import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ResponseService } from 'src/app/shared/services/response.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit {

  surveyId: any;
  surveyName: any;
  pageNumber: any = 1;
  totalPages: any = 10;
  questionTag: any;
  open: boolean;
  type: any;
  options: any = [];
  response: any;
  isLast = false;
  ImprintLoader = false;
  questions = [];
  answerStructure: any;
  answers: any = [];


  constructor(private questioService: QuestionService,
              private responseService: ResponseService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private notification: NotificationService) { }

  ngOnInit() {
    localStorage.setItem('ActiveNav', 'survey');
    this.activeRoute.queryParams.subscribe(params => {
     this.surveyId = params.surveyId;
     this.surveyName = params.surveyName;
  });
    this.getAndSetQuestions();
    this.structureQuestions();
  }

  async getAndSetQuestions() {
    await this.questioService.getQuestionsInASurvey(this.surveyId).
     subscribe(data => {this.questions = data; this.formatQuestions(); }, err => console.log(err));
  }
  formatQuestions() {
    if (this.questions.length > 0) {
      this.questionTag = this.questions[0].question;
      this.open = this.questions[0].open_question;
      this.type = this.questions[0].choice_type;
      this.options = this.questions[0].choices;
      this.pageNumber = 1;
      this.totalPages = this.questions.length;

      if (this.questions.length === 1) {
        this.isLast = true;
      }
    }
  }
  next(id) {
    this.structureAnswers(id);
    if (id !== this.questions.length) {
    this.questionTag = this.questions[id].question;
    this.open = this.questions[id].open_question;
    this.type = this.questions[id].choice_type;
    this.options = this.questions[id].choices;
    this.pageNumber = id + 1;
    this.totalPages = this.questions.length;
    }
  }
  structureAnswers(id) {
    const answer = {
      questionId: this.questions[id - 1]._id,
      answer : this.response
    };
    this.response = '';
    this.answers.push(answer);
    if (id === this.questions.length - 1) {
      this.isLast = true;
    }
    if (id === this.questions.length) {
      this.ImprintLoader = true;
      this.answerStructure.answers= this.answers;
      this.postAnswers(this.answerStructure);
    }
  }
  structureQuestions() {
    this.answerStructure = {
      surveyId: this.surveyId,
      userId: localStorage.getItem('loggedUserID'),
    };
  }
  async postAnswers(answers) {
    await this.responseService.sendResponse(answers).subscribe(data => {
      console.log(this.response);
      {this.notification.showSuccess('Survey resonses submited', 'Success');  this.ImprintLoader = false; }
      this.router.navigate(['/home/dashboard']);
    }, err => {{this.notification.showWarning('Could not submit', 'Failled');  this.ImprintLoader = false; }});
  }
}
