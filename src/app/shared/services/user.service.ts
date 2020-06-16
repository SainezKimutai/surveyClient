import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { dev, header, preauthheader } from '../dev/dev';
import { UserModel } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})


export class UserService {


    url = `${dev.connect}api/users/`;

    registrationHeader = new HttpHeaders().set(
      'Authorization', `Bearer ${sessionStorage.getItem('invitedUserToken')}`
    ).set('secrete', 'IMPRINT@@2020');

    constructor( private http: HttpClient ) { }

    registerUser( registrationData: UserModel ) {
        return this.http.post<any>(this.url + 'register', registrationData, {headers : this.registrationHeader});
    }

    loginUser( loginData: any ) {
      return this.http.post<any>(this.url + 'login', loginData, {headers : preauthheader});
    }

    inviteUser(inviteData: any) {
      return this.http.post<any>(this.url + 'invite', inviteData, {headers : header});
    }

    getAllUsers() {
      return this.http.get<any>(this.url + 'getAll/', {headers : header});
    }


    getOneUser(id) {
      return this.http.get<any>(this.url + 'getOne/' + id, {headers : header});
    }


    updateUsers(id, data: any) {
      return this.http.put<any>(this.url + 'update/' + id, data, {headers : header});
    }


    deleteUser(id) {
      return this.http.delete<any>(this.url + 'delete/' + id, {headers : header});
    }

    passwordReset(userDetails : any){

      var userObj ={
          email: userDetails.email,
          password: userDetails.password
      }

      return this.http.post<any>(this.url + 'passwordreset', userObj, {headers: preauthheader});
    }

    sendResetEmail(userDetails :any){
      return this.http.post<any>(this.url + 'passwordresettoken', userDetails, {headers: preauthheader});
    }


}
