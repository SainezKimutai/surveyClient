import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev , header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class SalesNoteService {


    url = `${dev.connect}api/salesNotes/`;


    // header = new HttpHeaders().set(
    //   'Authorization', `Bearer ${window.sessionStorage.getItem('loggedUserToken')}`
    // );


    constructor( private http: HttpClient ) {  }



    createNote( notes: any ) {
      return this.http.post<any>(this.url + 'create', notes, {headers : header});
    }


    getAllNotes() {
      let data: any;
      if (sessionStorage.getItem('permissionStatus') === 'isCustomer') {
        data = {companyId: sessionStorage.getItem('loggedCompanyId')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      } else {
        data = {companyId: sessionStorage.getItem('loggedUserID')};
        return this.http.post<any>(this.url + 'getCompanyAll/', data, {headers : header});
      }
    }


    getOneNote(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateNote(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteNote(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }


}
