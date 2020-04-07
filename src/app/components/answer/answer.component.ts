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
  // tslint:disable
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
    public questionsLength:number;

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
    holderResponseArray = [];
    isLast = false;
    ImprintLoader = false;
    questions = [];
    answerStructure: any;
    answers: any = [];
    threat: any;
    skip = false;
    currentQuestionIndex : any;

    // previous step valriables
    public previousSteps = 0;
    public answerHasChange = false;
    public quizIdOfAnswerOnEdit = '';



  ngOnInit() {
    localStorage.setItem('ActiveNav', 'survey');
    this.activeRoute.queryParams.subscribe(params => {
          this.surveyId = params.surveyId;
          this.surveyName = params.surveyName;
    });
    // this.responseService.getAllResponses().subscribe(
    //   data => {this.AllResponses = data; this.checkIfSurveyHadBeenAnsweredBefore(); },
    //   error => console.log('Error geting all Responses')
    // );
    let dataToSend = {
      surveyId: this.surveyId,
      companyId: localStorage.getItem('loggedCompanyId'),
      userId: localStorage.getItem('loggedUserID')
    }
    this.responseService.getByUserIdCompanyIdSurveyId(dataToSend).subscribe(
      data => {this.AllResponses = data; console.log(this.AllResponses); this.checkIfSurveyHadBeenAnsweredBefore(); },
      error => console.log('Error geting all Responses')
    );



  }


  checkIfSurveyHadBeenAnsweredBefore() {
    // const myResponses = this.AllResponses.filter((resp) => (resp.companyId === localStorage.getItem('loggedCompanyId') && resp.surveyId === this.surveyId) && resp.userId === localStorage.getItem('loggedUserID') ).map( e => e);
    const myResponses = this.AllResponses;

    if (myResponses.length > 0 ) {
      this.myPreviousResponseId = myResponses[0]._id;
     
      myResponses[0].answers.forEach(answer => {
        
        let formatedAnswer = {};
        let questionId = answer.questionId;
        let position = answer.position;
        let structured = [];
        let choice = {answer: answer.answer[0].answer};
        let threat = {classifier: [answer.answer[0].answer], category: answer.answer[0].level, inference: answer.answer[0].recom};
        structured.push(choice);
        structured["threatId"] = answer.answer[0].threatId;
        structured["threatName"] = answer.answer[0].threat;
        structured["threat"] = threat;
        formatedAnswer = {
          questionId: questionId,
          position: position,
          answer: structured
        }
        this.myPreviousAnswers.push(formatedAnswer);
      });
      
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
     subscribe(data => {this.questions = data.sort((a, b) =>  a.position - b.position); this.formatQuestions(); }, err => console.log(err));
  }


  async formatQuestions() {
    if (this.questions.length > 0) {
      
      this.questionTag = this.questions[0].question;
      this.skip = (this.questions[0].skip ? true: false);
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
    this.responseArray['threatName'] = this.threat.name;
    // direct range comparison...
    if(this.threat.type === 0){
     
      for(var i=0; i< this.threat.categorization_inferences.length; i++){
        if(response == this.threat.categorization_inferences[i].classifier[0]){
          feedback = this.threat.categorization_inferences[i];
          this.responseArray['threat'] = feedback;
          this.responseArray['skipNext'] = this.threat.skipNext;
          
        }else{
         
        }
      }
    }
    // range comparison..
    if(this.threat.type === 1){
       // range representations using to..
      if(response.includes('to')){
        // console.log(response.split('to'))
        let range = [];
        range.push(parseInt(response.split('to')[0]))
        range.push(parseInt(response.split('to')[1]))
        for(var i=0; i< this.threat.categorization_inferences.length; i++){
          if(JSON.stringify(range) === JSON.stringify(this.threat.categorization_inferences[i].classifier)){
             
            feedback = this.threat.categorization_inferences[i];
            this.responseArray['threat'] = feedback;
            this.responseArray['skipNext'] = this.threat.skipNext;
          }
        }
      }
      // value comparison
      else{
      for(var i=0; i< this.threat.categorization_inferences.length; i++){
        if(this.threat.categorization_inferences[i].classifier.length === 1){
          //if only one parameter is passed, ie, 10 and above, only 10 should be stored to process on this..
          // console.log("only one param");
          if(parseInt(response) < this.threat.categorization_inferences[i].classifier[0]+1){
            // console.log(parseInt(response));
            feedback = this.threat.categorization_inferences[i];
            this.responseArray['threat'] = feedback;
            this.responseArray['skipNext'] = this.threat.skipNext;
          }
        }
        else{
          // console.log("Comparing agains two params", parseInt(response));
          //checking if value is within a given range out of the given ones
        if(this.threat.categorization_inferences[i].classifier[0]-1 < parseInt(response) && parseInt(response) < this.threat.categorization_inferences[i].classifier[1]+1)
        {
          feedback = this.threat.categorization_inferences[i];
          this.responseArray['threat'] = feedback;
           this.responseArray['skipNext'] = this.threat.skipNext;
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
    if(this.responseArray.length > 0){
      this.responseArray.forEach(response => {
        response = response+" , "+ans.answer;
        this.responseArray[0]=response;
      });
    }else{
      this.responseArray.push(ans.answer)
    }
    
  }

  async getThreat(id){
    await this.threatService.getOneThreat(id).subscribe(async data => {this.threat = data;  await this.getThreatInference();}, error =>console.log("ERROR"));
    return this.threat;
  }

  async Process(id){
  
     await this.next(id); 

  }


  async next(id) {
     

    if(this.responseArray.length === 0){
     
      this.responseArray.push("Not answered")
    }
    if(!this.response && this.responseArray.length === 0){
      
       this.responseArray[0]="Not answered";
    }
    this.holderResponseArray = this.responseArray;
   
    await this.structureAnswers(id);

 }
  

  continuationFromBefore(id) {

    this.questionService.getQuestionsInASurvey(this.surveyId).
    subscribe(data => {this.questions = data.sort((a, b) =>  a.position - b.position);  this.formatQuestions2(id); this.structureAnswers2(id); }, err => console.log(err));

  }


  formatQuestions2(myId) {

    if (this.questions.length > 0) {

      this.questionTag = this.questions[myId].question;
      this.skip = this.questions[myId].skip;
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



async proceedToNext(id){

  const responseArray = this.holderResponseArray;
  

  if (id !== this.totalPages) {
    

    if(this.questions[id-1].linked){

      let skipNext = responseArray[0].skipNext ? true : false; 

      if(skipNext){
     
      if(id !== this.totalPages-1){
      if(id !== this.totalPages){
         
        this.questionTag = this.questions[id+1].question;
        this.skip =(this.questions[id+1].skip ? true: false);
        this.open = this.questions[id+1].open_question;
        this.multiple = this.questions[id+1].multiple_choice;
        this.type = this.questions[id+1].choice_type;
        this.options = this.questions[id+1].choices;
        this.pageNumber = id+2;
        this.totalPages = this.questions.length;
     
      }
     }

      }else{
        this.questionTag = this.questions[id].question;
        this.skip = (this.questions[id].skip ? true:false);
        this.open = this.questions[id].open_question;
        this.multiple = this.questions[id].multiple_choice;
        this.type = this.questions[id].choice_type;
        this.options = this.questions[id].choices;
        this.pageNumber = id + 1;
        this.totalPages = this.questions.length;
        
      }
    }
     else{
      this.questionTag = this.questions[id].question;
      this.skip = (this.questions[id].skip ? true: false);
      this.open = this.questions[id].open_question;
      this.multiple = this.questions[id].multiple_choice;
      this.type = this.questions[id].choice_type;
      this.options = this.questions[id].choices;
      this.pageNumber = id + 1;
      this.totalPages = this.questions.length;
    
   }
  
 }
//  this.holderResponseArray = []
}




  async structureAnswers(id) {
    if(this.questions[id-1].threat){
      // console.log(this.questions[id-1]);
      await this.threatService.getOneThreat(this.questions[id-1].threat).subscribe(async data => {
        this.threat = data; 
        await this.getThreatInference();
 
       const answer = {
        questionId: this.questions[id - 1]._id,
        position: this.questions[id-1].position,
        answer : this.responseArray
      };

     
      await this.answers.push(answer);

      if(this.questions[id-1].linked){ 
      //check if linked == true
        if(this.responseArray[0].skipNext){
          //check if  skipNext == true
          if (id === this.totalPages-1) { 
            // check if the next question after skip is the last..
             this.isLast = true;
             this.proceedToNext(id)
          } 
          if (this.questions[id+1]==null) { 
            // current question is the last question
           
             this.ImprintLoader = true;
             this.answerStructure.answers = this.answers;
             await this.postAnswers(this.answerStructure);
          }
          this.responseArray = [];
          this.skip = false;
          this.response = '';
          this.proceedToNext(id)

        }else{//if skipNext !=true
          if (id === this.totalPages - 1) {
            this.isLast = true;
            this.proceedToNext(id)
          } 
          if (id === this.totalPages) {
            this.ImprintLoader = true;
            this.answerStructure.answers = this.answers;
            await this.postAnswers(this.answerStructure);
          }
        }
        this.responseArray = [];
        this.skip = false;
        this.response = '';
        this.proceedToNext(id)

      }
      else{ //not linked, continue as normal.
        if (id === this.totalPages - 1) {
          this.isLast = true;
          this.proceedToNext(id);
        }
        if (id === this.totalPages) {
          this.ImprintLoader = true;
          this.answerStructure.answers = this.answers;
          await this.postAnswers(this.answerStructure);
        }

        this.responseArray = [];
        this.skip = false;
        this.response = '';
        this.proceedToNext(id)

      }
      
      this.responseArray = [];
      this.skip = false;
      this.response = '';
      // console.log("Goind to next")
      // this.proceedToNext(id)

     }, error =>{
     console.log("error")
     this.proceedToNext(id)
    });
    }else{//if question does not have a threat..
      const answer = {
        questionId: this.questions[id - 1]._id,
        position: this.questions[id - 1].position,
        answer : this.responseArray
      };
       
      await this.answers.push(answer);

      if(this.questions[id-1].linked){ 
        //check if linked == true
          if(this.responseArray[0].skipNext){//check if  skipNext == true
            if (id === this.totalPages-1) { // check if the next question after skip is the last..
               this.isLast = true;
               this.proceedToNext(id)
            }
            if (this.questions[id+1]==null) { // current question is the last question
               this.ImprintLoader = true;
               this.answerStructure.answers = this.answers;
               await this.postAnswers(this.answerStructure);
            }
            this.responseArray = [];
            this.skip = false;
            this.response = '';
            this.proceedToNext(id)
  
          }else{//if skipNext !=true
            if (id === this.totalPages - 1) {
              this.isLast = true;
              this.proceedToNext(id)
            } 
            if (id === this.totalPages) {
              this.ImprintLoader = true;
              this.answerStructure.answers = this.answers;
              await this.postAnswers(this.answerStructure);
            }
          }
          this.responseArray = [];
          this.skip = false;
          this.response = '';
          this.proceedToNext(id)
  
        }
        else{ //not linked, continue as normal.
          if (id === this.totalPages - 1) {
            this.isLast = true;
            this.proceedToNext(id);
          }
          if (id === this.totalPages) {
            this.ImprintLoader = true;
            this.answerStructure.answers = this.answers;
            await this.postAnswers(this.answerStructure);
          }
  
          this.responseArray = [];
          this.skip = false;
          this.response = '';
          this.proceedToNext(id)
        }
}
}


  structureAnswers2(id) {

    this.responseArray = [];
    this.response = '';
    this.skip = false;
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
        if ( localStorage.getItem('permissionStatus') === 'isCustomer') {  setTimeout(() => { this.router.navigate(['/home/reports']); }, 3000);  }


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



















  moveToPreviousQuestion() {
    this.previousSteps = this.previousSteps + 1;
  
    let id = this.pageNumber - 2;
  
    this.questionTag = this.questions[id].question;
    this.skip = (this.questions[id].skip ? true: false);
    this.open = this.questions[id].open_question;
    this.multiple = this.questions[id].multiple_choice;
    this.type = this.questions[id].choice_type;
    this.options = this.questions[id].choices;
    this.pageNumber = this.pageNumber - 1;
    this.totalPages = this.questions.length;
    this.quizIdOfAnswerOnEdit = this.questions[id]._id


    for (let ans of this.answers) {
      if (ans.questionId === this.quizIdOfAnswerOnEdit) { 
          this.response = ans.answer[0].answer ? 
                          ans.answer[0].answer.answer ? ans.answer[0].answer.answer : ans.answer[0].answer
                          : ans.answer[0] 
        break;
      }
    }


    this.answerHasChange = false;
   
  }







  detectChangeOnAnswer() {
    this.answerHasChange = true;
    
  }




  updatePreviousAnswers() {
    this.previousSteps = this.previousSteps - 1;

    if (this.answerHasChange) {

      this.answers = this.answers.filter((ans) => ans.questionId !== this.quizIdOfAnswerOnEdit).map(e => e);
      this.checkValueOfPreviousAnswers(this.pageNumber)

    }
    if (!this.answerHasChange) {
      let id = this.pageNumber;
  
      this.questionTag = this.questions[id].question;
      this.skip = (this.questions[id].skip ? true: false);
      this.open = this.questions[id].open_question;
      this.multiple = this.questions[id].multiple_choice;
      this.type = this.questions[id].choice_type;
      this.options = this.questions[id].choices;
      this.pageNumber = this.pageNumber + 1;
      this.totalPages = this.questions.length;
  
      if (this.previousSteps !== 0) {
      this.quizIdOfAnswerOnEdit = this.questions[id]._id
      this.response = this.answers[id].answer[0].answer ? 
                              this.answers[id].answer[0].answer.answer ? this.answers[id].answer[0].answer.answer : this.answers[id].answer[0].answer
                              : this.answers[id].answer[0] 
      }
  
  
      this.answerHasChange = false;
    }
   



  } // updatePreviousAnswers









  async checkValueOfPreviousAnswers(id) {
     

    if(this.responseArray.length === 0){
     
      this.responseArray.push("Not answered")
    }
    if(!this.response && this.responseArray.length === 0){
      
       this.responseArray[0]="Not answered";
    }
    this.holderResponseArray = this.responseArray;
   
    await this.structureEditedAnswers(id);

 }






 async structureEditedAnswers(id) {
  if(this.questions[id-1].threat){
    // console.log(this.questions[id-1]);
    await this.threatService.getOneThreat(this.questions[id-1].threat).subscribe(async data => {
      this.threat = data; 
      await this.getThreatInference();

     const answer = {
      questionId: this.questions[id - 1]._id,
      position: this.questions[id-1].position,
      answer : this.responseArray
    };

  
    await this.answers.push(answer);

    if(this.questions[id-1].linked){ 
    //check if linked == true
      if(this.responseArray[0].skipNext){
        //check if  skipNext == true
        if (id === this.totalPages-1) { 
          // check if the next question after skip is the last..
           this.isLast = true;
           this.moveTotheNextQustionOnEdit(id)
        } 
        if (this.questions[id+1]==null) { 
          // current question is the last question
         
           this.ImprintLoader = true;
           this.answerStructure.answers = this.answers;
           await this.postAnswers(this.answerStructure);
        }
        this.responseArray = [];
        this.skip = false;
        this.response = '';
        this.moveTotheNextQustionOnEdit(id)

      }else{//if skipNext !=true
        if (id === this.totalPages - 1) {
          this.isLast = true;
          this.moveTotheNextQustionOnEdit(id)
        } 
        if (id === this.totalPages) {
          this.ImprintLoader = true;
          this.answerStructure.answers = this.answers;
          await this.postAnswers(this.answerStructure);
        }
      }
      this.responseArray = [];
      this.skip = false;
      this.response = '';
      this.moveTotheNextQustionOnEdit(id)

    }
    else{ //not linked, continue as normal.
      if (id === this.totalPages - 1) {
        this.isLast = true;
        this.moveTotheNextQustionOnEdit(id);
      }
      if (id === this.totalPages) {
        this.ImprintLoader = true;
        this.answerStructure.answers = this.answers;
        await this.postAnswers(this.answerStructure);
      }

      this.responseArray = [];
      this.skip = false;
      this.response = '';
      this.moveTotheNextQustionOnEdit(id)

    }
    
    this.responseArray = [];
    this.skip = false;
    this.response = '';
    // console.log("Goind to next")
    // this.moveTotheNextQustionOnEdit(id)

   }, error =>{
   console.log("error")
   this.moveTotheNextQustionOnEdit(id)
  });
  }else{//if question does not have a threat..
    const answer = {
      questionId: this.questions[id - 1]._id,
      position: this.questions[id - 1].position,
      answer : this.responseArray
    };
     
    await this.answers.push(answer);

    if(this.questions[id-1].linked){ 
      //check if linked == true
        if(this.responseArray[0].skipNext){//check if  skipNext == true
          if (id === this.totalPages-1) { // check if the next question after skip is the last..
             this.isLast = true;
             this.moveTotheNextQustionOnEdit(id)
          }
          if (this.questions[id+1]==null) { // current question is the last question
             this.ImprintLoader = true;
             this.answerStructure.answers = this.answers;
             await this.postAnswers(this.answerStructure);
          }
          this.responseArray = [];
          this.skip = false;
          this.response = '';
          this.moveTotheNextQustionOnEdit(id)

        }else{//if skipNext !=true
          if (id === this.totalPages - 1) {
            this.isLast = true;
            this.moveTotheNextQustionOnEdit(id)
          } 
          if (id === this.totalPages) {
            this.ImprintLoader = true;
            this.answerStructure.answers = this.answers;
            await this.postAnswers(this.answerStructure);
          }
        }
        this.responseArray = [];
        this.skip = false;
        this.response = '';
        this.moveTotheNextQustionOnEdit(id)

      }
      else{ //not linked, continue as normal.
        if (id === this.totalPages - 1) {
          this.isLast = true;
          this.moveTotheNextQustionOnEdit(id);
        }
        if (id === this.totalPages) {
          this.ImprintLoader = true;
          this.answerStructure.answers = this.answers;
          await this.postAnswers(this.answerStructure);
        }

        this.responseArray = [];
        this.skip = false;
        this.response = '';
        this.moveTotheNextQustionOnEdit(id)
      }
}
}




moveTotheNextQustionOnEdit(id) {

  
  this.questionTag = this.questions[id].question;
  this.skip = (this.questions[id].skip ? true: false);
  this.open = this.questions[id].open_question;
  this.multiple = this.questions[id].multiple_choice;
  this.type = this.questions[id].choice_type;
  this.options = this.questions[id].choices;
  this.pageNumber = this.pageNumber + 1;
  this.totalPages = this.questions.length;

  if (this.previousSteps !== 0) {
    this.quizIdOfAnswerOnEdit = this.questions[id]._id
    for (let ans of this.answers) {
      if (ans.questionId === this.quizIdOfAnswerOnEdit) { 
          this.response = ans.answer[0].answer ? 
                          ans.answer[0].answer.answer ? ans.answer[0].answer.answer : ans.answer[0].answer
                          : ans.answer[0] 
        break;
      }
    }
  }


  this.answerHasChange = false;

}











































  back(){
    if ( localStorage.getItem('permissionStatus') === 'isThirdParty') {  this.router.navigate(['/home/dashboard']); }
    if ( localStorage.getItem('permissionStatus') === 'isAdmin') {  this.router.navigate(['/home/dashboard']); }
    if ( localStorage.getItem('permissionStatus') === 'isCustomer') { this.router.navigate(['/home/survey']); }
  }

































} // end of main class
