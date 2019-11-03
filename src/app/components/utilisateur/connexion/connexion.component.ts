import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Connexion } from 'src/app/models/connexion.model';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {

  connexionForm: FormGroup;
  loading = false;
  message = '';

  constructor(private formBuilder: FormBuilder, private utilisateurService: UtilisateurService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.connexionForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.email]],
      passe: ['', [Validators.required]]
    });
  }

  onSubmitForm() {
    this.loading = true;
    const formValue = this.connexionForm.value;
    const connexion = new Connexion(
      formValue['login'],
      formValue['passe'],
      false
    );
    console.log(connexion);
    this.utilisateurService.onConnexion(connexion).then((utilisateur: Utilisateur) => {
      this.loading = false;
      this.saveCredentials(utilisateur);
      this.router.navigate(['/ventes']);
    }, (error) => {
      this.loading = false;
      this.message = 'login ou mot de passe incorrect';
    });
    // this.router.navigate(['/users']);
  }

  saveCredentials(utilisateur: Utilisateur) {
    localStorage.setItem('SIAGESCOM_USER', JSON.stringify(utilisateur));
  }

}
