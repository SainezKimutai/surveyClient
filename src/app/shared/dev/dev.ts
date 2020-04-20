import { HttpHeaders } from '@angular/common/http';

// request header
export const header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );

// ip address pointing the server

// export const dev = {
//     connect: 'http://localhost:4111/',
// };

// export const dev = {
//     connect: 'https://surveyserver.imprintafrica.co.ke/',
// };

export const dev = {
  connect: 'https://dff8ea11.ngrok.io/',
} ;
