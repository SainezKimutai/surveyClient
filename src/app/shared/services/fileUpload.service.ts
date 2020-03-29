import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class FileUploadService {


    url = `${dev.connect}api/fileUpload/`;


    constructor( private http: HttpClient ) {  }


    uploadCompanyLogo( data: any ) {
      return this.http.post<any>(this.url + 'uploadCompanyLogo/', data, {headers : header});
    }

    removeCompanyLogo(name) {
      return this.http.delete<any>(this.url + 'removeCompanyLogo/' + name, {headers : header});
    }


}
