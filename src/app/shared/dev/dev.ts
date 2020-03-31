import { HttpHeaders } from '@angular/common/http';

// request header
export const header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );
<<<<<<< HEAD



// link point the server

// export const dev = {
//     connect: 'http://localhost:4111/',
// };

=======
>>>>>>> 2b8b07c734c4080debc42e261611aef0833f7f76
export const dev = {
    connect: 'https://surveyserver.imprintafrica.co.ke/',
};


