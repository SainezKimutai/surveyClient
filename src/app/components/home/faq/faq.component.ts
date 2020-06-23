import { Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPowerOff, faLayerGroup, faQuestionCircle, faQuestion,
        faTrash, faPen, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ModalDirective } from 'ngx-bootstrap';
import { HomeComponent } from '../home.component';
import { FaqCategoryService } from 'src/app/shared/services/faqCategory.service';
import { FaqService } from 'src/app/shared/services/faq.service';
import { InquiryService } from 'src/app/shared/services/inquiry.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Router } from '@angular/router';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass']
})
export class FaqComponent implements OnInit {
// tslint:disable

  constructor(
    private router: Router,
    private notifyService: NotificationService,
    private homeComponent: HomeComponent ,
    private faqCategoryService: FaqCategoryService,
    private faqService: FaqService,
    private inquiryService: InquiryService

  ) {  }
@ViewChild('addCategoryModal', { static: true }) addCategoryModal: ModalDirective;
@ViewChild('listCategoryModal', { static: true }) listCategoryModal: ModalDirective;
@ViewChild('editCategoryModal', { static: true }) editCategoryModal: ModalDirective;

@ViewChild('addFaqModal', {static: true}) addFaqModal: ModalDirective;
@ViewChild('editFaqModal', {static: true}) editFaqModal: ModalDirective;

@ViewChild('addInquiryModal', { static: true }) addInquiryModal: ModalDirective;
@ViewChild('listInquiryModal', { static: true }) listInquiryModal: ModalDirective;

public ImprintLoader = false;
public pageProgress = 0;
public contentNumber = 0;
public contentMsg = '';

// permission
public toAdmin = false;

public faPowerOff = faPowerOff;
public faSearch = faSearch;
public faLayerGroup = faLayerGroup
public faQuestionCircle = faQuestionCircle;
public faQuestion = faQuestion;
public faPen = faPen;
public faTrash = faTrash;
public faPlus = faPlus;
public faArrowLeft = faArrowLeft;

public AllCategories = [];
public AllInquiries = [];
public AllFAQs = [];
public FormatedFAQs = [];

editorConfig: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '140px',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '2',
  fonts: [ {class: 'georgia', name: 'Georgia'}, {class: 'arial', name: 'Arial'}, {class: 'times-new-roman', name: 'Times New Roman'}, {class: 'calibri', name: 'Calibri'}, {class: 'comic-sans-ms', name: 'Comic Sans MS'}],
  customClasses: [{name: 'quote', class: 'quote', }, {name: 'redText', class: 'redText'}, {name: 'titleText', class: 'titleText', tag: 'h1', }, ],
  uploadUrl: 'v1/image',
  sanitize: true,
  toolbarPosition: 'top',
};


// 
public categoryInput = '';
public categoryOnEdit: any;
public faqForm: any;
public faqOnEdit: any;
public inquiryForm: any;
public filterName = '';








ngOnInit() {
  if (sessionStorage.getItem('permissionStatus') === 'isAdmin') {
    this.toAdmin = true;
  }
  sessionStorage.setItem('ActiveNav', 'faq');
  this.faqForm = {
    categoryId: '',
    question: '',
    answer: '',
    position: 1
  }
  this.inquiryForm = {
    inquirer: sessionStorage.getItem('loggedUserEmail'),
    question: '',
    answered: false,
    createdAt: new Date(),
  }
  this.pageProgress = 10;
  this.updatePage().then(() => { 

  });

}



updatePage() {
  return new Promise((resolve, reject) => {
    this.faqCategoryService.getAll().subscribe(
      dataCat => {
        this.pageProgress = 25;
        this.AllCategories = dataCat;
        this.faqService.getAll().subscribe(
          dataFAQ => {
            this.AllFAQs = dataFAQ.sort((a, b) => a.position - b.position);
            this.pageProgress = 50;
            this.inquiryService.getUnAnswered().subscribe(
             dataInq => {
                this.AllInquiries = dataInq;
                this.pageProgress = 75;
                this.formatData().then(() => { this.pageProgress = 100; resolve(); })
             }, error => console.log('Error getting Inq')
            )
          }, error => console.log('Error getting FAQ')
        )
      }, error => console.log('Error getting Categories')
    )
  })
}



formatData() {
  return new Promise((resolve, reject) => {
  this.FormatedFAQs = [];
  this.contentNumber = 0
  this.contentMsg = 'No FAQs';
  this.AllCategories.forEach((catItem, i, arr) => {
    catItem.faqs  = this.AllFAQs.filter((f) => f.categoryId === catItem._id).map(e => e);
    this.contentNumber = this.contentNumber + catItem.faqs.length
    this.FormatedFAQs.push(catItem);
    if (i === arr.length - 1) { resolve(); }
  })
  if (this.AllCategories.length === 0) {resolve()}
  })
}



goBack(){
    this.router.navigate([`${sessionStorage.getItem('faqReturnRouer')}`]);
}



openListCategoryModal() {
  this.listCategoryModal.show();
}

openAddCategoryModal() {
  this.listCategoryModal.hide();
  this.addCategoryModal.show();
}


addNewCategory() {
  this.ImprintLoader = true;
  this.faqCategoryService.create({name: this.categoryInput}).subscribe(
    data => {
      this.updatePage().then(() => {
        this.categoryInput = '';
        this.ImprintLoader = false;
        this.addCategoryModal.hide();
        this.listCategoryModal.show();
        this.notifyService.showSuccess('Category Added', 'Success')
      })
    }, error => this.notifyService.showError('Could not create new', 'Failed')
  )

}


openEditCategoryModal(item: any) {
  this.categoryOnEdit = item;
  this.listCategoryModal.hide();
  this.editCategoryModal.show()
}

submitEditCategory() {
  this.ImprintLoader = true;
  this.faqCategoryService.update(this.categoryOnEdit._id, this.categoryOnEdit).subscribe(
    data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.editCategoryModal.hide();
        this.listCategoryModal.show();
        this.notifyService.showSuccess('Category Updated', 'Success')
      })
    }, error => this.notifyService.showError('Could not update', 'Failed')
  )
}

deleteCategory(item: any) {
  this.ImprintLoader = true;
  this.faqCategoryService.delete(item._id).subscribe(
    data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.editCategoryModal.hide();
        this.listCategoryModal.show();
        this.notifyService.showSuccess('Category Delete', 'Success')
      })
    }, error => this.notifyService.showError('Could not delete', 'Failed')
  )
}


openFaqModal() {
  this.faqForm = {
    categoryId: '',
    question: '',
    answer: '',
    position: this.AllFAQs.length + 1
  }
  this.addFaqModal.show();
}



addNewFaq() {
  this.ImprintLoader = true;
  this.faqService.create(this.faqForm).subscribe(
    data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.addFaqModal.hide();
        this.notifyService.showSuccess('FAQ created', 'Success')
      })
    }, error => this.notifyService.showError('Could not create faq', 'Failed')
  )

}



editFAQ(item: any) {
  this.faqOnEdit = item;
  this.editFaqModal.show();

}


saveFaqOnEdit() {
  this.ImprintLoader = true;
  this.faqService.update(this.faqOnEdit._id, this.faqOnEdit).subscribe(
    data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.editFaqModal.hide();
        this.notifyService.showSuccess('FAQ updated', 'Success')
      })
    }, error => this.notifyService.showError('Could not update faq', 'Failed')
  )
}


deleteFAQ(id: any) {
  this.ImprintLoader = true;
  this.faqService.delete(id).subscribe(
    data => {
      this.updatePage().then(() => {
        this.ImprintLoader = false;
        this.notifyService.showSuccess('FAQ deleted', 'Success')
      })
    }, error => this.notifyService.showError('Could not delete faq', 'Failed')
  )
}


openAddInquiryModal() {
  this.inquiryForm.question = '';
  this.addInquiryModal.show();
}


addNewInquiry() {
  this.ImprintLoader = true;
  this.inquiryService.create(this.inquiryForm).subscribe(
    data => {
        this.AllInquiries.push(data);
        this.ImprintLoader = false;
        this.addInquiryModal.hide();
        this.notifyService.showSuccess('Inquiry Sent', 'Success')
    }, error => this.notifyService.showError('Could not create inquiry', 'Failed')
  )
}



openListInquiryModal() {
  this.listInquiryModal.show();
}


markInquiryAsAnswered(item: any) {
  item.answered = true;
  this.ImprintLoader = true;
  this.inquiryService.update(item._id, item).subscribe(
    data => {
        this.AllInquiries = this.AllInquiries.filter((q) => q._id !== item._id).map(e => e);
        this.ImprintLoader = false;
        this.notifyService.showSuccess('Marked as Answered', 'Success')

    }, error => this.notifyService.showError('Could not update inquiry', 'Failed')
  )
}



searchFunction() {
  if (this.filterName === '' ) {
    this.notifyService.showInfo('Please type a key word to search', 'Info')
    } else {
      this.ImprintLoader = true;
      let myFAQs = this.AllFAQs.filter(v => v.question.toLowerCase().indexOf(this.filterName.toLowerCase()) > -1).slice(0, 10);
      this.filterFormatData(myFAQs).then(() => {
        this.ImprintLoader = false;
        this.notifyService.showInfo('Search complete', 'Info')
      })
  }

}

filterFormatData(myFAQs: any) {
  return new Promise((resolve, reject) => {
  this.FormatedFAQs = [];
  this.contentNumber = 0;
  this.contentMsg = 'Your search did not match any faqs, please use one key word and search again';
  this.AllCategories.forEach((catItem, i, arr) => {
    catItem.faqs  = myFAQs.filter((f) => f.categoryId === catItem._id).map(e => e);
    this.contentNumber = this.contentNumber + catItem.faqs.length
    this.FormatedFAQs.push(catItem);
    if (i === arr.length - 1) { resolve(); }
  })
  if (this.AllCategories.length === 0) {resolve()}
  })
}


clearSearch() {
  if (this.filterName === '' ) {
    this.ImprintLoader = true;
    this.FormatedFAQs = this.FormatedFAQs;
    this.formatData().then(() => {
      this.ImprintLoader = false;
      this.notifyService.showInfo('Search cleared', 'Info')
    })
    }
}



logOut() {
  this.homeComponent.logout();
}



}