import { Component, OnInit } from '@angular/core';
import { faEnvelope, faKey , faPhone , faAddressBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  constructor() { }

    // icon
    public faEnvelope = faEnvelope;
    public faKey = faKey;
    public faPhone = faPhone
    public faAddressBook = faAddressBook

  ngOnInit() {
    localStorage.setItem('ActiveNav', 'profile');
  }

}
