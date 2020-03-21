import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class FileUploadService {


    url = `${dev.connect}api/fileUpload/`;


    header = new HttpHeaders().set(
      'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
    );

    constructor( private http: HttpClient ) {  }


    uploadCompanyLogo( data: any ) {
      return this.http.post<any>(this.url + 'uploadCompanyLogo/', data, {headers : this.header});
    }

    removeCompanyLogo(name) {
      return this.http.delete<any>(this.url + 'removeCompanyLogo/' + name, {headers : this.header});
    }


}
