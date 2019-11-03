import { Component, OnInit } from '@angular/core';
import { faUsers, faMobile, faMoneyBill, faList, faCalendar, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { Email } from 'src/app/services/smtp';

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

  SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
  TOKEN_PATH = 'token.json';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initMailForm();
    // this.envoyerMail();
  }

  envoyerMail() {
    console.log('Envoi du mail !!');
    /*
    Email.send({
      Host: 'smtp.elasticemail.com',
      Username: 'muanza.kangudie@gmail.com',
      Password: '410a87ea-bff9-43b8-bde6-cee9530e51c5',
      To: 'kangudie.muanza@gmail.com',
      From: 'muanza.kangudie@gmail.com',
      Subject: 'This is the subject',
      Body: 'And this is the body'
    }).then(
      message => alert(message)
    );
      */
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
