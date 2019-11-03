import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Autorisation } from 'src/app/models/autorisation.model';

@Component({
  selector: 'app-edit-utilisateur',
  templateUrl: './edit-utilisateur.component.html',
  styleUrls: ['./edit-utilisateur.component.scss']
})
export class EditUtilisateurComponent implements OnInit {

  utilisateurForm: FormGroup;
  utilisateur: Utilisateur;
  autorisations: Autorisation[];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private uS: UtilisateurService, private router: Router) {

  }

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      if (id) {
        this.uS.getUtilisateur(id).then((utilisateur) => {
          this.utilisateur = utilisateur.data() as Utilisateur;
          this.initFormWhenUtilisateur();
        });
      }
    });
    this.autorisations = this.uS.AUTORISATIONS;
  }

  utilisateurHasAutorisation(autorisation: Autorisation) {
    for (let i = 0; i < this.utilisateur.autorisations.length; i++) {
      const a = this.utilisateur.autorisations[i];
      if (a.code === autorisation.code) {
        return true;
      }
    }
    return false;
  }

  setUtilisateurAutorisations() {
    const autorisations = [];
    for (let i = 0; i < this.autorisations.length; i++) {
      const a = this.autorisations[i];
      if (this.utilisateurHasAutorisation(a)) {
        autorisations.push(a);
      }
    }
    return autorisations;

  }

  initFormWhenUtilisateur() {
    this.utilisateurForm = this.formBuilder.group({
      nom: [this.utilisateur ? this.utilisateur.nom : '', [Validators.required]],
      autorisations: [this.utilisateur ? this.setUtilisateurAutorisations() : []],
      remise: [this.utilisateur ? this.utilisateur.pourcentageRemise : '', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
    console.log('this.utilisateurForm');
    this.utilisateurForm.controls.autorisations.setValue(this.setUtilisateurAutorisations());
  }

  initForm() {
    this.utilisateurForm = this.formBuilder.group({
      nom: [this.utilisateur ? this.utilisateur.nom : '', [Validators.required]],
      login: [this.utilisateur ? this.utilisateur.login : '', [Validators.required]],
      passe: [this.utilisateur ? this.utilisateur.passe : '', [Validators.required]],
      confirm: [this.utilisateur ? this.utilisateur.passe : '', [Validators.required]],
      autorisations: [this.utilisateur ? this.utilisateur.autorisations : '', [Validators.required]],
      remise: [this.utilisateur ? this.utilisateur.pourcentageRemise : '', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmitFormWhenUtilisateur() {
    const formValue = this.utilisateurForm.value;
    this.utilisateur.nom = formValue['nom'];
    this.utilisateur.pourcentageRemise = formValue['remise'];
    this.utilisateur.autorisations = formValue['autorisations'];
    const autorisations = this.utilisateur.autorisations.map((obj) => {
      return Object.assign({}, obj);
    });
    this.utilisateur.autorisations = autorisations;
    this.uS.onUpdateUtilisateur(Object.assign({}, this.utilisateur)).then(() => {
      this.router.navigate(['utilisateurs', 'view', this.utilisateur.id]);
    });
  }

  onSubmitFormNoUtilisateur() {
    const formValue = this.utilisateurForm.value;
    if (formValue['passe'] === formValue['confirm']) {
      const utilisateur = new Utilisateur(
        formValue['login'],
        formValue['nom'],
        formValue['passe'],
        formValue['remise'],
        formValue['autorisations']
      );

      const autorisations = utilisateur.autorisations.map((obj) => {
        return Object.assign({}, obj);
      });
      utilisateur.autorisations = autorisations;

      utilisateur.entreprise = Object.assign({}, this.uS.entreprise);
      console.log(Object.assign({}, utilisateur));
      this.uS.onCreateUtilisateur(Object.assign({}, utilisateur)).then((u: Utilisateur) => {
        this.router.navigate(['utilisateurs', 'view', u.id]);
      });

    } else {
      console.log('Mots de passe différents');
    }
  }

  onSubmitForm() {

    if (this.utilisateur) {
      this.onSubmitFormWhenUtilisateur();
      return;
    } else {
      this.onSubmitFormNoUtilisateur();
    }

  }
}
