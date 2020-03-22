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
  // tslint:disable: max-line-length




  constructor(private questioService: QuestionService,
              private responseService: ResponseService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private notification: NotificationService) { }



    surveyId: any;
    surveyName: any;
    pageNumber: any = 1;
    totalPages: any = 10;
    questionTag: any;
    open: boolean;
    multiple: boolean;
    type: any;
    options: any = [];
    response: any;
    responseArray = [];
    isLast = false;
    ImprintLoader = false;
    questions = [];
    answerStructure: any;
    answers: any = [];




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
     subscribe(data => {this.questions = data.sort((a, b) =>  b.position - a.position);  this.formatQuestions(); }, err => console.log(err));
  }




  formatQuestions() {
    if (this.questions.length > 0) {
      this.questionTag = this.questions[0].question;
      this.open = this.questions[0].open_question;
      this.multiple = this.questions[0].multiple_choice;
      this.type = this.questions[0].choice_type;
      this.options = this.questions[0].choices;
      this.pageNumber = 1;
      this.totalPages = this.questions.length;

      if (this.questions.length === 1) {
        this.isLast = true;
      }
    }
  }



  captureResponse() {
    this.responseArray = [];
    this.responseArray.push(this.response);
  }

  captureMultipleResponses(ans) {

    if (this.responseArray.includes(ans)) {
      this.responseArray = this.responseArray.filter(a => a !== ans ).map( e => e );
    } else {
      this.responseArray.push(ans);

    }
  }



  next(id) {
    this.structureAnswers(id);
    if (id !== this.questions.length) {
    this.questionTag = this.questions[id].question;
    this.open = this.questions[id].open_question;
    this.multiple = this.questions[id].multiple_choice;
    this.type = this.questions[id].choice_type;
    this.options = this.questions[id].choices;
    this.pageNumber = id + 1;
    this.totalPages = this.questions.length;
    }
  }






  structureAnswers(id) {
    const answer = {
      questionId: this.questions[id - 1]._id,
      answer : this.responseArray
    };
    this.responseArray = [];
    this.response = '';
    this.answers.push(answer);
    if (id === this.questions.length - 1) {
      this.isLast = true;
    }
    if (id === this.questions.length) {
      this.ImprintLoader = true;
      this.answerStructure.answers = this.answers;
      this.postAnswers(this.answerStructure);
    }
  }






  structureQuestions() {
    this.answerStructure = {
      surveyId: this.surveyId,
      userId: localStorage.getItem('loggedUserID'),
      companyId: localStorage.getItem('loggedCompanyId')
    };
  }






  async postAnswers(answers) {
    await this.responseService.sendResponse(answers).subscribe(
      data => {
      this.ImprintLoader = false;
      this.notification.showSuccess('Survey responses submited', 'Success');
      this.notification.showInfo('..for choosing to answer ours survey', 'Thank you');

      if ( localStorage.getItem('permissionStatus') === 'isThirdParty') { setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
      if ( localStorage.getItem('permissionStatus') === 'isAdmin') {  setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
      if ( localStorage.getItem('permissionStatus') === 'isCustomer') {  setTimeout(() => { this.router.navigate(['/home/profile']); }, 3000);  }


    }, err => {{this.ImprintLoader = false; this.notification.showWarning('Could not submit', 'Failled'); }});
  }




}
