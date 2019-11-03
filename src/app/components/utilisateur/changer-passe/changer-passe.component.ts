import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilisateurService } from 'src/app/services/utilisateur.service';

@Component({
  selector: 'app-changer-passe',
  templateUrl: './changer-passe.component.html',
  styleUrls: ['./changer-passe.component.scss']
})
export class ChangerPasseComponent implements OnInit {

  utilisateurForm: FormGroup;
  utilisateur: Utilisateur;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private uS: UtilisateurService, private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.route.paramMap.subscribe(ParamsAsMap => {
      const id = ParamsAsMap.get('id');
      if (id) {
        this.uS.getUtilisateur(id).then((utilisateur) => {
          this.utilisateur = utilisateur.data() as Utilisateur;
          this.initForm();
        });
      }
    });
  }

  initForm() {
    this.utilisateurForm = this.formBuilder.group({
      nom: [this.utilisateur ? this.utilisateur.nom : '', [Validators.required]],
      login: [this.utilisateur ? this.utilisateur.login : '', [Validators.required]],
      ancien: [this.utilisateur ? '' : '', [Validators.required]],
      passe: [this.utilisateur ? '' : '', [Validators.required]],
      confirm: [this.utilisateur ? '' : '', [Validators.required]],
      remise: [this.utilisateur ? this.utilisateur.pourcentageRemise : '', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmitForm() {
    if (confirm('Etes-vous sûr de vouloir changer de mot de passe ?')) {
      const formValue = this.utilisateurForm.value;
      if (formValue.passe === formValue.confirm) {
        this.utilisateur.passe = formValue.passe;
        this.uS.updatePassword(this.utilisateur, formValue.ancien).then(() => {
          this.router.navigate(['connexion']);
        });
      } else {
        alert('Les mots de passe ne sont pas identiques');
      }
    }
  }

}
