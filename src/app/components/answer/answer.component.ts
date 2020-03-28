import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/shared/services/questions.service';
import { ResponseService } from 'src/app/shared/services/responses.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ThreatService } from 'src/app/shared/services/threats.service';
import { async } from '@angular/core/testing';
@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.sass']
})
export class AnswerComponent implements OnInit {
  // tslint:disable: max-line-length
  // tslint:disable: prefer-const



  constructor(private questionService: QuestionService,
              private responseService: ResponseService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private threatService: ThreatService,
              private notification: NotificationService
              ) { }


    public AllResponses = [];
    public DoneQuestions = null;
    public myPreviousAnswers = [];
    public myPreviousResponseId = '';

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
    threat: any;




  ngOnInit() {
    localStorage.setItem('ActiveNav', 'survey');
    this.activeRoute.queryParams.subscribe(params => {
          this.surveyId = params.surveyId;
          this.surveyName = params.surveyName;
    });
    this.responseService.getAllResponses().subscribe(
      data => {this.AllResponses = data; this.checkIfSurveyHadBeenAnsweredBefore(); },
      error => console.log('Error geting all Responses')
    );


  }







  checkIfSurveyHadBeenAnsweredBefore() {
    const myResponses = this.AllResponses.filter((resp) => (resp.companyId === localStorage.getItem('loggedCompanyId') && resp.surveyId === this.surveyId) && resp.userId === localStorage.getItem('loggedUserID') ).map( e => e);

    if (myResponses.length > 0 ) {
      this.myPreviousResponseId = myResponses[0]._id;
      this.myPreviousAnswers = myResponses[0].answers;
      this.DoneQuestions = Number(this.myPreviousAnswers.length);
      this.structureQuestions();
      this.continuationFromBefore(this.DoneQuestions);
    } else {

      this.DoneQuestions = 0;
      this.getAndSetQuestions();
      this.structureQuestions();
    }
  }






  async getAndSetQuestions() {
    await this.questionService.getQuestionsInASurvey(this.surveyId).
     subscribe(data => {this.questions = data.sort((a, b) =>  a.position - b.position);  this.formatQuestions(); }, err => console.log(err));
  }




  async formatQuestions() {
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

  // impoertant...

  getThreatInference(){
    //check threat type, ie. direct value comparison or range comparison
    let response;
    if(this.responseArray[this.responseArray.length-1].answer){
      response = this.responseArray[this.responseArray.length-1].answer
    }
    else{
      response = this.responseArray[this.responseArray.length-1];
    }
    let feedback = {};
    this.responseArray['threatId'] = this.threat._id;
    // direct range comparison...
    if(this.threat.type === 0){
      for(var i=0; i< this.threat.categorization_inferences.length; i++){
        if(response == this.threat.categorization_inferences[i].classifier[0]){
          feedback = this.threat.categorization_inferences[i];
          this.responseArray['threat'] = feedback;
        }else{
         
        }
      }
    }
    // range comparison..
    if(this.threat.type === 1){
       // range representations using to..
      if(response.includes('to')){
        console.log(response.split('to'))
        let range = [];
        range.push(parseInt(response.split('to')[0]))
        range.push(parseInt(response.split('to')[1]))
        for(var i=0; i< this.threat.categorization_inferences.length; i++){
          if(JSON.stringify(range) === JSON.stringify(this.threat.categorization_inferences[i].classifier)){
             
            feedback = this.threat.categorization_inferences[i];
            this.responseArray['threat'] = feedback;
          }
        }
      }
      // value comparison
      else{
      for(var i=0; i< this.threat.categorization_inferences.length; i++){
        if(this.threat.categorization_inferences[i].classifier.length === 1){
          //if only one parameter is passed, ie, 10 and above, only 10 should be stored to process on this..
          console.log("only one param");
          if(parseInt(response) < this.threat.categorization_inferences[i].classifier[0]+1){
            feedback = this.threat.categorization_inferences[i];
            this.responseArray['threat'] = feedback;
          }
        }
        else{
          // console.log("Comparing agains two params", parseInt(response));
          //checking if value is within a given range out of the given ones
        if(this.threat.categorization_inferences[i].classifier[0]-1 < parseInt(response) && parseInt(response) < this.threat.categorization_inferences[i].classifier[1]+1)
        {
          feedback = this.threat.categorization_inferences[i];
          this.responseArray['threat'] = feedback;
        }
      }
    }
   }
  }
 }


  captureResponse() {
    this.responseArray = [];
    this.responseArray.push(this.response);
    
  }
  captureSingleResponse(ans) {
    this.responseArray = [];
    this.responseArray.push(ans);
  }

  captureMultipleResponses(ans) {

    if (this.responseArray.includes(ans)) {
      this.responseArray = this.responseArray.filter(a => a !== ans ).map( e => e );
    } else {
      this.responseArray.push(ans);

    }
  }

  async getThreat(id){
    await this.threatService.getOneThreat(id).subscribe(async data => {this.threat = data; console.log(this.threat); await this.getThreatInference();}, error =>console.log("ERROR"));
    return this.threat;
  }

  async Process(id){
  
      this.next(id);
     

  }


  async next(id) {
   
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


  continuationFromBefore(id) {

    this.questionService.getQuestionsInASurvey(this.surveyId).
    subscribe(data => {this.questions = data.sort((a, b) =>  a.position - b.position); console.log(this.questions);  this.formatQuestions2(id); this.structureAnswers2(id); }, err => console.log(err));

  }


  formatQuestions2(myId) {

    if (this.questions.length > 0) {
      this.questionTag = this.questions[myId].question;
      this.open = this.questions[myId].open_question;
      this.multiple = this.questions[myId].multiple_choice;
      this.type = this.questions[myId].choice_type;
      this.options = this.questions[myId].choices;
      this.pageNumber = myId + 1;
      this.totalPages = this.questions.length;


      if (this.questions.length === 1) {
        this.isLast = true;
      }
    }
  }








  async structureAnswers(id) {
    if(this.questions[id-1].threat){
    await this.threatService.getOneThreat(this.questions[id-1].threat).subscribe(async data => {this.threat = data; console.log(this.threat); await this.getThreatInference();
    //  console.log("Sending..",this.responseArray)
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
  }, error =>console.log("error"));
}else{
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
}



  structureAnswers2(id) {

    this.responseArray = [];
    this.response = '';
    this.answers = this.myPreviousAnswers;
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

    if ( this.DoneQuestions === 0 ) {
    await this.responseService.createResponse(answers).subscribe(
      data => {
        this.ImprintLoader = false;
        this.notification.showSuccess('Survey responses submited', 'Success');
        this.notification.showInfo('..for choosing to answer ours survey', 'Thank you');

        if ( localStorage.getItem('permissionStatus') === 'isThirdParty') { setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
        if ( localStorage.getItem('permissionStatus') === 'isAdmin') {  setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
        if ( localStorage.getItem('permissionStatus') === 'isCustomer') {  setTimeout(() => { this.router.navigate(['/home/survey']); }, 3000);  }


      }, err => {{this.ImprintLoader = false; this.notification.showWarning('Could not submit', 'Failled'); }});
    }

    if ( this.DoneQuestions > 0) {
      this.responseService.updateResponse(this.myPreviousResponseId, {answers: this.answers} ).subscribe(
        data => {
          this.ImprintLoader = false;
          this.notification.showSuccess('Survey responses submited', 'Success');
          this.notification.showInfo('..for choosing to answer ours survey', 'Thank you');

          if ( localStorage.getItem('permissionStatus') === 'isThirdParty') { setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
          if ( localStorage.getItem('permissionStatus') === 'isAdmin') {  setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
          if ( localStorage.getItem('permissionStatus') === 'isCustomer') {  setTimeout(() => { this.router.navigate(['/home/survey']); }, 3000);  }

        },
        error => {this.ImprintLoader = false; this.notification.showWarning('Could not submit', 'Failled'); }
      );
    }
  }








  saveAndExit() {
    this.ImprintLoader = true;
    this.answerStructure.answers = this.answers;
    if ( this.DoneQuestions === 0 ) {
      this.responseService.createResponse(this.answerStructure).subscribe(
        data => {
          this.ImprintLoader = false;
          this.notification.showSuccess('Survey responses submited', 'Success');
          this.notification.showInfo('..for choosing to answer ours survey', 'Thank you');

          if ( localStorage.getItem('permissionStatus') === 'isThirdParty') { setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
          if ( localStorage.getItem('permissionStatus') === 'isAdmin') {  setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
          if ( localStorage.getItem('permissionStatus') === 'isCustomer') {  setTimeout(() => { this.router.navigate(['/home/survey']); }, 3000);  }


        }, err => {{this.ImprintLoader = false; this.notification.showWarning('Could not submit', 'Failled'); }});
      }

    if ( this.DoneQuestions > 0) {
        this.responseService.updateResponse(this.myPreviousResponseId, {answers: this.answers} ).subscribe(
          data => {
            this.ImprintLoader = false;
            this.notification.showSuccess('Survey responses submited', 'Success');
            this.notification.showInfo('..for choosing to answer ours survey', 'Thank you');

            if ( localStorage.getItem('permissionStatus') === 'isThirdParty') { setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
            if ( localStorage.getItem('permissionStatus') === 'isAdmin') {  setTimeout(() => { this.router.navigate(['/home/dashboard']); }, 3000);  }
            if ( localStorage.getItem('permissionStatus') === 'isCustomer') {  setTimeout(() => { this.router.navigate(['/home/survey']); }, 3000);  }

          },
          error => {this.ImprintLoader = false; this.notification.showWarning('Could not submit', 'Failled'); }
        );
      }



  }

  back(){
    if ( localStorage.getItem('permissionStatus') === 'isThirdParty') {  this.router.navigate(['/home/dashboard']); }
    if ( localStorage.getItem('permissionStatus') === 'isAdmin') {  this.router.navigate(['/home/dashboard']); }
    if ( localStorage.getItem('permissionStatus') === 'isCustomer') { this.router.navigate(['/home/survey']); }
  }


}
