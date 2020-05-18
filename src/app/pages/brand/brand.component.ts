import { Component, OnInit } from '@angular/core';
import { faUsers, faMobile, faMoneyBill, faList, faCalendar, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  faUsers = faUsers;
  faMobile = faMobile;
  faMoneyBill = faMoneyBill;
  faList = faList;
  faCalendar = faCalendar;
  faDownload = faDownload;

  mailForm: FormGroup;
  message = '';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initMailForm();
    // this.envoyerMail();
  }

  autoConnexion() {

  }

  envoyerMail() {
    console.log('Envoi du mail !!');
  }

  initMailForm() {
    this.mailForm = this.formBuilder.group({
      mail: ['muanza.kangudie@gmail.com', [Validators.required, Validators.email]]
    });
  }

  onSubmitMailForm() {
    console.log('formValue');
    const formValue = this.mailForm.value;
    const mail = formValue.mail;
    console.log(mail);
    this.creerComptePourUnMois(mail);
    this.envoyerMail();
  }

  genererPasse() {
    return '123456';
  }

  creerComptePourUnMois(mail: string) {
    console.log('creerComptePourUnMois');
    const passe = this.genererPasse();
    firebase.auth().createUserWithEmailAndPassword(mail, passe).then(() => {
      this.message = 'Votre compte a été créé. Veuillez consulter votre boite mail';
      console.log(this.message);
    }).catch((e) => {
      this.message = e.code;
      console.log(this.message);
    });
  }


  telechargerBrochure() {
    // tslint:disable-next-line:max-line-length
    window.open('https://firebasestorage.googleapis.com/v0/b/siagescom.appspot.com/o/plaquette_commerciale_vendezfacile.com.pdf?alt=media&token=9d2ea3a9-de60-4250-bbc3-8066358032bb');
  }

}
