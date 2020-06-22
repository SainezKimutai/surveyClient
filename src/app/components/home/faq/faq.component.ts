import { Component, OnInit, ViewChild } from '@angular/core';
import { faSearch, faPowerOff, faLayerGroup, faQuestionCircle, faQuestion,
        faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ModalDirective } from 'ngx-bootstrap';
import { HomeComponent } from '../home.component';
import { FaqCategoryService } from 'src/app/shared/services/faqCategory.service';
import { FaqService } from 'src/app/shared/services/faq.service';
import { InquiryService } from 'src/app/shared/services/inquiry.service';
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

@ViewChild('faqModal', {static: true}) faqModal: ModalDirective;
@ViewChild('inquiryModal', { static: true }) inquiryModal: ModalDirective;

public ImprintLoader = false;

public faPowerOff = faPowerOff;
public faSearch = faSearch;
public faLayerGroup = faLayerGroup
public faQuestionCircle = faQuestionCircle;
public faQuestion = faQuestion;
public faPen = faPen;
public faTrash = faTrash;

public AllCategories = [];
public AllInquiries = [];
public AllFAQs = [];



// 
public categoryInput = '';
public categoryOnEdit: any;









ngOnInit() {
  sessionStorage.setItem('ActiveNav', 'faq');
  this.updatePage().then(() => {});

}



updatePage() {
  return new Promise((resolve, reject) => {
    this.faqCategoryService.getAll().subscribe(
      dataCat => {
        this.AllCategories = dataCat;
        this.faqService.getAll().subscribe(
          dataFAQ => {
            this.AllFAQs = dataFAQ;
            this.inquiryService.getAll().subscribe(
             dataInq => {
                this.AllInquiries = dataInq;
                this.formatData().then(() => { resolve(); })
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
    resolve()
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
  this.faqModal.show();
}


openInquiryModal() {
  this.inquiryModal.show();
}



logOut() {
  this.homeComponent.logout();
}



}