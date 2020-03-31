import { HttpHeaders } from '@angular/common/http';

// request header
export const header = new HttpHeaders().set(
    'Authorization', `Bearer ${window.localStorage.getItem('loggedUserToken')}`
  );
export const dev = {
    connect: 'https://surveyserver.imprintafrica.co.ke/',
};
