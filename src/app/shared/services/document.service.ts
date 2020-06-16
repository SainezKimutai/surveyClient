import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header} from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class DocumentService {


    public url = `${dev.connect}api/document/`;


    constructor( private http: HttpClient ) { }


    createDocument( data: any ) {
        return this.http.post<any>(this.url + 'create', data, {headers : header});
    }


    getAllDocuments() {
        return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneDocument(id) {
        return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateDocument(id, data: any) {
        return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteDocument(id) {
        return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    getAllDocumentsByComponayId() {
        const data = {companyId: sessionStorage.getItem('loggedCompanyId')};
        return this.http.post<any> (this.url + 'getByCompanyId/', data, {headers: header});
    }

}
