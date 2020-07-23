import { HttpHeaders } from '@angular/common/http';


// Define header
export let header = new HttpHeaders().set(
    'token', `${window.sessionStorage.getItem('loggedUserToken')}`
  ).set( 'Access-Control-Allow-Origin', '*').set( 'user', `${window.sessionStorage.getItem('loggedUserID')}`);



// Update Header
export const updateHeader = () => {
  return new Promise((resolve, reject) => {
    header = new HttpHeaders().set(
      'token', `${window.sessionStorage.getItem('loggedUserToken')}`
    ).set( 'Access-Control-Allow-Origin', '*').set( 'user', `${window.sessionStorage.getItem('loggedUserID')}`);
    resolve();
  });
};

export const preauthheader = new HttpHeaders().set('secrete', 'IMPRINT@@2020');

// ip address pointing the server

// export const dev = {
//     connect: 'http://localhost:4111/',
// };

export const dev = {
    connect: 'https://surveyserver.imprintafrica.co.ke/',
};

// export const dev = {
//   connect: 'http://167.172.26.3:4120/',
// } ;






