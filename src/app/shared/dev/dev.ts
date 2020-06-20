import { HttpHeaders } from '@angular/common/http';
 

// request header
export const header = new HttpHeaders().set(
    'token', `${window.sessionStorage.getItem('loggedUserToken')}`
  ).set( 'Access-Control-Allow-Origin', '*').set( 'user', `${window.sessionStorage.getItem('loggedUserID')}`);

export const preauthheader = new HttpHeaders().set('secrete', 'IMPRINT@@2020');

// ip address pointing the server

// export const dev = {
//     connect: 'http://167.172.26.3/:4411/',
// };

// export const dev = {
//     connect: 'https://surveyserver.imprintafrica.co.ke/',
// };

export const dev = {
  connect: 'http://167.172.26.3:4120/',
};