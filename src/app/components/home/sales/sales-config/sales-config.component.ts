import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterContentChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SalesCategoryService } from 'src/app/shared/services/sales-category.service';
import { HomeComponent } from 'src/app/components/home/home.component';
import { Color } from 'src/app/shared/colors/color';
import { faEdit, faTrash, faArrowLeft, faPlus} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-sales-config',
  templateUrl: './sales-config.component.html',
  styleUrls: ['./sales-config.component.sass']
})


export class SalesConfigComponent implements OnInit, OnDestroy {

  // Constructor
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private homeComponent: HomeComponent,
    private notifyService: NotificationService,
    private salesCategoryService: SalesCategoryService,
  ) { }
// tslint:disable: prefer-const
// tslint:disable: max-line-length
// tslint:disable: object-literal-shorthand

public ImprintLoader = false;
// permisions
public toAdmin = false;
public toCustomer = false;
public editorialMenuActionStatus = true;




@ViewChild('editSalesCatModal', {static: true}) public editSalesCatModal: ModalDirective;
@ViewChild('deleteSalesCatModal', {static: true}) public deleteSalesCatModal: ModalDirective;


// icon
public faEdit = faEdit;
public faTrash = faTrash;
public faArrowLeft = faArrowLeft;
public faPlus = faPlus;

// Status Variables
public previewSectionStatus: boolean;
public customServiceSectionStatus: boolean;
public customServiceFormStatus: boolean;
public addTaskSectionStatus: boolean;
public defineTaskFormStatus: boolean;
public listAddTeamStatus: boolean;
public listAddSalesCategoryStatus: boolean;
public listStatus: boolean;

// Form Variables


@ViewChild('myAddSalesCategoryForm' , {static: true}) myAddSalesCategoryFormValues;


public addNewTeamForm: FormGroup;
public addSalesCategoryForm: FormGroup;
public customServiceForm: FormGroup;
public defineTaskForm: FormGroup;
public editServiceForm: FormGroup;
public editTeamForm: FormGroup;
public editSalesCatForm: FormGroup;




// Binded Variables
public Teams: any = [];
public SalesCategorys: any = [];
public namedCustomService: string;
public namedTargetRevenue: number;
public Tasks: any = [];
public Services: any = [];
public Colors = Color;
public ColorSelectDropdownActive = false;
public SalesStagesColor = { name: 'default', code: '#02b0cc' };
public ColorSelectDropdownActiveOnSalesList = false;
public SalesColorId;




// Edit Variables
public serviceTobeEdited;
public teamToBeEdited;
public teamToBeDeleted;
public salesCategoryToBeEdited;
public salesCategoryToBeDeleted;

public myInterval: any;

public serviceOnEdit: any;
public serviceTobeDeleted: any;



  ngOnInit() {

          if (sessionStorage.getItem('permissionStatus') === 'isAdmin') {
            this.toAdmin = true;
          }
          if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
            this.toCustomer = true;
          }
          sessionStorage.setItem('ActiveNav', 'sales');
          this.ImprintLoader = true;


          this.updatePage().then( () => {
            this.ImprintLoader = false;
            if (this.SalesCategorys.length === 0) {this.defaultEdits(); }
          });


          // Add Sales Category
          this.addSalesCategoryForm = this.formBuilder.group({
            name: ['', Validators.required]
          });



          this.editSalesCatForm = this.formBuilder.group({
            name: ['', Validators.required]
          });



  }// ngOnInit -end



get formAddSalesCategory() {return this.addSalesCategoryForm.controls; }
get formSalesCatTeam() { return this.editSalesCatForm.controls; }








updatePage() {

  return new Promise((resolve, reject) => {

  this.salesCategoryService.getAllSalesCategories().subscribe(
    dataSales => {
    this.SalesCategorys = dataSales;
    resolve();
    }, error => { console.log('Cannot get all Categoris'); }
  );
  });

}











defaultEdits() {
  let defaultSalesCategories = [
    {
    name : 'Target Clients',
    companyId: this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
    color: {name: 'turquoise', code: '#40E0D0'},
    totalLeads : 0,
    totalRevenue : 0
  },
  {
    name : 'Prospects',
    companyId: this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
    color: {name: 'lightseagreen', code: '#00CED1'},
    totalLeads : 0,
    totalRevenue : 0
  },
  {
    name : 'Qualified Leads',
    companyId: this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
    color: {name: 'darkturquoise', code: '	#20B2AA'},
    totalLeads : 0,
    totalRevenue : 0
  },
  {
    name : 'Customers',
    companyId: this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
    color: {name: 'teal', code: '#008080'},
    totalLeads : 0,
    totalRevenue : 0
  },
  ];

  this.salesCategoryService.addSalesCategory(defaultSalesCategories[0]).subscribe(
    data1 => {
      this.salesCategoryService.addSalesCategory(defaultSalesCategories[1]).subscribe(
        data2 => {
          this.salesCategoryService.addSalesCategory(defaultSalesCategories[2]).subscribe(
            data3 => {
              this.salesCategoryService.addSalesCategory(defaultSalesCategories[3]).subscribe(
                data4 => {
                    this.updatePage();
                    this.openSalesCatForm();
                    this.notifyService.showInfo('Default sales stages have been created, you may edit them.', 'Default Sales Categories Created..');
                },
                error => console.log('Error creating default sales categories')
              );
            },
            error => console.log('Error creating default sales categories')
          );
        },
        error => console.log('Error creating default sales categories')
      );
    },
    error => console.log('Error creating default sales categories')
  );

}
































// Open Sales Cat Foem
openSalesCatForm() {

  this.previewSectionStatus = false;
  this.customServiceSectionStatus = false;
  this.customServiceFormStatus = false;
  this.addTaskSectionStatus = false;
  this.defineTaskFormStatus = false;
  this.listAddTeamStatus = false;
  this.listAddSalesCategoryStatus = !this.listAddSalesCategoryStatus;
  this.listStatus = false;
  setTimeout(() => { this.listStatus = true; }, 1000);

}










// Add Sales Category
addSalesCategory() {

  if (this.addSalesCategoryForm.value.name === '') { this.notifyService.showWarning('Please provide the name', 'Empty Field!'); } else {
  let convertedData = {
                      companyId: this.toCustomer ? sessionStorage.getItem('loggedCompanyId') : sessionStorage.getItem('loggedUserID'),
                      name: this.addSalesCategoryForm.value.name,
                      color: this.SalesStagesColor,
                      totalLeads: 0,
                      totalRevenue: 0
                    };
  this.ImprintLoader = true;
  this.salesCategoryService.addSalesCategory(convertedData).subscribe(
    data => {
      setTimeout(() => {
      this.ImprintLoader = false;
      this.updatePage();
      this.notifyService.showSuccess(`Category ${data.name} has been added`, 'Success');
      this.myAddSalesCategoryFormValues.resetForm();
    }, 1500);
    },
    error => {
      setTimeout(() => {
      this.ImprintLoader = false;
      this.notifyService.showError(error.error.message, 'Failed...');
      }, 1500);
    }
  );

 }


}



toggleColorSelectDropdown() {
  this.ColorSelectDropdownActive = !this.ColorSelectDropdownActive;
}



selectProductColor(color) {
  this.ColorSelectDropdownActive = false;
  this.SalesStagesColor = color;
}


toggleColorSelectDropdownOnSalesList(id) {
  this.ColorSelectDropdownActiveOnSalesList = !this.ColorSelectDropdownActiveOnSalesList;
  this.SalesColorId = id;
}

selectProductColorOnSalesList(myColor) {
  this.ColorSelectDropdownActiveOnSalesList = false;
  this.salesCategoryService.updateSaleCategory(this.SalesColorId, {color: myColor}).subscribe(
    data => {this.updatePage(); this.notifyService.showSuccess('Color Update', 'Success'); },
    error => {this.notifyService.showError('Could not update color', 'Failed'); }
  );
}
































identifySalesCatBeEdited(salesCat) {
  this.salesCategoryToBeEdited = salesCat, this.editSalesCatModal.show();
}


editSalesCategory() {

  let data = this.editSalesCatForm.value.name;

  this.salesCategoryService.updateSaleCategory(this.salesCategoryToBeEdited._id, {name: data}).subscribe(
    dataUpdatedSalCat => {
      this.updatePage();
      this.notifyService.showSuccess('Sales Category Updated', 'Success');
    },
    error => {
      this.notifyService.showError('Not Updated..', 'Error');
    }

  );
}



identifySalesCatToBeDeleted(salesCat) {
  return Number(salesCat.totalLeads) > 0 ?
  this.notifyService.showWarning('Ensure this stage has no cards for you to Delete', `${salesCat.totalLeads} card(s) in this Stage`) :
    (  this.salesCategoryToBeDeleted = salesCat, this.deleteSalesCatModal.show());
}


deleteSalesCategory() {

  this.salesCategoryService.deleteSaleCategory(this.salesCategoryToBeDeleted._id).subscribe(
    data => {
      this.updatePage();
      this.notifyService.showSuccess('Sales Category Delete', 'Success');
    },
    error => {
      this.notifyService.showError('Not Deleted..', 'Error');
    }

  );

}




ngOnDestroy() {
  clearInterval(this.myInterval);
}



}// === End;
