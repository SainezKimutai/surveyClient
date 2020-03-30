import { HttpHeaders } from '@angular/common/http';

// request header
export const header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );



// link point the server

// export const dev = {
//     connect: 'http://localhost:4111/',
// };

export const dev = {
    connect: 'http://167.172.26.3:4111/',
};
