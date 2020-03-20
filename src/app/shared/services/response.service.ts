import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev } from '../dev/dev';


@Injectable({
  providedIn: 'root'
})


export class ResponseService {


    public url = `${dev.connect}api/responses/`;
    


    constructor( private http: HttpClient ) { }

    sendResponse (data: any){
        return this.http.post<any>(this.url + 'create', data);
    }

}
