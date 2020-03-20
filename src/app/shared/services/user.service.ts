import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { dev } from '../dev/dev';
import { UserModel } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})


export class UserService {


    url = `${dev.connect}api/users/`;

    constructor( private http: HttpClient ) { }

    registerUser( registrationData: UserModel ) {
        return this.http.post<any>(this.url + 'register', registrationData);
    }

    loginUser( loginData: any ) {
      return this.http.post<any>(this.url + 'login', loginData);
    }


    getAllUsers() {
      return this.http.get<any>(this.url + 'getAll/');
    }


    getOneUser(id) {
      return this.http.get<any>(this.url + 'getOne/' + id);
    }


    updateUsers(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data);
    }


    deleteUser(id) {
      return this.http.delete<any>(this.url + 'delete/' + id );
    }


}
