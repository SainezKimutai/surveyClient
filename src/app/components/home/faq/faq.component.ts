import { Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPowerOff, faLayerGroup, faQuestionCircle, faQuestion,
        faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ModalDirective } from 'ngx-bootstrap';
import { HomeComponent } from '../home.component';
import { FaqCategoryService } from 'src/app/shared/services/faqCategory.service';
import { FaqService } from 'src/app/shared/services/faq.service';
import { InquiryService } from 'src/app/shared/services/inquiry.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass']
})
export class FaqComponent implements OnInit {
// tslint:disable

  constructor(
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

@ViewChild('inquiryModal', { static: true }) inquiryModal: ModalDirective;

public ImprintLoader = false;
public pageProgress = 0;

public faPowerOff = faPowerOff;
public faSearch = faSearch;
public faLayerGroup = faLayerGroup
public faQuestionCircle = faQuestionCircle;
public faQuestion = faQuestion;
public faPen = faPen;
public faTrash = faTrash;
public faPlus = faPlus;

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








ngOnInit() {
  sessionStorage.setItem('ActiveNav', 'faq');
  this.faqForm = {
    categoryId: '',
    question: '',
    answer: '',
    position: 1
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
            this.inquiryService.getAll().subscribe(
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
  this.AllCategories.forEach((catItem, i, arr) => {
    catItem.faqs  = this.AllFAQs.filter((f) => f.categoryId === catItem._id).map(e => e);
    this.FormatedFAQs.push(catItem);
    if (i === arr.length - 1) { resolve(); }
  })
  if (this.AllCategories.length === 0) {resolve()}
  })
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


openInquiryModal() {
  this.inquiryModal.show();
}



logOut() {
  this.homeComponent.logout();
}



}