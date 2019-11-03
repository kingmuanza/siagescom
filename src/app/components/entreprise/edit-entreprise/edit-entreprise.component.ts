import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilisateurService } from 'src/app/services/utilisateur.service';
import { Router } from '@angular/router';
import { Entreprise } from 'src/app/models/entreprise.model';

@Component({
  selector: 'app-edit-entreprise',
  templateUrl: './edit-entreprise.component.html',
  styleUrls: ['./edit-entreprise.component.scss']
})
export class EditEntrepriseComponent implements OnInit {

  entrerpriseForm: FormGroup;
  entreprise: Entreprise;

  constructor(private formBuilder: FormBuilder, private utilisateurService: UtilisateurService, private router: Router) { }

  ngOnInit() {
    if (this.utilisateurService.entreprise) {
      this.entreprise = this.utilisateurService.entreprise;
    }
    this.initForm();
  }

  initForm() {
    this.entrerpriseForm = this.formBuilder.group({
      nom: [this.entreprise ? this.entreprise.nom : '', [Validators.required]],
      tel: [this.entreprise ? this.entreprise.tel : '', [Validators.required]],
      juridique: [this.entreprise ? this.entreprise.juridique : '', []],
      contribuable: [this.entreprise ? this.entreprise.contribuable : '', []],
      bp: [this.entreprise ? this.entreprise.bp : '', []],
      adresse: [this.entreprise ? this.entreprise.addresse : '', []]
    });
  }

  onSubmitForm() {

    const formValue = this.entrerpriseForm.value;
    if (this.utilisateurService.entreprise) {
      this.entreprise.nom = formValue.nom;
      this.entreprise.tel = formValue.tel;
      this.entreprise.bp = formValue.bp;
      this.entreprise.addresse = formValue.adresse;
      this.entreprise.juridique = formValue.juridique;
      this.entreprise.contribuable = formValue.contribuable;

    } else {
      this.entreprise = new Entreprise(
        formValue['nom'],
        formValue['tel'],
        formValue['bp'],
        formValue['adresse'],
        formValue['juridique'],
        formValue['contribuable']
      );
    }
    console.log(Object.assign({}, this.entreprise));
    console.log(this.utilisateurService.utilisateur);
    this.utilisateurService.onSaveEntreprise(this.entreprise).then((resultat) => {
      this.router.navigate(['ventes']);
    });

  }

}
